import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AvailabilityDate {
  id: string;
  provider_id: string;
  date: string;
  time_slot: string;
  is_available: boolean;
  is_booked: boolean;
  created_at: string;
  updated_at: string;
}

export const useRealtimeAvailability = (providerId: string | null) => {
  const [availability, setAvailability] = useState<AvailabilityDate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!providerId) {
      setAvailability([]);
      setLoading(false);
      return;
    }

    const fetchAvailability = async () => {
      try {
        const { data, error } = await supabase
          .from('availability_dates')
          .select('*')
          .eq('provider_id', providerId)
          .order('date', { ascending: true })
          .order('time_slot', { ascending: true });
        
        if (error) throw error;
        setAvailability(data || []);
      } catch (error) {
        console.error('Error fetching availability:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailability();

    const channel = supabase
      .channel(`availability-${providerId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'availability_dates',
          filter: `provider_id=eq.${providerId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAvailability(prev => [...prev, payload.new as AvailabilityDate]);
          } else if (payload.eventType === 'UPDATE') {
            setAvailability(prev =>
              prev.map(slot => 
                slot.id === payload.new.id ? payload.new as AvailabilityDate : slot
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setAvailability(prev =>
              prev.filter(slot => slot.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [providerId]);

  return { availability, loading, setAvailability };
};
