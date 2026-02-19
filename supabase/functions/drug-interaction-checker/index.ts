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
    const { medicines } = await req.json();

    if (!medicines || !Array.isArray(medicines) || medicines.length < 2) {
      return new Response(JSON.stringify({ error: 'At least 2 medicines are required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (medicines.length > 6) {
      return new Response(JSON.stringify({ error: 'Maximum 6 medicines allowed' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const validMedicines = medicines.filter((m: string) => typeof m === 'string' && m.trim().length > 0);
    if (validMedicines.length < 2) {
      return new Response(JSON.stringify({ error: 'At least 2 valid medicine names are required' }), {
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
            content: `You are a clinical pharmacology assistant. Analyze drug interactions between given medicines. Return ONLY valid JSON with this exact structure:
{
  "interactions": [
    {
      "drug1": "Medicine A",
      "drug2": "Medicine B",
      "severity": "none|mild|moderate|severe|contraindicated",
      "description": "Brief description of the interaction",
      "recommendation": "What the patient should do"
    }
  ],
  "generalWarnings": ["General safety warning 1", "General safety warning 2"],
  "safeToTakeTogether": true/false
}

Severity levels:
- none: No known interaction
- mild: Minor interaction, generally safe but monitor
- moderate: Use with caution, may need dose adjustment
- severe: Significant risk, requires medical supervision
- contraindicated: Should not be combined

Analyze ALL possible pairwise combinations. Be thorough and accurate. Include a disclaimer that this is AI-generated and not a substitute for professional advice.`
          },
          {
            role: 'user',
            content: `Check interactions between these medicines: ${validMedicines.join(', ')}`
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
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
    const resultText = data.choices[0].message.content;

    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = resultText.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, resultText];
      const interactionData = JSON.parse(jsonMatch[1].trim());

      return new Response(JSON.stringify(interactionData), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse AI response:', resultText);
      return new Response(JSON.stringify({ error: 'Failed to parse interaction data' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Error in drug-interaction-checker:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
