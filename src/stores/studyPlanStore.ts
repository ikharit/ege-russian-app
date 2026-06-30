import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { StudyTask, StudyPlan } from '../types'
import { course } from '../data/courseData'

const allLessons = course.sections.flatMap((s) => s.lessons)

const allTrainers = [
  { id: 'accent-trainer', task: '4', title: 'Ударения', path: '/accent-trainer' },
  { id: 'task5-trainer', task: '5', title: 'Паронимы', path: '/task5-trainer' },
  { id: 'task6-trainer', task: '6', title: 'Суффиксы', path: '/task6-trainer' },
  { id: 'task7-trainer', task: '7', title: 'Окончания глаголов', path: '/task7-trainer' },
  { id: 'task8-trainer', task: '8', title: 'Слитное/раздельное', path: '/task8-trainer' },
  { id: 'task9-trainer', task: '9', title: 'Пропущенные буквы', path: '/task9-trainer' },
  { id: 'task10-trainer', task: '10', title: 'ПРЕ/ПРИ, Ъ/Ь', path: '/task10-trainer' },
  { id: 'task11-trainer', task: '11', title: 'Суффиксы прилагательных', path: '/task11-trainer' },
  { id: 'task12-trainer', task: '12', title: 'Окончания причастий', path: '/task12-trainer' },
  { id: 'task13-trainer', task: '13', title: 'НЕ/НИ с частями речи', path: '/task13-trainer' },
  { id: 'task14-trainer', task: '14', title: 'Наречия и предлоги', path: '/task14-trainer' },
  { id: 'task15-trainer', task: '15', title: 'Пунктуация', path: '/task15-trainer' },
  { id: 'task16-trainer', task: '16', title: 'Пунктуация в сложных', path: '/task16-trainer' },
]

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0]
}

function addDays(d: Date, days: number): Date {
  const nd = new Date(d)
  nd.setDate(nd.getDate() + days)
  return nd
}

function daysBetween(a: Date, b: Date): number {
  const ms = b.getTime() - a.getTime()
  return Math.ceil(ms / (1000 * 60 * 60 * 24))
}

// Target score thresholds: what % of each phase should be completed
function getIntensity(targetScore: number) {
  if (targetScore >= 90) return { lessonPct: 1.0, trainerPct: 1.0, mockCount: 5, reviewDaily: true }
  if (targetScore >= 80) return { lessonPct: 0.95, trainerPct: 0.95, mockCount: 4, reviewDaily: true }
  if (targetScore >= 70) return { lessonPct: 0.85, trainerPct: 0.80, mockCount: 3, reviewDaily: false }
  return { lessonPct: 0.70, trainerPct: 0.60, mockCount: 2, reviewDaily: false }
}

interface StudyPlanState {
  examDate: string | null
  targetScore: number
  plan: StudyPlan | null

  setExamDate: (date: string) => void
  setTargetScore: (score: number) => void
  generatePlan: () => void
  completeTask: (taskId: string) => void
  getTasksForDay: (date: string) => StudyTask[]
  getTodayTasks: () => StudyTask[]
  getProgress: () => { total: number; completed: number; percent: number }
  getAssessment: () => { status: 'ahead' | 'ontrack' | 'behind' | 'critical'; label: string; message: string; color: string }
  clearPlan: () => void
}

export const useStudyPlanStore = create<StudyPlanState>()(
  persist(
    (set, get) => ({
      examDate: null,
      targetScore: 70,
      plan: null,

      setExamDate: (date: string) => {
        set({ examDate: date })
        get().generatePlan()
      },

      setTargetScore: (score: number) => {
        set({ targetScore: score })
        get().generatePlan()
      },

      generatePlan: () => {
        const examDateStr = get().examDate
        const targetScore = get().targetScore
        if (!examDateStr) return

        const intensity = getIntensity(targetScore)
        const examDate = new Date(examDateStr)
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const totalDays = daysBetween(today, examDate)
        if (totalDays <= 0) return

        const tasks: StudyTask[] = []
        let taskId = 0

        const addTask = (date: Date, type: StudyTask['type'], title: string, description: string, targetId?: string, duration = 20) => {
          tasks.push({
            id: `task-${taskId++}`,
            date: formatDate(date),
            type,
            title,
            description,
            targetId,
            duration,
            completed: false,
          })
        }

        // Calculate how many lessons/trainers to include based on target score
        const lessonCount = Math.ceil(allLessons.length * intensity.lessonPct)
        const trainerCount = Math.ceil(allTrainers.length * intensity.trainerPct)
        const includedLessons = allLessons.slice(0, lessonCount)
        const includedTrainers = allTrainers.slice(0, trainerCount)

        // Фазы (adjusted for target score)
        const phase1End = Math.floor(totalDays * 0.5)
        const phase2End = Math.floor(totalDays * 0.8)

        // Фаза 1: Теория (уроки)
        const lessonChunks: string[][] = []
        for (let i = 0; i < includedLessons.length; i += 2) {
          lessonChunks.push(includedLessons.slice(i, i + 2).map((l) => l.id))
        }

        let lessonIdx = 0
        for (let d = 0; d < phase1End && d < totalDays; d++) {
          const date = addDays(today, d)
          const dayOfWeek = date.getDay()

          if (dayOfWeek === 0 && d < totalDays - 1) {
            addTask(date, 'rest', 'День отдыха', 'Отдохни, перезагрузи мозг. Завтра с новыми силами!', undefined, 0)
            continue
          }

          if (lessonIdx < lessonChunks.length) {
            const chunk = lessonChunks[lessonIdx]
            const lessonNames = chunk.map((id) => allLessons.find((l) => l.id === id)?.title || 'Урок')
            addTask(date, 'lesson', chunk.length > 1 ? 'Уроки: ' + lessonNames.join(', ') : lessonNames[0], 
              chunk.length > 1 ? 'Пройди 2 урока по теории' : 'Пройди урок по теории', 
              chunk[0], 25)
            lessonIdx++
          } else {
            // If lessons done early, add trainers
            const t = includedTrainers[d % includedTrainers.length]
            addTask(date, 'trainer', `Тренажёр: ${t.title}`, `Отработай задание №${t.task}`, t.path, 15)
          }
        }

        // Фаза 2: Тренажёры
        let trainerIdx = 0
        for (let d = phase1End; d < phase2End && d < totalDays; d++) {
          const date = addDays(today, d)
          const dayOfWeek = date.getDay()

          if (dayOfWeek === 0 && d < totalDays - 1) {
            addTask(date, 'rest', 'День отдыха', 'Отдохни, перезагрузи мозг. Завтра с новыми силами!')
            continue
          }

          // For high target scores: 3 trainers per day
          const trainersPerDay = targetScore >= 80 ? 3 : 2
          for (let tp = 0; tp < trainersPerDay; tp++) {
            const t = includedTrainers[trainerIdx % includedTrainers.length]
            if (!t) break
            addTask(date, 'trainer', `Тренажёр: ${t.title}`, `Отработай задание №${t.task}`, t.path, 15)
            trainerIdx++
          }
        }

        // Фаза 3: Моки + повтор
        const mockSpacing = totalDays / (intensity.mockCount + 1)
        const mockDays: number[] = []
        for (let i = 1; i <= intensity.mockCount; i++) {
          mockDays.push(Math.floor(phase2End + mockSpacing * i))
        }

        for (let d = phase2End; d < totalDays; d++) {
          const date = addDays(today, d)
          const dayOfWeek = date.getDay()

          if (dayOfWeek === 0 && d < totalDays - 1) {
            addTask(date, 'rest', 'День отдыха', 'Отдохни, перезагрузи мозг. Завтра с новыми силами!')
            continue
          }

          if (mockDays.includes(d)) {
            addTask(date, 'mock', 'Пробный вариант', 'Реши полный вариант ЕГЭ на время — 3,5 часа', undefined, 210)
          } else if (intensity.reviewDaily) {
            addTask(date, 'review', 'Повтор ошибок', 'Зайди в «Работу над ошибками» и прорешай слабые места', '/mistakes', 20)
          } else if ((d - phase2End) % 2 === 0) {
            addTask(date, 'review', 'Повтор ошибок', 'Зайди в «Работу над ошибками» и прорешай слабые места', '/mistakes', 20)
          } else {
            addTask(date, 'trainer', `Тренажёр: ${includedTrainers[trainerIdx % includedTrainers.length]?.title || 'Повтор'}`, 
              'Повтори сложное задание', undefined, 15)
            trainerIdx++
          }
        }

        set({ plan: { examDate: examDateStr, targetScore, tasks, generatedAt: new Date().toISOString() } })
      },

      completeTask: (taskId: string) => {
        const plan = get().plan
        if (!plan) return
        const tasks = plan.tasks.map((t) => t.id === taskId ? { ...t, completed: true } : t)
        set({ plan: { ...plan, tasks } })
      },

      getTasksForDay: (date: string) => {
        return get().plan?.tasks.filter((t) => t.date === date) || []
      },

      getTodayTasks: () => {
        const today = formatDate(new Date())
        return get().getTasksForDay(today)
      },

      getProgress: () => {
        const tasks = get().plan?.tasks || []
        const total = tasks.length
        const completed = tasks.filter((t) => t.completed).length
        return { total, completed, percent: total > 0 ? Math.round((completed / total) * 100) : 0 }
      },

      getAssessment: () => {
        const plan = get().plan
        const todayStr = formatDate(new Date())
        if (!plan) return { status: 'ontrack' as const, label: 'Нет плана', message: 'Создай план подготовки', color: 'text-gray-400' }

        const tasks = plan.tasks
        const totalDays = daysBetween(new Date(), new Date(plan.examDate))
        const elapsedTasks = tasks.filter((t) => t.date < todayStr)
        const completedTasks = tasks.filter((t) => t.completed)
        const expectedByNow = elapsedTasks.length
        const actualCompleted = completedTasks.length

        const ratio = expectedByNow > 0 ? actualCompleted / expectedByNow : 1

        if (ratio >= 1.1) return { status: 'ahead' as const, label: 'Отлично! 🚀', message: 'Ты опережаешь план — так держать!', color: 'text-duo-green' }
        if (ratio >= 0.85) return { status: 'ontrack' as const, label: 'В норме ✅', message: 'Ты вовремя выполняешь задачи', color: 'text-blue-500' }
        if (ratio >= 0.6) return { status: 'behind' as const, label: 'Отстаёшь ⚠️', message: 'Стоит поднажать — пропущены задачи', color: 'text-duo-yellow' }
        return { status: 'critical' as const, label: 'Срочно! 🚨', message: 'Критично отстаёшь — догоняй!', color: 'text-duo-red' }
      },

      clearPlan: () => set({ examDate: null, targetScore: 70, plan: null }),
    }),
    {
      name: 'ege-study-plan',
    }
  )
)
