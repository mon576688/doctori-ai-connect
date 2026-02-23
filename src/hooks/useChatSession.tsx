
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';
import { analyzeSymptoms, getMedicalDisclaimer, generateDoctorVisitPreparation } from '@/lib/medicalKnowledge';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ChatMessage {
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

export interface ChatSessionState {
  sessionId: string | null;
  messages: ChatMessage[];
  phase: 'initial' | 'assessment' | 'followup' | 'analysis' | 'summary';
  symptoms: string[];
  urgencyLevel: 'low' | 'medium' | 'high' | 'emergency';
  specialtyRecommendation: string;
  currentQuestionIndex: number;
  followupAnswers: Record<string, string>;
  isLoading: boolean;
  retryCount: number;
}

interface ChatSessionListItem {
  id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  urgency_level: string | null;
  primary_symptoms: string[] | null;
  status: string | null;
  specialty_recommendation?: string | null;
  last_assistant_message?: string | null;
}

const MAX_RETRIES = 2;

export const useChatSession = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { language } = useLanguage();

  const [sessions, setSessions] = useState<ChatSessionListItem[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  
  const [sessionState, setSessionState] = useState<ChatSessionState>({
    sessionId: null,
    messages: [],
    phase: 'initial',
    symptoms: [],
    urgencyLevel: 'low',
    specialtyRecommendation: '',
    currentQuestionIndex: 0,
    followupAnswers: {},
    isLoading: false,
    retryCount: 0
  });

  // Fetch sessions list
  const fetchSessions = useCallback(async () => {
    if (!user) return;
    setSessionsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .select('id, title, created_at, updated_at, urgency_level, primary_symptoms, status, specialty_recommendation')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setSessions(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setSessionsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) fetchSessions();
  }, [user, fetchSessions]);

  // Load a past session
  const loadSession = useCallback(async (sessionId: string) => {
    if (!user) return;
    setSessionState(prev => ({ ...prev, isLoading: true }));

    try {
      // Fetch session metadata
      const { data: session, error: sessionError } = await supabase
        .from('chat_sessions')
        .select('*')
        .eq('id', sessionId)
        .single();

      if (sessionError) throw sessionError;

      // Fetch messages
      const { data: messages, error: msgError } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (msgError) throw msgError;

      const chatMessages: ChatMessage[] = (messages || []).map((msg) => ({
        id: msg.id,
        content: msg.content,
        role: msg.role as 'user' | 'assistant' | 'system',
        timestamp: new Date(msg.created_at!),
        metadata: msg.metadata,
      }));

      // Determine phase from session data
      let phase: ChatSessionState['phase'] = 'initial';
      if (session.primary_symptoms && session.primary_symptoms.length > 0) {
        phase = 'assessment';
      }
      if (session.status === 'completed') {
        phase = 'summary';
      }

      setSessionState({
        sessionId: session.id,
        messages: chatMessages,
        phase,
        symptoms: session.primary_symptoms || [],
        urgencyLevel: (session.urgency_level as any) || 'low',
        specialtyRecommendation: session.specialty_recommendation || '',
        currentQuestionIndex: 0,
        followupAnswers: {},
        isLoading: false,
        retryCount: 0,
      });
    } catch (error) {
      console.error('Error loading session:', error);
      toast({
        title: 'Error',
        description: 'Failed to load chat session.',
        variant: 'destructive',
      });
      setSessionState(prev => ({ ...prev, isLoading: false }));
    }
  }, [user, toast]);

  // Reset to start a new chat
  const resetSession = useCallback(() => {
    setSessionState({
      sessionId: null,
      messages: [],
      phase: 'initial',
      symptoms: [],
      urgencyLevel: 'low',
      specialtyRecommendation: '',
      currentQuestionIndex: 0,
      followupAnswers: {},
      isLoading: false,
      retryCount: 0,
    });
  }, []);

  const createSession = useCallback(async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('chat_sessions')
        .insert([{
          user_id: user.id,
          title: 'Health Consultation',
          status: 'active',
          urgency_level: 'low'
        }])
        .select()
        .single();

      if (error) throw error;
      // Refresh sessions list
      fetchSessions();
      return data.id;
    } catch (error) {
      console.error('Error creating session:', error);
      toast({
        title: "Error",
        description: "Failed to create chat session. Please try again.",
        variant: "destructive"
      });
      return null;
    }
  }, [user, toast, fetchSessions]);

  const saveMessage = useCallback(async (content: string, role: 'user' | 'assistant', metadata?: any) => {
    if (!sessionState.sessionId) return;

    try {
      await supabase
        .from('chat_messages')
        .insert([{
          session_id: sessionState.sessionId,
          content,
          role,
          metadata
        }]);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  }, [sessionState.sessionId]);

  const generateAssessment = useCallback(async (state: ChatSessionState) => {
    if (!state.sessionId) return;

    try {
      const assessmentData = {
        symptoms: state.symptoms,
        urgency_level: state.urgencyLevel,
        specialty_recommendation: state.specialtyRecommendation,
        responses: state.followupAnswers
      };

      await supabase
        .from('medical_assessments')
        .insert([{
          session_id: state.sessionId,
          symptoms: { detected: state.symptoms },
          assessment_data: assessmentData,
          urgency_score: state.urgencyLevel === 'emergency' ? 100 : 
                        state.urgencyLevel === 'high' ? 80 :
                        state.urgencyLevel === 'medium' ? 50 : 20
        }]);

      const preparation = generateDoctorVisitPreparation(
        state.symptoms, 
        state.followupAnswers, 
        state.urgencyLevel
      );

      await supabase
        .from('visit_preparations')
        .insert([{
          user_id: user?.id,
          session_id: state.sessionId,
          summary: preparation.summary,
          questions: preparation.questionsForDoctor,
          symptoms_timeline: preparation.symptomsTimeline,
          medications_to_discuss: preparation.medicationsToDiscuss
        }]);

      const summaryMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        content: `Based on our conversation, I've prepared a comprehensive health summary and doctor visit preparation guide. This includes your symptom analysis, recommended specialty (${state.specialtyRecommendation}), and questions to ask your healthcare provider.`,
        role: 'assistant',
        timestamp: new Date()
      };

      setSessionState(prev => ({
        ...prev,
        messages: [...prev.messages, summaryMessage],
        phase: 'summary'
      }));

      await saveMessage(summaryMessage.content, 'assistant');

    } catch (error) {
      console.error('Error generating assessment:', error);
      toast({
        title: "Error",
        description: "Failed to generate assessment. Please try again.",
        variant: "destructive"
      });
    }
  }, [user, toast, saveMessage]);

  const sendMessageWithRetry = useCallback(async (
    content: string, 
    sessionId: string, 
    retryCount = 0,
    currentState?: ChatSessionState
  ): Promise<void> => {
    const state = currentState || sessionState;
    
    try {
      let userProfile = null;
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('age, gender, name, medical_conditions, medications, allergies')
          .eq('id', user.id)
          .single();
        userProfile = profile;
      }

      const { data, error } = await supabase.functions.invoke('ai-chat-assistant', {
        body: {
          userMessage: content,
          messages: state.messages,
          sessionContext: {
            phase: state.phase,
            symptoms: state.symptoms,
            urgencyLevel: state.urgencyLevel,
            followupAnswers: state.followupAnswers,
            sessionId: sessionId,
            language: language,
            isRegisteredUser: true,
            userProfile: userProfile
          }
        }
      });

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

        await supabase
          .from('chat_sessions')
          .update({
            urgency_level: analysis.urgencyLevel,
            primary_symptoms: analysis.symptoms,
            specialty_recommendation: analysis.specialtyRecommendation
          })
          .eq('id', sessionId);

        // Update title based on first symptom
        if (analysis.symptoms.length > 0) {
          await supabase
            .from('chat_sessions')
            .update({ title: analysis.symptoms.slice(0, 3).join(', ') })
            .eq('id', sessionId);
          fetchSessions();
        }

      } else if (state.phase === 'assessment') {
        newState.followupAnswers[state.currentQuestionIndex.toString()] = content;
        newState.currentQuestionIndex = state.currentQuestionIndex + 1;
        
        // Only transition to summary when AI sends the [SUMMARY_READY] marker
        if (hasSummaryMarker) {
          newState.phase = 'analysis';
          // Detect specialty from AI response for provider recommendations
          const detectedSpecialties = data.suggestedProviders ? [] : [];
          setTimeout(() => {
            generateAssessment(newState);
          }, 2000);
        }
      }

      // If we got SUMMARY_READY marker in any phase, trigger assessment
      if (hasSummaryMarker && state.phase !== 'initial') {
        newState.phase = 'analysis';
        setTimeout(() => {
          generateAssessment(newState);
        }, 2000);
      }

      const aiMessage: ChatMessage = {
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

      await saveMessage(aiResponse, 'assistant', { urgencyLevel: newState.urgencyLevel });

    } catch (error: any) {
      console.error('Error sending message:', error);
      
      if ((error.message?.includes('rate limit') || error.message?.includes('Rate limit')) && retryCount < MAX_RETRIES) {
        console.log(`Rate limit hit, retrying in ${(retryCount + 1) * 3} seconds...`);
        
        toast({
          title: "High Traffic",
          description: `Server is busy, retrying in ${(retryCount + 1) * 3} seconds...`,
          variant: "default"
        });

        setTimeout(() => {
          sendMessageWithRetry(content, sessionId, retryCount + 1);
        }, (retryCount + 1) * 3000);
        
        return;
      }
      
      const emergencyNumber = language === 'bn' ? '999' : '911';
      const isRateLimit = error.message?.includes('rate limit') || error.message?.includes('Rate limit');
      
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: isRateLimit 
          ? `I'm experiencing high demand right now. Please try again in a moment.\n\n⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.\n\nℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.\n\nThis is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`
          : `I'm sorry, I'm having trouble processing your request right now.\n\n⚠️ EMERGENCY: If you're experiencing a medical emergency, call ${emergencyNumber} immediately.\n\nℹ️ For non-emergency health concerns, please contact your healthcare provider or visit an urgent care center.\n\nThis is not medical advice. Always consult with a qualified healthcare provider for personal health concerns.`,
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

      toast({
        title: isRateLimit ? "Server Busy" : "Connection Issue",
        description: isRateLimit 
          ? "High demand detected. Please try again shortly." 
          : "Unable to connect to AI assistant. Please try again.",
        variant: "destructive"
      });
    }
  }, [saveMessage, toast, language, user, generateAssessment, fetchSessions]);

  const sendMessage = useCallback(async (content: string) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to start a chat session.",
        variant: "destructive"
      });
      return;
    }

    let sessionId = sessionState.sessionId;
    if (!sessionId) {
      sessionId = await createSession();
      if (!sessionId) {
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date()
    };

    let latestState: ChatSessionState | undefined;
    setSessionState(prev => {
      const updated = {
        ...prev,
        isLoading: true,
        sessionId: sessionId,
        messages: [...prev.messages, userMessage]
      };
      latestState = updated;
      return updated;
    });

    await saveMessage(content, 'user');
    await new Promise(resolve => setTimeout(resolve, 0));
    await sendMessageWithRetry(content, sessionId!, 0, latestState);
  }, [user, sessionState.sessionId, createSession, saveMessage, sendMessageWithRetry, toast]);

  const initializeChat = useCallback(() => {
    // Don't overwrite if a session is already loaded
    if (sessionState.messages.length > 0 && sessionState.sessionId) return;

    const emergencyNumber = language === 'bn' ? '999' : '911';
    const professionalWelcome = `Hello! I'm Doctor AI, your caring virtual health assistant. 🩺

Welcome to your personalized health consultation. I'm here to help you understand your symptoms and guide you toward appropriate medical care. Please feel free to describe your symptoms or health concerns in as much detail as you're comfortable sharing.

⚠️ **IMPORTANT EMERGENCY NOTICE**: If you're experiencing a medical emergency (chest pain, difficulty breathing, severe bleeding, etc.), please call ${emergencyNumber} immediately or go to your nearest emergency room.

ℹ️ **Medical Disclaimer**: I provide general health information only and am not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for personal health concerns.

As a registered user, I'll be able to save our conversation and provide you with a comprehensive health summary and doctor visit preparation guide. What brings you here today? I'm listening and ready to help guide you toward the right care. 💙`;

    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      content: professionalWelcome,
      role: 'assistant',
      timestamp: new Date()
    };

    setSessionState(prev => ({
      ...prev,
      messages: [welcomeMessage]
    }));
  }, [language, sessionState.messages.length, sessionState.sessionId]);

  return {
    sessionState,
    sendMessage,
    initializeChat,
    sessions,
    sessionsLoading,
    loadSession,
    resetSession,
    fetchSessions,
  };
};
