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
  { id: 'task13-trainer', task: '13', title: 'НЕ/НИ с причастиями', path: '/task13-trainer' },
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

interface StudyPlanState {
  examDate: string | null
  plan: StudyPlan | null

  setExamDate: (date: string) => void
  generatePlan: () => void
  completeTask: (taskId: string) => void
  getTasksForDay: (date: string) => StudyTask[]
  getTodayTasks: () => StudyTask[]
  getProgress: () => { total: number; completed: number; percent: number }
  clearPlan: () => void
}

export const useStudyPlanStore = create<StudyPlanState>()(
  persist(
    (set, get) => ({
      examDate: null,
      plan: null,

      setExamDate: (date: string) => {
        set({ examDate: date })
        get().generatePlan()
      },

      generatePlan: () => {
        const examDateStr = get().examDate
        if (!examDateStr) return

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

        // Фазы
        const phase1End = Math.floor(totalDays * 0.5)  // 50% на теорию
        const phase2End = Math.floor(totalDays * 0.8)  // 30% на тренажёры
        // остальное 20% на пробники + повтор

        // Фаза 1: Теория (уроки)
        const lessonChunks: string[][] = []
        for (let i = 0; i < allLessons.length; i += 2) {
          lessonChunks.push(allLessons.slice(i, i + 2).map((l) => l.id))
        }

        let lessonIdx = 0
        for (let d = 0; d < phase1End && d < totalDays; d++) {
          const date = addDays(today, d)
          const dayOfWeek = date.getDay()

          // Воскресенье = отдых (если не последний день)
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
            // Если уроки закончились раньше — добавляем тренажёр
            const t = allTrainers[d % allTrainers.length]
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

          // 2 тренажёра в день
          const t1 = allTrainers[trainerIdx % allTrainers.length]
          const t2 = allTrainers[(trainerIdx + 1) % allTrainers.length]
          addTask(date, 'trainer', `Тренажёр: ${t1.title}`, `Отработай задание №${t1.task}`, t1.path, 15)
          addTask(date, 'trainer', `Тренажёр: ${t2.title}`, `Отработай задание №${t2.task}`, t2.path, 15)
          trainerIdx += 2
        }

        // Фаза 3: Пробники + повтор ошибок
        const mockDays = [Math.floor(totalDays * 0.85), Math.floor(totalDays * 0.92), totalDays - 2]
        for (let d = phase2End; d < totalDays; d++) {
          const date = addDays(today, d)
          const dayOfWeek = date.getDay()

          if (dayOfWeek === 0 && d < totalDays - 1) {
            addTask(date, 'rest', 'День отдыха', 'Отдохни, перезагрузи мозг. Завтра с новыми силами!')
            continue
          }

          if (mockDays.includes(d)) {
            addTask(date, 'mock', 'Пробный вариант', 'Реши полный вариант ЕГЭ на время — 3,5 часа', undefined, 210)
          } else {
            addTask(date, 'review', 'Повтор ошибок', 'Зайди в «Работу над ошибками» и прорешай слабые места', '/mistakes', 20)
          }
        }

        set({ plan: { examDate: examDateStr, tasks, generatedAt: new Date().toISOString() } })
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

      clearPlan: () => set({ examDate: null, plan: null }),
    }),
    {
      name: 'ege-study-plan',
    }
  )
)
