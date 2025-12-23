import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle2, Calendar, Home, Video, Phone, MessageCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useBooking } from '@/contexts/BookingContext';

const platformIcons: Record<string, React.ReactNode> = {
  phone: <Phone className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
  zoom: <Video className="h-4 w-4" />,
  'google-meet': <Video className="h-4 w-4" />,
};

const platformLabels: Record<string, string> = {
  phone: 'Phone Call',
  whatsapp: 'WhatsApp',
  zoom: 'Zoom Meeting',
  'google-meet': 'Google Meet',
};

export default function Confirmed() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { resetBooking, providerData, selectedDate, selectedTime } = useBooking();
  
  const consultationType = searchParams.get('type') || 'video';
  const platform = searchParams.get('platform') || 'zoom';

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

        {/* Consultation Options Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Consultation Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Consultation Type</span>
              <Badge variant="secondary" className="capitalize">
                {consultationType === 'video' ? (
                  <><Video className="h-3 w-3 mr-1" /> Video Call</>
                ) : (
                  <><Phone className="h-3 w-3 mr-1" /> Audio Call</>
                )}
              </Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Platform</span>
              <Badge variant="outline" className="flex items-center gap-1">
                {platformIcons[platform]}
                {platformLabels[platform] || platform}
              </Badge>
            </div>

            <Separator />

            <div className="bg-muted/50 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Important:</strong> The doctor will initiate the call at the scheduled time. Please ensure you are available and have a stable internet connection.
              </p>
            </div>

            <div className="text-xs text-muted-foreground space-y-1">
              <p>• You will receive a notification when the doctor starts the consultation</p>
              <p>• Make sure to have your medical records ready</p>
              <p>• Be in a quiet, private space for the consultation</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
