import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Briefcase, DollarSign, Building2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { calculateDistance, formatPrice } from '@/lib/bookingUtils';
import { BookingProgress } from '@/components/booking/BookingProgress';
import { toast } from 'sonner';

interface Provider {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  photo_url: string;
  latitude: number;
  longitude: number;
  bio: string;
  provider_type: string;
  address: string;
  city: string;
  services: Array<{ price: number; service_name: string }>;
}

interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  description: string;
  logo_url: string;
}

export default function ProviderList() {
  const navigate = useNavigate();
  const { city, providerType, userLatitude, userLongitude } = useBooking();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city || !providerType) {
      navigate('/booking/location');
    }
  }, [city, providerType, navigate]);

  const [showingAllLocations, setShowingAllLocations] = useState(false);

  useEffect(() => {
    if (!city || !providerType) return;

    const fetchData = async () => {
      try {
        if (providerType === 'hospital') {
          // First try to fetch hospitals in selected city using secure public view (cast to bypass type generation lag)
          let { data, error } = await supabase
            .from('hospitals_public' as any)
            .select('*')
            .ilike('city', `%${city}%`);

          if (error) throw error;

          // If no hospitals found, fetch all hospitals
          if (!data || data.length === 0) {
            const { data: allData, error: allError } = await supabase
              .from('hospitals_public' as any)
              .select('*');

            if (allError) throw allError;
            data = allData;
            setShowingAllLocations(true);
          } else {
            setShowingAllLocations(false);
          }

          setHospitals((data || []).map((h: any) => ({
            id: h.id,
            name: h.name,
            address: h.address || '',
            city: h.city,
            description: h.description || '',
            logo_url: h.logo_url || '/placeholder.svg',
          })));
        } else {
          // First try to fetch providers in selected city using the secure view
          let { data, error } = await supabase
            .from('providers_public')
            .select('*')
            .ilike('city', `%${city}%`);

          if (error) throw error;

          // If no providers found in selected city, fetch all providers
          if (!data || data.length === 0) {
            const { data: allData, error: allError } = await supabase
              .from('providers_public')
              .select('*');

            if (allError) throw allError;
            data = allData;
            setShowingAllLocations(true);
          } else {
            setShowingAllLocations(false);
          }

          // Fetch services for each provider
          const providerIds = (data || []).map((p: any) => p.id);
          const { data: servicesData } = await supabase
            .from('provider_services')
            .select('provider_id, price, service_name')
            .in('provider_id', providerIds);

          const servicesMap = new Map<string, Array<{ price: number; service_name: string }>>();
          (servicesData || []).forEach((s: any) => {
            if (!servicesMap.has(s.provider_id)) {
              servicesMap.set(s.provider_id, []);
            }
            servicesMap.get(s.provider_id)!.push({ price: s.price, service_name: s.service_name });
          });

          const formattedProviders: Provider[] = (data || []).map((p: any) => {
            const services = servicesMap.get(p.id) || [];
            return {
              id: p.id,
              name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
              specialty: p.specialty || services[0]?.service_name || 'General Practice',
              experience: p.experience || p.years_experience || 5,
              photo_url: p.photo_url || '/placeholder.svg',
              latitude: 0,
              longitude: 0,
              bio: p.bio || '',
              provider_type: p.provider_type || providerType,
              address: '',
              city: p.city || '',
              services: services,
            };
          });

          // Calculate distances and sort if coordinates available
          if (userLatitude && userLongitude) {
            formattedProviders.forEach((provider) => {
              if (provider.latitude && provider.longitude) {
                (provider as any).distance = calculateDistance(
                  userLatitude,
                  userLongitude,
                  provider.latitude,
                  provider.longitude
                );
              }
            });
            formattedProviders.sort((a: any, b: any) => (a.distance || 999) - (b.distance || 999));
          }

          setProviders(formattedProviders);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [city, providerType, userLatitude, userLongitude, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading providers...</p>
        </div>
      </div>
    );
  }

  const itemCount = providerType === 'hospital' ? hospitals.length : providers.length;
  const itemLabel = providerType === 'hospital' ? 'hospital' : providerType;

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <BookingProgress />
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {providerType === 'hospital' ? 'Available Hospitals' : 'Available Providers'}
            {showingAllLocations ? ' - All Locations' : ` in ${city}`}
          </h1>
          <p className="text-muted-foreground">
            {showingAllLocations 
              ? `No ${itemLabel}s found in ${city}. Showing all ${itemCount} available ${itemLabel}${itemCount !== 1 ? 's' : ''}.`
              : `Found ${itemCount} ${itemLabel}${itemCount !== 1 ? 's' : ''} near you`}
          </p>
        </div>

        {itemCount === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No {itemLabel}s found in your area.</p>
            <Button onClick={() => navigate('/booking/location')} className="mt-4">
              Try Different Location
            </Button>
          </Card>
        ) : providerType === 'hospital' ? (
          // Render hospitals
          <div className="grid md:grid-cols-2 gap-6">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="hover:shadow-float transition-shadow">
                <CardHeader>
                  <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="text-primary" size={32} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{hospital.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{hospital.city}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {hospital.address && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>{hospital.address}</span>
                      </div>
                    )}
                    {hospital.description && (
                      <p className="text-muted-foreground mt-2 line-clamp-2">
                        {hospital.description}
                      </p>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => navigate(`/booking/hospital/${hospital.id}`)}
                    variant="medical"
                    className="w-full"
                  >
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          // Render providers
          <div className="grid md:grid-cols-2 gap-6">
            {providers.map((provider) => (
              <Card key={provider.id} className="hover:shadow-float transition-shadow">
                <CardHeader>
                  <div className="flex gap-4">
                    <img
                      src={provider.photo_url}
                      alt={provider.name}
                      className="w-20 h-20 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle className="text-xl">{provider.name}</CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{provider.specialty}</Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase size={16} />
                      <span>{provider.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Star size={16} className="text-yellow-500 fill-yellow-500" />
                      <span>4.8 (120 reviews)</span>
                    </div>
                    {(provider as any).distance && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>{(provider as any).distance.toFixed(1)} km away</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-primary font-semibold">
                      <DollarSign size={16} />
                      <span>
                        {provider.services[0]?.price
                          ? formatPrice(provider.services[0].price)
                          : 'Contact for pricing'}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => navigate(`/booking/provider/${provider.id}`)}
                    variant="medical"
                    className="w-full"
                  >
                    View Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
