import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { BookingProgress } from '@/components/booking/BookingProgress';
import { toast } from 'sonner';
import { format, addDays } from 'date-fns';

export default function DateSelect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { providerId, providerData, setSelectedDate, setProvider } = useBooking();
  const [date, setDate] = useState<Date | undefined>();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);
  const [contextReady, setContextReady] = useState(false);

  // Recover context from URL if needed
  useEffect(() => {
    const recoverContext = async () => {
      if (providerId && providerId === id) {
        setContextReady(true);
        return;
      }

      if (!id) {
        navigate('/booking/providers');
        return;
      }

      // Try to fetch provider data and set it in context
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            id, name, first_name, last_name, bio, photo_url,
            latitude, longitude, address, city, provider_type,
            provider_services (price, service_name, duration_minutes)
          `)
          .eq('id', id)
          .single();

        if (error || !data) {
          toast.error('Provider not found');
          navigate('/booking/providers');
          return;
        }

        const providerInfo = {
          id: data.id,
          name: data.name || `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'Provider',
          specialty: data.provider_services?.[0]?.service_name || 'General Practice',
          rating: 4.8,
          experience: 5,
          price: data.provider_services?.[0]?.price || 0,
          photo_url: data.photo_url || '/placeholder.svg',
          latitude: data.latitude ? parseFloat(String(data.latitude)) : 0,
          longitude: data.longitude ? parseFloat(String(data.longitude)) : 0,
          address: data.address || '',
          bio: data.bio || '',
          provider_type: (data.provider_type || 'doctor') as 'doctor' | 'hospital' | 'nurse',
          duration: data.provider_services?.[0]?.duration_minutes || 30,
        };

        setProvider(id, providerInfo);
        setContextReady(true);
      } catch (error) {
        console.error('Error recovering context:', error);
        navigate('/booking/providers');
      }
    };

    recoverContext();
  }, [id, providerId, navigate, setProvider]);

  useEffect(() => {
    if (!contextReady || !id) return;

    const fetchAvailability = async () => {
      try {
        // First check availability_dates (specific dates)
        const { data, error } = await supabase
          .from('availability_dates')
          .select('date')
          .eq('provider_id', id)
          .eq('is_available', true)
          .eq('is_booked', false)
          .gte('date', format(new Date(), 'yyyy-MM-dd'));

        if (error) throw error;

        const uniqueDates = [...new Set((data || []).map((d) => d.date))];
        let dates = uniqueDates.map((d) => new Date(d));

        // If no specific dates, fall back to recurring weekly slots
        if (dates.length === 0) {
          const { data: weeklySlots, error: slotsError } = await supabase
            .from('availability_slots')
            .select('day_of_week, start_time, end_time')
            .eq('provider_id', id)
            .eq('is_available', true);

          if (!slotsError && weeklySlots && weeklySlots.length > 0) {
            const generated: Date[] = [];
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            for (let i = 0; i < 14; i++) {
              const d = addDays(today, i);
              if (weeklySlots.some((s) => s.day_of_week === d.getDay())) {
                generated.push(d);
              }
            }
            dates = generated;
          }
        }

        setAvailableDates(dates);
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast.error('Failed to load available dates');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [id, contextReady]);

  const handleContinue = () => {
    if (date) {
      setSelectedDate(date);
      navigate(`/booking/time/${id}`);
    }
  };

  const isDateAvailable = (checkDate: Date) => {
    return availableDates.some(
      (availDate) => format(availDate, 'yyyy-MM-dd') === format(checkDate, 'yyyy-MM-dd')
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <BookingProgress />
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Select Appointment Date</CardTitle>
            {providerData && (
              <div className="flex items-center gap-3 mt-4">
                <img
                  src={providerData.photo_url}
                  alt={providerData.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{providerData.name}</div>
                  <div className="text-sm text-muted-foreground">{providerData.specialty}</div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {availableDates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No available dates found for this provider
                </p>
                <Button onClick={() => navigate('/booking/providers')}>
                  Choose Different Provider
                </Button>
              </div>
            ) : (
              <>
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(checkDate) => !isDateAvailable(checkDate)}
                    className="pointer-events-auto"
                  />
                </div>
                {date && (
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-4">
                      Selected: {format(date, 'EEEE, MMMM d, yyyy')}
                    </p>
                    <Button onClick={handleContinue} variant="medical" size="lg" className="w-full">
                      Continue to Time Selection
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
