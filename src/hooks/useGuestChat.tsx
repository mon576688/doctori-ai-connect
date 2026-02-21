
import { useState, useCallback, useEffect } from 'react';
import { analyzeSymptoms, getMedicalDisclaimer } from '@/lib/medicalKnowledge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';

export interface GuestMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  isUrgent?: boolean;
  metadata?: any;
  suggestedProviders?: Array<{
    id: string;
    name: string;
    specialty: string;
    city: string;
    photo_url?: string | null;
    consultation_fee?: number | null;
    experience?: number | null;
    verified?: boolean;
  }>;
}

export interface GuestChatState {
  sessionId: string;
  messages: GuestMessage[];
  phase: 'initial' | 'assessment' | 'followup' | 'analysis' | 'summary';
  symptoms: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  specialtyRecommendation: string;
  currentQuestionIndex: number;
  followupAnswers: Record<string, string>;
  isLoading: boolean;
  requiresAuth: boolean;
  retryCount: number;
}

const GUEST_STORAGE_KEY = 'doctori_guest_session';
const MAX_RETRIES = 2;

export const useGuestChat = () => {
  const { toast } = useToast();
  const { language } = useLanguage();
  
  const [sessionState, setSessionState] = useState<GuestChatState>({
    sessionId: `guest_${Date.now()}`,
    messages: [],
    phase: 'initial',
    symptoms: [],
    urgencyLevel: 'low',
    specialtyRecommendation: '',
    currentQuestionIndex: 0,
    followupAnswers: {},
    isLoading: false,
    requiresAuth: false,
    retryCount: 0
  });

  // Load session from localStorage on init
  useEffect(() => {
    const saved = localStorage.getItem(GUEST_STORAGE_KEY);
    if (saved) {
      try {
        const parsedSession = JSON.parse(saved);
        // Convert timestamp strings back to Date objects
        parsedSession.messages = parsedSession.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setSessionState(parsedSession);
      } catch (error) {
        console.error('Error loading guest session:', error);
      }
    }
  }, []);

  // Save session to localStorage whenever it changes (with privacy protection)
  useEffect(() => {
    if (sessionState.messages.length > 0) {
      // Only save essential data, exclude sensitive content in production
      const sanitizedSession = {
        ...sessionState,
        messages: sessionState.messages.map(msg => ({
          ...msg,
          content: msg.role === 'user' ? '[User message]' : msg.content.substring(0, 200) + '...'
        }))
      };
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(sanitizedSession));
      
      // Auto-clear old sessions (24 hour retention)
      setTimeout(() => {
        const saved = localStorage.getItem(GUEST_STORAGE_KEY);
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            const lastActivity = new Date(Math.max(...parsed.messages.map((m: any) => new Date(m.timestamp).getTime())));
            if (Date.now() - lastActivity.getTime() > 24 * 60 * 60 * 1000) {
              localStorage.removeItem(GUEST_STORAGE_KEY);
            }
          } catch (e) {
            localStorage.removeItem(GUEST_STORAGE_KEY);
          }
        }
      }, 1000);
    }
  }, [sessionState]);

  const sendMessageWithRetry = useCallback(async (
    content: string, 
    retryCount = 0,
    currentState?: GuestChatState
  ): Promise<void> => {
    // Use passed-in state to avoid stale closures
    const state = currentState || sessionState;
    
    try {
      console.log(`Sending message to AI (attempt ${retryCount + 1})`);
      
      // Get user profile data for registered users
      const { data: userProfile } = await supabase.auth.getUser();
      const isRegisteredUser = !!userProfile.user;
      
      let profileData = null;
      if (isRegisteredUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('age, gender, name, medical_conditions, medications, allergies')
          .eq('id', userProfile.user.id)
          .single();
        profileData = profile;
      }

      // Call our secure AI chat assistant with language context and user profile
      console.log('Attempting to call ai-chat-assistant function...');
      
      const { data, error } = await supabase.functions.invoke('ai-chat-assistant', {
        body: {
          userMessage: content,
          messages: state.messages,
          sessionContext: {
            phase: state.phase,
            symptoms: state.symptoms,
            urgencyLevel: state.urgencyLevel,
            followupAnswers: state.followupAnswers,
            language: language,
            isRegisteredUser,
            userProfile: profileData
          }
        }
      });

      console.log('Supabase function call completed');
      console.log('Response data:', data);
      console.log('Response error:', error);

      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to connect to AI service');
      }

      if (!data?.response) {
        console.error('Invalid response from AI service:', data);
        throw new Error('No response received from AI');
      }

      let aiResponse = data.response;
      let newState = { ...state };

      // Check for [SUMMARY_READY] marker from AI
      const hasSummaryMarker = aiResponse.includes('[SUMMARY_READY]');
      if (hasSummaryMarker) {
        aiResponse = aiResponse.replace(/\[SUMMARY_READY\]/g, '').trim();
      }

      // Basic symptom analysis for urgency detection
      const analysis = analyzeSymptoms(content);
      if (state.phase === 'initial') {
        newState = {
          ...state,
          phase: 'assessment',
          symptoms: analysis.symptoms,
          urgencyLevel: analysis.urgencyLevel,
          specialtyRecommendation: analysis.specialtyRecommendation,
          currentQuestionIndex: 0
        };
      } else if (state.phase === 'assessment') {
        newState.followupAnswers[state.currentQuestionIndex.toString()] = content;
        newState.currentQuestionIndex = state.currentQuestionIndex + 1;
        
        // Only transition to summary when AI sends the [SUMMARY_READY] marker
        if (hasSummaryMarker) {
          newState.phase = 'summary';
          newState.requiresAuth = true;
        }
      }

      // If we got SUMMARY_READY in any non-initial phase, transition to summary
      if (hasSummaryMarker && state.phase !== 'initial') {
        newState.phase = 'summary';
        newState.requiresAuth = true;
      }

      const aiMessage: GuestMessage = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date(),
        isUrgent: newState.urgencyLevel === 'emergency' || newState.urgencyLevel === 'high',
        suggestedProviders: data.suggestedProviders || undefined,
      };

      setSessionState(prev => ({
        ...newState,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
        retryCount: 0
      }));

      // Removed detailed logging for privacy

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      // Check if it's a rate limit error and we can retry
      if ((error.message?.includes('rate limit') || error.message?.includes('Rate limit') || error.status === 429) && retryCount < MAX_RETRIES) {
        const retryDelay = (retryCount + 1) * 5; // 5, 10 seconds
        console.log(`Rate limit hit, retrying in ${retryDelay} seconds...`);
        
        toast({
          title: "High Traffic",
          description: `Server is busy, retrying in ${retryDelay} seconds...`,
          variant: "default"
        });

        // Wait with exponential backoff
        setTimeout(() => {
          sendMessageWithRetry(content, retryCount + 1);
        }, retryDelay * 1000);
        
        return;
      }
      
      // Handle API key errors specifically
      if (error.status === 401 || error.message?.includes('API key')) {
        console.error('API Authentication error detected');
        toast({
          title: "Service Configuration Error",
          description: "There's an issue with our AI service configuration. Please try again later.",
          variant: "destructive"
        });
      }
      
      // Fallback response with appropriate emergency number
      const emergencyNumber = language === 'bn' ? '999' : '911';
      const isRateLimit = error.message?.includes('rate limit') || error.message?.includes('Rate limit') || error.status === 429;
      const isAuthError = error.status === 401 || error.message?.includes('API key');
      
      const fallbackMessage: GuestMessage = {
        id: (Date.now() + 1).toString(),
        content: isRateLimit 
          ? `I'm experiencing high demand right now. Please try again in a moment.

⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.

ℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.

This is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`
          : isAuthError
          ? `I'm having trouble connecting to my AI services right now. Please try again in a moment.

⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.

ℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.

This is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`
          : `I'm sorry, I'm having trouble processing your request right now.

⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.

ℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.

This is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`,
        role: 'assistant',
        timestamp: new Date(),
        isUrgent: false
      };

      setSessionState(prev => ({
        ...prev,
        messages: [...prev.messages, fallbackMessage],
        isLoading: false,
        retryCount: retryCount
      }));

      if (!isAuthError) {
        toast({
          title: isRateLimit ? "Server Busy" : "Connection Issue",
          description: isRateLimit 
            ? "High demand detected. Please try again shortly." 
            : "Unable to connect to AI assistant. Please try again.",
          variant: "destructive"
        });
      }
    }
  }, [toast, language]);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message and get the latest state
    const userMessage: GuestMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    // Use a state updater to capture the latest state and pass it to sendMessageWithRetry
    let latestState: GuestChatState | undefined;
    setSessionState(prev => {
      const updated = {
        ...prev,
        isLoading: true,
        messages: [...prev.messages, userMessage]
      };
      latestState = updated;
      return updated;
    });

    // Small delay to ensure state is captured
    await new Promise(resolve => setTimeout(resolve, 0));
    
    await sendMessageWithRetry(content, 0, latestState);
  }, [sendMessageWithRetry]);

  const initializeChat = useCallback((_welcomeMessage?: string) => {
    const professionalWelcome = `Hello! I'm Doctor AI, your caring virtual health assistant. 🩺

I'm here to help you understand your symptoms and guide you toward appropriate medical care. Please feel free to describe your symptoms or health concerns in as much detail as you're comfortable sharing.

⚠️ **IMPORTANT EMERGENCY NOTICE**: If you're experiencing a medical emergency (chest pain, difficulty breathing, severe bleeding, etc.), please call ${language === 'bn' ? '999' : '911'} immediately or go to your nearest emergency room.

ℹ️ **Medical Disclaimer**: I provide general health information only and am not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for personal health concerns.

What brings you here today? I'm listening and ready to help guide you toward the right care. 💙`;

    const welcomeMsg: GuestMessage = {
      id: 'welcome',
      content: professionalWelcome,
      role: 'assistant',
      timestamp: new Date()
    };

    setSessionState(prev => ({
      ...prev,
      messages: [welcomeMsg]
    }));
  }, [language]);

  const clearSession = useCallback(() => {
    localStorage.removeItem(GUEST_STORAGE_KEY);
    setSessionState({
      sessionId: `guest_${Date.now()}`,
      messages: [],
      phase: 'initial',
      symptoms: [],
      urgencyLevel: 'low',
      specialtyRecommendation: '',
      currentQuestionIndex: 0,
      followupAnswers: {},
      isLoading: false,
      requiresAuth: false,
      retryCount: 0
    });
  }, []);

  return {
    sessionState,
    sendMessage,
    initializeChat,
    clearSession
  };
};
