import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageCircle, Send, Bot, User, AlertTriangle, Phone, Download, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatSession } from "@/hooks/useChatSession";
import { useGuestChat } from "@/hooks/useGuestChat";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage, Language } from "@/contexts/LanguageContext";
import { isHealthRelated } from '@/hooks/useHealthTopicFilter';
import { VoiceChatInterface } from "@/components/VoiceChatInterface";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";

const Chat = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [messageInput, setMessageInput] = useState("");
  const [chatLanguage, setChatLanguage] = useState<Language>(language);
  const { speak } = useTextToSpeech();

  // Use guest chat by default, authenticated chat when logged in
  const authenticatedChat = useChatSession();
  const guestChat = useGuestChat();
  const isAuthenticated = user && !loading;
  const chat = isAuthenticated ? authenticatedChat : guestChat;

  useEffect(() => {
    if (!loading) {
      console.log('Initializing chat, isAuthenticated:', isAuthenticated);
      const welcomeMessage = t('chat.welcome');
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
    navigate('/chat-summary');
  };

  const handleVoiceMessage = async (transcript: string) => {
    if (transcript.trim()) {
      await chat.sendMessage(transcript);
    }
  };

  const handleSpeakText = (text: string) => {
    speak(text);
  };

  const getPlaceholder = () => {
    return isAuthenticated 
      ? t('chat.placeholder.authenticated')
      : t('chat.placeholder.guest');
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <MessageCircle className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading chat...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-xl md:text-2xl font-bold flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg">
                <Bot className="h-6 w-6" />
              </div>
              <span>Doctori AI Health Assistant</span>
              {isAuthenticated && (
                <Badge variant="secondary" className="bg-white/20 text-white">
                  Premium
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
                      <span className="text-sm text-gray-600">Doctor AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Area - Always Visible */}
            <div className="p-4 md:p-6 border-t space-y-4">
              {/* Voice Chat Interface for Premium Users */}
              {isAuthenticated && (
                <VoiceChatInterface 
                  onVoiceMessage={handleVoiceMessage}
                  onSpeakText={handleSpeakText}
                  disabled={chat.sessionState.isLoading}
                />
              )}

              {/* Emergency Alert */}
              {(chat.sessionState.urgencyLevel === "high" || chat.sessionState.urgencyLevel === "emergency") && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    <span className="text-red-800 font-semibold text-sm">URGENT MEDICAL ATTENTION NEEDED</span>
                  </div>
                  <p className="text-red-700 text-xs md:text-sm mb-3">
                    Based on your symptoms, please seek immediate medical care. Call {chatLanguage === 'bn' ? '999' : '911'} or go to the nearest emergency room.
                  </p>
                  <Button variant="destructive" size="sm" className="w-full" onClick={() => window.open(`tel:${chatLanguage === 'bn' ? '999' : '911'}`)}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call {chatLanguage === 'bn' ? '999' : '911'} Emergency
                  </Button>
                </div>
              )}

              {/* Language Selector */}
              <div className="flex items-center space-x-2 mb-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Select value={chatLanguage} onValueChange={(value: string) => setChatLanguage(value as Language)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="bn">বাংলা</SelectItem>
                  </SelectContent>
                </Select>
              </div>

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
                  View Your Health Summary & Recommended Doctors
                </Button>
              )}

              {/* Medical Disclaimer */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div className="text-center">
                  <p className="text-xs md:text-sm text-blue-800 mb-1">
                    ℹ️ <strong>Medical Disclaimer</strong>
                  </p>
                  <p className="text-xs text-blue-700">
                    This AI provides general health information only and is not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for personal health concerns.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
