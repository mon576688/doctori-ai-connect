import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { medicineName } = await req.json();

    if (!medicineName) {
      return new Response(JSON.stringify({ error: 'Medicine name is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a medical information assistant. Provide accurate, comprehensive information about medicines in JSON format. Always include safety warnings and disclaimers. Return ONLY valid JSON with this exact structure:
            {
              "name": "Medicine Name",
              "genericName": "Generic name if different",
              "category": "Drug category (e.g., Analgesic, Antibiotic)",
              "uses": ["Primary use 1", "Primary use 2"],
              "dosage": "Standard dosage information with warnings about consulting healthcare providers",
              "sideEffects": ["Common side effect 1", "Common side effect 2"],
              "precautions": ["Important precaution 1", "Important precaution 2"],
              "brandNames": ["Brand name 1", "Brand name 2"],
              "alternatives": ["Alternative medicine 1", "Alternative medicine 2"]
            }`
          },
          {
            role: 'user',
            content: `Provide detailed medical information about: ${medicineName}`
          }
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
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
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const medicineText = data.choices[0].message.content;

    try {
      const jsonMatch = medicineText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, medicineText];
      const medicineInfo = JSON.parse(jsonMatch[1].trim());
      
      return new Response(JSON.stringify({ medicineInfo }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', medicineText);
      return new Response(JSON.stringify({ error: 'Failed to parse medicine information' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in medicine-lookup function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
