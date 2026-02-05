import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { MessageCircle, Send, Bot, User, AlertTriangle, Phone, Download, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatSession } from "@/hooks/useChatSession";
import { useGuestChat } from "@/hooks/useGuestChat";
import { useAuth } from "@/hooks/useAuth";
import { isHealthRelated } from '@/hooks/useHealthTopicFilter';
import { supabase } from "@/integrations/supabase/client";
import { getCurrentLocation } from "@/lib/locationUtils";
import { useToast } from "@/components/ui/use-toast";
import ProviderRecommendations from "@/components/chat/ProviderRecommendations";
import { SEO } from "@/components/SEO";
import { PAGE_SEO } from "@/lib/seo";

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
  const [messageInput, setMessageInput] = useState("");
  
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
      // Try to get user's location
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
        // Fall back to user's profile city
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('city')
            .eq('id', user.id)
            .single();
          
          if (profile?.city) {
            searchParams.city = profile.city;
            setSearchLocation(profile.city);
          }
        }
      }

      // Call the search-providers edge function
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
      console.log('Initializing chat, isAuthenticated:', isAuthenticated);
      const welcomeMessage = t('welcome');
      chat.initializeChat(welcomeMessage);
    }
  }, [loading, chat.initializeChat, t]);

  const handleSendMessage = () => {
    const content = messageInput.trim();
    if (!content) return;

    console.log('Sending message:', content);

    if (!isHealthRelated(content)) {
      console.log('Message not health-related, showing filter response');
      return;
    }

    setMessageInput("");
    chat.sendMessage(content).catch(error => {
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
    // Store summary data for the summary page
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

  const getPlaceholder = () => {
    return isAuthenticated 
      ? t('placeholderAuthenticated')
      : t('placeholderGuest');
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <SEO 
        title={PAGE_SEO.chat.title}
        description={PAGE_SEO.chat.description}
        canonicalPath={PAGE_SEO.chat.canonicalPath}
      />
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-xl md:text-2xl font-bold flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="h-6 w-6" />
              </div>
              <span>{t('headerTitle')}</span>
              {isAuthenticated && (
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {t('premium')}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {/* Messages Area */}
            <div className="h-[400px] md:h-[500px] overflow-y-auto p-4 md:p-6 space-y-4">
              {chat.sessionState.messages.map((message, index) => (
                <div
                  key={`${message.id}-${index}`}
                  className={`flex items-start space-x-3 ${
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-4 w-4" />
                    ) : (
                      <Bot className="h-4 w-4" />
                    )}
                  </div>
                  <div className={`flex-1 p-3 rounded-lg shadow-sm ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white ml-12' 
                      : 'bg-white border border-gray-200 mr-12'
                  } ${message.isUrgent ? 'border-red-500 border-2' : ''}`}>
                    <div className="text-sm md:text-base whitespace-pre-wrap">
                      {formatMessage(message.content)}
                    </div>
                    <div className={`text-xs mt-2 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {chat.sessionState.isLoading && (
                <div className="flex items-start space-x-3">
                  <div className="p-2 rounded-lg bg-gray-100 text-gray-800">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1 p-3 rounded-lg bg-white border border-gray-200 mr-12">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-sm text-gray-600">{t('thinking')}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          {/* Input Area - Always Visible */}
            <div className="p-4 md:p-6 border-t space-y-4">
              {/* Emergency Alert */}
              {(chat.sessionState.urgencyLevel === "high" || chat.sessionState.urgencyLevel === "emergency") && (
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
              )}

              {/* Text Input + Send */}
              <div className="flex space-x-2">
                <Textarea 
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={handleKeyPress} 
                  placeholder={getPlaceholder()}
                  className="flex-1 min-h-[60px] text-sm md:text-base resize-none" 
                  disabled={chat.sessionState.isLoading} 
                />
                <Button 
                  onClick={handleSendMessage} 
                  variant="default" 
                  size="icon" 
                  className="self-end h-[60px] w-12 md:w-14" 
                  disabled={chat.sessionState.isLoading}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {/* Summary Option (non-blocking) */}
              {chat.sessionState.phase === "summary" && (
                <Button onClick={handleViewSummary} variant="secondary" size="sm" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t('viewSummary')}
                </Button>
              )}

              {/* Medical Disclaimer */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-xs md:text-sm text-blue-800 mb-1">
                    ℹ️ <strong>{t('disclaimerTitle')}</strong>
                  </p>
                  <p className="text-xs text-blue-700">
                    {t('disclaimerText')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Provider Recommendations - shown after summary phase */}
        {showRecommendations && (
          <ProviderRecommendations
            providers={providers}
            hospitals={hospitals}
            specialty={chat.sessionState.specialtyRecommendation || 'General Practice'}
            isLoading={loadingProviders}
            searchLocation={searchLocation}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
