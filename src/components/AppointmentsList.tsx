import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, User, FileText, Video, Phone, MessageCircle, ExternalLink, Stethoscope, MessageSquareDashed } from "lucide-react";
import { format } from "date-fns";

interface DoctorProfile {
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  photo_url: string | null;
}

interface PatientProfile {
  first_name: string | null;
  last_name: string | null;
  email: string;
}

interface Appointment {
  id: string;
  appointment_date: string;
  status: string;
  notes: string | null;
  doctor_id: string;
  user_id: string;
  consultation_type: string | null;
  consultation_platform: string | null;
  consultation_link: string | null;
  consultation_status: string | null;
  is_chat_enabled?: boolean;
  session_end_time?: string | null;
  doctors?: {
    user_id: string;
    specialty: string;
    consultation_fee: number | null;
    profiles: DoctorProfile;
  } | null;
  profiles?: PatientProfile | null;
}

interface AppointmentsListProps {
  viewAs?: "patient" | "provider";
}

const platformIcons: Record<string, React.ReactNode> = {
  phone: <Phone className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
  zoom: <Video className="h-4 w-4" />,
  'google-meet': <Video className="h-4 w-4" />,
};

export const AppointmentsList = ({ viewAs = "patient" }: AppointmentsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();

    // Subscribe to realtime updates
    const channel = supabase
      .channel("appointments-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "appointments",
          filter: viewAs === "patient" ? `user_id=eq.${user?.id}` : `doctor_id=eq.${user?.id}`,
        },
        () => {
          fetchAppointments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, viewAs]);

  const fetchAppointments = async () => {
    if (!user) return;

    setIsLoading(true);

    let query = supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false });

    if (viewAs === "patient") {
      query = query.eq("user_id", user.id);
    } else {
      query = query.eq("doctor_id", user.id);
    }

    const { data: appointmentsData, error } = await query;

    if (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Fetch related profile information
    const enrichedAppointments = await Promise.all(
      (appointmentsData || []).map(async (appointment) => {
        let doctors = null;
        let profiles = null;

        if (viewAs === "patient") {
          // Fetch doctor info
          const { data: doctorData } = await supabase
            .from("doctors")
            .select("user_id, specialty, consultation_fee")
            .eq("user_id", appointment.doctor_id)
            .single();

          if (doctorData) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("first_name, last_name, email, phone, photo_url")
              .eq("id", doctorData.user_id)
              .single();

            if (profileData) {
              doctors = {
                ...doctorData,
                profiles: profileData,
              };
            }
          }
        } else {
          // Fetch patient info
          const { data: profileData } = await supabase
            .from("profiles")
            .select("first_name, last_name, email")
            .eq("id", appointment.user_id)
            .single();

          profiles = profileData;
        }

        return {
          ...appointment,
          doctors,
          profiles,
        };
      })
    );

    setAppointments(enrichedAppointments as Appointment[]);
    setIsLoading(false);
  };

  const updateStatus = async (appointmentId: string, newStatus: string) => {
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointmentId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Status updated",
      description: `Appointment marked as ${newStatus}`,
    });

    fetchAppointments();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getDoctorName = (appointment: Appointment) => {
    if (!appointment.doctors?.profiles) return "Unknown Doctor";
    const profile = appointment.doctors.profiles;
    const name = `${profile.first_name || ""} ${profile.last_name || ""}`.trim();
    return name ? `Dr. ${name}` : profile.email;
  };

  const getDoctorInitials = (appointment: Appointment) => {
    if (!appointment.doctors?.profiles) return "D";
    const profile = appointment.doctors.profiles;
    return `${profile.first_name?.[0] || ""}${profile.last_name?.[0] || ""}`.toUpperCase() || "D";
  };

  const openMeetingLink = (link: string) => {
    window.open(link, '_blank');
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Loading appointments...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          {viewAs === "patient" ? "My Appointments" : "Patient Appointments"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No appointments found
          </p>
        ) : (
          appointments.map((appointment) => {
            let name = "Unknown";
            let specialty = null;
            
            if (viewAs === "patient" && appointment.doctors?.profiles) {
              const profile = appointment.doctors.profiles;
              name = `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.email;
              specialty = appointment.doctors.specialty;
            } else if (viewAs === "provider" && appointment.profiles) {
              const profile = appointment.profiles;
              name = `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || profile.email;
            }

            const isUpcoming = new Date(appointment.appointment_date) > new Date();

            return (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    {/* Doctor/Patient Info with Avatar */}
                    <div className="flex items-center gap-3">
                      {viewAs === "patient" && appointment.doctors?.profiles && (
                        <Avatar className="h-12 w-12">
                          <AvatarImage 
                            src={appointment.doctors.profiles.photo_url || undefined} 
                            alt={getDoctorName(appointment)} 
                          />
                          <AvatarFallback>{getDoctorInitials(appointment)}</AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          {viewAs === "patient" ? (
                            <Stethoscope className="h-4 w-4 text-primary" />
                          ) : (
                            <User className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-semibold">
                            {viewAs === "patient" ? getDoctorName(appointment) : name}
                          </span>
                        </div>
                        {viewAs === "patient" && specialty && (
                          <Badge variant="secondary" className="mt-1">{specialty}</Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {format(new Date(appointment.appointment_date), "PPP 'at' p")}
                    </div>

                    {/* Consultation Type & Platform */}
                    {appointment.consultation_type && (
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline" className="capitalize">
                          {appointment.consultation_type === 'video' ? (
                            <><Video className="h-3 w-3 mr-1" /> Video</>
                          ) : (
                            <><Phone className="h-3 w-3 mr-1" /> Audio</>
                          )}
                        </Badge>
                        {appointment.consultation_platform && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            {platformIcons[appointment.consultation_platform]}
                            <span className="capitalize">{appointment.consultation_platform.replace('-', ' ')}</span>
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Meeting Link for Patient */}
                    {viewAs === "patient" && appointment.consultation_link && appointment.consultation_status === 'in_progress' && (
                      <div className="bg-primary/10 rounded-lg p-3 space-y-2">
                        <p className="text-sm font-medium text-primary flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Consultation In Progress
                        </p>
                        <Button 
                          size="sm" 
                          onClick={() => openMeetingLink(appointment.consultation_link!)}
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Join Consultation
                        </Button>
                      </div>
                    )}

                    {/* Consultation Status */}
                    {appointment.consultation_status === 'in_progress' && (
                      <Badge className="bg-green-500 animate-pulse">
                        Consultation In Progress
                      </Badge>
                    )}

                    {appointment.notes && (
                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p className="text-muted-foreground">{appointment.notes}</p>
                      </div>
                    )}
                  </div>

                  <Badge className={getStatusColor(appointment.status)}>
                    {appointment.status}
                  </Badge>
                </div>

                {viewAs === "provider" && appointment.status === "scheduled" && (
                  <div className="flex gap-2 pt-2 border-t">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(appointment.id, "completed")}
                    >
                      Mark Complete
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(appointment.id, "cancelled")}
                    >
                      Cancel
                    </Button>
                  </div>
                )}

                {viewAs === "patient" && appointment.status === "scheduled" && (
                  <div className="pt-2 border-t flex gap-2 flex-wrap">
                    {/* Chat with Doctor - only if chat is enabled */}
                    {appointment.is_chat_enabled && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate('/dashboard?tab=messages')}
                      >
                        <MessageSquareDashed className="h-4 w-4 mr-1" />
                        Chat with Doctor
                      </Button>
                    )}
                    {/* Contact Doctor Options */}
                    {appointment.doctors?.profiles?.phone && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`https://wa.me/${appointment.doctors!.profiles.phone!.replace(/\D/g, '')}`, '_blank')}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(`tel:${appointment.doctors!.profiles.phone}`, '_blank')}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(appointment.id, "cancelled")}
                      className="text-destructive"
                    >
                      Cancel Appointment
                    </Button>
                  </div>
                )}

                {/* Completed appointment - view chat history */}
                {viewAs === "patient" && appointment.status === "completed" && appointment.is_chat_enabled && (
                  <div className="pt-2 border-t">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate('/dashboard?tab=messages')}
                    >
                      <MessageSquareDashed className="h-4 w-4 mr-1" />
                      View Chat History
                    </Button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};