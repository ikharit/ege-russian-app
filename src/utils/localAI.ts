import type { ChatContext, ChatMessage } from './aiChat';
import type {
  UserStats,
  ErrorPattern,
  PredictiveScore,
  AnswerHistory,
  LessonProgress,
  ScheduleDay,
  SRSItem,
  WrongAnswer,
  ExamResult,
  WeeklySchedulePreferences,
} from '../types';
import { getTaskKnowledge, getAvailableTaskNumbers } from '../data/aiKnowledgeBase';
import { course } from '../data/courseData';
import { generateWeeklySchedule, exportScheduleToText } from './weeklySchedule';
import { getPredictiveScore, getWeakTasks } from './predictiveScore';
import { getSubskillName } from './errorPatternAnalyzer';

// ─── Types ───

export type LocalAIIntent =
  | 'progress'
  | 'errors'
  | 'task'
  | 'schedule'
  | 'motivation'
  | 'rule'
  | 'exam_info'
  | 'greeting'
  | 'unknown';

export interface LocalAIAction {
  type: string;
  payload: unknown;
}

export interface LocalAIResponse {
  text: string;
  actions?: LocalAIAction[];
  suggestions?: string[];
}

export interface LocalAIRequest {
  message: string;
  context: ChatContext;
  // Extended fields needed for local AI operations (passed from chatStore)
  progressState?: {
    lessonProgress: Record<string, LessonProgress>;
    taskStats: Record<string, { total: number; correct: number; wrong: number; lastAttemptAt: string }>;
    wrongAnswers: WrongAnswer[];
    examResults: ExamResult[];
    examDate: string | null;
    weeklySchedule: ScheduleDay[] | null;
    srsData: Record<string, SRSItem>;
    answerHistory: AnswerHistory[];
    userStats: UserStats;
  };
}

// ─── Intent Detection ───

const INTENT_KEYWORDS: Record<LocalAIIntent, string[]> = {
  progress: ['прогресс', 'как дела', 'сколько', 'уровень', 'xp', 'опыт', 'достижения', 'статистика', 'результаты', 'успехи', 'где я'],
  errors: ['ошибк', 'разбер', 'слаб', 'что не получается', 'неправильно', 'провал', 'проверь ошибки', 'где я ошибаюсь', 'слабые места', 'проблемы'],
  task: ['задан', 'вопрос', 'порешаем', 'потренируем', 'дай задание', 'тренаж', 'упражнен', 'пример', 'потренироваться', 'задачка', 'тест', 'тренировка'],
  schedule: ['расписан', 'план', 'когда учить', 'график', 'неделя', 'что учить сегодня', 'когда заниматься', 'план на неделю', 'учебный план'],
  motivation: ['мотивац', 'поддержи', 'не хочу', 'устал', 'скучно', 'без сил', 'падаю духом', 'не могу', 'лень', 'хочу бросить', 'подбодри', 'давай', 'помоги начать'],
  rule: ['правил', 'почему', 'как', 'объясн', 'что такое', 'зачем', 'теория', 'справочник', 'поясни', 'разъясни', 'как пишется', 'как ставится', 'запомнить', 'шпаргалка'],
  exam_info: ['экзамен', 'когда', 'сколько осталось', 'балл', 'егэ', 'дата', 'прогноз', 'сколько дней', 'до экзамена', 'сколько набрать', 'набрать 80', 'пороговый'],
  greeting: ['привет', 'здравствуй', 'хай', 'хело', 'добрый день', 'добрый вечер', 'доброе утро', 'салют', 'здорово', 'здрасьте', 'хеллоу', 'ку'],
  unknown: [],
};

export function analyzeIntent(message: string): LocalAIIntent {
  const lower = message.toLowerCase();
  for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS) as [LocalAIIntent, string][]) {
    if (intent === 'unknown') continue;
    for (const kw of keywords) {
      if (lower.includes(kw)) return intent;
    }
  }
  return 'unknown';
}

// ─── Templates ───

const TEMPLATES: Record<LocalAIIntent, string[]> = {
  progress: [
    'Привет, {name}! 👋 Ты на уровне {level} ({xp} XP). Прошёл {completed}/{total} уроков. Средняя точность: {accuracy}%. Текущий стрик: {streak} дней. Предсказанный балл на ЕГЭ: {predictedScore} (уверенность: {confidence}%). 🎯',
    'Твой прогресс радует, {name}! 📈 Уровень {level}, {xp} XP. Завершено {completed} из {total} уроков. Стрик: {streak} дней. Прогноз: {predictedScore} баллов.',
    'Держу в курсе, {name}! 💪 Уровень {level}, {xp} XP. Точность: {accuracy}%. Стрик: {streak} дней подряд. Предсказанный балл: {predictedScore} (уверенность {confidence}%).',
    'Вот твоя сводка, {name}! 📊 Уровень {level}, {xp} XP. Пройдено {completed} из {total} уроков. Средняя точность: {accuracy}%. Стрик: {streak} дней. Прогноз: {predictedScore} баллов.',
  ],
  errors: [
    'Твои слабые места: {topPatterns}. Чаще всего ошибаешься в {mostFrequentError}. Вот рекомендация: {recommendation}. 🧠',
    'Давай разберём ошибки! Твои основные проблемы: {topPatterns}. Самая частая ошибка: {mostFrequentError}. Рекомендация: {recommendation}. 💡',
    'Анализ ошибок готов, {name}! Слабые места: {topPatterns}. Чаще всего: {mostFrequentError}. Совет: {recommendation}.',
    'Пора работать над ошибками! Топ проблем: {topPatterns}. Самая частая: {mostFrequentError}. Что делать: {recommendation}. 🔧',
  ],
  task: [
    'Вот задание по {topic}: {questionText}. Варианты: {options}. Удачи! 📝',
    'Попробуй разобрать это: {questionText}. Варианты: {options}. Тема: {topic}. 💪',
    'Задание на {topic}: {questionText}. Варианты: {options}. Давай, у тебя получится! 🎯',
    'Тренировка по {topic}: {questionText}. Варианты: {options}. Проверь себя! 🧠',
  ],
  schedule: [
    'Твоё расписание на неделю: {scheduleSummary}. Ближайшее: {nextItem}. 📅',
    'Вот план на неделю! {scheduleSummary}. Следующий пункт: {nextItem}. Удобно? 📆',
    'Составил расписание: {scheduleSummary}. Ближайшее занятие: {nextItem}. Давай по плану! 🗓️',
    'Твой учебный план: {scheduleSummary}. Дальше: {nextItem}. Ты готов? 📚',
  ],
  motivation: [
    'Ты уже прошёл {completed} уроков! Это больше, чем {percent}% учеников. 🔥',
    'Старайся всего 5 минут — и стрик продолжится! 💪',
    'В прошлый раз ты справился с {taskName} на {accuracy}% — круто! 🌟',
    'Не сдавайся, {name}! Каждый урок — шаг к {predictedScore} баллам на ЕГЭ. 🚀',
    'Помни: даже 10 минут учёбы сегодня — это прогресс. Твой стрик {streak} дней — впечатляет! 🔥',
    'Ты способен на большее! {xp} XP — это не просто цифры, это реальные знания. 📚',
    'Маленькие шаги ведут к большим целям. Ты уже на уровне {level} — круто! 💫',
    'Если устал — сделай перерыв. Но не бросай! Твой прогноз {predictedScore} баллов уже неплох. 📈',
    'Представь себя на экзамене с уверенностью. Это возможно, {name}! Продолжай! 🎯',
    'Ты не один! Я твой AI-репетитор и верю в тебя. Давай ещё один урок? 🤝',
    'Стаж {streak} дней — это дисциплина. Ты круче, чем думаешь! 💪',
    'Каждая ошибка — это шанс вырасти. Твой прогресс {accuracy}% говорит сам за себя. 🌱',
  ],
  rule: [
    'Вот правила по заданию {taskNumber}: {rules}. Пример: {example}. 📖',
    'Задание {taskNumber}: {rules}. Смотри пример: {example}. Запомни — это важно! 🧠',
    'Объясняю задание {taskNumber}: {rules}. Пример: {example}. Повторяй вслух! 🔁',
    'Правила задания {taskNumber}: {rules}. Разберём пример: {example}. Удачи! 📝',
  ],
  exam_info: [
    'До экзамена осталось {days} дней. Текущий прогноз: {predictedScore} баллов. Для 80+ нужно подтянуть: {weakTasks}. 🎯',
    'Экзамен через {days} дней! Прогноз: {predictedScore} баллов. Твои слабые темы: {weakTasks}. Стоит поработать над ними! 📚',
    '{days} дней до ЕГЭ. Сейчас твой прогноз — {predictedScore} баллов. Для роста фокусируйся на: {weakTasks}. 🔥',
    'До экзамена {days} дней. Прогноз: {predictedScore}. Чтобы набрать 80+, нужно подтянуть: {weakTasks}. Давай! 💪',
  ],
  greeting: [
    'Привет, {name}! 🎉 Я — твой AI-репетитор. Знаю всё о твоём прогрессе: уровень {level}, {xp} XP. Чем могу помочь?',
    'Здравствуй, {name}! 🤖 Я работаю без интернета и API-ключей. Твой уровень: {level}, {xp} XP. Что будем делать?',
    'Привет, {name}! 💪 Я твой персональный репетитор по ЕГЭ. Уровень {level}, {xp} XP. Давай учиться!',
    'Хай, {name}! 🎓 Готов к занятиям? Твой уровень: {level}, {xp} XP. Я могу: дать задание, разобрать ошибки, показать прогресс.',
  ],
  unknown: [
    'Я пока не умею отвечать на это 😅 Но я могу: показать прогресс, разобрать ошибки, дать задание, объяснить правило. Попробуй спросить: «Разбери мои ошибки» или «Дай задание на ударения».',
    'Хм, не совсем понял 🤔 Но я знаю много о ЕГЭ! Спроси: «Покажи прогресс», «Разбери ошибки», «Дай задание» или «Как набрать 80+?».',
    'Такое я пока не умею 😅 Но зато я могу помочь с заданиями 1-26, мотивацией и планированием. Что выберем?',
    'Не уверен, что понял вопрос 🤓 Давай лучше про учёбу! Попробуй: «Дай задание», «Разбери ошибки», «Мотивируй меня» или «Как доехать до 80 баллов?».',
  ],
};

// ─── Helpers ───

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatList(items: string[], limit = 3): string {
  if (items.length === 0) return 'пока не выявлены';
  const slice = items.slice(0, limit);
  return slice.join(', ') + (items.length > limit ? ` и ещё ${items.length - limit}` : '');
}

function getTotalLessons(): number {
  return course.sections.reduce((sum, s) => sum + s.lessons.length, 0);
}

function getCompletedLessons(lessonProgress: Record<string, LessonProgress>): number {
  return Object.values(lessonProgress).filter(l => l.status === 'completed').length;
}

function calculateAccuracy(answerHistory: AnswerHistory[]): number {
  if (answerHistory.length === 0) return 0;
  const correct = answerHistory.filter(a => a.correct).length;
  return Math.round((correct / answerHistory.length) * 100);
}

function extractTaskNumber(message: string): string | null {
  const match = message.match(/задани[ея]\s*(\d+)/i) || message.match(/task\s*(\d+)/i) || message.match(/номер\s*(\d+)/i);
  return match ? match[1] : null;
}

function findQuestionFromWeakTopics(weakTopics: ErrorPattern[]): { text: string; options?: string[]; taskNumber: string; topic: string } | null {
  if (!weakTopics.length) return null;
  const top = weakTopics[0];
  const taskNum = String(top.taskNumber);
  const section = course.sections.find(s =>
    s.lessons.some(l => l.id.includes(`task${taskNum}`) || l.id.includes(`q${taskNum}`))
  );
  if (!section) return null;
  const lesson = section.lessons.find(l => l.id.includes(`task${taskNum}`) || l.id.includes(`q${taskNum}`));
  if (!lesson || !lesson.questions.length) return null;
  const q = pickRandom(lesson.questions);
  return {
    text: q.text,
    options: q.options,
    taskNumber: taskNum,
    topic: `задание ${taskNum}`,
  };
}

function findRandomUncompletedQuestion(lessonProgress: Record<string, LessonProgress>): { text: string; options?: string[]; taskNumber: string; topic: string } | null {
  const allLessons = course.sections.flatMap(s => s.lessons);
  const uncompleted = allLessons.filter(l => lessonProgress[l.id]?.status !== 'completed');
  if (uncompleted.length === 0) {
    // All completed — pick random from any
    const lesson = pickRandom(allLessons);
    if (!lesson.questions.length) return null;
    const q = pickRandom(lesson.questions);
    const taskNum = lesson.id.match(/task(\d+)/)?.[1] || lesson.id.match(/q(\d+)/)?.[1] || '?';
    return { text: q.text, options: q.options, taskNumber: taskNum, topic: `задание ${taskNum}` };
  }
  const lesson = pickRandom(uncompleted);
  if (!lesson.questions.length) return null;
  const q = pickRandom(lesson.questions);
  const taskNum = lesson.id.match(/task(\d+)/)?.[1] || lesson.id.match(/q(\d+)/)?.[1] || '?';
  return { text: q.text, options: q.options, taskNumber: taskNum, topic: `задание ${taskNum}` };
}

function getNextScheduleItem(weeklySchedule: ScheduleDay[] | null): string {
  if (!weeklySchedule || weeklySchedule.length === 0) return 'расписание ещё не составлено';
  const today = new Date();
  const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
  const todayKey = dayNames[today.getDay()];
  const todaySchedule = weeklySchedule.find(d => d.day === todayKey);
  if (todaySchedule && todaySchedule.items.length > 0) {
    const first = todaySchedule.items[0];
    return `${first.title} (${first.duration} мин)`;
  }
  // Find next available day
  for (let i = 1; i <= 7; i++) {
    const nextDay = new Date(today);
    nextDay.setDate(today.getDate() + i);
    const key = dayNames[nextDay.getDay()];
    const day = weeklySchedule.find(d => d.day === key);
    if (day && day.items.length > 0) {
      return `${day.items[0].title} (${day.items[0].duration} мин) — ${dayNamesRu[key]}`;
    }
  }
  return 'расписание ещё не составлено';
}

const dayNamesRu: Record<string, string> = {
  mon: 'понедельник', tue: 'вторник', wed: 'среда', thu: 'четверг',
  fri: 'пятница', sat: 'суббота', sun: 'воскресенье',
};

// ─── Response Builders ───

function buildProgressResponse(
  context: ChatContext,
  progressState?: LocalAIRequest['progressState']
): LocalAIResponse {
  const { userStats, predictedScore, streak, activeProfile } = context;
  const name = activeProfile?.name || userStats.name || 'ученик';
  const level = userStats.level || 1;
  const xp = userStats.xp || 0;
  const total = getTotalLessons();
  const completed = progressState ? getCompletedLessons(progressState.lessonProgress) : 0;
  const accuracy = progressState ? calculateAccuracy(progressState.answerHistory) : 0;
  const predicted = predictedScore?.predictedSecondary ?? 0;
  const confidence = Math.round((predictedScore?.confidence ?? 0) * 100);

  const template = pickRandom(TEMPLATES.progress);
  const text = template
    .replace(/{name}/g, name)
    .replace(/{level}/g, String(level))
    .replace(/{xp}/g, String(xp))
    .replace(/{completed}/g, String(completed))
    .replace(/{total}/g, String(total))
    .replace(/{accuracy}/g, String(accuracy))
    .replace(/{streak}/g, String(streak || 0))
    .replace(/{predictedScore}/g, String(predicted))
    .replace(/{confidence}/g, String(confidence));

  return {
    text,
    suggestions: ['Разбери мои ошибки 🧠', 'Дай задание на слабую тему 💪', 'Как набрать 80+? 🎯'],
  };
}

function buildErrorsResponse(
  context: ChatContext,
  progressState?: LocalAIRequest['progressState']
): LocalAIResponse {
  const { weakTopics } = context;
  const topPatterns = weakTopics.length > 0
    ? weakTopics.slice(0, 3).map(p => `задание ${p.taskNumber} — ${getSubskillName(p.errorType)} (${p.frequency} раз)`).join('; ')
    : 'пока не выявлены';
  const mostFrequent = weakTopics.length > 0
    ? `${getSubskillName(weakTopics[0].errorType)} (задание ${weakTopics[0].taskNumber})`
    : 'пока данных мало';
  const recommendation = weakTopics.length > 0
    ? `потренируй задание ${weakTopics[0].taskNumber} — ${getSubskillName(weakTopics[0].errorType)}`
    : 'продолжай практику, я отслеживаю твой прогресс';

  const template = pickRandom(TEMPLATES.errors);
  const text = template
    .replace(/{topPatterns}/g, topPatterns)
    .replace(/{mostFrequentError}/g, mostFrequent)
    .replace(/{recommendation}/g, recommendation);

  const actions: LocalAIAction[] = [];
  if (weakTopics.length > 0) {
    actions.push({ type: 'startTrainer', payload: `task${weakTopics[0].taskNumber}` });
  }

  return {
    text,
    actions,
    suggestions: ['Дай задание на эту тему 📝', 'Покажи правило 📖', 'Мотивируй меня 🔥'],
  };
}

function buildTaskResponse(
  context: ChatContext,
  progressState?: LocalAIRequest['progressState']
): LocalAIResponse {
  let question: { text: string; options?: string[]; taskNumber: string; topic: string } | null = null;

  if (context.weakTopics.length > 0) {
    question = findQuestionFromWeakTopics(context.weakTopics);
  }
  if (!question && progressState) {
    question = findRandomUncompletedQuestion(progressState.lessonProgress);
  }
  if (!question) {
    // Fallback: pick absolutely random
    const allLessons = course.sections.flatMap(s => s.lessons);
    const lesson = pickRandom(allLessons);
    if (lesson.questions.length > 0) {
      const q = pickRandom(lesson.questions);
      const taskNum = lesson.id.match(/task(\d+)/)?.[1] || lesson.id.match(/q(\d+)/)?.[1] || '?';
      question = { text: q.text, options: q.options, taskNumber: taskNum, topic: `задание ${taskNum}` };
    }
  }

  if (!question) {
    return {
      text: 'Я не смог найти подходящее задание 😅 Но ты можешь открыть любой тренажёр из меню! 🎯',
      suggestions: ['Покажи прогресс 📊', 'Разбери ошибки 🧠', 'Мотивируй меня 🔥'],
    };
  }

  const optionsText = question.options && question.options.length > 0
    ? question.options.map((o, i) => `${i + 1}) ${o}`).join('; ')
    : 'ответь текстом';

  const template = pickRandom(TEMPLATES.task);
  const text = template
    .replace(/{topic}/g, question.topic)
    .replace(/{questionText}/g, question.text)
    .replace(/{options}/g, optionsText);

  return {
    text: `${text}\n[ACTION:startTrainer("${question.taskNumber}")]`,
    actions: [{ type: 'startTrainer', payload: question.taskNumber }],
    suggestions: ['Покажи правило по этому заданию 📖', 'Дай ещё задание 📝', 'Разбери ошибки 🧠'],
  };
}

function buildScheduleResponse(
  _context: ChatContext,
  progressState?: LocalAIRequest['progressState']
): LocalAIResponse {
  if (!progressState) {
    return {
      text: 'Я не могу составить расписание без данных о прогрессе 😅 Попробуй сначала пройти несколько уроков! 📚',
      suggestions: ['Покажи прогресс 📊', 'Дай задание 📝', 'Мотивируй меня 🔥'],
    };
  }

  const state = {
    taskStats: progressState.taskStats,
    lessonProgress: progressState.lessonProgress,
    userStats: progressState.userStats,
    wrongAnswers: progressState.wrongAnswers,
    examResults: progressState.examResults,
  };

  const schedule = generateWeeklySchedule(state);
  const summary = exportScheduleToText(schedule).slice(0, 500) + (exportScheduleToText(schedule).length > 500 ? '...' : '');
  const nextItem = getNextScheduleItem(schedule);

  const template = pickRandom(TEMPLATES.schedule);
  const text = template
    .replace(/{scheduleSummary}/g, summary)
    .replace(/{nextItem}/g, nextItem);

  return {
    text,
    actions: [{ type: 'generateSchedule', payload: '' }],
    suggestions: ['Дай задание на сегодня 📝', 'Покажи прогресс 📊', 'Разбери ошибки 🧠'],
  };
}

function buildMotivationResponse(
  context: ChatContext,
  progressState?: LocalAIRequest['progressState']
): LocalAIResponse {
  const { userStats, predictedScore, streak, activeProfile } = context;
  const name = activeProfile?.name || userStats.name || 'ученик';
  const completed = progressState ? getCompletedLessons(progressState.lessonProgress) : 0;
  const total = getTotalLessons();
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const accuracy = progressState ? calculateAccuracy(progressState.answerHistory) : 0;
  const weakTaskName = context.weakTopics.length > 0
    ? `${getSubskillName(context.weakTopics[0].errorType)}`
    : 'общие задания';

  const template = pickRandom(TEMPLATES.motivation);
  const text = template
    .replace(/{name}/g, name)
    .replace(/{completed}/g, String(completed))
    .replace(/{percent}/g, String(percent))
    .replace(/{streak}/g, String(streak || 0))
    .replace(/{xp}/g, String(userStats.xp || 0))
    .replace(/{level}/g, String(userStats.level || 1))
    .replace(/{predictedScore}/g, String(predictedScore?.predictedSecondary ?? 0))
    .replace(/{accuracy}/g, String(accuracy))
    .replace(/{taskName}/g, weakTaskName);

  return {
    text,
    suggestions: ['Дай задание 💪', 'Покажи прогресс 📊', 'Составь расписание 📅'],
  };
}

function buildRuleResponse(message: string): LocalAIResponse {
  const taskNum = extractTaskNumber(message);
  if (!taskNum) {
    const available = getAvailableTaskNumbers().join(', ');
    return {
      text: `О каком задании идёт речь? 🤔 Я могу объяснить задания ${available}. Напиши: «Объясни задание 5» или «Правила по заданию 9». 📖`,
      suggestions: ['Объясни задание 5', 'Объясни задание 9', 'Объясни задание 16'],
    };
  }

  const knowledge = getTaskKnowledge(taskNum);
  if (!knowledge) {
    return {
      text: `Пока у меня нет правил для задания ${taskNum} 😅 Но я знаю задания ${getAvailableTaskNumbers().join(', ')}. Попробуй другое! 📚`,
      suggestions: ['Объясни задание 5', 'Объясни задание 9', 'Объясни задание 16'],
    };
  }

  const rules = knowledge.rules.slice(0, 4).join(' ');
  const example = knowledge.examples[0];
  const exampleText = example
    ? `Правильно: «${example.correct}». Неправильно: «${example.incorrect}». Почему: ${example.explanation}`
    : '';

  const template = pickRandom(TEMPLATES.rule);
  const text = template
    .replace(/{taskNumber}/g, taskNum)
    .replace(/{rules}/g, rules)
    .replace(/{example}/g, exampleText);

  const suggestions = knowledge.tips.slice(0, 2).map(t => `Совет: ${t}`);

  return {
    text,
    suggestions: suggestions.length > 0 ? suggestions : ['Дай задание на эту тему 📝', 'Покажи ошибки по заданию ' + taskNum + ' 🧠'],
  };
}

function buildExamInfoResponse(
  context: ChatContext,
  progressState?: LocalAIRequest['progressState']
): LocalAIResponse {
  const { predictedScore } = context;
  const days = progressState?.examDate
    ? Math.max(0, Math.ceil((new Date(progressState.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 180;
  const predicted = predictedScore?.predictedSecondary ?? 0;
  const weakTasks = predictedScore?.breakdown
    ? getWeakTasks(predictedScore.breakdown, 3).map(t => `задание ${t.taskNumber} (недобор ${t.gap.toFixed(1)} балл)`).join(', ')
    : 'пока данных мало';

  const template = pickRandom(TEMPLATES.exam_info);
  const text = template
    .replace(/{days}/g, String(days))
    .replace(/{predictedScore}/g, String(predicted))
    .replace(/{weakTasks}/g, weakTasks);

  return {
    text,
    suggestions: ['Составь расписание 📅', 'Дай задание на слабую тему 💪', 'Мотивируй меня 🔥'],
  };
}

function buildGreetingResponse(context: ChatContext): LocalAIResponse {
  const { userStats, activeProfile } = context;
  const name = activeProfile?.name || userStats.name || 'ученик';
  const level = userStats.level || 1;
  const xp = userStats.xp || 0;

  const template = pickRandom(TEMPLATES.greeting);
  const text = template
    .replace(/{name}/g, name)
    .replace(/{level}/g, String(level))
    .replace(/{xp}/g, String(xp));

  return {
    text,
    suggestions: ['Покажи прогресс 📊', 'Дай задание 📝', 'Разбери ошибки 🧠'],
  };
}

function buildUnknownResponse(): LocalAIResponse {
  const template = pickRandom(TEMPLATES.unknown);
  return {
    text: template,
    suggestions: ['Разбери мои ошибки 🧠', 'Дай задание на слабую тему 💪', 'Как набрать 80+? 🎯', 'Мотивируй меня 🔥'],
  };
}

// ─── Main Entry ───

export function processLocalMessage(request: LocalAIRequest): LocalAIResponse {
  const { message, context, progressState } = request;
  const intent = analyzeIntent(message);

  switch (intent) {
    case 'progress':
      return buildProgressResponse(context, progressState);
    case 'errors':
      return buildErrorsResponse(context, progressState);
    case 'task':
      return buildTaskResponse(context, progressState);
    case 'schedule':
      return buildScheduleResponse(context, progressState);
    case 'motivation':
      return buildMotivationResponse(context, progressState);
    case 'rule':
      return buildRuleResponse(message);
    case 'exam_info':
      return buildExamInfoResponse(context, progressState);
    case 'greeting':
      return buildGreetingResponse(context);
    case 'unknown':
    default:
      return buildUnknownResponse();
  }
}

/**
 * Converts a LocalAIResponse to a ChatMessage for compatibility with the chat store.
 */
export function localAIResponseToChatMessage(response: LocalAIResponse): ChatMessage {
  let content = response.text;
  if (response.actions && response.actions.length > 0) {
    const actionStrings = response.actions.map(a => `[ACTION:${a.type}("${String(a.payload)}")]`);
    content += '\n' + actionStrings.join('\n');
  }
  return {
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    role: 'assistant',
    content: content.trim(),
    timestamp: new Date().toISOString(),
  };
}

/**
 * Suggested prompts for local AI mode.
 */
export function getLocalSuggestedPrompts(): string[] {
  return [
    'Покажи мой прогресс 📊',
    'Разбери мои ошибки 🧠',
    'Дай задание на слабую тему 💪',
    'Мотивируй меня 🔥',
  ];
}

export function getLocalResponseMode(apiKey: string | null, useLocalAI: boolean): 'local' | 'api' {
  if (!apiKey) return 'local';
  return useLocalAI ? 'local' : 'api';
}
