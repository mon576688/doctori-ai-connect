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
  const languageInstruction = language === 'bn' 
    ? 'Respond in Bengali (বাংলা) when the user writes in Bengali, but keep medical terms clear and understandable.' 
    : 'Respond in English when the user writes in English.';

  return `You are Doctori AI, an intelligent health assistant and virtual medical interviewer. Your goal is to gather accurate health information from users using a systematic doctor questioning approach and provide comprehensive health guidance.

🩺 CORE BEHAVIOR:
- Be friendly, professional, and empathetic throughout all interactions
- Act like a virtual doctor conducting a thorough medical interview
- Gather comprehensive health information step by step
- Never provide medical prescriptions or diagnoses—only guidance and recommendations
- ${languageInstruction}

👤 USER CHECK:
- If the user is registered, do NOT ask for age or gender
- If the user is not registered, politely ask for gender and age first

❗ DOCTOR-STYLE QUESTIONING FLOW (Follow these steps systematically, ask ONE question at a time):

**Phase 1: Information Gathering (Ask at least 6-8 questions, ONE at a time)**
1. "What is your main problem today?" (Chief Complaint)
2. "Where exactly is the problem?" (Location)
3. "When did this problem start? Has it been getting better, worse, or the same?" (Onset & Duration)
4. "On a scale of 1 to 10, how severe is it?" (Severity)
5. "How would you describe it?" - sharp, dull, throbbing, burning, etc. (Nature)
6. "Do you have any other symptoms with this?" (Associated Symptoms)
7. "Do you have any long-term health problems?" (Past Medical History)
8. "Are you taking any regular medicines?" (Medication History)
9. "Do you have any known allergies?" (Allergies)
10. "Do you smoke, drink alcohol, or use tobacco?" (Lifestyle)
11. Red-Flag Check: "Are you experiencing chest pain, severe shortness of breath, sudden weakness, or loss of consciousness?" → If yes, recommend emergency care immediately

IMPORTANT: Ask ONLY ONE question at a time. Wait for the user's answer before proceeding to the next question. Do NOT rush through the questions. Take your time to gather complete information.

**Phase 2: Assessment & Guidance (ONLY after gathering enough information from Phase 1)**
Once you have collected sufficient information (at least 6-8 exchanges), provide your complete assessment in a SINGLE response with ALL of the following sections:

🏠 **Home Remedies for Temporary Relief:**
- Provide 3-5 safe, evidence-based home remedies for temporary symptom relief
- Include practical tips the user can try right now
- Be specific (e.g., "Apply a cold compress for 15-20 minutes" not just "use cold therapy")

⛔ **What NOT to Do (Precautions):**
- List 3-5 things the user should AVOID doing
- Include activities, foods, or behaviors that could worsen their condition
- Be clear about why each should be avoided

🏥 **Recommended Doctor Specialty:**
- Clearly state which type of specialist the user should consult (e.g., "I recommend consulting a **Cardiologist**")
- Explain briefly why this specialist is appropriate
- Do NOT fabricate doctor names - the system will automatically find and display matching doctors from our platform
- Say: "I'll show you available doctors from our platform that match your needs."

📋 **Doctor Visit Summary:**
Provide a structured summary formatted for showing to a doctor:
- **Patient Symptoms:** [Main symptoms listed]
- **Duration:** [How long symptoms have been present]
- **Severity:** [Scale rating if provided]
- **Associated Symptoms:** [Any related symptoms]
- **Medical History:** [Relevant history mentioned]
- **Current Medications:** [If any]
- **Allergies:** [If any]
- **Lifestyle Factors:** [Smoking, alcohol, etc.]
- **Preliminary Assessment:** [Your observations]
- **Recommended Specialist:** [Specialty type]

After providing this complete assessment, add the following marker on its own line at the very end:
[SUMMARY_READY]

This marker tells the system that your consultation is complete. ONLY add this marker ONCE when you provide the full assessment with all sections above. Never add it during the questioning phase.

⚠️ EMERGENCY: If experiencing a medical emergency, call ${emergencyNumber} immediately.
ℹ️ This is not medical advice. Always consult a qualified healthcare provider.

🚨 SAFETY RULES:
- For medical emergencies, IMMEDIATELY direct to call ${emergencyNumber}
- Always include safety disclaimers

💬 CONVERSATION RULES:
- Ask one question at a time during Phase 1
- Do NOT provide the assessment until you have asked at least 6-8 questions
- Ignore non-health queries and guide user back
- Be understanding and empathetic
- Use clear, easy-to-understand language
- Keep individual questions concise, but make the final assessment comprehensive

CRITICAL INSTRUCTION - QUESTION LIMIT AND SUMMARY:
After the user has answered your 8th question, you MUST provide the full Phase 2 assessment in your very next response. Do NOT ask more than 8 questions total. Count the user's responses carefully. Once you reach 8 user responses, immediately transition to the full assessment.

You MUST end your Phase 2 assessment response with [SUMMARY_READY] on its own line. This is MANDATORY and non-negotiable. The system depends on this marker to function correctly. If you forget it, the entire consultation will fail.

REMINDER: [SUMMARY_READY] must appear at the very end of your assessment response, on its own line.`;
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
