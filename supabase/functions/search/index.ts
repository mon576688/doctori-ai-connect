import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.52.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, types = ['doctors', 'medicine', 'services'] } = await req.json();

    if (!query || query.trim().length < 2) {
      return new Response(
        JSON.stringify({ error: 'Query must be at least 2 characters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const results: any[] = [];
    const searchTerm = query.toLowerCase().trim();

    // Search doctors
    if (types.includes('doctors')) {
      const { data: doctors } = await supabase
        .from('doctors_public')
        .select('*')
        .or(`specialty.ilike.%${searchTerm}%,bio.ilike.%${searchTerm}%`)
        .limit(10);

      if (doctors) {
        results.push(...doctors.map(doc => ({
          id: doc.id,
          type: 'doctor',
          name: `Dr. ${doc.specialty || 'Healthcare Provider'}`,
          specialty: doc.specialty,
          description: doc.bio || '',
          experience: doc.experience,
          consultationFee: doc.consultation_fee,
          verified: doc.verified,
          link: `/doctor/${doc.id}`,
          relevance: 0.9,
        })));
      }
    }

    // Search medicine cache
    if (types.includes('medicine')) {
      const { data: medicines } = await supabase
        .from('medicine_cache')
        .select('*')
        .ilike('medicine_name', `%${searchTerm}%`)
        .limit(5);

      if (medicines) {
        results.push(...medicines.map(med => ({
          id: med.id,
          type: 'medicine',
          name: med.medicine_name,
          description: 'View detailed medicine information',
          link: `/medicine?search=${encodeURIComponent(med.medicine_name)}`,
          relevance: 0.8,
        })));
      }
    }

    // Search service categories
    if (types.includes('services')) {
      const { data: categories } = await supabase
        .from('service_categories')
        .select('*')
        .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .limit(5);

      if (categories) {
        results.push(...categories.map(cat => ({
          id: cat.id,
          type: 'service',
          name: cat.name,
          description: cat.description || '',
          icon: cat.icon,
          link: `/services/${cat.id}`,
          relevance: 0.7,
        })));
      }
    }

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return new Response(
      JSON.stringify({ 
        query,
        results: results.slice(0, 20),
        totalResults: results.length 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Search error:', error);
    return new Response(
      JSON.stringify({ error: 'Search service temporarily unavailable. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
