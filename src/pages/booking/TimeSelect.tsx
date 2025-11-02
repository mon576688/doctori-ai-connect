import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sunrise, Sun, Moon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { groupTimeSlots } from '@/lib/bookingUtils';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function TimeSelect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { providerId, selectedDate, setSelectedTime, providerData } = useBooking();
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<{
    morning: string[];
    afternoon: string[];
    evening: string[];
  }>({ morning: [], afternoon: [], evening: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!providerId || providerId !== id || !selectedDate) {
      navigate('/booking/providers');
      return;
    }

    const fetchTimeSlots = async () => {
      try {
        const { data, error } = await supabase
          .from('availability_dates')
          .select('time_slot')
          .eq('provider_id', id)
          .eq('date', format(selectedDate, 'yyyy-MM-dd'))
          .eq('is_available', true)
          .eq('is_booked', false);

        if (error) throw error;

        const slots = (data || []).map((d) => d.time_slot);
        const grouped = groupTimeSlots(slots);
        setTimeSlots(grouped);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        toast.error('Failed to load available time slots');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [id, providerId, selectedDate, navigate]);

  const handleContinue = () => {
    if (selectedSlot) {
      setSelectedTime(selectedSlot);
      navigate('/booking/review');
    }
  };

  const TimeSlotButton = ({ time }: { time: string }) => (
    <Button
      variant={selectedSlot === time ? 'default' : 'outline'}
      onClick={() => setSelectedSlot(time)}
      className="w-full"
    >
      {time}
    </Button>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const hasSlots =
    timeSlots.morning.length > 0 || timeSlots.afternoon.length > 0 || timeSlots.evening.length > 0;

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Select Appointment Time</CardTitle>
            {providerData && selectedDate && (
              <div className="flex items-center gap-3 mt-4">
                <img
                  src={providerData.photo_url}
                  alt={providerData.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">{providerData.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                  </div>
                </div>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {!hasSlots ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No available time slots for this date
                </p>
                <Button onClick={() => navigate(`/booking/schedule/${id}`)}>
                  Choose Different Date
                </Button>
              </div>
            ) : (
              <>
                {timeSlots.morning.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sunrise className="text-primary" size={20} />
                      <h3 className="font-semibold">Morning (6 AM - 12 PM)</h3>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {timeSlots.morning.map((time) => (
                        <TimeSlotButton key={time} time={time} />
                      ))}
                    </div>
                  </div>
                )}

                {timeSlots.afternoon.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sun className="text-primary" size={20} />
                      <h3 className="font-semibold">Afternoon (12 PM - 6 PM)</h3>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {timeSlots.afternoon.map((time) => (
                        <TimeSlotButton key={time} time={time} />
                      ))}
                    </div>
                  </div>
                )}

                {timeSlots.evening.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Moon className="text-primary" size={20} />
                      <h3 className="font-semibold">Evening (6 PM - 10 PM)</h3>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {timeSlots.evening.map((time) => (
                        <TimeSlotButton key={time} time={time} />
                      ))}
                    </div>
                  </div>
                )}

                {selectedSlot && (
                  <Button
                    onClick={handleContinue}
                    variant="medical"
                    size="lg"
                    className="w-full mt-6"
                  >
                    Continue to Review
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
