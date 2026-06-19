import { UserStats, ErrorPattern, AnswerHistory, PredictiveScore } from '../types';
import { SRSItem } from './spacedRepetition';
import { StudentProfile } from '../stores/studentStore';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  functionCall?: {
    name: string;
    arguments: string;
  };
}

export interface ChatContext {
  userStats: UserStats;
  weakTopics: ErrorPattern[];
  dueReviews: SRSItem[];
  predictedScore: PredictiveScore;
  streak: number;
  achievements: string[];
  recentAnswers: AnswerHistory[];
  activeProfile: StudentProfile | null;
  className: string | null;
  classRank: number | null;
}

export type AIProvider = 'kimi' | 'openai' | 'custom';

export interface AIConfig {
  apiKey: string | null;
  provider: AIProvider;
  endpoint: string;
}

const DEFAULT_ENDPOINTS: Record<AIProvider, string> = {
  kimi: 'https://api.moonshot.cn/v1/chat/completions',
  openai: 'https://api.openai.com/v1/chat/completions',
  custom: '',
};

export function getDefaultEndpoint(provider: AIProvider): string {
  return DEFAULT_ENDPOINTS[provider];
}

export function buildSystemPrompt(context: ChatContext): string {
  const { userStats, weakTopics, dueReviews, predictedScore, streak, achievements, activeProfile, className, classRank } = context;

  const name = activeProfile?.name || userStats.name || 'ученик';
  const level = userStats.level || 1;
  const xp = userStats.xp || 0;
  const streakDays = streak || 0;
  const achievementCount = achievements.length;

  const topWeakTopics = weakTopics
    .slice(0, 5)
    .map((p, i) => `${i + 1}. Задание ${p.taskNumber}: ${p.errorType} (уверенность: ${Math.round(p.confidence * 100)}%)`)
    .join('\n');

  const dueReviewsText = dueReviews.length > 0
    ? `Просроченные повторения: ${dueReviews.length} уроков`
    : 'Нет просроченных повторений';

  const scoreText = predictedScore
    ? `Предсказанный балл на ЕГЭ: ${predictedScore.predictedSecondary} из 100 (первичный: ${predictedScore.predictedPrimary} из 58). До порогового балла (36): ${predictedScore.neededForThreshold} XP. До хорошего (60): ${predictedScore.neededForGood} XP. До отличного (80): ${predictedScore.neededForExcellent} XP. Рекомендуется ${predictedScore.recommendedDaily} минут в день.`
    : 'Недостаточно данных для предсказания балла.';

  const classText = className
    ? `Класс: ${className}${classRank && classRank > 0 ? `, место в рейтинге: #${classRank}` : ''}`
    : '';

  return `Ты — персональный репетитор по русскому языку для подготовки к ЕГЭ. Твоя задача — помогать ученику готовиться к экзамену, объяснять правила, анализировать ошибки, мотивировать и давать задания.

Информация об ученике:
- Имя: ${name}
- Уровень: ${level}
- XP: ${xp}
- Streak: ${streakDays} дней подряд
- Достижений разблокировано: ${achievementCount}
${classText ? `- ${classText}` : ''}

Слабые места:
${topWeakTopics || 'Пока не выявлены явные слабые темы. Продолжай практику!'}

${scoreText}

${dueReviewsText}

Твои возможности:
1. Давать конкретные задания из слабых тем ученика
2. Объяснять правила русского языка
3. Анализировать ошибки и объяснять, почему ученик ошибся
4. Мотивировать и поддерживать
5. Предлагать переходить к урокам или тренажёрам

Стиль общения:
- Дружелюбный, молодёжный тон
- Можешь использовать эмодзи
- Ответы: 2-4 предложения, кроме случаев, когда ученик просит подробное объяснение
- В конце каждого ответа предложи 1-2 варианта дальнейших действий (как быстрые кнопки)

Формат функций (если нужно выполнить действие в приложении):
В конце ответа, если нужно направить ученика, добавь одно из:
[ACTION:navigateToLesson("lesson-id")]
[ACTION:startTrainer("task5")]
[ACTION:showErrorAnalysis]
[ACTION:generateSchedule]

Важно: отвечай всегда на русском языке. Если ученик просит задание — предложи конкретное задание из его слабых тем. Если ученик ошибся — объясни, почему, и дай похожий пример.`;
}

export interface SendMessageOptions {
  messages: ChatMessage[];
  apiKey: string;
  apiEndpoint?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  onStream?: (chunk: string) => void;
}

export async function sendMessage(options: SendMessageOptions): Promise<ChatMessage> {
  const {
    messages,
    apiKey,
    apiEndpoint = DEFAULT_ENDPOINTS.kimi,
    model = 'moonshot-v1-8k',
    temperature = 0.7,
    maxTokens = 500,
    onStream,
  } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: messages.map(m => ({
          role: m.role,
          content: m.content,
        })),
        temperature,
        max_tokens: maxTokens,
        stream: !!onStream,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('INVALID_API_KEY');
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Streaming mode
    if (onStream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;
              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content || '';
                if (delta) {
                  fullContent += delta;
                  onStream(delta);
                }
              } catch {
                // ignore malformed JSON in stream
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return {
        id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        role: 'assistant',
        content: fullContent,
        timestamp: new Date().toISOString(),
      };
    }

    // Non-streaming mode
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';

    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      role: 'assistant',
      content,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new Error('TIMEOUT');
      }
      throw error;
    }
    throw new Error('UNKNOWN_ERROR');
  }
}

export function getSuggestedPrompts(context: ChatContext): string[] {
  const { weakTopics, dueReviews, streak, predictedScore } = context;
  const prompts: string[] = [];

  prompts.push('Разбери мои ошибки 🧠');
  prompts.push('Дай задание на слабую тему 💪');
  prompts.push('Как набрать 80+ баллов? 🎯');
  prompts.push('Что учить сегодня? 📚');

  if (streak < 3) {
    prompts.push('Вернём стрик? 🔥');
  }

  if (dueReviews.length > 0) {
    prompts.push('Повторить просроченное 🔁');
  }

  return prompts.slice(0, 4);
}

export function parseFunctionCalls(content: string): Array<{ name: string; arguments: string }> | null {
  const regex = /\[ACTION:(\w+)\(([^)]*)\)\]/g;
  const matches: Array<{ name: string; arguments: string }> = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    matches.push({
      name: match[1],
      arguments: match[2].replace(/["']/g, ''),
    });
  }

  return matches.length > 0 ? matches : null;
}

export function stripFunctionCalls(content: string): string {
  return content.replace(/\[ACTION:\w+\([^)]*\)\]/g, '').trim();
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    if (error.message === 'INVALID_API_KEY') {
      return 'Проверь API ключ в настройках. Ключ недействителен или истёк срок.';
    }
    if (error.message === 'TIMEOUT') {
      return 'Проверь интернет-соединение. Запрос занял слишком много времени (15 сек).';
    }
    if (error.message.startsWith('HTTP')) {
      return `Ошибка API: ${error.message}. Проверь API ключ или интернет-соединение.`;
    }
    return `Ошибка: ${error.message}. Проверь API ключ или интернет-соединение.`;
  }
  return 'Проверь API ключ или интернет-соединение.';
}
