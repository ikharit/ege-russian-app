import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { useChatStore } from '../stores/chatStore';
import { useProgressStore } from '../stores/progressStore';
import { useStudentStore } from '../stores/studentStore';
import { useClassStore } from '../stores/classStore';
import { parseFunctionCalls, stripFunctionCalls, getSuggestedPrompts, ChatMessage } from '../utils/aiChat';
import { getLocalSuggestedPrompts } from '../utils/localAI';
import { getPredictiveScore } from '../utils/predictiveScore';
import { getDueReviews } from '../utils/spacedRepetition';
import { ChatQuickActions } from './ChatQuickActions';

interface AIChatProps {
  isOpen: boolean;
  onClose: () => void;
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const isError = message.content.startsWith('❌') || message.content.startsWith('⚠️');

  const displayContent = isUser ? message.content : stripFunctionCalls(message.content);
  const functionCalls = !isUser ? parseFunctionCalls(message.content) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-duo-purple/10 flex items-center justify-center mr-2 shrink-0 mt-1">
          <Bot size={16} className="text-duo-purple" />
        </div>
      )}
      <div className="max-w-[80%]">
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isUser
              ? 'bg-duo-green text-white rounded-br-md'
              : isError
              ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-md'
              : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-sm'
          }`}
        >
          {displayContent}
        </div>
        {functionCalls && functionCalls.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {functionCalls.map((call, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-full bg-duo-purple/10 text-duo-purple font-medium"
              >
                {call.name}: {call.arguments}
              </span>
            ))}
          </div>
        )}
        <p className={`text-[10px] text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-duo-green/10 flex items-center justify-center ml-2 shrink-0 mt-1">
          <User size={16} className="text-duo-green" />
        </div>
      )}
    </motion.div>
  );
}

function TypingIndicator({ isLocalMode }: { isLocalMode: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start mb-3"
    >
      <div className="w-8 h-8 rounded-full bg-duo-purple/10 flex items-center justify-center mr-2 shrink-0">
        <Bot size={16} className="text-duo-purple" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">
            {isLocalMode ? '🧠 Локальный AI печатает' : 'AI-Репетитор печатает'}
          </span>
          <span className="flex gap-0.5">
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-duo-purple"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
            />
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-duo-purple"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.span
              className="w-1.5 h-1.5 rounded-full bg-duo-purple"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
            />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function AIChat({ isOpen, onClose }: AIChatProps) {
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [inputValue, setInputValue] = useState('');

  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const sendUserMessage = useChatStore((s) => s.sendUserMessage);
  const useLocalAI = useChatStore((s) => s.useLocalAI);
  const apiKey = useChatStore((s) => s.apiKey);
  const isLocalMode = !apiKey || useLocalAI;

  const progress = useProgressStore();
  const student = useStudentStore();
  const classStore = useClassStore();

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

  const context = {
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

  const suggestedPrompts = isLocalMode ? getLocalSuggestedPrompts() : getSuggestedPrompts(context);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSend = async () => {
    const text = inputValue.trim();
    if (!text || isLoading) return;
    setInputValue('');
    await sendUserMessage(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestedClick = (prompt: string) => {
    if (isLoading) return;
    sendUserMessage(prompt);
  };

  const handleFunctionAction = (call: { name: string; arguments: string }) => {
    switch (call.name) {
      case 'navigateToLesson':
        if (call.arguments) {
          navigate(`/lesson/${call.arguments}`);
          onClose();
        }
        break;
      case 'startTrainer':
        if (call.arguments) {
          navigate(`/${call.arguments}-trainer`);
          onClose();
        }
        break;
      case 'showErrorAnalysis':
        navigate('/error-analysis');
        onClose();
        break;
      case 'generateSchedule':
        navigate('/weekly-schedule');
        onClose();
        break;
      default:
        break;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-gray-900 sm:items-center sm:justify-center sm:bg-black/50"
        >
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="flex flex-col h-full w-full sm:max-w-lg sm:h-[85vh] sm:rounded-2xl sm:shadow-2xl bg-duo-snow dark:bg-gray-900 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-duo-purple to-duo-blue flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800 dark:text-white">
                    {isLocalMode ? '🧠 Локальный AI' : 'AI-Репетитор 💬'}
                  </h2>
                  <p className="text-xs text-gray-500">
                    {isLocalMode ? 'Работает без интернета и API-ключей' : 'Персональный помощник по ЕГЭ'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Закрыть чат"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-duo-purple/20 to-duo-blue/20 flex items-center justify-center">
                    <Bot size={32} className="text-duo-purple" />
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">Привет!</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {isLocalMode
                      ? 'Привет! Я — твой AI-репетитор. Работаю без интернета и API-ключей. Знаю всё о твоём прогрессе! 💪'
                      : 'Я твой AI-репетитор. Чем могу помочь? 🎓'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {suggestedPrompts.map((prompt, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestedClick(prompt)}
                        className="px-3 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {messages.map((msg) => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

              {isLoading && <TypingIndicator isLocalMode={isLocalMode} />}

              <div ref={messagesEndRef} />
            </div>

            {/* Function call buttons from last assistant message */}
            {!isLoading && messages.length > 0 && (() => {
              const lastAssistant = messages.slice().reverse().find(m => m.role === 'assistant');
              if (!lastAssistant) return null;
              const calls = parseFunctionCalls(lastAssistant.content);
              if (!calls || calls.length === 0) return null;
              return (
                <div className="px-4 pb-2 flex flex-wrap gap-2">
                  {calls.map((call, idx) => {
                    const labels: Record<string, string> = {
                      navigateToLesson: 'Перейти к уроку',
                      startTrainer: 'Открыть тренажёр',
                      showErrorAnalysis: 'Разбор ошибок',
                      generateSchedule: 'Составить расписание',
                    };
                    return (
                      <button
                        key={idx}
                        onClick={() => handleFunctionAction(call)}
                        className="px-3 py-1.5 rounded-lg bg-duo-purple text-white text-xs font-bold hover:bg-duo-purple/90 transition-colors"
                      >
                        {labels[call.name] || call.name}
                      </button>
                    );
                  })}
                </div>
              );
            })()}

            {/* Quick Actions */}
            <div className="shrink-0 border-t border-gray-100 dark:border-gray-800 pt-2">
              <ChatQuickActions context={context} onSend={handleSuggestedClick} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Напиши сообщение..."
                  rows={1}
                  className="flex-1 resize-none max-h-32 px-4 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 border-0 text-sm text-gray-800 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-duo-purple/30 scrollbar-hide"
                  style={{ minHeight: '40px' }}
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className={`p-2.5 rounded-full transition-colors ${
                    inputValue.trim() && !isLoading
                      ? 'bg-duo-purple text-white hover:bg-duo-purple/90'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                  aria-label="Отправить"
                >
                  {isLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-1.5">
                Enter — отправить, Shift+Enter — новая строка
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
