import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompts: Record<string, string> = {
  prescription: `You are a medical prescription analysis AI. When given a prescription image or text:
1. Extract and list all medicine names clearly
2. Identify the drug class/group for each medicine
3. Explain the common uses and indications for each medicine
4. Rewrite the prescription in clear, readable format
5. Note any important warnings or common side effects

Format your response with clear headings and bullet points.
End with: "⚠️ This analysis is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider."`,

  report: `You are a medical report analysis AI. When given a medical report image or text:
1. Identify the type of report (blood test, X-ray, MRI, etc.)
2. List all values and highlight any that are outside normal ranges
3. Explain medical terms in simple, easy-to-understand language
4. Summarize key findings
5. Provide general interpretation guidance

Format your response with clear headings, tables where appropriate, and bullet points.
End with: "⚠️ This analysis is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider."`,

  symptom: `You are a symptom analysis AI. When given symptom descriptions or images:
1. Analyze the described or visible symptoms
2. Suggest possible conditions that may be associated (clearly state these are possibilities, not diagnoses)
3. Provide general guidance and precautions
4. Recommend when to consult a doctor urgently vs. routinely
5. Suggest any immediate self-care measures if appropriate

Format your response with clear headings and bullet points.
End with: "⚠️ This analysis is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider."`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, text, imageBase64 } = await req.json();

    if (!type || !systemPrompts[type]) {
      return new Response(
        JSON.stringify({ error: "Invalid analysis type. Use: prescription, report, or symptom" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!text && !imageBase64) {
      return new Response(
        JSON.stringify({ error: "Please provide text or an image for analysis" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const messages: any[] = [
      { role: "system", content: systemPrompts[type] },
    ];

    // Build user message with optional image
    if (imageBase64) {
      const userContent: any[] = [];
      if (text) {
        userContent.push({ type: "text", text });
      }
      userContent.push({
        type: "image_url",
        image_url: { url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}` },
      });
      messages.push({ role: "user", content: userContent });
    } else {
      messages.push({ role: "user", content: text });
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Service temporarily unavailable. Please try again later." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Analysis failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content || "No analysis could be generated.";

    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (e) {
    console.error("analyze-medical error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
