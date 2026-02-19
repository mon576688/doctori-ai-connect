import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Plus, Clock, AlertTriangle, LogIn } from 'lucide-react';
import { format } from 'date-fns';

interface ChatSessionItem {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  urgency_level: string | null;
  primary_symptoms: string[] | null;
  status: string | null;
}

interface ChatHistoryProps {
  sessions: ChatSessionItem[];
  activeSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const ChatHistory = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewChat,
  isAuthenticated,
  loading,
}: ChatHistoryProps) => {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center h-full">
        <LogIn className="h-10 w-10 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-foreground mb-1">Sign in to save history</p>
        <p className="text-xs text-muted-foreground">
          Log in to keep your chat sessions and revisit them anytime.
        </p>
      </div>
    );
  }

  const getUrgencyColor = (level: string | null) => {
    switch (level) {
      case 'emergency': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <Button onClick={onNewChat} className="w-full" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {loading ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No past conversations yet. Start a new chat!
            </div>
          ) : (
            sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => onSelectSession(session.id)}
                className={`w-full text-left p-3 rounded-lg transition-colors text-sm ${
                  activeSessionId === session.id
                    ? 'bg-primary/10 border border-primary/20'
                    : 'hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <MessageSquare className="h-4 w-4 mt-0.5 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-foreground">
                      {session.title || 'Health Consultation'}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(session.updated_at || session.created_at), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    {session.primary_symptoms && session.primary_symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {session.primary_symptoms.slice(0, 2).map((symptom, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] px-1.5 py-0">
                            {symptom}
                          </Badge>
                        ))}
                        {session.primary_symptoms.length > 2 && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                            +{session.primary_symptoms.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                    {session.urgency_level && session.urgency_level !== 'low' && (
                      <Badge variant={getUrgencyColor(session.urgency_level)} className="text-[10px] mt-1">
                        <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />
                        {session.urgency_level}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatHistory;
