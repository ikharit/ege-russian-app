import { LessonProgress } from '../types';

export interface SRSItem {
  lessonId: string;
  interval: number; // дни до следующего повторения
  repetitions: number; // сколько раз повторяли
  easeFactor: number; // 2.5 по умолчанию, мин 1.3
  nextReview: string; // ISO дата
  lastReview: string; // ISO дата
  quality: number; // 0-5 оценка последнего ответа
}

/**
 * Преобразует процент правильных ответов в quality (0-5) для SM-2.
 */
export function scoreToQuality(score: number): number {
  if (score >= 100) return 5;
  if (score >= 80) return 4;
  if (score >= 60) return 3;
  return 2;
}

/**
 * Применяет алгоритм SM-2 (SuperMemo-2) для расчёта следующего повторения.
 *
 * Формулы:
 * - Если quality < 3: repetitions = 0, interval = 1
 * - Если quality >= 3:
 *   - repetitions = 1 → interval = 1
 *   - repetitions = 2 → interval = 6
 *   - repetitions > 2 → interval = round(interval * easeFactor)
 *   - easeFactor = max(1.3, easeFactor + 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
 */
export function calculateNextReview(item: SRSItem, quality: number): SRSItem {
  const q = Math.max(0, Math.min(5, quality));

  let newInterval: number;
  let newRepetitions: number;
  let newEaseFactor: number;

  if (q < 3) {
    // Неудачный ответ — сброс, но сохраняем easeFactor с минимальным штрафом
    newRepetitions = 0;
    newInterval = 1;
    newEaseFactor = Math.max(1.3, item.easeFactor - 0.2);
  } else {
    // Успешный ответ
    newRepetitions = item.repetitions + 1;
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(item.interval * item.easeFactor);
    }

    // Точная формула SM-2 для ease factor
    newEaseFactor =
      item.easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
    newEaseFactor = Math.max(1.3, newEaseFactor);
  }

  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(now.getDate() + newInterval);

  return {
    lessonId: item.lessonId,
    interval: newInterval,
    repetitions: newRepetitions,
    easeFactor: Number(newEaseFactor.toFixed(2)),
    nextReview: nextReview.toISOString(),
    lastReview: now.toISOString(),
    quality: q,
  };
}

/**
 * Создаёт начальные SRS items из существующего прогресса.
 * Не перезаписывает уже существующие SRS items.
 */
export function initSRS(
  lessonProgress: Record<string, LessonProgress>,
  existingSRS: Record<string, SRSItem> = {}
): Record<string, SRSItem> {
  const srsData: Record<string, SRSItem> = { ...existingSRS };
  const now = new Date().toISOString();

  for (const [lessonId, progress] of Object.entries(lessonProgress)) {
    if (progress.status === 'completed' && !srsData[lessonId]) {
      const completedAt = progress.completedAt || now;
      const nextReview = new Date(completedAt);
      nextReview.setDate(nextReview.getDate() + 1);

      srsData[lessonId] = {
        lessonId,
        interval: 1,
        repetitions: 1,
        easeFactor: 2.5,
        nextReview: nextReview.toISOString(),
        lastReview: completedAt,
        quality: 4,
      };
    }
  }

  return srsData;
}

/**
 * Возвращает уроки, где nextReview <= сегодня (включая просроченные).
 */
export function getDueReviews(
  srsData: Record<string, SRSItem>
): SRSItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Object.values(srsData).filter((item) => {
    const nextReview = new Date(item.nextReview);
    nextReview.setHours(0, 0, 0, 0);
    return nextReview <= today;
  });
}

/**
 * Возвращает срочность повторения (0-100+).
 * - due today → 100
 * - due tomorrow → 80
 * - overdue → 100 + дни просрочки
 * - в будущем → падает от 80
 */
export function getReviewPriority(item: SRSItem): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextReview = new Date(item.nextReview);
  nextReview.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor(
    (today.getTime() - nextReview.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff >= 0) {
    // Due today или просрочено
    return Math.min(100, 100 + daysDiff);
  } else if (daysDiff === -1) {
    // Due tomorrow
    return 80;
  } else {
    // Due в будущем
    return Math.max(0, 80 + daysDiff);
  }
}

/**
 * Форматирует дату следующего повторения для отображения.
 */
export function formatNextReview(item: SRSItem): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const nextReview = new Date(item.nextReview);
  nextReview.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor(
    (today.getTime() - nextReview.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysDiff === 0) return 'Сегодня';
  if (daysDiff === 1) return 'Вчера';
  if (daysDiff > 1) return `Просрочено на ${daysDiff} дн.`;
  if (daysDiff === -1) return 'Завтра';
  return `Через ${Math.abs(daysDiff)} дн.`;
}

/**
 * Форматирует информацию об интервале для отображения.
 */
export function formatInterval(item: SRSItem): string {
  const repCount = item.repetitions;
  if (repCount === 0) return 'Повторение сброшено';
  return `Повторение #${repCount}, через ${item.interval} дн.`;
}

/**
 * Рассчитывает retention rate: какой % уроков с SRS имеют repetitions >= 2
 * (то есть прошли хотя бы один цикл повторения).
 */
export function calculateRetentionRate(
  srsData: Record<string, SRSItem>
): number {
  const items = Object.values(srsData);
  if (items.length === 0) return 0;
  const retained = items.filter((item) => item.repetitions >= 2).length;
  return Math.round((retained / items.length) * 100);
}

/**
 * Возвращает уроки, которые due на этой неделе (сегодня + 7 дней).
 */
export function getDueThisWeek(
  srsData: Record<string, SRSItem>
): SRSItem[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekLater = new Date(today);
  weekLater.setDate(weekLater.getDate() + 7);

  return Object.values(srsData).filter((item) => {
    const nextReview = new Date(item.nextReview);
    nextReview.setHours(0, 0, 0, 0);
    return nextReview >= today && nextReview <= weekLater;
  });
}

/**
 * Возвращает количество просроченных уроков.
 */
export function getOverdueCount(srsData: Record<string, SRSItem>): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Object.values(srsData).filter((item) => {
    const nextReview = new Date(item.nextReview);
    nextReview.setHours(0, 0, 0, 0);
    return nextReview < today;
  }).length;
}
