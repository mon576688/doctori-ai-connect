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

      // Use atomic booking function to prevent race conditions
      const { data: appointmentId, error } = await supabase.rpc('book_appointment_slot', {
        _user_id: user.id,
        _provider_id: providerId,
        _appointment_date: appointmentDateTime.toISOString(),
        _date: format(selectedDate, 'yyyy-MM-dd'),
        _time_slot: selectedTime,
        _appointment_type: providerData.provider_type,
        _duration_minutes: providerData.duration || 30,
      });

      if (error) {
        // Handle specific error cases
        if (error.message.includes('no longer available')) {
          toast.error('This time slot is no longer available. Please select another time.');
          navigate(`/booking/time/${providerId}`);
          return;
        }
        throw error;
      }

      toast.success('Appointment confirmed successfully!');
      navigate('/booking/confirmed');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to confirm appointment. Please try again.');
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
