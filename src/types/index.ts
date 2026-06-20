export interface WrongAnswer {
  questionId: string
  text: string
  options?: string[]
  correctAnswer: string[]
  userAnswer: string[]
  explanation: string
  taskNumber?: string
  lessonId?: string
  timestamp: string
  reviewed: boolean
  attempts: number
}

export interface Question {
  id: string
  type: 'single' | 'multiple' | 'text' | 'ege-multiple'
  text: string
  options?: string[]
  correctAnswer: string[]
  explanation: string
  theory?: string
  difficulty: 'easy' | 'medium' | 'hard'
  xpReward: number
  atoms?: string[]        // ← atom IDs this question tests (e.g. ['prefix_pre_pri', 'pre_pri_dictionary'])
  irtDifficulty?: number  // IRT calibrated difficulty (-3 to +3)
  errorType?: string        // Error pattern tag for analysis
}

export interface UserAtomProgress {
  atomId: string
  totalAttempts: number
  correctCount: number
  accuracy: number        // 0–100
  lastAttemptAt: string   // ISO date
  masteryLevel: 'new' | 'learning' | 'review' | 'mastered'
}

export interface Lesson {
  id: string
  sectionId: string
  title: string
  type: 'theory' | 'practice' | 'test'
  description: string
  theory?: string
  questions: Question[]
  xpReward: number
  prerequisites: string[]
}

export interface LessonGroup {
  id: string
  title: string
  subtitle?: string
  lessons: Lesson[]
}

export interface Section {
  id: string
  courseId: string
  title: string
  subtitle: string
  order: number
  icon: string
  color: string
  lessons: Lesson[]
  groups?: LessonGroup[]
}

export interface Course {
  id: string
  title: string
  description: string
  sections: Section[]
}

export interface LessonProgress {
  lessonId: string
  status: 'locked' | 'available' | 'started' | 'completed'
  score: number
  bestScore: number
  attempts: number
  xpEarned: number
  completedAt?: string
}

export interface UserStats {
  xp: number
  level: number
  streak: number
  maxStreak: number
  lastActivityDate: string
  hearts: number
  maxHearts: number
  achievements: string[]
  name: string
  lastHeartRestore?: string
  infiniteHearts?: boolean
  totalLessonTimeMinutes?: number
  totalQuestionsAnswered?: number
  totalHeartsLost?: number
  weeklyXP?: number
  league?: string
  activeStatus?: string
  mistakesFixed?: number
  streakFrozen?: boolean
  streakFreezeUsed?: number
  streakFreezeLastReset?: string
  currentCombo?: number
  maxCombo?: number
  playerProfile?: PlayerProfile
  emotionalState?: EmotionalState
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: string
}

export type PlayerType = 'achiever' | 'explorer' | 'socializer' | 'killer'

export interface PlayerProfile {
  type: PlayerType
  scores: Record<PlayerType, number>
  detectedAt: string
  source: 'quiz' | 'behavior'
}

export interface EmotionalState {
  recentAccuracy: number
  sessionDuration: number
  errorsInRow: number
  successesInRow: number
  lastVisit: string
  lastExamDate?: string
  lastStreakBeforeBreak?: number
  newLevelReached?: boolean
  previousLevel?: number
  overdueSRSLessons?: number
  comboAtStart?: number
}

export interface MotivationalMessage {
  text: string
  tone: 'encouraging' | 'celebrating' | 'calming' | 'challenging'
  icon: string
}

export type StudyTaskType = 'lesson' | 'trainer' | 'review' | 'mock' | 'rest'

export interface StudyTask {
  id: string
  date: string // ISO YYYY-MM-DD
  type: StudyTaskType
  title: string
  description: string
  targetId?: string // lesson id or trainer path
  duration: number // minutes
  completed: boolean
}

export interface EssayProgress {
  topicId: string
  status: 'not_started' | 'draft' | 'completed'
  draftText: string
  savedAt: string
  selfCheck?: {
    k1: number
    k2: number
    k3: number
    k4: number
  }
}

export interface StudyPlan {
  examDate: string
  targetScore: number // desired exam score (0-100)
  tasks: StudyTask[]
  generatedAt: string
}

export interface EssayTopic {
  id: string
  number: number
  text: string
  author: string
  task: string
  difficulty: 'easy' | 'medium' | 'hard'
  hints: string[]
  keyPoints: string[]
}

export interface ScheduleDay {
  day: 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';
  items: ScheduleItem[];
  totalTime: number; // минуты
}

export interface ScheduleItem {
  type: 'lesson' | 'review' | 'exam' | 'essay' | 'break';
  lessonId?: string;
  title: string;
  duration: number; // минуты
  reason: string; // почему это в расписании
}

export interface PredictiveScore {
  predictedPrimary: number; // первичный балл (0-58)
  predictedSecondary: number; // тестовый балл (0-100)
  confidence: number; // 0-1, насколько уверены (растёт с данными)
  breakdown: Record<number, number>; // taskNumber -> predicted score
  neededForThreshold: number; // сколько XP/уроков нужно до 36 баллов (минимум)
  neededForGood: number; // до 60 баллов
  neededForExcellent: number; // до 80 баллов
  timeToExam: number; // дней до экзамена (default: 180)
  recommendedDaily: number; // минут в день для достижения цели
}

export interface WeeklySchedulePreferences {
  availableTimePerDay?: Partial<Record<'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun', number>>;
  activeDays?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
  focus?: 'weak' | 'all' | 'exam';
}


// ─── IRT & Error Pattern Analysis Types ───

export interface AnswerHistory {
  questionId: string
  taskNumber: string
  correct: boolean
  errorType?: string
  timestamp: string
  timeSpent: number // milliseconds
}

export interface ErrorPattern {
  taskNumber: number
  errorType: string
  frequency: number
  lastOccurred: string
  confidence: number
}

export interface WeakSubskill {
  taskNumber: number
  subskill: string
  accuracy: number
}

export interface ErrorAnalysis {
  patterns: ErrorPattern[]
  weakSubskills: WeakSubskill[]
  recommendations: string[]
}
