import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { BookingProgress } from '@/components/booking/BookingProgress';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function DateSelect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { providerId, providerData, setSelectedDate } = useBooking();
  const [date, setDate] = useState<Date | undefined>();
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!providerId || providerId !== id) {
      navigate('/booking/providers');
    }
  }, [providerId, id, navigate]);

  useEffect(() => {
    if (!providerId || providerId !== id) return;

    const fetchAvailability = async () => {
      try {
        const { data, error } = await supabase
          .from('availability_dates')
          .select('date')
          .eq('provider_id', id)
          .eq('is_available', true)
          .eq('is_booked', false)
          .gte('date', format(new Date(), 'yyyy-MM-dd'));

        if (error) throw error;

        const dates = (data || []).map((d) => new Date(d.date));
        setAvailableDates(dates);
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast.error('Failed to load available dates');
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();
  }, [id, providerId, navigate]);

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
