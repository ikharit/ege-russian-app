import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StudentProfile } from './studentStore'

export interface ProgressData {
  userStats: {
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
    mistakesFixed?: number
    currentCombo?: number
    maxCombo?: number
  }
  lessonProgress: Record<string, {
    lessonId: string
    status: 'locked' | 'available' | 'started' | 'completed'
    score: number
    bestScore: number
    attempts: number
    xpEarned: number
    completedAt?: string
  }>
  taskStats: Record<string, { total: number; correct: number; wrong: number; lastAttemptAt: string }>
  achievements: string[]
  atomProgress?: Record<string, unknown>
  wrongAnswers?: unknown[]
  theoryTestsCompleted?: Record<string, { completed: boolean; score: number; xpEarned: number; completedAt?: string }>
  dailyQuestProgress?: Record<string, unknown>
}

export interface ClassHomework {
  id: string
  taskNumber: string
  taskTitle: string
  deadline: string
  assignedAt: string
}

export interface ClassStudent extends StudentProfile {
  joinedAt: string
  progress?: ProgressData
}

export interface ClassRoom {
  id: string
  name: string
  teacherName: string
  inviteCode: string
  students: ClassStudent[]
  createdAt: string
  homework: ClassHomework[]
}

interface ClassStoreState {
  classes: Record<string, ClassRoom>
  activeClassId: string | null
}

interface ClassStoreActions {
  createClass: (teacherName: string, className: string) => { classId: string; inviteCode: string }
  joinClass: (inviteCode: string, studentProfile: StudentProfile) => boolean
  leaveClass: (classId: string, profileId: string) => void
  deleteClass: (classId: string) => void
  getClassByCode: (code: string) => ClassRoom | null
  getClassById: (classId: string) => ClassRoom | null
  getStudentClass: (profileId: string) => ClassRoom | null
  getStudentProgress: (classId: string, profileId: string) => ProgressData | undefined
  updateStudentProgress: (classId: string, profileId: string, progress: ProgressData) => void
  assignHomework: (classId: string, homework: Omit<ClassHomework, 'id' | 'assignedAt'>) => void
  removeHomework: (classId: string, homeworkId: string) => void
  setActiveClassId: (classId: string | null) => void
  getClassesByTeacher: (teacherName: string) => ClassRoom[]
  getLeaderboard: (classId: string) => { profileId: string; name: string; emoji: string; xp: number; lessonsCompleted: number; accuracy: number }[]
  syncClass: (classId: string) => Promise<void>
  subscribeToClass: (classId: string, onUpdate: (data: ClassRoom | null) => void) => Promise<() => void>
}

export type ClassStore = ClassStoreState & ClassStoreActions

const SAFE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

function generateInviteCode(): string {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += SAFE_CHARS[Math.floor(Math.random() * SAFE_CHARS.length)]
  }
  return code
}

function generateClassId(): string {
  return `class-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function generateHomeworkId(): string {
  return `hw-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

export const useClassStore = create<ClassStore>()(
  persist(
    (set, get) => ({
      classes: {},
      activeClassId: null,

      createClass: (teacherName, className) => {
        const state = get()
        let inviteCode = generateInviteCode()
        // Ensure uniqueness
        let attempts = 0
        while (Object.values(state.classes).some(c => c.inviteCode === inviteCode) && attempts < 100) {
          inviteCode = generateInviteCode()
          attempts++
        }
        const classId = generateClassId()
        const newClass: ClassRoom = {
          id: classId,
          name: className,
          teacherName,
          inviteCode,
          students: [],
          createdAt: new Date().toISOString(),
          homework: [],
        }
        set((s) => ({
          classes: { ...s.classes, [classId]: newClass },
          activeClassId: s.activeClassId || classId,
        }))
        return { classId, inviteCode }
      },

      joinClass: (inviteCode, studentProfile) => {
        const code = inviteCode.toUpperCase().trim()
        const state = get()
        const classRoom = Object.values(state.classes).find(c => c.inviteCode === code)
        if (!classRoom) return false
        if (classRoom.students.some(s => s.id === studentProfile.id)) return false

        const classStudent: ClassStudent = {
          ...studentProfile,
          joinedAt: new Date().toISOString(),
        }
        set((s) => ({
          classes: {
            ...s.classes,
            [classRoom.id]: {
              ...classRoom,
              students: [...classRoom.students, classStudent],
            },
          },
        }))
        return true
      },

      leaveClass: (classId, profileId) => {
        const state = get()
        const classRoom = state.classes[classId]
        if (!classRoom) return
        set((s) => ({
          classes: {
            ...s.classes,
            [classId]: {
              ...classRoom,
              students: classRoom.students.filter(s => s.id !== profileId),
            },
          },
          activeClassId: s.activeClassId === classId ? null : s.activeClassId,
        }))
      },

      deleteClass: (classId) => {
        set((s) => {
          const { [classId]: _, ...rest } = s.classes
          return {
            classes: rest,
            activeClassId: s.activeClassId === classId ? null : s.activeClassId,
          }
        })
      },

      getClassByCode: (code) => {
        const state = get()
        return Object.values(state.classes).find(c => c.inviteCode === code.toUpperCase().trim()) || null
      },

      getClassById: (classId) => {
        return get().classes[classId] || null
      },

      getStudentClass: (profileId) => {
        const state = get()
        return Object.values(state.classes).find(c => c.students.some(s => s.id === profileId)) || null
      },

      getStudentProgress: (classId, profileId) => {
        const classRoom = get().classes[classId]
        if (!classRoom) return undefined
        const student = classRoom.students.find(s => s.id === profileId)
        return student?.progress
      },

      updateStudentProgress: (classId, profileId, progress) => {
        const state = get()
        const classRoom = state.classes[classId]
        if (!classRoom) return
        set((s) => ({
          classes: {
            ...s.classes,
            [classId]: {
              ...classRoom,
              students: classRoom.students.map(st =>
                st.id === profileId ? { ...st, progress } : st
              ),
            },
          },
        }))
      },

      assignHomework: (classId, homework) => {
        const state = get()
        const classRoom = state.classes[classId]
        if (!classRoom) return
        const newHw: ClassHomework = {
          ...homework,
          id: generateHomeworkId(),
          assignedAt: new Date().toISOString(),
        }
        set((s) => ({
          classes: {
            ...s.classes,
            [classId]: {
              ...classRoom,
              homework: [...classRoom.homework, newHw],
            },
          },
        }))
        if (typeof navigator !== 'undefined' && navigator.onLine) {
          import('./firebaseStore').then(({ useFirebaseStore }) => {
            useFirebaseStore.getState().syncClassData(classId).catch(() => {})
          })
        }
      },

      removeHomework: (classId, homeworkId) => {
        const state = get()
        const classRoom = state.classes[classId]
        if (!classRoom) return
        set((s) => ({
          classes: {
            ...s.classes,
            [classId]: {
              ...classRoom,
              homework: classRoom.homework.filter(h => h.id !== homeworkId),
            },
          },
        }))
      },

      setActiveClassId: (classId) => {
        set({ activeClassId: classId })
      },

      getClassesByTeacher: (teacherName) => {
        return Object.values(get().classes).filter(c => c.teacherName === teacherName)
      },

      syncClass: async (classId: string) => {
        const { useFirebaseStore } = await import('./firebaseStore')
        await useFirebaseStore.getState().syncClassData(classId)
      },

      subscribeToClass: async (classId: string, onUpdate: (data: ClassRoom | null) => void) => {
        const { subscribeToClass } = await import('./firebaseStore')
        return subscribeToClass(classId, onUpdate)
      },

      getLeaderboard: (classId) => {
        const classRoom = get().classes[classId]
        if (!classRoom) return []
        return classRoom.students
          .map(s => {
            const progress = s.progress
            const lessonsCompleted = progress
              ? Object.values(progress.lessonProgress || {}).filter((l: { status?: string }) => l.status === 'completed').length
              : 0
            const totalAttempts = Object.values(progress?.taskStats || {}).reduce((sum: number, t: { total?: number }) => sum + (t.total || 0), 0)
            const totalCorrect = Object.values(progress?.taskStats || {}).reduce((sum: number, t: { correct?: number }) => sum + (t.correct || 0), 0)
            const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
            return {
              profileId: s.id,
              name: s.name,
              emoji: s.emoji,
              xp: progress?.userStats?.xp || 0,
              lessonsCompleted,
              accuracy,
            }
          })
          .sort((a, b) => b.xp - a.xp)
      },
    }),
    {
      name: 'ege-class-storage',
    }
  )
)
