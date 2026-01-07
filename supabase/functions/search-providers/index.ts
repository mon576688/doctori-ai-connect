import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Haversine formula to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

serve(async (req) => {
  console.log('Search providers function called');
  
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { specialty, latitude, longitude, city, limit = 10 } = await req.json();
    console.log('Search params:', { specialty, latitude, longitude, city, limit });

    // Fetch approved providers with their profiles
    let providersQuery = supabase
      .from('profiles')
      .select(`
        id,
        first_name,
        last_name,
        photo_url,
        city,
        address,
        phone,
        latitude,
        longitude,
        provider_type,
        doctors!inner (
          specialty,
          consultation_fee,
          experience,
          bio,
          verified
        )
      `)
      .eq('role', 'provider')
      .eq('approval_status', 'approved');

    // Filter by specialty if provided
    if (specialty && specialty !== 'General Practice') {
      providersQuery = providersQuery.ilike('doctors.specialty', `%${specialty}%`);
    }

    // Filter by city if no coordinates provided
    if (city && !latitude && !longitude) {
      providersQuery = providersQuery.ilike('city', `%${city}%`);
    }

    const { data: providers, error: providersError } = await providersQuery.limit(50);

    if (providersError) {
      console.error('Error fetching providers:', providersError);
      throw providersError;
    }

    console.log('Found providers:', providers?.length || 0);

    // Calculate distance and sort if coordinates provided
    let processedProviders = (providers || []).map((provider: any) => {
      let distance = null;
      if (latitude && longitude && provider.latitude && provider.longitude) {
        distance = calculateDistance(latitude, longitude, provider.latitude, provider.longitude);
      }
      
      const doctor = provider.doctors?.[0] || provider.doctors;
      return {
        id: provider.id,
        name: `${provider.first_name || ''} ${provider.last_name || ''}`.trim() || 'Doctor',
        photo_url: provider.photo_url,
        specialty: doctor?.specialty || 'General Practice',
        consultation_fee: doctor?.consultation_fee,
        experience: doctor?.experience,
        bio: doctor?.bio,
        verified: doctor?.verified,
        city: provider.city,
        address: provider.address,
        phone: provider.phone,
        distance: distance ? Math.round(distance * 10) / 10 : null,
        provider_type: provider.provider_type
      };
    });

    // Sort by distance if available, otherwise by experience
    processedProviders.sort((a: any, b: any) => {
      if (a.distance !== null && b.distance !== null) {
        return a.distance - b.distance;
      }
      if (a.distance !== null) return -1;
      if (b.distance !== null) return 1;
      return (b.experience || 0) - (a.experience || 0);
    });

    // Limit results
    processedProviders = processedProviders.slice(0, limit);

    // Fetch nearby hospitals
    let hospitalsQuery = supabase
      .from('hospitals')
      .select('*')
      .eq('is_active', true);

    if (city && !latitude && !longitude) {
      hospitalsQuery = hospitalsQuery.ilike('city', `%${city}%`);
    }

    const { data: hospitals, error: hospitalsError } = await hospitalsQuery.limit(20);

    if (hospitalsError) {
      console.error('Error fetching hospitals:', hospitalsError);
    }

    console.log('Found hospitals:', hospitals?.length || 0);

    // Process hospitals (note: hospitals table may not have lat/lng)
    const processedHospitals = (hospitals || []).map((hospital: any) => ({
      id: hospital.id,
      name: hospital.name,
      logo_url: hospital.logo_url,
      city: hospital.city,
      address: hospital.address,
      phone: hospital.phone,
      email: hospital.email,
      description: hospital.description,
      distance: null // Could calculate if hospitals had coordinates
    }));

    // Fetch average ratings for providers
    const providerIds = processedProviders.map((p: any) => p.id);
    if (providerIds.length > 0) {
      const { data: reviews } = await supabase
        .from('reviews')
        .select('provider_id, rating')
        .in('provider_id', providerIds)
        .eq('is_approved', true);

      if (reviews && reviews.length > 0) {
        const ratingsMap: Record<string, { sum: number; count: number }> = {};
        reviews.forEach((review: any) => {
          if (!ratingsMap[review.provider_id]) {
            ratingsMap[review.provider_id] = { sum: 0, count: 0 };
          }
          ratingsMap[review.provider_id].sum += review.rating;
          ratingsMap[review.provider_id].count += 1;
        });

        processedProviders = processedProviders.map((provider: any) => ({
          ...provider,
          rating: ratingsMap[provider.id] 
            ? Math.round((ratingsMap[provider.id].sum / ratingsMap[provider.id].count) * 10) / 10
            : null,
          reviewCount: ratingsMap[provider.id]?.count || 0
        }));
      }
    }

    return new Response(JSON.stringify({
      providers: processedProviders,
      hospitals: processedHospitals,
      specialty: specialty || 'General Practice',
      searchLocation: city || (latitude && longitude ? 'Current Location' : 'All Locations')
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('Error in search-providers:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      providers: [],
      hospitals: []
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
