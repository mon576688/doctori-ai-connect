import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Calendar, Home, Video, Building2, MapPin, HomeIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBooking } from '@/contexts/BookingContext';

export default function Confirmed() {
  const navigate = useNavigate();
  const { resetBooking, providerData, consultationType, city } = useBooking();

  const isPhysical = consultationType === 'physical';
  const isNurse = providerData?.provider_type === 'nurse';

  useEffect(() => {
    // Reset booking state after confirmation
    return () => {
      resetBooking();
    };
  }, [resetBooking]);

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full space-y-6">
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
                onClick={() => navigate('/dashboard/user')}
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

        {/* Consultation Details Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consultation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Consultation Type</span>
              <Badge variant="secondary" className="capitalize">
                {isPhysical ? (
                  <>
                    {isNurse ? <HomeIcon className="h-3 w-3 mr-1" /> : <Building2 className="h-3 w-3 mr-1" />}
                    {isNurse ? 'House Visit' : 'Physical Visit'}
                  </>
                ) : (
                  <><Video className="h-3 w-3 mr-1" /> Online Consultation</>
                )}
              </Badge>
            </div>

            <Separator />

            {isPhysical ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Location</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {providerData?.address || city || 'Will be provided'}
                  </Badge>
                </div>
                <Separator />
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Important:</strong>{' '}
                    {isNurse
                      ? 'The nurse will visit your home at the scheduled time. Please ensure someone is available to receive them.'
                      : 'Please arrive 10-15 minutes before your scheduled time. Bring any relevant medical records.'}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• Have your medical records and ID ready</p>
                  {isNurse ? (
                    <p>• Ensure a clean, well-lit area is prepared for the visit</p>
                  ) : (
                    <p>• Arrive early to complete any registration forms</p>
                  )}
                  <p>• Wear comfortable clothing for examination</p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Platform</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Video className="h-3 w-3" />
                    Video Call (Zoom / Google Meet)
                  </Badge>
                </div>
                <Separator />
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Important:</strong> The {isNurse ? 'nurse' : 'doctor'} will share a meeting link before the appointment. Please ensure you have a stable internet connection.
                  </p>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>• You will receive the meeting link via notification</p>
                  <p>• Make sure to have your medical records ready</p>
                  <p>• Be in a quiet, private space for the consultation</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
