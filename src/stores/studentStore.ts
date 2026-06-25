import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface StudentProfile {
  id: string
  name: string
  className?: string
  emoji: string
  createdAt: string
  lastActive: string
  role?: 'student' | 'teacher' | 'parent'
  progress?: any // snapshot of progressStore data
  history: { date: string; xp: number; level: number; streak: number; lessonsCompleted: number; accuracy: number }[]
}

interface StudentStore {
  profiles: StudentProfile[]
  activeProfileId: string | null

  createProfile: (name: string, className?: string, emoji?: string) => string
  switchProfile: (id: string, currentProgressData?: any) => void
  deleteProfile: (id: string) => void
  updateActiveProfile: (progressData: any) => void
  getActiveProfile: () => StudentProfile | null
  getProfileById: (id: string) => StudentProfile | undefined
  addHistoryPoint: (progressData: any) => void
  getProfileStats: (id: string) => {
    xp: number
    level: number
    streak: number
    lessonsCompleted: number
    accuracy: number
    totalAttempts: number
    weakTopics: string[]
    daysActive: number
    name: string
    emoji: string
  }
}

const getToday = () => new Date().toISOString().split('T')[0]

const getInitialProgress = () => ({
  userStats: {
    xp: 0, level: 1, streak: 0, maxStreak: 0, lastActivityDate: '',
    hearts: 5, maxHearts: 5, achievements: [], name: 'ученик',
    lastHeartRestore: '', infiniteHearts: false,
    totalLessonTimeMinutes: 0, totalQuestionsAnswered: 0,
    totalHeartsLost: 0, mistakesFixed: 0,
  },
  lessonProgress: {},
  atomProgress: {},
  wrongAnswers: [],
  taskStats: {},
  achievements: [],
  lastUnlockedAchievement: null,
  currentLessonId: null,
  currentLessonStartTime: null,
  currentLessonHeartsLost: 0,
  heartRestoreCount: 0,
  exportCount: 0,
  dailyQuestProgress: {},
  leaderboardRanks: [],
  theoryTestsCompleted: {},
  isTeacher: false,
  userId: null,
})

export const useStudentStore = create<StudentStore>()(
  persist(
    (set, get) => ({
      profiles: [],
      activeProfileId: null,

      createProfile: (name, className, emoji = '🎓') => {
        const id = 'student_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7)
        const newProfile: StudentProfile = {
          id,
          name,
          className,
          emoji,
          createdAt: new Date().toISOString(),
          lastActive: getToday(),
          progress: getInitialProgress(),
          history: [],
        }
        const wasEmpty = get().profiles.length === 0
        set((s) => ({
          profiles: [...s.profiles, newProfile],
          activeProfileId: wasEmpty ? id : s.activeProfileId,
        }))
        return id
      },

      switchProfile: (id, currentProgressData) => {
        const currentActive = get().activeProfileId
        // Save current progress to current profile
        if (currentActive && currentProgressData) {
          set((s) => ({
            profiles: s.profiles.map(p =>
              p.id === currentActive
                ? { ...p, progress: currentProgressData, lastActive: getToday() }
                : p
            ),
            activeProfileId: id,
          }))
        } else {
          set({ activeProfileId: id })
        }
      },

      deleteProfile: (id) => {
        set((s) => {
          const remaining = s.profiles.filter(p => p.id !== id)
          return {
            profiles: remaining,
            activeProfileId: s.activeProfileId === id
              ? (remaining[0]?.id || null)
              : s.activeProfileId,
          }
        })
      },

      updateActiveProfile: (progressData) => {
        const activeId = get().activeProfileId
        if (!activeId) return
        set((s) => ({
          profiles: s.profiles.map(p =>
            p.id === activeId
              ? { ...p, progress: progressData, lastActive: getToday() }
              : p
          ),
        }))
      },

      getActiveProfile: () => {
        return get().profiles.find(p => p.id === get().activeProfileId) || null
      },

      getProfileById: (id) => {
        return get().profiles.find(p => p.id === id)
      },

      addHistoryPoint: (progressData) => {
        const activeId = get().activeProfileId
        if (!activeId) return
        const today = getToday()
        const lessonsCompleted = Object.values(progressData.lessonProgress || {}).filter((l: any) => l.status === 'completed').length
        const totalAttempts = Number((Object.values(progressData.taskStats || {}) as any[]).reduce((sum: number, t: any) => sum + (t.total || 0), 0))
        const totalCorrect = (Object.values(progressData.taskStats || {}) as any[]).reduce((sum: number, t: any) => sum + (t.correct || 0), 0)
        const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0

        set((s) => ({
          profiles: s.profiles.map(p => {
            if (p.id !== activeId) return p
            const filtered = p.history.filter(h => h.date !== today)
            return {
              ...p,
              history: [...filtered, {
                date: today,
                xp: progressData.userStats?.xp || 0,
                level: progressData.userStats?.level || 1,
                streak: progressData.userStats?.streak || 0,
                lessonsCompleted,
                accuracy,
              }],
              lastActive: today,
            }
          })
        }))
      },

      getProfileStats: (id) => {
        const p = get().profiles.find(p => p.id === id)
        if (!p) return {
          xp: 0, level: 1, streak: 0, lessonsCompleted: 0, accuracy: 0,
          totalAttempts: 0, weakTopics: [], daysActive: 0, name: '', emoji: '🎓',
        }
        const progress = p.progress || {}
        const lessonsCompleted = Object.values(progress.lessonProgress || {}).filter((l: any) => l.status === 'completed').length
        const totalAttempts = Number((Object.values(progress.taskStats || {}) as any[]).reduce((sum: number, t: any) => sum + (t.total || 0), 0))
        const totalCorrect = (Object.values(progress.taskStats || {}) as any[]).reduce((sum: number, t: any) => sum + (t.correct || 0), 0)
        const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
        const weakTopics = Object.entries(progress.taskStats || {})
          .filter(([_, t]: [string, any]) => t.total > 0 && t.wrong > 0 && (t.correct / t.total) < 0.7)
          .map(([task, _]: [string, any]) => `Задание ${task}`)
        const daysActive = new Set(p.history.map(h => h.date)).size

        return {
          xp: progress.userStats?.xp || 0,
          level: progress.userStats?.level || 1,
          streak: progress.userStats?.streak || 0,
          lessonsCompleted,
          accuracy,
          totalAttempts,
          weakTopics,
          daysActive,
          name: p.name,
          emoji: p.emoji,
        }
      },
    }),
    {
      name: 'ege-student-storage',
      onRehydrateStorage: (state) => {
        console.log('[StudentStore] Rehydrated from localStorage', {
          hasState: !!state,
          profileCount: state ? state.profiles?.length ?? 0 : 0,
          activeProfileId: state?.activeProfileId ?? null,
        })
      },
    }
  )
)
