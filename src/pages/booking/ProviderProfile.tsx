import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Briefcase, DollarSign, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/bookingUtils';
import { toast } from 'sonner';

export default function ProviderProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { setProvider } = useBooking();
  const [provider, setProviderData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProvider = async () => {
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
              service_name,
              description,
              duration_minutes
            )
          `)
          .eq('id', id)
          .single();

        if (error) throw error;

        const formattedProvider = {
          id: data.id,
          name: data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim(),
          bio: data.bio || 'No bio available',
          photo_url: data.photo_url || '/placeholder.svg',
          latitude: data.latitude ? parseFloat(String(data.latitude)) : 0,
          longitude: data.longitude ? parseFloat(String(data.longitude)) : 0,
          address: data.address || 'Address not provided',
          provider_type: data.provider_type,
          specialty: data.provider_services?.[0]?.service_name || 'General Practice',
          price: data.provider_services?.[0]?.price || 0,
          duration: data.provider_services?.[0]?.duration_minutes || 30,
          experience: 5, // Default
          rating: 4.8,
          services: data.provider_services || [],
        };

        setProviderData(formattedProvider);
      } catch (error) {
        console.error('Error fetching provider:', error);
        toast.error('Failed to load provider details');
        navigate('/booking/providers');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProvider();
    }
  }, [id, navigate]);

  const handleBookAppointment = () => {
    if (provider) {
      setProvider(provider.id, provider);
      navigate(`/booking/schedule/${provider.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!provider) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="overflow-hidden">
          <div className="bg-gradient-primary h-32"></div>
          <CardHeader className="relative -mt-16">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-end">
              <img
                src={provider.photo_url}
                alt={provider.name}
                className="w-32 h-32 rounded-full border-4 border-background object-cover shadow-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <CardTitle className="text-3xl mb-2">{provider.name}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="secondary">{provider.specialty}</Badge>
                      <Badge variant="outline">{provider.provider_type}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">
                      {formatPrice(provider.price)}
                    </div>
                    <div className="text-sm text-muted-foreground">per session</div>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 mt-6">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Briefcase className="text-primary" size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Experience</div>
                  <div className="font-semibold">{provider.experience} years</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Star className="text-primary" size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Rating</div>
                  <div className="font-semibold">{provider.rating} ⭐</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="text-primary" size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-semibold">{provider.duration} min</div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">About</h3>
              <p className="text-muted-foreground leading-relaxed">{provider.bio}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <div className="flex items-start gap-2">
                <MapPin className="text-primary mt-1" size={20} />
                <p className="text-muted-foreground">{provider.address}</p>
              </div>
            </div>

            {provider.services.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Services Offered</h3>
                <div className="grid gap-3">
                  {provider.services.map((service: any, idx: number) => (
                    <Card key={idx} className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">{service.service_name}</h4>
                          {service.description && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-primary">
                            {formatPrice(service.price)}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {service.duration_minutes} min
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 sticky bottom-4">
          <Button
            onClick={handleBookAppointment}
            variant="medical"
            size="lg"
            className="w-full shadow-float"
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
}
