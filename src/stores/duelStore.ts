import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface DuelQuestion {
  id: string
  text: string
  options?: string[]
  correctAnswer: string[]
  explanation: string
  taskNumber: string
  atoms?: string[]
}

export interface DuelPlayer {
  profileId: string
  name: string
  emoji: string
  answers: { questionId: string; correct: boolean; timeMs: number }[]
  completedAt?: string
  score: number
  accuracy: number
  totalTimeMs: number
}

export interface Duel {
  id: string
  code: string
  creatorName: string
  creatorEmoji: string
  status: 'waiting' | 'active' | 'completed'
  questions: DuelQuestion[]
  players: DuelPlayer[]
  createdAt: string
  expiresAt: string // 24h from creation
}

interface DuelState {
  duels: Record<string, Duel>
  activeDuelId: string | null

  createDuel: (creatorName: string, creatorEmoji: string, questions: DuelQuestion[]) => { duelId: string; code: string }
  joinDuel: (code: string, player: { profileId: string; name: string; emoji: string }) => Duel | null
  submitAnswers: (duelId: string, playerId: string, answers: { questionId: string; correct: boolean; timeMs: number }[]) => void
  getDuel: (duelId: string) => Duel | undefined
  getDuelByCode: (code: string) => Duel | undefined
  getActiveDuel: () => Duel | undefined
  leaveDuel: () => void
  cleanupExpired: () => void
}

function generateDuelCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

function generateDuelId(): string {
  return 'duel_' + Date.now() + '_' + Math.random().toString(36).slice(2, 8)
}

export const useDuelStore = create<DuelState>()(
  persist(
    (set, get) => ({
      duels: {},
      activeDuelId: null,

      createDuel: (creatorName, creatorEmoji, questions) => {
        let code = generateDuelCode()
        let attempts = 0
        while (Object.values(get().duels).some(d => d.code === code) && attempts < 100) {
          code = generateDuelCode()
          attempts++
        }
        const duelId = generateDuelId()
        const now = new Date()
        const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()

        const newDuel: Duel = {
          id: duelId,
          code,
          creatorName,
          creatorEmoji,
          status: 'waiting',
          questions,
          players: [],
          createdAt: now.toISOString(),
          expiresAt,
        }

        set((s) => ({
          duels: { ...s.duels, [duelId]: newDuel },
          activeDuelId: duelId,
        }))

        return { duelId, code }
      },

      joinDuel: (code, player) => {
        const duel = Object.values(get().duels).find(d => d.code === code && d.status === 'waiting')
        if (!duel) return null
        if (duel.players.length >= 1) return null // Max 1 opponent (2 players total)
        if (duel.players.some(p => p.profileId === player.profileId)) return null // Already joined

        const newPlayer: DuelPlayer = {
          profileId: player.profileId,
          name: player.name,
          emoji: player.emoji,
          answers: [],
          score: 0,
          accuracy: 0,
          totalTimeMs: 0,
        }

        set((s) => ({
          duels: {
            ...s.duels,
            [duel.id]: {
              ...duel,
              players: [...duel.players, newPlayer],
              status: 'active' as const,
            },
          },
          activeDuelId: duel.id,
        }))

        return get().duels[duel.id]
      },

      submitAnswers: (duelId, playerId, answers) => {
        const duel = get().duels[duelId]
        if (!duel) return

        const correctCount = answers.filter(a => a.correct).length
        const accuracy = answers.length > 0 ? Math.round((correctCount / answers.length) * 100) : 0
        const totalTimeMs = answers.reduce((sum, a) => sum + a.timeMs, 0)
        const score = correctCount * 100 + Math.max(0, 500 - Math.round(totalTimeMs / 1000))

        const updatedPlayers = duel.players.map(p =>
          p.profileId === playerId
            ? {
                ...p,
                answers,
                completedAt: new Date().toISOString(),
                score,
                accuracy,
                totalTimeMs,
              }
            : p
        )

        const allCompleted = updatedPlayers.length === 2 && updatedPlayers.every(p => p.completedAt)

        set((s) => ({
          duels: {
            ...s.duels,
            [duelId]: {
              ...duel,
              players: updatedPlayers,
              status: allCompleted ? 'completed' : duel.status,
            },
          },
        }))
      },

      getDuel: (duelId) => get().duels[duelId],
      getDuelByCode: (code) => Object.values(get().duels).find(d => d.code === code),
      getActiveDuel: () => {
        const id = get().activeDuelId
        return id ? get().duels[id] : undefined
      },
      leaveDuel: () => set({ activeDuelId: null }),
      cleanupExpired: () => {
        const now = new Date().toISOString()
        set((s) => ({
          duels: Object.fromEntries(
            Object.entries(s.duels).filter(([_, d]) => d.expiresAt > now)
          ),
        }))
      },
    }),
    {
      name: 'ege-duel-storage',
    }
  )
)
