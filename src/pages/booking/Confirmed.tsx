import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Home } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useBooking } from '@/contexts/BookingContext';

export default function Confirmed() {
  const navigate = useNavigate();
  const { resetBooking } = useBooking();

  useEffect(() => {
    // Reset booking state after confirmation
    return () => {
      resetBooking();
    };
  }, [resetBooking]);

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CheckCircle2 className="text-green-600 dark:text-green-500" size={48} />
            </div>
            <CardTitle className="text-3xl text-green-600 dark:text-green-500">
              Appointment Confirmed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-muted-foreground">
              Your appointment has been successfully booked. You will receive a confirmation email
              shortly.
            </p>

            <div className="space-y-3">
              <Button
                onClick={() => navigate('/dashboard')}
                variant="medical"
                size="lg"
                className="w-full"
              >
                <Calendar className="mr-2" />
                View My Appointments
              </Button>
              <Button
                onClick={() => navigate('/booking/location')}
                variant="outline"
                size="lg"
                className="w-full"
              >
                Book Another Appointment
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                size="lg"
                className="w-full"
              >
                <Home className="mr-2" />
                Back to Home
              </Button>
            </div>

            <div className="pt-4 text-sm text-muted-foreground">
              <p>
                Need to make changes? Visit your dashboard to view and manage your appointments.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
