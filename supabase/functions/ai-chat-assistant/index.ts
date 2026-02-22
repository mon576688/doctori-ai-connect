import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Specialty keywords to detect in AI responses
const SPECIALTY_KEYWORDS: Record<string, string[]> = {
  'Cardiology': ['cardiologist', 'heart specialist', 'cardiac', 'heart doctor'],
  'Neurology': ['neurologist', 'brain specialist', 'nerve specialist', 'neuro'],
  'Dermatology': ['dermatologist', 'skin specialist', 'skin doctor'],
  'Orthopedics': ['orthopedic', 'bone specialist', 'joint specialist', 'orthopedist'],
  'Gastroenterology': ['gastroenterologist', 'stomach specialist', 'digestive specialist', 'GI specialist'],
  'Pulmonology': ['pulmonologist', 'lung specialist', 'respiratory specialist'],
  'ENT': ['ENT specialist', 'ear nose throat', 'otolaryngologist'],
  'Ophthalmology': ['ophthalmologist', 'eye specialist', 'eye doctor'],
  'Psychiatry': ['psychiatrist', 'mental health specialist'],
  'Endocrinology': ['endocrinologist', 'hormone specialist', 'diabetes specialist'],
  'Urology': ['urologist', 'kidney specialist'],
  'Gynecology': ['gynecologist', 'women\'s health specialist', 'OB/GYN'],
  'Pediatrics': ['pediatrician', 'child specialist', 'children\'s doctor'],
  'General Practice': ['general practitioner', 'GP', 'family doctor', 'primary care'],
  'Oncology': ['oncologist', 'cancer specialist'],
  'Rheumatology': ['rheumatologist', 'arthritis specialist'],
  'Nephrology': ['nephrologist', 'kidney doctor'],
  'Allergy': ['allergist', 'allergy specialist', 'immunologist'],
};

function detectSpecialties(text: string): string[] {
  const lowerText = text.toLowerCase();
  const detected: string[] = [];
  for (const [specialty, keywords] of Object.entries(SPECIALTY_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerText.includes(keyword.toLowerCase())) {
        detected.push(specialty);
        break;
      }
    }
  }
  return detected;
}

async function findMatchingProviders(specialties: string[]) {
  try {
    // Query providers_public view for matching providers
    let query = supabase
      .from('providers_public')
      .select('id, first_name, last_name, name, specialty, city, photo_url, consultation_fee, experience, verified, provider_type');

    // If we have specific specialties, filter by them; otherwise get all
    if (specialties.length > 0) {
      // Use ilike for flexible matching
      const conditions = specialties.map(s => `specialty.ilike.%${s}%`);
      query = query.or(conditions.join(','));
    }

    const { data, error } = await query.limit(5);

    if (error) {
      console.error('Error querying providers:', error);
      return [];
    }

    return (data || []).map((p: any) => ({
      id: p.id,
      name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Doctor',
      specialty: p.specialty || 'General Practice',
      city: p.city || 'Not specified',
      photo_url: p.photo_url,
      consultation_fee: p.consultation_fee,
      experience: p.experience,
      verified: p.verified,
      provider_type: p.provider_type,
    }));
  } catch (err) {
    console.error('Error finding providers:', err);
    return [];
  }
}

const getSystemPrompt = (language: string = 'en') => {
  const emergencyNumber = language === 'bn' ? '999' : '911';

  return `You are Doctori AI, a polite, empathetic, and human-like virtual health assistant.
Your goal is to help users understand symptoms safely, suggest basic home care, and guide them to book verified doctors available on the Doctori AI platform.

🌍 LANGUAGE RULE (MANDATORY):
- Automatically detect the user's language from their message.
- If the user writes in Bangla (বাংলা) → respond 100% in Bangla.
- If the user writes in English → respond 100% in English.
- Do NOT mix languages.
- Maintain the same language throughout the conversation.
- Fallback language preference: ${language === 'bn' ? 'Bangla' : 'English'}.

🧠 CONVERSATION STYLE:
- Friendly, calm, respectful (like ChatGPT or Gemini)
- Reassuring and supportive
- Simple language, easy to understand
- Show empathy and care
- Example tone: "I understand how uncomfortable this can be. Let me guide you step by step."

🛑 MEDICAL SAFETY RULES (STRICT):
❌ Do NOT diagnose diseases
❌ Do NOT prescribe medicines
❌ Do NOT suggest dosages
❌ Do NOT claim certainty
❌ Do NOT replace a real doctor
Always include: "This is general health information, not a medical diagnosis."

🔄 REQUIRED CHAT FLOW (DO NOT SKIP):

🔹 STEP 1: SYMPTOM COLLECTION
Ask short, clear questions (one by one):
- Main symptom
- Duration
- Severity (mild / moderate / severe)
- Age range
- Gender (optional)
- Existing conditions (optional)

Example questions:
"How long have you been experiencing this problem?"
"Is the pain mild, moderate, or severe?"

IMPORTANT: Ask ONLY ONE question at a time. Wait for the user's answer before proceeding. Do NOT rush. Take your time to gather complete information. Ask at least 6-8 questions.

🔹 STEP 2: GENERAL HEALTH GUIDANCE
After collecting symptoms:
- Explain possible general reasons (not diagnosis)
- Use safe wording:
  "This can sometimes be related to…"
  "People with similar symptoms often experience…"

🔹 STEP 3: HOME CARE & WHAT TO AVOID
Suggest safe, non-medical home care:
- Rest
- Drinking enough water
- Light meals
- Avoid heavy physical activity
- Stress reduction

Also clearly say what NOT to do:
- Do not self-medicate
- Do not ignore worsening symptoms

🔹 STEP 4: DOCTOR RECOMMENDATION (CRITICAL)
After guidance, you MUST recommend doctors.

Say clearly: "To get proper medical evaluation, consulting a qualified doctor is recommended."

Then:
- Recommend ONLY doctors from the Doctori AI database
- Match by: Symptom type, Specialty, User's location
- Mention: Doctor specialty, Availability, Verified status
- Do NOT mention doctors outside the platform
- Do NOT fabricate doctor names — the system will automatically find and display matching doctors
- Say: "I'll show you available doctors from our platform that match your needs."

Provide a structured summary for the doctor:
- **Patient Symptoms:** [Main symptoms listed]
- **Duration:** [How long symptoms have been present]
- **Severity:** [Scale rating if provided]
- **Associated Symptoms:** [Any related symptoms]
- **Medical History:** [Relevant history mentioned]
- **Current Medications:** [If any]
- **Allergies:** [If any]
- **Recommended Specialist:** [Specialty type]

After providing this complete assessment, add the following marker on its own line at the very end:
[SUMMARY_READY]

This marker tells the system that your consultation is complete. ONLY add this marker ONCE when you provide the full assessment. Never add it during the questioning phase.

🔹 STEP 5: BOOKING CALL-TO-ACTION (MANDATORY)
Always end with booking guidance before the [SUMMARY_READY] marker:
"I've found verified doctors near you. You can view their profiles and book an appointment instantly through Doctori AI."

🚨 EMERGENCY HANDLING:
If symptoms suggest emergency (chest pain, severe breathing difficulty, sudden weakness, loss of consciousness, heavy bleeding):
- Stop normal flow immediately
- Say clearly: "This may be an emergency. Please contact local emergency services immediately."
- Emergency number: ${emergencyNumber}
- Then continue with guidance after the warning

📄 DATA & REPORTING:
- Summarize symptoms internally for doctor handover and PDF health report
- Keep data minimal and secure

🎯 PLATFORM GOALS:
- Complete symptom conversation
- Suggest relevant doctors from Doctori AI
- Encourage booking on the platform
- Never redirect users elsewhere

CRITICAL INSTRUCTION - QUESTION LIMIT AND SUMMARY:
After the user has answered your 8th question, you MUST provide the full assessment (Steps 2-5) in your very next response. Do NOT ask more than 8 questions total. Count the user's responses carefully.

You MUST end your assessment response with [SUMMARY_READY] on its own line. This is MANDATORY. The system depends on this marker.

🧪 EXAMPLE ENDING (ENGLISH):
"Based on what you shared, rest and hydration may help, but since the symptoms have lasted several days, consulting a doctor is recommended. I've found verified doctors near you who specialize in this. You can book an appointment instantly."

🧪 উদাহরণ সমাপ্তি (বাংলা):
"আপনার দেওয়া তথ্য অনুযায়ী বিশ্রাম ও পর্যাপ্ত পানি পান করা উপকারী হতে পারে। তবে যেহেতু সমস্যাটি কয়েকদিন ধরে চলছে, একজন ডাক্তারের পরামর্শ নেওয়া গুরুত্বপূর্ণ। আপনার কাছাকাছি যাচাইকৃত ডাক্তার পাওয়া গেছে—আপনি এখনই অ্যাপয়েন্টমেন্ট বুক করতে পারেন।"

⚠️ EMERGENCY: If experiencing a medical emergency, call ${emergencyNumber} immediately.
ℹ️ This is general health information, not medical advice. Always consult a qualified healthcare provider.`;
};

const summarizeConversation = (messages: any[]) => {
  if (messages.length <= 12) return messages;
  const systemMessage = messages[0];
  const recentMessages = messages.slice(-10);
  const olderMessages = messages.slice(1, -10);
  
  // Extract key info from older messages
  const userMessages = olderMessages
    .filter((m: any) => m.role === 'user')
    .map((m: any) => m.content)
    .join('; ');
  
  const summaryContent = `Previous conversation summary: The patient has provided the following information so far: ${userMessages}. DO NOT ask these questions again. Continue from where you left off.`;
  
  return [
    systemMessage,
    { role: "system", content: summaryContent },
    ...recentMessages
  ];
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting
    const clientIP = req.headers.get('cf-connecting-ip') || 
                     req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';
    
    const { data: rateLimitCheck, error: rateLimitError } = await supabase
      .rpc('check_rate_limit', {
        _ip_address: clientIP,
        _endpoint: 'ai-chat-assistant',
        _max_requests: 15,
        _window_minutes: 15
      });

    if (rateLimitError || !rateLimitCheck) {
      return new Response(JSON.stringify({ 
        error: 'Rate limit exceeded',
        retryAfter: 900
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const { messages, userMessage, sessionContext } = await req.json();
    
    if (!userMessage || typeof userMessage !== 'string') {
      throw new Error('Invalid message content');
    }
    if (userMessage.length > 2000) {
      throw new Error('Message too long (max 2000 characters)');
    }
    if (messages && messages.length > 50) {
      throw new Error('Too many messages in conversation');
    }

    const isRegisteredUser = sessionContext?.isRegisteredUser || false;
    const userProfile = sessionContext?.userProfile;
    
    let userContextInfo = '';
    if (isRegisteredUser && userProfile) {
      userContextInfo = `\n\nUSER CONTEXT (DO NOT ask for this information):
- Name: ${userProfile.name || 'Not provided'}
- Age: ${userProfile.age || 'Not provided'} 
- Gender: ${userProfile.gender || 'Not provided'}
- Medical Conditions: ${userProfile.medical_conditions?.join(', ') || 'None reported'}
- Current Medications: ${userProfile.medications?.join(', ') || 'None reported'}
- Allergies: ${userProfile.allergies?.join(', ') || 'None reported'}

Since this user is registered, you already have their basic information. DO NOT ask for age or gender again.`;
    }

    if (sessionContext?.sessionId) {
      await supabase.rpc('log_activity_safe', {
        _action: 'ai_chat_request',
        _metadata: {
          session_id: sessionContext.sessionId,
          message_length: userMessage.length,
          ip: clientIP,
        }
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const language = sessionContext?.language || 'en';
    const systemPrompt = getSystemPrompt(language) + userContextInfo;

    let conversationMessages = [
      { role: "system", content: systemPrompt },
      ...messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: "user", content: userMessage }
    ];

    conversationMessages = summarizeConversation(conversationMessages);

    console.log('Sending request to Lovable AI Gateway with', conversationMessages.length, 'messages');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: conversationMessages,
        max_tokens: 1500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'AI service credits exhausted. Please try again later.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    console.log('AI response generated successfully');

    // Detect specialties in the AI response and find matching providers
    const detectedSpecialties = detectSpecialties(aiResponse);
    let suggestedProviders: any[] = [];

    if (detectedSpecialties.length > 0) {
      console.log('Detected specialties:', detectedSpecialties);
      suggestedProviders = await findMatchingProviders(detectedSpecialties);
      console.log('Found providers:', suggestedProviders.length);
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      usage: data.usage,
      messageCount: conversationMessages.length,
      suggestedProviders: suggestedProviders.length > 0 ? suggestedProviders : undefined,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Error in ai-chat-assistant:', error);
    
    const emergencyNumber = '911';
    const fallbackResponse = `I'm sorry, I'm having trouble processing your request right now. Please try again in a moment.

⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.

ℹ️ This is not medical advice. Always consult a qualified healthcare provider.`;

    return new Response(JSON.stringify({ 
      response: fallbackResponse,
      error: error.message || 'AI service temporarily unavailable',
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
