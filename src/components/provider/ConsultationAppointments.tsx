import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  Video, 
  Phone, 
  MessageCircle, 
  Calendar,
  Clock,
  User,
  FileText,
  Play,
  CheckCircle
} from 'lucide-react';
import { format, isToday, isFuture, isPast } from 'date-fns';

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  consultation_type: string;
  consultation_platform: string;
  consultation_status: string;
  notes: string | null;
  patient_info?: {
    id: string;
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
  };
}

const platformIcons: Record<string, React.ReactNode> = {
  phone: <Phone className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
  zoom: <Video className="h-4 w-4" />,
  'google-meet': <Video className="h-4 w-4" />,
};

const platformLabels: Record<string, string> = {
  phone: 'Phone',
  whatsapp: 'WhatsApp',
  zoom: 'Zoom',
  'google-meet': 'Google Meet',
};

export default function ConsultationAppointments() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('today');

  useEffect(() => {
    if (user) {
      fetchAppointments();
    }
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', user.id)
        .order('appointment_date', { ascending: true });

      if (error) throw error;

      // Fetch patient info for each appointment
      const appointmentsWithPatientInfo = await Promise.all(
        (data || []).map(async (appointment) => {
          const { data: patientProfile } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, phone')
            .eq('id', appointment.user_id)
            .single();

          return {
            ...appointment,
            patient_info: patientProfile || undefined,
          };
        })
      );

      setAppointments(appointmentsWithPatientInfo);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const startConsultation = async (appointment: Appointment) => {
    try {
      // Update consultation status
      const { error } = await supabase
        .from('appointments')
        .update({ 
          consultation_status: 'in_progress',
          consultation_started_at: new Date().toISOString()
        })
        .eq('id', appointment.id);

      if (error) throw error;

      // Open the appropriate platform
      const platform = appointment.consultation_platform;
      let url = '';

      switch (platform) {
        case 'zoom':
          url = 'https://zoom.us/start';
          break;
        case 'google-meet':
          url = 'https://meet.google.com/new';
          break;
        case 'whatsapp':
          if (appointment.patient_info?.phone) {
            url = `https://wa.me/${appointment.patient_info.phone}`;
          } else {
            toast.error('Patient phone number not available');
            return;
          }
          break;
        case 'phone':
          if (appointment.patient_info?.phone) {
            url = `tel:${appointment.patient_info.phone}`;
          } else {
            toast.error('Patient phone number not available');
            return;
          }
          break;
      }

      if (url) {
        window.open(url, '_blank');
      }

      toast.success('Consultation started!');
      fetchAppointments();
    } catch (error) {
      console.error('Error starting consultation:', error);
      toast.error('Failed to start consultation');
    }
  };

  const completeConsultation = async (appointmentId: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          consultation_status: 'completed',
          consultation_ended_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;
      toast.success('Consultation completed!');
      fetchAppointments();
    } catch (error) {
      console.error('Error completing consultation:', error);
      toast.error('Failed to complete consultation');
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointment_date);
    switch (filter) {
      case 'today':
        return isToday(aptDate);
      case 'upcoming':
        return isFuture(aptDate);
      case 'past':
        return isPast(aptDate) && !isToday(aptDate);
      default:
        return true;
    }
  });

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-muted rounded"></div>
        <div className="h-32 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Consultations</h2>
          <p className="text-muted-foreground">Manage your patient consultations</p>
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="past">Past</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAppointments.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No Consultations</h3>
            <p className="text-muted-foreground mt-2">
              {filter === 'today' 
                ? "You don't have any consultations scheduled for today."
                : "No consultations found for the selected filter."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      {appointment.patient_info?.first_name} {appointment.patient_info?.last_name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(appointment.appointment_date), 'PPP')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {format(new Date(appointment.appointment_date), 'p')}
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      appointment.status === 'completed' ? 'default' :
                      appointment.status === 'cancelled' ? 'destructive' : 'secondary'
                    }>
                      {appointment.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Type:</span>
                    <Badge variant="outline" className="capitalize">
                      {appointment.consultation_type === 'video' ? (
                        <><Video className="h-3 w-3 mr-1" /> Video</>
                      ) : (
                        <><Phone className="h-3 w-3 mr-1" /> Audio</>
                      )}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Platform:</span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      {platformIcons[appointment.consultation_platform]}
                      {platformLabels[appointment.consultation_platform] || appointment.consultation_platform}
                    </Badge>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Notes: </span>
                    {appointment.notes}
                  </div>
                )}

                <Separator />

                <div className="flex gap-2 justify-end flex-wrap">
                  {appointment.status === 'scheduled' && (
                    <>
                      {appointment.consultation_status !== 'in_progress' ? (
                        <Button 
                          onClick={() => startConsultation(appointment)}
                          className="flex items-center gap-2"
                        >
                          <Play className="h-4 w-4" />
                          Start Consultation
                        </Button>
                      ) : (
                        <Button 
                          variant="outline"
                          onClick={() => completeConsultation(appointment.id)}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Mark Complete
                        </Button>
                      )}
                    </>
                  )}
                  
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/provider/prescription?patient=${appointment.patient_info?.id}&appointment=${appointment.id}`)}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Write Prescription
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
