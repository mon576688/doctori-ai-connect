import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface BroadcastMessage {
  type: string;
  event: string;
  payload: any;
}

export const useBroadcast = (channelName: string, onMessage?: (message: BroadcastMessage) => void) => {
  const { user } = useAuth();
  const [channel, setChannel] = useState<any>(null);

  useEffect(() => {
    if (!user) return;

    const broadcastChannel = supabase.channel(channelName);

    broadcastChannel
      .on('broadcast', { event: '*' }, (message) => {
        if (onMessage && message.payload) {
          const broadcastMsg: BroadcastMessage = {
            type: 'broadcast',
            event: message.event,
            payload: message.payload,
          };
          onMessage(broadcastMsg);
        }
      })
      .subscribe();

    setChannel(broadcastChannel);

    return () => {
      supabase.removeChannel(broadcastChannel);
    };
  }, [user, channelName, onMessage]);

  const broadcast = (event: string, payload: any) => {
    if (channel) {
      const message: BroadcastMessage = {
        type: 'broadcast',
        event,
        payload: { ...payload, user_id: user?.id },
      };
      channel.send(message);
    }
  };

  return { broadcast, channel };
};
