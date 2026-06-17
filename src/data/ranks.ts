export interface Rank {
  id: string
  name: string
  emoji: string
  minLevel: number
  maxLevel: number
  stripeCount: number
  color: string
  description: string
}

export const ranks: Rank[] = [
  { id: 'recruit', name: 'Рекрут', emoji: '📖', minLevel: 1, maxLevel: 2, stripeCount: 1, color: '#8B7355', description: 'Начало пути' },
  { id: 'soldier', name: 'Солдат', emoji: '📝', minLevel: 3, maxLevel: 4, stripeCount: 2, color: '#6B8E23', description: 'Первые шаги' },
  { id: 'corporal', name: 'Ефрейтор', emoji: '📚', minLevel: 5, maxLevel: 6, stripeCount: 3, color: '#4682B4', description: 'Уверенный старт' },
  { id: 'sergeant', name: 'Сержант', emoji: '🎯', minLevel: 7, maxLevel: 9, stripeCount: 1, color: '#DAA520', description: 'Опытный боец' },
  { id: 'staff-sergeant', name: 'Старший сержант', emoji: '⭐', minLevel: 10, maxLevel: 12, stripeCount: 2, color: '#FF8C00', description: 'Командир отделения' },
  { id: 'warrant', name: 'Прапорщик', emoji: '⭐⭐', minLevel: 13, maxLevel: 15, stripeCount: 3, color: '#CD853F', description: 'Мастер своего дела' },
  { id: 'lieutenant', name: 'Лейтенант', emoji: '💎', minLevel: 16, maxLevel: 18, stripeCount: 1, color: '#4169E1', description: 'Молодой офицер' },
  { id: 'captain', name: 'Капитан', emoji: '💎💎', minLevel: 19, maxLevel: 21, stripeCount: 2, color: '#2E5090', description: 'Опытный командир' },
  { id: 'major', name: 'Майор', emoji: '🦅', minLevel: 22, maxLevel: 24, stripeCount: 3, color: '#800080', description: 'Стратег' },
  { id: 'colonel', name: 'Полковник', emoji: '👑', minLevel: 25, maxLevel: 29, stripeCount: 1, color: '#C41E3A', description: 'Высшее командование' },
  { id: 'general', name: 'Генерал', emoji: '👑✨', minLevel: 30, maxLevel: 999, stripeCount: 2, color: '#FFD700', description: 'Легенда' },
]

export function getRankByLevel(level: number): Rank {
  return ranks.find(r => level >= r.minLevel && level <= r.maxLevel) || ranks[0]
}

export function getNextRank(level: number): Rank | null {
  const current = getRankByLevel(level)
  const currentIdx = ranks.indexOf(current)
  return ranks[currentIdx + 1] || null
}

export function getXPForLevel(level: number): number {
  return (level - 1) * 100
}

export function getXPToNextLevel(currentXP: number): { current: number; needed: number; nextLevel: number } {
  const currentLevel = Math.floor(currentXP / 100) + 1
  const nextLevelXP = currentLevel * 100
  const currentInLevel = currentXP - getXPForLevel(currentLevel)
  const needed = nextLevelXP - currentXP
  return { current: currentInLevel, needed, nextLevel: currentLevel + 1 }
}
