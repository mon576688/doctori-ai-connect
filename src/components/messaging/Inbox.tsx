import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { MessageSquare, Send, Search, ArrowLeft, CheckCheck, Mail, Video, Lock, Info } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

interface Contact {
  id: string;
  name: string;
  photo_url: string | null;
  last_message?: string;
  last_message_time?: string;
  unread_count: number;
  is_read_only?: boolean;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
}

function formatDateSeparator(dateStr: string): string {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

function groupMessagesByDate(messages: Message[]): { date: string; messages: Message[] }[] {
  const groups: { date: string; messages: Message[] }[] = [];
  let currentDate = '';

  for (const msg of messages) {
    const msgDate = format(new Date(msg.created_at), 'yyyy-MM-dd');
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groups.push({ date: msg.created_at, messages: [msg] });
    } else {
      groups[groups.length - 1].messages.push(msg);
    }
  }
  return groups;
}

// System message renderer
function SystemMessageCard({ content }: { content: string }) {
  const text = content.replace('[SYSTEM] ', '');
  const urlMatch = text.match(/(https?:\/\/[^\s]+)/);

  return (
    <div className="flex justify-center mb-3">
      <div className="bg-accent/50 border border-accent rounded-lg px-4 py-3 max-w-[85%] text-center space-y-2">
        <div className="flex items-center justify-center gap-2 text-sm font-medium text-accent-foreground">
          <Info className="h-4 w-4" />
          System
        </div>
        <p className="text-sm text-accent-foreground/80">
          {urlMatch ? text.replace(urlMatch[0], '').trim() : text}
        </p>
        {urlMatch && (
          <Button
            size="sm"
            className="gap-2"
            onClick={() => window.open(urlMatch[0], '_blank')}
          >
            <Video className="h-4 w-4" />
            Join Consultation
          </Button>
        )}
      </div>
    </div>
  );
}

// Skeleton loaders
function ContactsSkeleton() {
  return (
    <div className="space-y-1">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MessagesSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <Skeleton className={`h-12 rounded-lg ${i % 2 === 0 ? 'w-48' : 'w-36'}`} />
        </div>
      ))}
    </div>
  );
}

// Typing indicator bubble
function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="bg-muted rounded-lg px-4 py-3 flex items-center gap-1">
        <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 rounded-full bg-muted-foreground/60 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}

export function Inbox() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sending, setSending] = useState(false);
  const [contactsLoading, setContactsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [onlineUserIds, setOnlineUserIds] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingChannelRef = useRef<any>(null);

  useEffect(() => {
    if (user) {
      fetchContacts();
      const cleanup = subscribeToMessages();
      setupPresenceChannel();
      return () => {
        cleanup?.();
        if (typingChannelRef.current) {
          supabase.removeChannel(typingChannelRef.current);
        }
      };
    }
  }, [user]);

  useEffect(() => {
    if (selectedContact) {
      setMessagesLoading(true);
      fetchMessages(selectedContact.id);
      markMessagesAsRead(selectedContact.id);
      setupTypingChannel(selectedContact.id);
    }
    return () => {
      if (typingChannelRef.current) {
        supabase.removeChannel(typingChannelRef.current);
        typingChannelRef.current = null;
      }
    };
  }, [selectedContact?.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Presence for online/offline
  const setupPresenceChannel = () => {
    if (!user) return;
    const channel = supabase.channel('inbox-presence');
    channel
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        const ids = new Set<string>();
        Object.values(state).forEach((presences: any[]) => {
          presences.forEach((p) => {
            if (p.user_id) ids.add(p.user_id);
          });
        });
        setOnlineUserIds(ids);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: user.id, online_at: new Date().toISOString() });
        }
      });
  };

  // Typing indicator channel
  const setupTypingChannel = (contactId: string) => {
    if (!user) return;
    if (typingChannelRef.current) {
      supabase.removeChannel(typingChannelRef.current);
    }
    const channel = supabase.channel(`typing-${[user.id, contactId].sort().join('-')}`);
    channel
      .on('broadcast', { event: 'typing' }, (payload) => {
        if (payload.payload?.user_id !== user.id) {
          setIsTyping(true);
          if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 2000);
        }
      })
      .subscribe();
    typingChannelRef.current = channel;
  };

  const broadcastTyping = useCallback(() => {
    if (typingChannelRef.current && user) {
      typingChannelRef.current.send({
        type: 'broadcast',
        event: 'typing',
        payload: { user_id: user.id }
      });
    }
  }, [user]);

  const subscribeToMessages = () => {
    const channel = supabase
      .channel('direct-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `receiver_id=eq.${user?.id}`
        },
        (payload) => {
          const newMsg = payload.new as Message;
          if (selectedContact && newMsg.sender_id === selectedContact.id) {
            setMessages(prev => [...prev, newMsg]);
            markMessagesAsRead(selectedContact.id);
          }
          fetchContacts();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'direct_messages',
          filter: `sender_id=eq.${user?.id}`
        },
        (payload) => {
          const updated = payload.new as Message;
          setMessages(prev => prev.map(m => m.id === updated.id ? { ...m, is_read: updated.is_read } : m));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchContacts = async () => {
    if (!user) return;
    setContactsLoading(true);

    try {
      // Fetch appointment-linked contacts
      const { data: appointments, error: aptError } = await supabase
        .from('appointments')
        .select('user_id, doctor_id, is_chat_enabled, session_end_time')
        .eq('is_chat_enabled', true)
        .or(`user_id.eq.${user.id},doctor_id.eq.${user.id}`);

      if (aptError) throw aptError;

      // Also get contacts from existing messages (for backwards compatibility)
      const { data: sentMessages } = await supabase
        .from('direct_messages')
        .select('receiver_id')
        .eq('sender_id', user.id);

      const { data: receivedMessages } = await supabase
        .from('direct_messages')
        .select('sender_id')
        .eq('receiver_id', user.id);

      const contactIds = new Set<string>();
      const contactReadOnlyMap = new Map<string, boolean>();

      // Add appointment contacts
      (appointments || []).forEach(apt => {
        const contactId = apt.user_id === user.id ? apt.doctor_id : apt.user_id;
        contactIds.add(contactId);
        
        // Check read-only: if session_end_time is set and older than 24h
        const currentReadOnly = contactReadOnlyMap.get(contactId);
        if (apt.session_end_time) {
          const endTime = new Date(apt.session_end_time);
          const isExpired = endTime.getTime() < Date.now() - 24 * 60 * 60 * 1000;
          // Only read-only if ALL appointments with this contact are expired
          if (currentReadOnly === undefined) {
            contactReadOnlyMap.set(contactId, isExpired);
          } else if (!isExpired) {
            contactReadOnlyMap.set(contactId, false);
          }
        } else {
          // Active appointment (no end time) = not read-only
          contactReadOnlyMap.set(contactId, false);
        }
      });

      // Add message contacts (existing conversations)
      (sentMessages || []).forEach(m => contactIds.add(m.receiver_id));
      (receivedMessages || []).forEach(m => contactIds.add(m.sender_id));

      if (contactIds.size === 0) {
        setContacts([]);
        setContactsLoading(false);
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, photo_url')
        .in('id', Array.from(contactIds));

      if (profileError) throw profileError;

      const contactsWithDetails = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: lastMsg } = await supabase
            .from('direct_messages')
            .select('content, created_at')
            .or(`and(sender_id.eq.${user.id},receiver_id.eq.${profile.id}),and(sender_id.eq.${profile.id},receiver_id.eq.${user.id})`)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();

          const { count } = await supabase
            .from('direct_messages')
            .select('*', { count: 'exact', head: true })
            .eq('sender_id', profile.id)
            .eq('receiver_id', user.id)
            .eq('is_read', false);

          return {
            id: profile.id,
            name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
            photo_url: profile.photo_url,
            last_message: lastMsg?.content,
            last_message_time: lastMsg?.created_at,
            unread_count: count || 0,
            is_read_only: contactReadOnlyMap.get(profile.id) ?? false
          };
        })
      );

      setContacts(contactsWithDetails.sort((a, b) => 
        new Date(b.last_message_time || 0).getTime() - new Date(a.last_message_time || 0).getTime()
      ));
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setContactsLoading(false);
    }
  };

  const fetchMessages = async (contactId: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${contactId}),and(sender_id.eq.${contactId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const markMessagesAsRead = async (contactId: string) => {
    if (!user) return;

    await supabase
      .from('direct_messages')
      .update({ is_read: true })
      .eq('sender_id', contactId)
      .eq('receiver_id', user.id)
      .eq('is_read', false);

    fetchContacts();
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedContact || !user) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('direct_messages')
        .insert({
          sender_id: user.id,
          receiver_id: selectedContact.id,
          content: newMessage.trim()
        });

      if (error) throw error;

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        sender_id: user.id,
        receiver_id: selectedContact.id,
        content: newMessage.trim(),
        is_read: false,
        created_at: new Date().toISOString()
      }]);

      setNewMessage('');
      fetchContacts();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Send Failed",
        description: "Failed to send message. You may only message doctors with an active appointment.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const messageGroups = groupMessagesByDate(messages);
  const isReadOnly = selectedContact?.is_read_only ?? false;

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Messages
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex overflow-hidden p-0">
        {/* Contacts List */}
        <div className={`w-full md:w-1/3 border-r flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <ScrollArea className="flex-1">
            {contactsLoading ? (
              <ContactsSkeleton />
            ) : filteredContacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <Mail className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-medium mb-1">No conversations yet</p>
                <p className="text-sm text-muted-foreground">
                  Your conversations will appear here once you book an appointment with a doctor.
                </p>
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => setSelectedContact(contact)}
                  className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-muted transition-colors ${
                    selectedContact?.id === contact.id ? 'bg-muted' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src={contact.photo_url || undefined} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {/* Online indicator */}
                    <span
                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                        onlineUserIds.has(contact.id) ? 'bg-green-500' : 'bg-muted-foreground/40'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{contact.name}</p>
                      <div className="flex items-center gap-1">
                        {contact.is_read_only && (
                          <Lock className="h-3 w-3 text-muted-foreground" />
                        )}
                        {contact.unread_count > 0 && (
                          <Badge variant="default" className="ml-1">
                            {contact.unread_count}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {contact.last_message && (
                      <p className="text-sm text-muted-foreground truncate">
                        {contact.last_message}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
          </ScrollArea>
        </div>

        {/* Chat Area */}
        <div className={`flex-1 flex flex-col ${selectedContact ? 'flex' : 'hidden md:flex'}`}>
          {selectedContact ? (
            <>
              {/* Chat Header */}
              <div className="p-3 border-b flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setSelectedContact(null)}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="relative">
                  <Avatar>
                    <AvatarImage src={selectedContact.photo_url || undefined} />
                    <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span
                    className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${
                      onlineUserIds.has(selectedContact.id) ? 'bg-green-500' : 'bg-muted-foreground/40'
                    }`}
                  />
                </div>
                <div>
                  <p className="font-medium">{selectedContact.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {onlineUserIds.has(selectedContact.id) ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                {messagesLoading ? (
                  <MessagesSkeleton />
                ) : (
                  <div className="space-y-4">
                    {messageGroups.map((group, gi) => (
                      <div key={gi}>
                        {/* Date separator */}
                        <div className="flex items-center gap-3 my-4">
                          <div className="flex-1 h-px bg-border" />
                          <span className="text-xs text-muted-foreground font-medium px-2">
                            {formatDateSeparator(group.date)}
                          </span>
                          <div className="flex-1 h-px bg-border" />
                        </div>
                        {group.messages.map((msg) => {
                          const isMine = msg.sender_id === user?.id;
                          const isSystem = msg.content.startsWith('[SYSTEM]');

                          if (isSystem) {
                            return <SystemMessageCard key={msg.id} content={msg.content} />;
                          }

                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}
                            >
                              <div
                                className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                  isMine
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p>{msg.content}</p>
                                <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : ''}`}>
                                  <p className={`text-xs ${
                                    isMine
                                      ? 'text-primary-foreground/70'
                                      : 'text-muted-foreground'
                                  }`}>
                                    {format(new Date(msg.created_at), 'HH:mm')}
                                  </p>
                                  {isMine && (
                                    <CheckCheck className={`h-3.5 w-3.5 ${
                                      msg.is_read ? 'text-blue-400' : 'text-primary-foreground/50'
                                    }`} />
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </ScrollArea>

              {/* Message Input or Read-Only Banner */}
              {isReadOnly ? (
                <div className="p-3 border-t bg-muted/50 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Lock className="h-4 w-4" />
                  This conversation is read-only. Book a new appointment to message again.
                </div>
              ) : (
                <div className="p-3 border-t flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => {
                      setNewMessage(e.target.value);
                      broadcastTyping();
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={sending || !newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <div className="rounded-full bg-muted p-6 mx-auto mb-4 w-fit">
                  <MessageSquare className="h-12 w-12" />
                </div>
                <p className="font-medium mb-1">Select a conversation</p>
                <p className="text-sm">Conversations are created when you book an appointment</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
