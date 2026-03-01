import { useEffect, useState, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MessageCircle, Send, User, AlertTriangle, Phone, Download, History, Plus, FileDown, Lightbulb, CheckCircle } from "lucide-react";

const AiAvatar = ({ size = "sm" }: {size?: "sm" | "md";}) =>
<div className={`${size === "md" ? "h-6 w-6" : "h-5 w-5"} rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shrink-0`}>
    <span className={`font-bold text-white ${size === "md" ? "text-[10px]" : "text-[8px]"}`}>AI</span>
  </div>;

import InlineProviderCards from "@/components/chat/InlineProviderCards";
import ChatHistory from "@/components/chat/ChatHistory";
import { useNavigate } from "react-router-dom";
import { useChatSession } from "@/hooks/useChatSession";
import { useGuestChat } from "@/hooks/useGuestChat";
import { useAuth } from "@/hooks/useAuth";
import { isHealthRelated } from '@/hooks/useHealthTopicFilter';
import { supabase } from "@/integrations/supabase/client";
import { getCurrentLocation } from "@/lib/locationUtils";
import { useToast } from "@/components/ui/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ProviderRecommendations from "@/components/chat/ProviderRecommendations";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";
import { PDFService } from "@/services/pdfService";
import { format } from "date-fns";

interface Provider {
  id: string;
  name: string;
  photo_url: string | null;
  specialty: string;
  consultation_fee: number | null;
  experience: number | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  distance: number | null;
  rating: number | null;
  reviewCount: number;
  verified: boolean;
}

interface Hospital {
  id: string;
  name: string;
  logo_url: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  distance: number | null;
}

const Chat = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t, i18n } = useTranslation('chat');
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [messageInput, setMessageInput] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);

  // Provider recommendations state
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [searchLocation, setSearchLocation] = useState("");

  // Use guest chat by default, authenticated chat when logged in
  const authenticatedChat = useChatSession();
  const guestChat = useGuestChat();
  const isAuthenticated = user && !loading;
  const chat = isAuthenticated ? authenticatedChat : guestChat;

  // Fetch nearby providers when phase becomes summary
  const fetchNearbyProviders = useCallback(async (specialty: string) => {
    setLoadingProviders(true);
    setShowRecommendations(true);

    try {
      const locationResult = await getCurrentLocation();

      let searchParams: any = {
        specialty: specialty || 'General Practice',
        limit: 8
      };

      if (locationResult.coordinates) {
        searchParams.latitude = locationResult.coordinates.latitude;
        searchParams.longitude = locationResult.coordinates.longitude;
        setSearchLocation('Your Location');
      } else {
        if (user) {
          const { data: profile } = await supabase.
          from('profiles').
          select('city').
          eq('id', user.id).
          single();

          if (profile?.city) {
            searchParams.city = profile.city;
            setSearchLocation(profile.city);
          }
        }
      }

      const { data, error } = await supabase.functions.invoke('search-providers', {
        body: searchParams
      });

      if (error) {
        console.error('Error fetching providers:', error);
        toast({
          title: "Couldn't load recommendations",
          description: "Please try browsing all doctors instead.",
          variant: "destructive"
        });
        return;
      }

      setProviders(data.providers || []);
      setHospitals(data.hospitals || []);
      if (data.searchLocation) {
        setSearchLocation(data.searchLocation);
      }
    } catch (error) {
      console.error('Error in fetchNearbyProviders:', error);
    } finally {
      setLoadingProviders(false);
    }
  }, [user, toast]);

  // Watch for phase changes to trigger recommendations
  useEffect(() => {
    if (chat.sessionState.phase === 'summary' && !showRecommendations) {
      const specialty = chat.sessionState.specialtyRecommendation || 'General Practice';
      fetchNearbyProviders(specialty);
    }
  }, [chat.sessionState.phase, chat.sessionState.specialtyRecommendation, showRecommendations, fetchNearbyProviders]);

  useEffect(() => {
    if (!loading) {
      (chat as any).initializeChat();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const handleSelectSession = useCallback((sessionId: string) => {
    if ('loadSession' in authenticatedChat) {
      setShowRecommendations(false);
      authenticatedChat.loadSession(sessionId);
      setHistoryOpen(false);
    }
  }, [authenticatedChat]);

  const handleNewChat = useCallback(() => {
    if ('resetSession' in authenticatedChat) {
      setShowRecommendations(false);
      authenticatedChat.resetSession();
      setHistoryOpen(false);
      // Re-initialize with welcome message after reset
      setTimeout(() => {
        authenticatedChat.initializeChat();
      }, 0);
    }
  }, [authenticatedChat]);

  const handleSendMessage = () => {
    const content = messageInput.trim();
    if (!content) return;

    // Only apply health filter on the very first message (initial phase)
    if (chat.sessionState.phase === 'initial' && !isHealthRelated(content)) {
      toast({
        title: "Health Topics Only",
        description: "Please describe a health symptom or medical concern to get started."
      });
      return;
    }

    setMessageInput("");
    chat.sendMessage(content).catch((error) => {
      console.error('Error sending message:', error);
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleViewSummary = () => {
    const summaryData = {
      symptoms: chat.sessionState.symptoms,
      specialty: chat.sessionState.specialtyRecommendation || 'General Practice',
      urgency: chat.sessionState.urgencyLevel,
      responses: chat.sessionState.followupAnswers,
      conversation: chat.sessionState.messages
    };
    sessionStorage.setItem('chatSummary', JSON.stringify(summaryData));
    navigate('/chat-summary');
  };

  const handleDownloadPDF = async () => {
    try {
      const userName = user?.email?.split('@')[0] || 'Patient';
      const lastAssistantMsg = [...chat.sessionState.messages].
      reverse().
      find((m) => m.role === 'assistant');

      await PDFService.generateHealthReport({
        patientName: userName,
        date: format(new Date(), 'yyyy-MM-dd'),
        symptoms: chat.sessionState.symptoms,
        aiAssessment: lastAssistantMsg?.content || 'Assessment completed.',
        recommendations: [
        `Recommended specialty: ${chat.sessionState.specialtyRecommendation || 'General Practice'}`,
        'Follow up with a healthcare provider for professional advice.'],

        urgencyLevel: chat.sessionState.urgencyLevel,
        doctorRecommendation: `We recommend consulting a ${chat.sessionState.specialtyRecommendation || 'General Practitioner'}.`
      });

      toast({ title: 'PDF Downloaded', description: 'Your health report has been saved.' });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({ title: 'Error', description: 'Failed to generate PDF.', variant: 'destructive' });
    }
  };

  const hasUserMessages = chat.sessionState.messages.some((m) => m.role === 'user');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [chat.sessionState.messages, chat.sessionState.isLoading]);

  const getPlaceholder = () => {
    return isAuthenticated ?
    t('placeholderAuthenticated') :
    t('placeholderGuest');
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => {
      const segments = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
      return (
        <span key={index}>
          {segments.map((seg, i) => {
            if (seg.startsWith('**') && seg.endsWith('**')) {
              return <strong key={i}>{seg.slice(2, -2)}</strong>;
            }
            if (seg.startsWith('*') && seg.endsWith('*')) {
              return <em key={i}>{seg.slice(1, -1)}</em>;
            }
            return <span key={i}>{seg}</span>;
          })}
          <br />
        </span>
      );
    });
  };

  const getEmergencyNumber = () => {
    return i18n.language === 'bn' ? '999' : '911';
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <MessageCircle className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>{t('loading')}</p>
      </div>
    </div>;
  }

  const historyPanel =
  <ChatHistory
    sessions={'sessions' in authenticatedChat ? authenticatedChat.sessions : []}
    activeSessionId={chat.sessionState.sessionId}
    onSelectSession={handleSelectSession}
    onNewChat={handleNewChat}
    isAuthenticated={!!isAuthenticated}
    loading={'sessionsLoading' in authenticatedChat ? authenticatedChat.sessionsLoading : false} />;



  return (
    <div className="min-h-screen bg-background/60 backdrop-blur-xl p-4 md:p-6">
      <SEO
        title={PAGE_SEO.chat.title}
        description={PAGE_SEO.chat.description}
        canonicalPath={PAGE_SEO.chat.canonicalPath} />

      <div className="max-w-6xl mx-auto">
        <div className="flex gap-4">
          {/* Desktop History Sidebar */}
          {!isMobile &&
          <div className="w-72 shrink-0">
              <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-md border border-white/20 h-[calc(100vh-8rem)] sticky top-4">
                <CardHeader className="border-b bg-gradient-to-r from-primary/90 to-primary text-primary-foreground rounded-t-lg py-3 px-4">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <History className="h-4 w-4" />
                    Chat History
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 h-[calc(100%-3.5rem)]">
                  {historyPanel}
                </CardContent>
              </Card>
            </div>
          }

          {/* Main Chat Area */}
          <div className="flex-1 min-w-0">
            <Card className="shadow-2xl border-0 bg-white/70 backdrop-blur-md border border-white/20">
              <CardHeader className="border-b bg-gradient-to-r from-primary/90 to-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="text-xl md:text-2xl font-bold flex items-center space-x-3">
                  {/* Mobile History Button */}
                  {isMobile &&
                  <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-white/20 shrink-0">
                          <History className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="p-0 w-80">
                        <div className="pt-12 h-full">
                          {historyPanel}
                        </div>
                      </SheetContent>
                    </Sheet>
                  }
                  <div className="bg-white/20 p-2 rounded-lg">
                    <AiAvatar size="md" />
                  </div>
                  <span>{t('headerTitle')}</span>
                  <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                    <CheckCircle className="h-3.5 w-3.5" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                  {isAuthenticated &&
                  <Badge variant="secondary" className="bg-white/20 text-primary-foreground">
                      {t('premium')}
                    </Badge>
                  }
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {/* Messages Area */}
                <div className="h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-6 space-y-4">
                  {chat.sessionState.messages.map((message, index) =>
                  <div
                    key={`${message.id}-${index}`}
                    className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`
                    }>

                      <div className={`p-2 rounded-lg ${
                    message.role === 'user' ?
                    'bg-primary text-primary-foreground' :
                    'bg-muted text-foreground'}`
                    }>
                        {message.role === 'user' ?
                      <User className="h-4 w-4" /> :

                      <AiAvatar />
                      }
                      </div>
                      <div className={`flex-1 p-3 shadow-sm ${
                    message.role === 'user' ?
                    'bg-primary text-primary-foreground ml-12 rounded-2xl rounded-br-sm' :
                    'bg-muted/50 backdrop-blur-sm border border-border/30 mr-12 rounded-2xl rounded-bl-sm'} ${
                    message.isUrgent ? 'border-red-500 border-2' : ''}`}>
                        <div className="text-sm md:text-base whitespace-pre-wrap">
                          {formatMessage(message.content)}
                        </div>
                        {message.role === 'assistant' && message.suggestedProviders && message.suggestedProviders.length > 0 &&
                      <InlineProviderCards providers={message.suggestedProviders} />
                      }
                        <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`
                      }>
                          {message.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  )}

                  {chat.sessionState.isLoading &&
                  <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-lg bg-transparent">
                        <AiAvatar />
                      </div>
                      <div className="flex-1 p-3 rounded-2xl rounded-bl-sm bg-muted/50 backdrop-blur-sm border border-border/30 mr-12">
                        <div className="flex items-center space-x-2">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                            <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{t('thinking')}</span>
                        </div>
                      </div>
                    </div>
                  }
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 md:p-6 border-t space-y-4">
                  {/* Symptom Tips for New Users */}
                  {chat.sessionState.phase === 'initial' && !hasUserMessages &&
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb className="h-4 w-4 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-800">Tips for describing symptoms</span>
                      </div>
                      <ul className="text-xs text-amber-700 space-y-1 list-disc list-inside">
                        <li>Describe when symptoms started (e.g., "2 days ago")</li>
                        <li>Mention the location of pain or discomfort</li>
                        <li>Rate your pain on a scale of 1-10</li>
                        <li>List any medications you are currently taking</li>
                        <li>Mention if symptoms worsen at specific times</li>
                      </ul>
                    </div>
                  }

                  {chat.sessionState.urgencyLevel === "emergency" &&
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        <span className="text-red-800 font-semibold text-sm">{t('urgentTitle')}</span>
                      </div>
                      <p className="text-red-700 text-xs md:text-sm mb-3">
                        {t('urgentMessage')}
                      </p>
                      <Button variant="destructive" size="sm" className="w-full" onClick={() => window.open(`tel:${getEmergencyNumber()}`)}>
                        <Phone className="h-4 w-4 mr-2" />
                        {t('callEmergency')}
                      </Button>
                    </div>
                  }

                  <div className="relative flex items-center">
                    <Textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={getPlaceholder()}
                      className="flex-1 min-h-[48px] max-h-[120px] text-sm md:text-base resize-none rounded-full bg-muted/30 border-border/50 focus:border-primary/50 pr-14 pl-5 py-3"
                      disabled={chat.sessionState.isLoading} />

                    <Button
                      onClick={handleSendMessage}
                      variant="default"
                      size="icon"
                      className="absolute right-2 rounded-full w-10 h-10"
                      disabled={chat.sessionState.isLoading}>

                      <Send className="h-4 w-4" />
                    </Button>
                  </div>

                  {chat.sessionState.phase === "summary" &&
                  <div className="flex gap-2">
                      <Button onClick={handleViewSummary} variant="secondary" size="sm" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        {t('viewSummary')}
                      </Button>
                      <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="flex-1">
                        <FileDown className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  }

                  <div className="bg-muted/30 border border-border/30 rounded-lg p-3">
                    <div className="text-center">
                      <p className="text-xs md:text-sm text-muted-foreground mb-1">
                        ℹ️ <strong>{t('disclaimerTitle')}</strong>
                      </p>
                      <p className="text-xs text-muted-foreground/80">
                        {t('disclaimerText')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {showRecommendations &&
            <ProviderRecommendations
              providers={providers}
              hospitals={hospitals}
              specialty={chat.sessionState.specialtyRecommendation || 'General Practice'}
              isLoading={loadingProviders}
              searchLocation={searchLocation} />

            }
          </div>
        </div>
      </div>
    </div>);

};

export default Chat;