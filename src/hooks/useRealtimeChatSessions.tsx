import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface ChatSession {
  id: string;
  user_id: string;
  title: string | null;
  status: string;
  primary_symptoms: string[] | null;
  urgency_level: string;
  specialty_recommendation: string | null;
  created_at: string;
  updated_at: string;
}

export const useRealtimeChatSessions = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        const { data, error } = await supabase
          .from('chat_sessions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setSessions(data || []);
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();

    const channel = supabase
      .channel('chat-sessions-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chat_sessions',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSessions(prev => [payload.new as ChatSession, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSessions(prev =>
              prev.map(session => 
                session.id === payload.new.id ? payload.new as ChatSession : session
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setSessions(prev =>
              prev.filter(session => session.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return { sessions, loading, setSessions };
};
