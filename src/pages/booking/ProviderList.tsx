import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Star, Briefcase, DollarSign } from 'lucide-react';
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
  services: Array<{ price: number; service_name: string }>;
}

export default function ProviderList() {
  const navigate = useNavigate();
  const { city, providerType, userLatitude, userLongitude } = useBooking();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!city || !providerType) {
      navigate('/booking/location');
    }
  }, [city, providerType, navigate]);

  useEffect(() => {
    if (!city || !providerType) return;

    const fetchProviders = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id,
            name,
            first_name,
            last_name,
            bio,
            photo_url,
            latitude,
            longitude,
            address,
            provider_type,
            provider_services (
              price,
              service_name
            )
          `)
          .eq('role', 'provider')
          .eq('approval_status', 'approved')
          .eq('provider_type', providerType)
          .not('latitude', 'is', null)
          .not('longitude', 'is', null);

        if (error) throw error;

        const formattedProviders: Provider[] = (data || []).map((p: any) => ({
          id: p.id,
          name: p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim(),
          specialty: p.provider_services?.[0]?.service_name || 'General Practice',
          experience: 5, // Default, can be added to schema later
          photo_url: p.photo_url || '/placeholder.svg',
          latitude: parseFloat(p.latitude),
          longitude: parseFloat(p.longitude),
          bio: p.bio || '',
          provider_type: p.provider_type,
          address: p.address || '',
          services: p.provider_services || [],
        }));

        // Calculate distances and sort
        if (userLatitude && userLongitude) {
          formattedProviders.forEach((provider) => {
            (provider as any).distance = calculateDistance(
              userLatitude,
              userLongitude,
              provider.latitude,
              provider.longitude
            );
          });
          formattedProviders.sort((a: any, b: any) => a.distance - b.distance);
        }

        setProviders(formattedProviders);
      } catch (error) {
        console.error('Error fetching providers:', error);
        toast.error('Failed to load providers');
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
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

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <BookingProgress />
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Available Providers in {city}
          </h1>
          <p className="text-muted-foreground">
            Found {providers.length} {providerType}s near you
          </p>
        </div>

        {providers.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No providers found in your area.</p>
            <Button onClick={() => navigate('/booking/location')} className="mt-4">
              Try Different Location
            </Button>
          </Card>
        ) : (
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
