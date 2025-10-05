import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentBookingFormProps {
  doctorId: string;
  doctorName: string;
  onSuccess?: () => void;
}

export const AppointmentBookingForm = ({
  doctorId,
  doctorName,
  onSuccess,
}: AppointmentBookingFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [date, setDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  const handleDateSelect = async (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setSelectedTime("");

    if (!selectedDate) return;

    // Fetch available time slots for the selected date
    const dayOfWeek = selectedDate.getDay();

    const { data: slots, error } = await supabase
      .from("availability_slots")
      .select("start_time, end_time")
      .eq("provider_id", doctorId)
      .eq("day_of_week", dayOfWeek)
      .eq("is_available", true);

    if (error) {
      console.error("Error fetching availability:", error);
      return;
    }

    // Generate time slots from availability
    const timeSlots: string[] = [];
    slots?.forEach((slot) => {
      const start = new Date(`2000-01-01T${slot.start_time}`);
      const end = new Date(`2000-01-01T${slot.end_time}`);
      
      for (let time = start; time < end; time.setMinutes(time.getMinutes() + 30)) {
        timeSlots.push(format(time, "HH:mm"));
      }
    });

    setAvailableSlots(timeSlots);
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book an appointment",
        variant: "destructive",
      });
      return;
    }

    if (!date || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select a date and time",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const appointmentDateTime = new Date(date);
    const [hours, minutes] = selectedTime.split(":").map(Number);
    appointmentDateTime.setHours(hours, minutes, 0, 0);

    const { error } = await supabase.from("appointments").insert({
      user_id: user.id,
      doctor_id: doctorId,
      appointment_date: appointmentDateTime.toISOString(),
      status: "scheduled",
      notes: notes || null,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Booking failed",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Appointment booked!",
      description: `Your appointment with ${doctorName} has been confirmed`,
    });

    setDate(undefined);
    setSelectedTime("");
    setNotes("");
    onSuccess?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CalendarIcon className="h-5 w-5" />
          Book Appointment with {doctorName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Select Date</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date() || date.getDay() === 0}
            className={cn("rounded-md border mt-2 pointer-events-auto")}
          />
        </div>

        {date && availableSlots.length > 0 && (
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4" />
              Select Time
            </Label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {availableSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTime(time)}
                  className="w-full"
                >
                  {time}
                </Button>
              ))}
            </div>
          </div>
        )}

        {date && availableSlots.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No available slots for this date. Please select another date.
          </p>
        )}

        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any additional information for the doctor..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="mt-2"
          />
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!date || !selectedTime || isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? "Booking..." : "Confirm Appointment"}
        </Button>
      </CardContent>
    </Card>
  );
};