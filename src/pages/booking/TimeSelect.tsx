import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Sunrise, Sun, Moon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/contexts/BookingContext';
import { supabase } from '@/integrations/supabase/client';
import { groupTimeSlots } from '@/lib/bookingUtils';
import { BookingProgress } from '@/components/booking/BookingProgress';
import { SimilarDoctors } from '@/components/booking/SimilarDoctors';
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

  // Check if we have required context, redirect to date selection if missing date
  useEffect(() => {
    if (!providerId || providerId !== id) {
      // If no provider context, go back to date selection which will recover it
      navigate(`/booking/schedule/${id}`);
      return;
    }
    if (!selectedDate) {
      // If no date selected, go back to date selection
      navigate(`/booking/schedule/${id}`);
    }
  }, [providerId, id, selectedDate, navigate]);

  useEffect(() => {
    if (!providerId || providerId !== id || !selectedDate) return;

    const fetchTimeSlots = async () => {
      try {
        const dateStr = format(selectedDate, 'yyyy-MM-dd');

        // First check availability_dates
        const { data, error } = await supabase
          .from('availability_dates')
          .select('time_slot')
          .eq('provider_id', id)
          .eq('date', dateStr)
          .eq('is_available', true)
          .eq('is_booked', false);

        if (error) throw error;

        let slots = (data || []).map((d) => d.time_slot);

        // If no specific dates, fall back to recurring weekly slots
        if (slots.length === 0) {
          const dayOfWeek = selectedDate.getDay();
          const { data: weeklySlots, error: slotsError } = await supabase
            .from('availability_slots')
            .select('start_time, end_time')
            .eq('provider_id', id)
            .eq('day_of_week', dayOfWeek)
            .eq('is_available', true);

          if (!slotsError && weeklySlots && weeklySlots.length > 0) {
            // Generate hourly time slots from each range
            const generatedSlots: string[] = [];
            for (const slot of weeklySlots) {
              const startHour = parseInt(slot.start_time.split(':')[0], 10);
              const endHour = parseInt(slot.end_time.split(':')[0], 10);
              for (let h = startHour; h < endHour; h++) {
                generatedSlots.push(`${h.toString().padStart(2, '0')}:00:00`);
              }
            }

            // Filter out already-booked appointments
            const { data: bookedAppts } = await supabase
              .from('appointments')
              .select('appointment_date')
              .eq('doctor_id', id)
              .eq('status', 'scheduled')
              .gte('appointment_date', `${dateStr}T00:00:00`)
              .lte('appointment_date', `${dateStr}T23:59:59`);

            const bookedTimes = new Set(
              (bookedAppts || []).map((a) => {
                const d = new Date(a.appointment_date);
                return `${d.getHours().toString().padStart(2, '0')}:00:00`;
              })
            );

            // Also filter out slots already in availability_dates as booked
            const { data: bookedDates } = await supabase
              .from('availability_dates')
              .select('time_slot')
              .eq('provider_id', id)
              .eq('date', dateStr)
              .eq('is_booked', true);

            const bookedDateTimes = new Set(
              (bookedDates || []).map((d) => d.time_slot)
            );

            slots = generatedSlots.filter(
              (s) => !bookedTimes.has(s) && !bookedDateTimes.has(s)
            );
          }
        }

        // Format time slots for display (HH:MM format)
        const displaySlots = slots.map((s) => {
          const parts = s.split(':');
          const hour = parseInt(parts[0], 10);
          const minute = parts[1] || '00';
          const ampm = hour >= 12 ? 'PM' : 'AM';
          const displayHour = hour % 12 || 12;
          return `${displayHour}:${minute} ${ampm}`;
        });

        const grouped = groupTimeSlots(displaySlots);
        setTimeSlots(grouped);
      } catch (error) {
        console.error('Error fetching time slots:', error);
        toast.error('Failed to load available time slots');
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [id, providerId, selectedDate]);

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
    <div className="min-h-screen bg-background py-8 px-4">
      <BookingProgress />
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
        {providerData && (
          <div className="mt-8">
            <SimilarDoctors
              currentDoctorId={id!}
              specialty={(providerData as any).specialty}
              city={(providerData as any).city}
            />
          </div>
        )}
      </div>
    </div>
  );
}
