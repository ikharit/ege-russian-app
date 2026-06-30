import { Context } from 'telegraf'

export interface BotUser {
  id: string
  name: string
  xp: number
  level: number
  streak: number
  maxStreak: number
  lastActivityDate: string
  completedLessons: string[]
  totalQuestionsAnswered: number
  totalCorrectAnswers: number
  mistakes: BotMistake[]
  settings: UserSettings
}

export interface BotMistake {
  taskNumber: string
  topic: string
  count: number
  lastDate: string
}

export interface UserSettings {
  reminderTime: string
  notifications: {
    streak: boolean
    homework: boolean
    srs: boolean
    dailyQuest: boolean
  }
  preferredTasks: string[]
  linkedAppUserId?: string
}

export interface TaskQuestion {
  id: string
  taskNumber: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export interface MotivationalTemplate {
  text: string
  icon: string
  condition: 'streak' | 'level' | 'progress' | 'random'
}

export interface GreetingTemplate {
  text: string
  icon: string
}

export interface SessionState {
  currentTaskNumber?: string
  currentQuestionIndex: number
  correctCount: number
  totalCount: number
  questions: TaskQuestion[]
}

export type BotContext = Context & {
  session?: SessionState
}

export const TASK_NAMES: Record<string, string> = {
  task1: 'Задание 1. Логико-смысловые связи',
  task2: 'Задание 2. Грамматические нормы',
  task3: 'Задание 3. Лексические нормы',
  task4: 'Задание 4. Паронимы',
  task5: 'Задание 5. Ударения',
  task6: 'Задание 6. Правописание приставок',
  task7: 'Задание 7. Правописание корней',
  task8: 'Задание 8. Правописание суффиксов',
  task9: 'Задание 9. Слитное/раздельное/дефисное написание',
  task10: 'Задание 10. Пунктуация в сложноподчинённом предложении',
  task11: 'Задание 11. Пунктуация при вводных словах',
  task12: 'Задание 12. Знаки препинания в СПП',
  task14: 'Задание 14. Сложные предложения',
  task15: 'Задание 15. Разделительный Ь/Ъ',
  task16: 'Задание 16. Стилистика',
  task17: 'Задание 17. Средства выразительности',
}
