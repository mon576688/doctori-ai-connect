import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Calendar, Clock, User, FileText } from "lucide-react";
import { format } from "date-fns";

interface DoctorProfile {
  first_name: string | null;
  last_name: string | null;
  email: string;
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
  doctors?: {
    user_id: string;
    specialty: string;
    profiles: DoctorProfile;
  } | null;
  profiles?: PatientProfile | null;
}

interface AppointmentsListProps {
  viewAs?: "patient" | "provider";
}

export const AppointmentsList = ({ viewAs = "patient" }: AppointmentsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
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
            .select("user_id, specialty")
            .eq("user_id", appointment.doctor_id)
            .single();

          if (doctorData) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("first_name, last_name, email")
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

            return (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{name}</span>
                      {viewAs === "patient" && specialty && (
                        <Badge variant="secondary">{specialty}</Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      {format(new Date(appointment.appointment_date), "PPP 'at' p")}
                    </div>

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
                  <div className="pt-2 border-t">
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
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};