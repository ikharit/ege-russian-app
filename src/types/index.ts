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
  activeStatus?: string
  mistakesFixed?: number
  streakFrozen?: boolean
  streakFreezeUsed?: number
  streakFreezeLastReset?: string
  currentCombo?: number
  maxCombo?: number
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  condition: string
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

export interface StudyPlan {
  examDate: string
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
