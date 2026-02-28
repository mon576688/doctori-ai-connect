import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import PatientProfileModal from './PatientProfileModal';
import SendMeetingLink from './SendMeetingLink';
import { generateJitsiLink } from '@/lib/bookingUtils';
import { 
  Video, 
  Phone, 
  MessageCircle, 
  Calendar,
  Clock,
  User,
  FileText,
  Play,
  CheckCircle,
  Eye,
  Link2,
  Droplet,
  Mail
} from 'lucide-react';
import { format, isToday, isFuture, isPast } from 'date-fns';

interface PatientInfo {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  age: number | null;
  gender: string | null;
  blood_group: string | null;
}

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  consultation_type: string;
  consultation_platform: string;
  consultation_status: string;
  consultation_link: string | null;
  notes: string | null;
  patient_info?: PatientInfo;
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
  
  // Modal states
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [meetingLinkModalOpen, setMeetingLinkModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

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

      // Fetch patient info for each appointment with extended fields
      const appointmentsWithPatientInfo = await Promise.all(
        (data || []).map(async (appointment) => {
          const { data: patientProfile } = await supabase
            .from('profiles')
            .select('id, first_name, last_name, email, phone, photo_url, age, gender, blood_group')
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
      // Generate Jitsi meeting link if no link exists
      const meetingLink = appointment.consultation_link || generateJitsiLink(appointment.id);
      
      // Get doctor name for system message
      const doctorName = user ? `Dr. ${(await supabase.from('profiles').select('first_name, last_name').eq('id', user.id).single()).data?.first_name || 'Doctor'}` : 'Doctor';

      // Update consultation status with link and session start
      const { error } = await supabase
        .from('appointments')
        .update({ 
          consultation_status: 'in_progress',
          consultation_started_at: new Date().toISOString(),
          session_start_time: new Date().toISOString(),
          consultation_link: meetingLink,
          is_chat_enabled: true
        })
        .eq('id', appointment.id);

      if (error) throw error;

      // Auto-post system message with meeting link to chat
      if (appointment.patient_info?.id && user) {
        await supabase.from('direct_messages').insert({
          sender_id: user.id,
          receiver_id: appointment.patient_info.id,
          content: `[SYSTEM] Video Consultation Started. Join your consultation with ${doctorName}: ${meetingLink}`
        });
      }

      // Send notification to patient
      if (appointment.patient_info?.id) {
        await supabase.rpc('send_notification', {
          _user_id: appointment.patient_info.id,
          _title: 'Consultation Started',
          _message: `Your doctor has started the consultation. Join now: ${meetingLink}`,
          _type: 'info',
          _link: meetingLink,
        });
      }

      // Open the meeting link
      if (meetingLink) {
        window.open(meetingLink, '_blank');
      }

      toast.success('Consultation started!');
      fetchAppointments();
    } catch (error) {
      console.error('Error starting consultation:', error);
      toast.error('Failed to start consultation');
    }
  };

  const completeConsultation = async (appointmentId: string, patientId?: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'completed',
          consultation_status: 'completed',
          consultation_ended_at: new Date().toISOString(),
          session_end_time: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (error) throw error;

      // Auto-post system message about consultation end
      if (patientId && user) {
        await supabase.from('direct_messages').insert({
          sender_id: user.id,
          receiver_id: patientId,
          content: '[SYSTEM] Consultation ended. You can still send follow-up messages for the next 24 hours.'
        });
      }

      // Send notification to patient
      if (patientId) {
        await supabase.rpc('send_notification', {
          _user_id: patientId,
          _title: 'Consultation Completed',
          _message: 'Your consultation has been completed. You can send follow-up messages for 24 hours.',
          _type: 'success',
          _link: '/dashboard',
        });
      }

      toast.success('Consultation completed!');
      fetchAppointments();
    } catch (error) {
      console.error('Error completing consultation:', error);
      toast.error('Failed to complete consultation');
    }
  };

  const openPatientProfile = (patientId: string) => {
    setSelectedPatientId(patientId);
    setProfileModalOpen(true);
  };

  const openMeetingLinkModal = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setMeetingLinkModalOpen(true);
  };

  const getPatientName = (patient?: PatientInfo) => {
    if (!patient) return 'Unknown Patient';
    const name = `${patient.first_name || ''} ${patient.last_name || ''}`.trim();
    return name || patient.email || 'Unknown Patient';
  };

  const getPatientInitials = (patient?: PatientInfo) => {
    if (!patient) return 'P';
    return `${patient.first_name?.[0] || ''}${patient.last_name?.[0] || ''}`.toUpperCase() || 'P';
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
    <>
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
                    <div className="flex items-start gap-4">
                      {/* Patient Avatar */}
                      <Avatar className="h-14 w-14 cursor-pointer hover:ring-2 hover:ring-primary transition-all" onClick={() => appointment.patient_info?.id && openPatientProfile(appointment.patient_info.id)}>
                        <AvatarImage src={appointment.patient_info?.photo_url || undefined} alt={getPatientName(appointment.patient_info)} />
                        <AvatarFallback className="text-lg">{getPatientInitials(appointment.patient_info)}</AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {getPatientName(appointment.patient_info)}
                          {appointment.patient_info?.id && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 px-2"
                              onClick={() => openPatientProfile(appointment.patient_info!.id)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              Profile
                            </Button>
                          )}
                        </CardTitle>
                        
                        {/* Patient Quick Info */}
                        <div className="flex flex-wrap gap-2">
                          {appointment.patient_info?.gender && (
                            <Badge variant="secondary" className="text-xs capitalize">
                              {appointment.patient_info.gender}
                            </Badge>
                          )}
                          {appointment.patient_info?.age && (
                            <Badge variant="secondary" className="text-xs">
                              {appointment.patient_info.age} yrs
                            </Badge>
                          )}
                          {appointment.patient_info?.blood_group && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1">
                              <Droplet className="h-3 w-3" />
                              {appointment.patient_info.blood_group}
                            </Badge>
                          )}
                        </div>
                        
                        <CardDescription className="flex items-center gap-4 pt-1">
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
                  {/* Patient Contact Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    {appointment.patient_info?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{appointment.patient_info.phone}</span>
                      </div>
                    )}
                    {appointment.patient_info?.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate max-w-[200px]">{appointment.patient_info.email}</span>
                      </div>
                    )}
                  </div>
                  
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
                    {appointment.consultation_link && (
                      <div className="flex items-center gap-2">
                        <Link2 className="h-4 w-4 text-green-500" />
                        <span className="text-green-600 text-xs">Link sent</span>
                      </div>
                    )}
                  </div>

                  {appointment.notes && (
                    <div className="text-sm">
                      <span className="text-muted-foreground">Notes: </span>
                      {appointment.notes}
                    </div>
                  )}

                  <Separator />

                  <div className="flex gap-2 justify-end flex-wrap">
                    {/* Send Meeting Link Button */}
                    {appointment.status === 'scheduled' && !appointment.consultation_link && (
                      <Button 
                        variant="outline"
                        onClick={() => openMeetingLinkModal(appointment)}
                        className="flex items-center gap-2"
                      >
                        <Link2 className="h-4 w-4" />
                        Send Meeting Link
                      </Button>
                    )}
                    
                    {/* Quick Contact Buttons */}
                    {appointment.patient_info?.phone && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`https://wa.me/${appointment.patient_info!.phone!.replace(/\D/g, '')}`, '_blank')}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${appointment.patient_info!.phone}`, '_blank')}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    
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
                            onClick={() => completeConsultation(appointment.id, appointment.patient_info?.id)}
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

      {/* Patient Profile Modal */}
      <PatientProfileModal
        patientId={selectedPatientId}
        open={profileModalOpen}
        onOpenChange={setProfileModalOpen}
      />

      {/* Send Meeting Link Modal */}
      {selectedAppointment && (
        <SendMeetingLink
          appointmentId={selectedAppointment.id}
          patientId={selectedAppointment.patient_info?.id || ''}
          patientName={getPatientName(selectedAppointment.patient_info)}
          patientPhone={selectedAppointment.patient_info?.phone || undefined}
          open={meetingLinkModalOpen}
          onOpenChange={setMeetingLinkModalOpen}
          onSuccess={fetchAppointments}
        />
      )}
    </>
  );
}