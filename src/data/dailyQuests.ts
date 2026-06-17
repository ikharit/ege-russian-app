export interface DailyQuest {
  id: string
  title: string
  description: string
  target: number
  rewardXP: number
  type: 'questions' | 'lessons' | 'perfect' | 'time' | 'streak'
}

export const dailyQuests: DailyQuest[] = [
  { id: 'quest-questions-5', title: 'Решатель', description: 'Ответь правильно на 5 вопросов', target: 5, rewardXP: 20, type: 'questions' },
  { id: 'quest-lessons-1', title: 'Ученик дня', description: 'Пройди 1 урок', target: 1, rewardXP: 30, type: 'lessons' },
  { id: 'quest-perfect-1', title: 'Безупречный', description: 'Пройди урок на 100%', target: 1, rewardXP: 50, type: 'perfect' },
  { id: 'quest-time-10', title: 'Марафонец', description: 'Занимайся 10 минут', target: 10, rewardXP: 25, type: 'time' },
  { id: 'quest-streak-3', title: 'Огненный', description: 'Поддержи страйк 3 дня', target: 3, rewardXP: 40, type: 'streak' },
]
