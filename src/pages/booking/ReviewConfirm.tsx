import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, DollarSign, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useBooking } from '@/contexts/BookingContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from '@/lib/bookingUtils';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ReviewConfirm() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    city,
    providerData,
    selectedDate,
    selectedTime,
    price,
    providerId,
    resetBooking,
  } = useBooking();
  const [confirming, setConfirming] = useState(false);

  if (!providerData || !selectedDate || !selectedTime) {
    navigate('/booking/location');
    return null;
  }

  if (!user) {
    navigate(`/login?redirect=/booking/review`);
    return null;
  }

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      // Combine date and time
      const appointmentDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(':');
      appointmentDateTime.setHours(parseInt(hours), parseInt(minutes));

      // Insert appointment
      const { error: appointmentError } = await supabase.from('appointments').insert({
        user_id: user.id,
        doctor_id: providerId,
        appointment_date: appointmentDateTime.toISOString(),
        status: 'scheduled',
        appointment_type: providerData.provider_type,
        duration_minutes: providerData.duration || 30,
      });

      if (appointmentError) throw appointmentError;

      // Mark time slot as booked
      const { error: updateError } = await supabase
        .from('availability_dates')
        .update({ is_booked: true })
        .eq('provider_id', providerId)
        .eq('date', format(selectedDate, 'yyyy-MM-dd'))
        .eq('time_slot', selectedTime);

      if (updateError) throw updateError;

      toast.success('Appointment confirmed successfully!');
      navigate('/booking/confirmed');
    } catch (error) {
      console.error('Error confirming appointment:', error);
      toast.error('Failed to confirm appointment. Please try again.');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Review & Confirm Appointment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Provider Info */}
            <div className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg">
              <img
                src={providerData.photo_url}
                alt={providerData.name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{providerData.name}</h3>
                <p className="text-sm text-muted-foreground">{providerData.specialty}</p>
                <Badge variant="secondary" className="mt-1">
                  {providerData.provider_type}
                </Badge>
              </div>
            </div>

            {/* Appointment Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Calendar className="text-primary" size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Date</div>
                  <div className="font-medium">{format(selectedDate, 'EEEE, MMMM d, yyyy')}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="text-primary" size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Time</div>
                  <div className="font-medium">{selectedTime}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="text-primary" size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Location</div>
                  <div className="font-medium">{city}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="text-primary" size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Duration</div>
                  <div className="font-medium">{providerData.duration || 30} minutes</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="text-primary" size={20} />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Consultation Fee</div>
                  <div className="font-semibold text-lg text-primary">{formatPrice(price)}</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              <Button
                onClick={handleConfirm}
                disabled={confirming}
                variant="medical"
                size="lg"
                className="w-full"
              >
                {confirming ? 'Confirming...' : 'Confirm Appointment'}
              </Button>
              <Button
                onClick={() => navigate(`/booking/time/${providerId}`)}
                variant="outline"
                size="lg"
                className="w-full"
                disabled={confirming}
              >
                Change Time
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
