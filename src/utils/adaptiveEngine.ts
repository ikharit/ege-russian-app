import { Course, Lesson, LessonProgress, Section, UserStats } from '../types';

export type RecommendationReason =
  | 'weak_topic'
  | 'review_needed'
  | 'next_in_sequence'
  | 'streak_saver'
  | 'exam_prep'
  | 'variety';

export interface Recommendation {
  lessonId: string;
  lessonTitle: string;
  sectionTitle: string;
  sectionColor: string;
  reason: RecommendationReason;
  priority: number;
  estimatedTime: number;
  description: string;
}

export interface AdaptiveEngineState {
  userStats: UserStats;
  lessonProgress: Record<string, LessonProgress>;
  taskStats: Record<string, { total: number; correct: number; wrong: number; lastAttemptAt: string }>;
  course: Course;
  examDate?: string;
}

const DEFAULT_EGE_DATE = '2026-05-26';

const DIFFICULTY_MAP: Record<string, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

export function getTaskNumberFromLessonId(lessonId: string): string | null {
  const match = lessonId.match(/(?:lesson-task|q)(\d+)/);
  return match ? match[1] : null;
}

function getDaysToExam(examDateStr?: string): number | null {
  const examDate = new Date(examDateStr || DEFAULT_EGE_DATE);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  examDate.setHours(0, 0, 0, 0);
  const diff = Math.floor((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff >= 0 ? diff : null;
}

function getDaysSinceCompleted(completedAt?: string): number | null {
  if (!completedAt) return null;
  const completed = new Date(completedAt);
  const today = new Date();
  return Math.floor((today.getTime() - completed.getTime()) / (1000 * 60 * 60 * 24));
}

function getLessonDifficulty(lesson: Lesson): number {
  if (lesson.questions.length === 0) return 1;
  const sum = lesson.questions.reduce((acc, q) => acc + (DIFFICULTY_MAP[q.difficulty] ?? 2), 0);
  return sum / lesson.questions.length;
}

function isShortLesson(lesson: Lesson): boolean {
  return lesson.questions.length <= 8 && getLessonDifficulty(lesson) <= 1.5;
}

export function getEstimatedTime(lesson: Lesson): number {
  const base = 2;
  const perQuestion = 0.4;
  return Math.round(base + lesson.questions.length * perQuestion);
}

function getRecentCompletedLessons(
  lessonProgress: Record<string, LessonProgress>,
  days: number = 7
): { lessonId: string; taskNumber: string | null }[] {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);

  return Object.values(lessonProgress)
    .filter((p): p is LessonProgress & { completedAt: string } =>
      p.status === 'completed' && !!p.completedAt
    )
    .filter(p => new Date(p.completedAt) >= cutoff)
    .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
    .map(p => ({
      lessonId: p.lessonId,
      taskNumber: getTaskNumberFromLessonId(p.lessonId),
    }));
}

function getTaskAccuracy(
  taskNumber: string,
  taskStats: Record<string, { total: number; correct: number; wrong: number; lastAttemptAt: string }>
): number | null {
  const stat = taskStats[taskNumber];
  if (!stat || stat.total === 0) return null;
  return Math.round((stat.correct / stat.total) * 100);
}

function isLessonAvailable(
  lesson: Lesson,
  lessonProgress: Record<string, LessonProgress>
): boolean {
  // If already completed, it's available for review
  if (lessonProgress[lesson.id]?.status === 'completed') return true;
  // Check prerequisites
  if (lesson.prerequisites.length === 0) return true;
  return lesson.prerequisites.every(prId => lessonProgress[prId]?.status === 'completed');
}

interface ScoredLesson {
  lesson: Lesson;
  section: Section;
  priority: number;
  reason: RecommendationReason;
  description: string;
}

function scoreLesson(
  lesson: Lesson,
  section: Section,
  state: AdaptiveEngineState
): ScoredLesson | null {
  const progress = state.lessonProgress[lesson.id];
  const daysSinceCompleted = getDaysSinceCompleted(progress?.completedAt);
  const taskNumber = getTaskNumberFromLessonId(lesson.id);
  const accuracy = taskNumber ? getTaskAccuracy(taskNumber, state.taskStats) : null;
  const daysToExam = getDaysToExam(state.examDate);
  const available = isLessonAvailable(lesson, state.lessonProgress);

  // Not available at all
  if (!available) return null;

  // 1. Forgetting curve: completed > 14 days ago
  if (progress?.status === 'completed' && daysSinceCompleted !== null && daysSinceCompleted > 14) {
    return {
      lesson,
      section,
      priority: Math.min(100, 55 + (daysSinceCompleted - 14) * 2),
      reason: 'review_needed',
      description: `Урок пройден ${daysSinceCompleted} дней назад. Пора повторить, чтобы закрепить материал.`,
    };
  }

  // For new lessons that are not completed
  if (progress?.status === 'completed') return null;

  // 2. Weak topic (accuracy < 60%)
  if (accuracy !== null && accuracy < 60) {
    return {
      lesson,
      section,
      priority: 95,
      reason: 'weak_topic',
      description: `Точность по заданию ${taskNumber} — ${accuracy}%. Нужно подтянуть!`,
    };
  }

  // 3. Exam proximity (< 30 days) and weak topic (< 80%)
  if (daysToExam !== null && daysToExam < 30) {
    if (accuracy !== null && accuracy < 80) {
      return {
        lesson,
        section,
        priority: 92,
        reason: 'exam_prep',
        description: `До экзамена ${daysToExam} дней. Фокус на слабых темах!`,
      };
    }
  }

  // 4. Streak motivation: streak < 3, short lesson
  if (state.userStats.streak < 3 && isShortLesson(lesson)) {
    return {
      lesson,
      section,
      priority: 75,
      reason: 'streak_saver',
      description: `Короткий урок на ${getEstimatedTime(lesson)} мин. Быстро выполни и сохрани серию!`,
    };
  }

  // 5. Next in sequence (default)
  let priority = 45;
  if (daysToExam !== null && daysToExam > 60) {
    priority = 55; // Focus on basics when exam is far
  }
  // Boost if user has some accuracy data but not terrible
  if (accuracy !== null && accuracy >= 60 && accuracy < 85) {
    priority += 5;
  }

  return {
    lesson,
    section,
    priority,
    reason: 'next_in_sequence',
    description: 'Следующий урок в программе. Двигайся вперёд!',
  };
}

export function getSmartRecommendations(
  state: AdaptiveEngineState,
  limit: number = 3
): Recommendation[] {
  const allLessons: { lesson: Lesson; section: Section }[] = [];
  for (const section of state.course.sections) {
    for (const lesson of section.lessons) {
      allLessons.push({ lesson, section });
    }
  }

  const recentCompleted = getRecentCompletedLessons(state.lessonProgress, 7);
  const recentTaskTypes = recentCompleted
    .map(r => r.taskNumber)
    .filter((t): t is string => t !== null);

  // Score all lessons
  const scored: ScoredLesson[] = [];
  for (const { lesson, section } of allLessons) {
    const result = scoreLesson(lesson, section, state);
    if (result) {
      scored.push(result);
    }
  }

  // Apply post-processing penalties/bonuses
  const processed: Recommendation[] = [];
  for (const s of scored) {
    let priority = s.priority;
    const taskNumber = getTaskNumberFromLessonId(s.lesson.id);

    // Variety penalty: same task type recently completed
    if (taskNumber && recentTaskTypes.includes(taskNumber)) {
      if (s.reason === 'next_in_sequence') {
        priority -= 15;
      } else if (s.reason === 'weak_topic') {
        // Keep weak topics high even with variety penalty, but slightly reduce
        priority -= 5;
      }
    }

    // Learning curve: if recent lessons were hard, deprioritize hard lessons
    const lessonDiff = getLessonDifficulty(s.lesson);
    if (recentCompleted.length >= 2 && lessonDiff >= 2.5) {
      priority -= 10;
    }
    // Conversely, if recent lessons were easy, boost medium/hard slightly for variety
    if (recentCompleted.length >= 2 && lessonDiff < 1.5) {
      priority += 3;
    }

    // Streak saver: if streak is high, reduce priority of streak savers
    if (s.reason === 'streak_saver' && state.userStats.streak >= 5) {
      priority -= 20;
    }

    // Boost variety reason for completed lessons not reviewed in > 7 days
    if (s.reason === 'review_needed') {
      // Already high priority, don't reduce
    }

    processed.push({
      lessonId: s.lesson.id,
      lessonTitle: s.lesson.title,
      sectionTitle: s.section.title,
      sectionColor: s.section.color,
      reason: s.reason,
      priority: Math.max(0, Math.min(100, priority)),
      estimatedTime: getEstimatedTime(s.lesson),
      description: s.description,
    });
  }

  // Sort by priority descending
  processed.sort((a, b) => b.priority - a.priority);

  // Deduplicate by task type to ensure variety, but keep strong recommendations
  const seenTaskTypes = new Set<string>();
  const deduped: Recommendation[] = [];
  for (const rec of processed) {
    const taskNum = getTaskNumberFromLessonId(rec.lessonId);
    if (taskNum) {
      if (seenTaskTypes.has(taskNum)) {
        // Skip duplicate task types with low priority, unless it's a strong recommendation
        if (rec.priority < 70) continue;
      }
      seenTaskTypes.add(taskNum);
    }
    deduped.push(rec);
    if (deduped.length >= limit * 2) break;
  }

  const result = deduped.slice(0, limit);

  // If still empty after dedup, fall back to raw sorted list
  if (result.length === 0 && processed.length > 0) {
    return processed.slice(0, limit);
  }

  return result;
}

export interface FocusAreaResult {
  sectionTitle: string;
  sectionColor: string;
  completed: number;
  total: number;
  topLessonId: string | null;
  topLessonTitle: string | null;
}

export function getFocusArea(state: AdaptiveEngineState): FocusAreaResult {
  const recommendations = getSmartRecommendations(state, 1);
  if (recommendations.length === 0) {
    // All done — calculate overall progress
    let totalCompleted = 0;
    let totalLessons = 0;
    for (const section of state.course.sections) {
      totalLessons += section.lessons.length;
      totalCompleted += section.lessons.filter(
        l => state.lessonProgress[l.id]?.status === 'completed'
      ).length;
    }
    return {
      sectionTitle: 'Все разделы',
      sectionColor: '#58cc02',
      completed: totalCompleted,
      total: totalLessons,
      topLessonId: null,
      topLessonTitle: null,
    };
  }

  const topRec = recommendations[0];
  const section = state.course.sections.find(s => s.title === topRec.sectionTitle);

  if (!section) {
    return {
      sectionTitle: topRec.sectionTitle,
      sectionColor: topRec.sectionColor,
      completed: 0,
      total: 0,
      topLessonId: topRec.lessonId,
      topLessonTitle: topRec.lessonTitle,
    };
  }

  const completed = section.lessons.filter(
    l => state.lessonProgress[l.id]?.status === 'completed'
  ).length;
  const total = section.lessons.length;

  return {
    sectionTitle: section.title,
    sectionColor: section.color,
    completed,
    total,
    topLessonId: topRec.lessonId,
    topLessonTitle: topRec.lessonTitle,
  };
}
