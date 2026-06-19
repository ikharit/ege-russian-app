import { ScheduleDay, ScheduleItem, WeeklySchedulePreferences, UserStats, LessonProgress } from '../types';
import { course } from '../data/courseData';
import { fipiVariants } from '../data/fipiVariants';
import { essayTopics } from '../data/essayData';
import { getSmartRecommendations } from './adaptiveEngine';
import type { AdaptiveEngineState } from './adaptiveEngine';

interface WeeklyScheduleInput {
  taskStats: Record<string, { total: number; correct: number; wrong: number; lastAttemptAt: string }>;
  lessonProgress: Record<string, LessonProgress>;
  userStats: UserStats;
  wrongAnswers: { reviewed: boolean; taskNumber?: string }[];
  examResults: unknown[];
}

type DayKey = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

const DAY_KEYS: DayKey[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];

const DEFAULT_AVAILABLE_TIME: Record<DayKey, number> = {
  mon: 30,
  tue: 30,
  wed: 30,
  thu: 30,
  fri: 30,
  sat: 60,
  sun: 45,
};

function getDayKey(date: Date): DayKey {
  const dayIndex = date.getDay(); // 0 = Sun, 1 = Mon...
  const mapping: DayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  return mapping[dayIndex];
}

function getNextDayKey(day: DayKey): DayKey {
  const idx = DAY_KEYS.indexOf(day);
  return DAY_KEYS[(idx + 1) % 7];
}

function addMinutesToDate(base: Date, minutes: number): Date {
  const d = new Date(base);
  d.setMinutes(d.getMinutes() + minutes);
  return d;
}

export function generateWeeklySchedule(
  state: WeeklyScheduleInput,
  preferences: WeeklySchedulePreferences = {}
): ScheduleDay[] {
  const availableTime = { ...DEFAULT_AVAILABLE_TIME, ...preferences.availableTimePerDay };
  const activeDays = preferences.activeDays || DAY_KEYS;
  const focus = preferences.focus || 'weak';

  const scheduleDays: ScheduleDay[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Track what was placed on previous day for variety
  let prevDayTypes: Set<string> = new Set();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dayKey = getDayKey(date);

    if (!activeDays.includes(dayKey)) {
      scheduleDays.push({ day: dayKey, items: [], totalTime: 0 });
      continue;
    }

    const budget = availableTime[dayKey] || 0;
    if (budget === 0) {
      scheduleDays.push({ day: dayKey, items: [], totalTime: 0 });
      continue;
    }

    const items: ScheduleItem[] = [];
    let used = 0;

    // Determine priority sources based on day and focus
    const candidates = getCandidates(state, dayKey, focus, prevDayTypes);

    for (const candidate of candidates) {
      if (used >= budget) break;
      // Ensure we don't exceed budget by more than 5 minutes
      if (used + candidate.duration > budget + 5) {
        // Try to fit a shorter version or skip
        if (used + candidate.duration > budget + 10) continue;
      }
      items.push(candidate);
      used += candidate.duration;
      prevDayTypes.add(candidate.type);
    }

    // If we have leftover time and it's not Sunday, add a review or break
    const remaining = budget - used;
    if (remaining > 10 && dayKey !== 'sun') {
      items.push({
        type: 'break',
        title: 'Перерыв',
        duration: Math.min(remaining, 10),
        reason: 'Важно отдохнуть между заданиями для лучшего усвоения',
      });
      used += Math.min(remaining, 10);
    }

    scheduleDays.push({
      day: dayKey,
      items,
      totalTime: used,
    });

    // Reset prevDayTypes for next iteration (but we pass current day's types for variety check)
    prevDayTypes = new Set(items.map(it => it.type));
  }

  return scheduleDays;
}

interface CandidateItem {
  type: ScheduleItem['type'];
  lessonId?: string;
  title: string;
  duration: number;
  reason: string;
  priority: number;
}

function getCandidates(
  state: WeeklyScheduleInput,
  dayKey: DayKey,
  focus: 'weak' | 'all' | 'exam',
  prevDayTypes: Set<string>
): CandidateItem[] {
  const candidates: CandidateItem[] = [];
  const lessonProgress = state.lessonProgress || {};
  const wrongAnswers = state.wrongAnswers || [];

  // 1. Weak topics (from adaptive engine)
  const adaptiveState = {
    userStats: state.userStats as import('../types').UserStats,
    lessonProgress: lessonProgress as Record<string, import('../types').LessonProgress>,
    taskStats: state.taskStats || {},
    course,
  } as import('./adaptiveEngine').AdaptiveEngineState;
  const recommendations = getSmartRecommendations(adaptiveState, [], 5);
  for (const rec of recommendations) {
    const duration = rec.estimatedTime || 15;
    candidates.push({
      type: 'lesson',
      lessonId: rec.lessonId,
      title: rec.lessonTitle,
      duration,
      reason: rec.description,
      priority: rec.priority,
    });
  }

  // 2. Due reviews (from wrong answers, not reviewed recently)
  const unreviewed = wrongAnswers
    .filter(w => !w.reviewed)
    .slice(0, 3);
  for (const w of unreviewed) {
    candidates.push({
      type: 'review',
      title: `Работа над ошибкой: задание ${w.taskNumber || '?'}`,
      duration: 10,
      reason: 'Вопрос, на который ты отвечал неправильно — стоит повторить',
      priority: 85,
    });
  }

  // 3. New lessons (not completed, available)
  const allLessons = course.sections.flatMap(s => s.lessons);
  for (const lesson of allLessons) {
    const prog = lessonProgress[lesson.id];
    if (!prog || prog.status === 'available' || prog.status === 'started') {
      const prereqDone = lesson.prerequisites.length === 0 || lesson.prerequisites.every(p => lessonProgress[p]?.status === 'completed');
      if (prereqDone) {
        const duration = Math.max(10, lesson.questions.length * 2);
        candidates.push({
          type: 'lesson',
          lessonId: lesson.id,
          title: lesson.title,
          duration,
          reason: 'Новый урок — расширяй знания!',
          priority: 50,
        });
      }
    }
  }

  // 4. Exam variants (Saturday focus, or exam focus)
  if (dayKey === 'sat' || focus === 'exam') {
    for (const variant of fipiVariants.slice(0, 2)) {
      candidates.push({
        type: 'exam',
        title: variant.name,
        duration: dayKey === 'sat' ? 60 : 30,
        reason: dayKey === 'sat' ? 'Суббота — отличный день для пробного варианта' : 'Тренировка в формате экзамена',
        priority: dayKey === 'sat' ? 90 : 60,
      });
    }
  }

  // 5. Essays (long essay on Saturday)
  if (dayKey === 'sat' || focus === 'all') {
    const essay = essayTopics[0];
    if (essay) {
      candidates.push({
        type: 'essay',
        title: `Сочинение: «${essay.text.slice(0, 40)}...»`,
        duration: dayKey === 'sat' ? 45 : 20,
        reason: 'Письменная часть — важный компонент ЕГЭ',
        priority: dayKey === 'sat' ? 88 : 45,
      });
    }
  }

  // 6. Sunday: light review or rest
  if (dayKey === 'sun') {
    // Reduce priority of heavy tasks, boost light review
    for (const c of candidates) {
      if (c.type === 'exam' || c.type === 'essay') {
        c.priority -= 40;
      }
    }
    candidates.push({
      type: 'break',
      title: 'Лёгкое повторение',
      duration: 15,
      reason: 'Воскресенье — отдохни, но немного повтори',
      priority: 30,
    });
  }

  // Variety penalty: don't repeat same type two days in a row unless it's high priority weak topic
  for (const c of candidates) {
    if (prevDayTypes.has(c.type) && c.priority < 80) {
      c.priority -= 15;
    }
  }

  // Sort by priority descending
  candidates.sort((a, b) => b.priority - a.priority);

  // Deduplicate by title
  const seenTitles = new Set<string>();
  const deduped: CandidateItem[] = [];
  for (const c of candidates) {
    if (seenTitles.has(c.title)) continue;
    seenTitles.add(c.title);
    deduped.push(c);
  }

  return deduped;
}

export function exportScheduleToText(schedule: ScheduleDay[]): string {
  const lines: string[] = ['📅 Расписание на неделю\n'];
  const dayNames: Record<DayKey, string> = {
    mon: 'Понедельник', tue: 'Вторник', wed: 'Среда', thu: 'Четверг',
    fri: 'Пятница', sat: 'Суббота', sun: 'Воскресенье',
  };
  for (const day of schedule) {
    lines.push(`\n${dayNames[day.day]} (${day.totalTime} мин):`);
    if (day.items.length === 0) {
      lines.push('  — выходной');
      continue;
    }
    for (const item of day.items) {
      lines.push(`  • ${item.title} (${item.duration} мин) — ${item.reason}`);
    }
  }
  return lines.join('\n');
}

export function exportScheduleToICS(schedule: ScheduleDay[]): string {
  const now = new Date();
  const uidBase = `ege-schedule-${now.getTime()}`;
  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//EGE Russian//Weekly Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dayOffset: Record<DayKey, number> = {
    mon: 0, tue: 1, wed: 2, thu: 3, fri: 4, sat: 5, sun: 6,
  };

  for (const day of schedule) {
    if (day.items.length === 0) continue;

    const offset = dayOffset[day.day];
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    // Start at 10:00 AM
    const startDate = new Date(date);
    startDate.setHours(10, 0, 0, 0);

    let current = new Date(startDate);
    for (let i = 0; i < day.items.length; i++) {
      const item = day.items[i];
      const start = new Date(current);
      const end = addMinutesToDate(current, item.duration);
      current = end;

      const fmtDate = (d: Date) =>
        d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

      lines.push('BEGIN:VEVENT');
      lines.push(`UID:${uidBase}-${day.day}-${i}@ege-russian.app`);
      lines.push(`DTSTART:${fmtDate(start)}`);
      lines.push(`DTEND:${fmtDate(end)}`);
      lines.push(`SUMMARY:${item.title}`);
      lines.push(`DESCRIPTION:${item.reason}`);
      lines.push('END:VEVENT');
    }
  }

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}
