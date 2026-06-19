import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  ChatMessage,
  ChatContext,
  AIProvider,
  buildSystemPrompt,
  sendMessage,
  getErrorMessage,
  getDefaultEndpoint,
} from '../utils/aiChat';
import {
  processLocalMessage,
  localAIResponseToChatMessage,
  getLocalResponseMode,
} from '../utils/localAI';
import type { LocalAIRequest } from '../utils/localAI';
import { useProgressStore } from './progressStore';
import { useStudentStore } from './studentStore';
import { useClassStore } from './classStore';
import { getPredictiveScore } from '../utils/predictiveScore';
import { getDueReviews } from '../utils/spacedRepetition';

interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  apiKey: string | null;
  apiEndpoint: string;
  provider: AIProvider;
  connectionStatus: 'unknown' | 'checking' | 'connected' | 'error' | 'no_key';
  useLocalAI: boolean;
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
  setApiKey: (key: string) => void;
  setProvider: (provider: AIProvider) => void;
  setEndpoint: (endpoint: string) => void;
  sendUserMessage: (content: string) => Promise<void>;
  checkConnection: () => Promise<void>;
  setConnectionStatus: (status: ChatStore['connectionStatus']) => void;
  toggleLocalAI: () => void;
  getDefaultResponseMode: () => 'local' | 'api';
}

function buildChatContext(): ChatContext {
  const progress = useProgressStore.getState();
  const student = useStudentStore.getState();
  const classStore = useClassStore.getState();

  const activeProfile = student.getActiveProfile();
  const studentClass = activeProfile ? classStore.getStudentClass(activeProfile.id) : null;
  const classLeaderboard = studentClass ? classStore.getLeaderboard(studentClass.id) : [];
  const myClassRank = activeProfile && studentClass
    ? classLeaderboard.findIndex(e => e.profileId === activeProfile.id) + 1
    : -1;

  const errorAnalysis = progress.getErrorAnalysis();
  const srsData = progress.getSRSData();
  const dueReviews = getDueReviews(srsData);

  const daysToExam = progress.examDate
    ? Math.max(0, Math.ceil((new Date(progress.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 180;

  const predictedScore = getPredictiveScore(progress, daysToExam);

  return {
    userStats: progress.userStats,
    weakTopics: errorAnalysis.patterns || [],
    dueReviews,
    predictedScore,
    streak: progress.userStats.streak || 0,
    achievements: progress.achievements || [],
    recentAnswers: progress.answerHistory.slice(-20),
    activeProfile,
    className: studentClass?.name || null,
    classRank: myClassRank > 0 ? myClassRank : null,
  };
}

function buildLocalAIRequest(content: string): LocalAIRequest {
  const progress = useProgressStore.getState();
  const context = buildChatContext();

  return {
    message: content,
    context,
    progressState: {
      lessonProgress: progress.lessonProgress,
      taskStats: progress.taskStats,
      wrongAnswers: progress.wrongAnswers,
      examResults: progress.examResults,
      examDate: progress.examDate,
      weeklySchedule: progress.weeklySchedule,
      srsData: progress.srsData,
      answerHistory: progress.answerHistory,
      userStats: progress.userStats,
    },
  };
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      apiKey: null,
      apiEndpoint: getDefaultEndpoint('kimi'),
      provider: 'kimi',
      connectionStatus: 'unknown',
      useLocalAI: true,

      addMessage: (msg) => {
        set((state) => ({ messages: [...state.messages, msg] }));
      },

      clearMessages: () => {
        set({ messages: [] });
      },

      setApiKey: (key) => {
        set({ apiKey: key.trim() || null, connectionStatus: key ? 'unknown' : 'no_key' });
      },

      setProvider: (provider) => {
        const defaultEndpoint = getDefaultEndpoint(provider);
        set({ provider, apiEndpoint: defaultEndpoint });
      },

      setEndpoint: (endpoint) => {
        set({ apiEndpoint: endpoint.trim() });
      },

      setConnectionStatus: (status) => {
        set({ connectionStatus: status });
      },

      toggleLocalAI: () => {
        set((state) => ({ useLocalAI: !state.useLocalAI }));
      },

      getDefaultResponseMode: () => {
        return getLocalResponseMode(get().apiKey, get().useLocalAI);
      },

      checkConnection: async () => {
        const { apiKey, apiEndpoint } = get();
        if (!apiKey) {
          set({ connectionStatus: 'no_key' });
          return;
        }

        set({ connectionStatus: 'checking' });

        try {
          await sendMessage({
            messages: [{ id: 'test', role: 'user', content: 'Привет', timestamp: new Date().toISOString() }],
            apiKey,
            apiEndpoint,
            maxTokens: 5,
          });
          set({ connectionStatus: 'connected' });
        } catch (error) {
          set({ connectionStatus: 'error' });
        }
      },

      sendUserMessage: async (content) => {
        const { apiKey, apiEndpoint, messages, useLocalAI } = get();
        const mode = getLocalResponseMode(apiKey, useLocalAI);

        const userMessage: ChatMessage = {
          id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };

        set((state) => ({ messages: [...state.messages, userMessage], isLoading: true }));

        if (mode === 'local') {
          // Local AI mode
          try {
            const request = buildLocalAIRequest(content);
            const response = processLocalMessage(request);
            const chatMessage = localAIResponseToChatMessage(response);
            set((state) => ({
              messages: [...state.messages, chatMessage],
              isLoading: false,
            }));
          } catch (error) {
            const errorMsg: ChatMessage = {
              id: `err_${Date.now()}`,
              role: 'assistant',
              content: '❌ Произошла ошибка в локальном AI. Попробуй ещё раз или перезагрузи страницу.',
              timestamp: new Date().toISOString(),
            };
            set((state) => ({
              messages: [...state.messages, errorMsg],
              isLoading: false,
            }));
          }
          return;
        }

        // External API mode
        if (!apiKey) {
          const errorMsg: ChatMessage = {
            id: `err_${Date.now()}`,
            role: 'assistant',
            content: '⚠️ Введите API ключ в настройках профиля, чтобы использовать внешнего AI-репетитора.',
            timestamp: new Date().toISOString(),
          };
          set((state) => ({ messages: [...state.messages, errorMsg], isLoading: false }));
          return;
        }

        try {
          const context = buildChatContext();
          const systemPrompt = buildSystemPrompt(context);

          const systemMessage: ChatMessage = {
            id: `sys_${Date.now()}`,
            role: 'system',
            content: systemPrompt,
            timestamp: new Date().toISOString(),
          };

          const apiMessages = [systemMessage, ...messages.filter(m => m.role !== 'system'), userMessage];

          const response = await sendMessage({
            messages: apiMessages,
            apiKey,
            apiEndpoint,
          });

          set((state) => ({
            messages: [...state.messages, response],
            isLoading: false,
            connectionStatus: 'connected',
          }));
        } catch (error) {
          const errorMsg: ChatMessage = {
            id: `err_${Date.now()}`,
            role: 'assistant',
            content: `❌ ${getErrorMessage(error)}`,
            timestamp: new Date().toISOString(),
          };
          set((state) => ({
            messages: [...state.messages, errorMsg],
            isLoading: false,
            connectionStatus: 'error',
          }));
        }
      },
    }),
    {
      name: 'ege-chat-storage',
      partialize: (state) => ({
        messages: state.messages.slice(-50),
        apiKey: state.apiKey,
        apiEndpoint: state.apiEndpoint,
        provider: state.provider,
        useLocalAI: state.useLocalAI,
      }),
    }
  )
);
