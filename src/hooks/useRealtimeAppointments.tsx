import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  user_id: string;
  doctor_id: string;
  appointment_date: string;
  status: string;
  appointment_type: string;
  duration_minutes: number;
  notes?: string;
  cancellation_reason?: string;
  created_at: string;
  updated_at: string;
}

export const useRealtimeAppointments = (viewAs: 'patient' | 'provider' = 'patient') => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setAppointments([]);
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        const query = supabase
          .from('appointments')
          .select('*')
          .order('appointment_date', { ascending: true });

        if (viewAs === 'patient') {
          query.eq('user_id', user.id);
        } else {
          query.eq('doctor_id', user.id);
        }

        const { data, error } = await query;
        
        if (error) throw error;
        setAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        toast.error('Failed to load appointments');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();

    // Subscribe to real-time changes
    const filterColumn = viewAs === 'patient' ? 'user_id' : 'doctor_id';
    const channel = supabase
      .channel('appointments-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'appointments',
          filter: `${filterColumn}=eq.${user.id}`
        },
        (payload) => {
          console.log('Appointment change:', payload);
          
          if (payload.eventType === 'INSERT') {
            setAppointments(prev => [...prev, payload.new as Appointment]);
            toast.success('New appointment added');
          } else if (payload.eventType === 'UPDATE') {
            setAppointments(prev =>
              prev.map(apt => apt.id === payload.new.id ? payload.new as Appointment : apt)
            );
          } else if (payload.eventType === 'DELETE') {
            setAppointments(prev =>
              prev.filter(apt => apt.id !== payload.old.id)
            );
            toast.info('Appointment removed');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, viewAs]);

  return { appointments, loading, setAppointments };
};
