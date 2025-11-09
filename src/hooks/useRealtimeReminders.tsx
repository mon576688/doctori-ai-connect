import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

interface Reminder {
  id: number;
  user_id: string;
  title: string;
  reminder_time: string;
  repeat_interval: string | null;
  notes: string | null;
  created_at: string;
}

export const useRealtimeReminders = () => {
  const { user } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setReminders([]);
      setLoading(false);
      return;
    }

    const fetchReminders = async () => {
      try {
        const { data, error } = await supabase
          .from('reminders')
          .select('*')
          .eq('user_id', user.id)
          .order('reminder_time', { ascending: true });
        
        if (error) throw error;
        setReminders(data || []);
      } catch (error) {
        console.error('Error fetching reminders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReminders();

    const channel = supabase
      .channel('reminders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reminders',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setReminders(prev => [...prev, payload.new as Reminder]);
            toast.success('New reminder added');
          } else if (payload.eventType === 'UPDATE') {
            setReminders(prev =>
              prev.map(reminder => 
                reminder.id === payload.new.id ? payload.new as Reminder : reminder
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setReminders(prev =>
              prev.filter(reminder => reminder.id !== payload.old.id)
            );
            toast.info('Reminder deleted');
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { reminders, loading, setReminders };
};
