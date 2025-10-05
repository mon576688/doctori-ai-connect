import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Clock, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface TimeSlot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const ProviderAvailability = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slots, setSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAvailability();
  }, [user]);

  const fetchAvailability = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("availability_slots")
      .select("*")
      .eq("provider_id", user.id)
      .order("day_of_week")
      .order("start_time");

    if (error) {
      console.error("Error fetching availability:", error);
      return;
    }

    setSlots(data || []);
  };

  const addSlot = async (dayOfWeek: number) => {
    if (!user) return;

    setIsLoading(true);

    const { error } = await supabase.from("availability_slots").insert({
      provider_id: user.id,
      day_of_week: dayOfWeek,
      start_time: "09:00",
      end_time: "17:00",
      is_available: true,
    });

    setIsLoading(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Slot added",
      description: "New availability slot has been added",
    });

    fetchAvailability();
  };

  const deleteSlot = async (slotId: string) => {
    const { error } = await supabase
      .from("availability_slots")
      .delete()
      .eq("id", slotId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Slot removed",
      description: "Availability slot has been removed",
    });

    fetchAvailability();
  };

  const toggleAvailability = async (slotId: string, isAvailable: boolean) => {
    const { error } = await supabase
      .from("availability_slots")
      .update({ is_available: isAvailable })
      .eq("id", slotId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchAvailability();
  };

  const updateSlotTime = async (
    slotId: string,
    field: "start_time" | "end_time",
    value: string
  ) => {
    const { error } = await supabase
      .from("availability_slots")
      .update({ [field]: value })
      .eq("id", slotId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    fetchAvailability();
  };

  const groupedSlots = slots.reduce((acc, slot) => {
    if (!acc[slot.day_of_week]) {
      acc[slot.day_of_week] = [];
    }
    acc[slot.day_of_week].push(slot);
    return acc;
  }, {} as Record<number, TimeSlot[]>);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Manage Availability
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {DAYS_OF_WEEK.map((day, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{day}</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addSlot(index)}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Slot
              </Button>
            </div>

            {groupedSlots[index]?.map((slot) => (
              <div
                key={slot.id}
                className="flex items-center gap-3 p-3 border rounded-lg"
              >
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <Label className="text-xs">Start Time</Label>
                    <input
                      type="time"
                      value={slot.start_time}
                      onChange={(e) =>
                        updateSlotTime(slot.id, "start_time", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">End Time</Label>
                    <input
                      type="time"
                      value={slot.end_time}
                      onChange={(e) =>
                        updateSlotTime(slot.id, "end_time", e.target.value)
                      }
                      className="w-full px-2 py-1 border rounded text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={slot.is_available}
                    onCheckedChange={(checked) =>
                      toggleAvailability(slot.id, checked)
                    }
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteSlot(slot.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}

            {!groupedSlots[index]?.length && (
              <p className="text-sm text-muted-foreground italic">
                No availability set for this day
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};