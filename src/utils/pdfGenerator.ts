import type { ReactElement } from 'react'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { createRoot } from 'react-dom/client'
import type { ReportPreviewData } from '../components/ReportPreview'
import { useProgressStore } from '../stores/progressStore'
import { useStudentStore } from '../stores/studentStore'
import { useClassStore } from '../stores/classStore'
import { course } from '../data/courseData'
import { achievements as allAchievements } from '../data/achievements'
import { getPredictiveScore } from './predictiveScore'
import { calculateComparisonStats } from './comparisonEngine'
import { getSmartRecommendations } from './adaptiveEngine'
import { analyzeErrors, getSubskillName } from './errorPatternAnalyzer'
import { formatNextReview, formatInterval } from './spacedRepetition'
import type { ExamResult } from '../data/fipiVariants'
import type { WrongAnswer } from '../types/index'

export interface ReportOptions {
  type: 'parent' | 'teacher' | 'student' | 'class'
  studentId?: string
  classId?: string
  dateRange?: { from: string; to: string }
  includeCharts?: boolean
  includeRecommendations?: boolean
}

export type PDFReport = jsPDF

const REPORT_CONTAINER_ID = 'report-render-container'

function getContainer(): HTMLElement {
  let container = document.getElementById(REPORT_CONTAINER_ID)
  if (!container) {
    container = document.createElement('div')
    container.id = REPORT_CONTAINER_ID
    container.style.position = 'absolute'
    container.style.left = '-9999px'
    container.style.top = '0'
    container.style.width = '210mm'
    container.style.zIndex = '-1'
    document.body.appendChild(container)
  }
  return container
}

async function waitForRender(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function elementToCanvas(el: HTMLElement): Promise<HTMLCanvasElement> {
  return html2canvas(el, {
    scale: 2,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    width: 794,
    height: 1123,
  })
}

export async function generatePDF(
  element: ReactElement,
  filename: string
): Promise<void> {
  const container = getContainer()
  container.innerHTML = ''

  const root = createRoot(container)
  root.render(element)

  await waitForRender(1000)

  const pages = container.querySelectorAll<HTMLElement>('.report-page')
  if (pages.length === 0) {
    root.unmount()
    throw new Error('No report pages found')
  }

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  for (let i = 0; i < pages.length; i++) {
    const canvas = await elementToCanvas(pages[i])
    const imgData = canvas.toDataURL('image/png')

    if (i > 0) pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)
  }

  pdf.save(filename)

  root.unmount()
  container.innerHTML = ''
}

export function formatDateRu(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

export function formatDateShort(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })
}

export function getDaysToExam(examDateStr: string | null): number {
  if (!examDateStr) return 180
  const exam = new Date(examDateStr)
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  exam.setHours(0, 0, 0, 0)
  const diff = Math.ceil((exam.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  return Math.max(0, diff)
}

export type { ReportPreviewData }

// ─── Data builders ───

function getTotalLessons(): number {
  return course.sections.reduce((sum, s) => sum + s.lessons.length, 0)
}

function buildKnowledgeMap(progress: Record<string, { status?: string }>): { section: string; completed: number; total: number; color: string }[] {
  return course.sections
    .filter((s) => s.id !== 'section-dooshin-all')
    .map((section) => {
      const completed = section.lessons.filter((l) => progress[l.id]?.status === 'completed').length
      return {
        section: section.title,
        completed,
        total: section.lessons.length,
        color: section.color,
      }
    })
}

export function buildParentReportData(studentId: string): ReportPreviewData {
  const progress = useProgressStore.getState()
  const student = useStudentStore.getState().getProfileById(studentId)
  const stats = student?.progress?.userStats || progress.userStats
  const lessonProgress = student?.progress?.lessonProgress || progress.lessonProgress
  const taskStats = student?.progress?.taskStats || progress.taskStats
  const wrongAnswers = student?.progress?.wrongAnswers || progress.wrongAnswers
  const examResults = student?.progress?.examResults || progress.examResults
  const examDate = progress.examDate
  const daysToExam = getDaysToExam(examDate)
  const completedLessons = (Object.values(lessonProgress) as any[]).filter((l: any) => l.status === 'completed').length
  const totalAttempts = (Object.values(taskStats) as any[]).reduce((sum: number, t: any) => sum + (t.total || 0), 0)
  const totalCorrect = (Object.values(taskStats) as any[]).reduce((sum: number, t: any) => sum + (t.correct || 0), 0)
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  const score = getPredictiveScore(
    { taskStats, examResults, userStats: stats, lessonProgress, wrongAnswers, examDate },
    daysToExam
  )
  const comparison = calculateComparisonStats()
  const errorAnalysis = analyzeErrors(progress.answerHistory || [])
  const recommendations = errorAnalysis.recommendations
  const allStudents = useStudentStore.getState().profiles
  const currentStudent = allStudents.find((s) => s.id === studentId)
  const history = currentStudent?.history || []
  const activityHistory = history.map((h) => ({
    date: h.date,
    xp: h.xp,
    accuracy: h.accuracy,
  }))
  const weakTopics = errorAnalysis.patterns.slice(0, 5).map((p) => ({
    task: `Задание ${p.taskNumber}`,
    errorType: getSubskillName(p.errorType),
    count: p.frequency,
    recommendation: recommendations.find((r) => r.includes(String(p.taskNumber))) || `Повтори задание ${p.taskNumber}`,
  }))
  const weeklySchedule = (progress.weeklySchedule || []).flatMap((day) =>
    day.items.map((item) => ({
      day: day.day,
      title: item.title,
      duration: item.duration,
    }))
  )

  return {
    type: 'parent',
    studentName: stats.name || student?.name || 'Ученик',
    studentEmoji: student?.emoji || '🎓',
    date: new Date().toLocaleDateString('ru-RU'),
    footerText: 'ЕГЭ Русский — Подготовка',
    level: stats.level || 1,
    xp: stats.xp || 0,
    streak: stats.streak || 0,
    accuracy,
    predictedScore: score.predictedSecondary,
    lessonsCompleted: completedLessons,
    totalLessons: getTotalLessons(),
    daysToExam,
    activityHistory,
    weakTopics,
    speedPercentile: comparison.speedPercentile,
    accuracyPercentile: comparison.accuracyPercentile,
    efficiencyPercentile: comparison.efficiencyPercentile,
    streakPercentile: comparison.streakPercentile,
    recommendations,
    weeklySchedule,
    className: '',
    teacherName: '',
    students: [],
    classWeakTopics: [],
    homework: [],
    achievements: [],
    examResults: [],
    taskStats: [],
    srsItems: [],
    smartPath: [],
    knowledgeMap: buildKnowledgeMap(lessonProgress),
  }
}

export function buildTeacherReportData(classId: string): ReportPreviewData {
  const classStore = useClassStore.getState()
  const classRoom = classStore.getClassById(classId)
  if (!classRoom) {
    throw new Error('Class not found')
  }
  const students = classRoom.students.map((st) => {
    const progress = st.progress
    const lessonsCompleted = progress
      ? Object.values(progress.lessonProgress || {}).filter((l: { status?: string }) => l.status === 'completed').length
      : 0
    const totalAttempts = Object.values(progress?.taskStats || {}).reduce((sum: number, t: { total?: number }) => sum + (t.total || 0), 0)
    const totalCorrect = Object.values(progress?.taskStats || {}).reduce((sum: number, t: { correct?: number }) => sum + (t.correct || 0), 0)
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
    const daysToExam = getDaysToExam(useProgressStore.getState().examDate)
    const score = getPredictiveScore(
      {
        taskStats: progress?.taskStats || {},
        examResults: (progress?.examResults || []) as ExamResult[],
        userStats: progress?.userStats || { xp: 0, level: 1, streak: 0, maxStreak: 0, lastActivityDate: '', hearts: 5, maxHearts: 5, achievements: [], name: st.name },
        lessonProgress: progress?.lessonProgress || {},
        wrongAnswers: (progress?.wrongAnswers || []) as WrongAnswer[],
        examDate: useProgressStore.getState().examDate,
      },
      daysToExam
    )
    return {
      name: st.name,
      emoji: st.emoji,
      level: progress?.userStats?.level || 1,
      xp: progress?.userStats?.xp || 0,
      accuracy,
      lessonsCompleted,
      streak: progress?.userStats?.streak || 0,
      predictedScore: score.predictedSecondary,
    }
  })

  // Aggregate class weak topics
  const taskErrorMap = new Map<string, { count: number; total: number }>()
  for (const st of classRoom.students) {
    const taskStats = st.progress?.taskStats || {}
    for (const [task, stat] of Object.entries(taskStats)) {
      const s = stat as { total: number; correct: number; wrong: number }
      if (!taskErrorMap.has(task)) taskErrorMap.set(task, { count: 0, total: 0 })
      const entry = taskErrorMap.get(task)!
      entry.total += s.total || 0
      entry.count += s.wrong || 0
    }
  }
  const classWeakTopics = Array.from(taskErrorMap.entries())
    .filter(([_, v]) => v.total > 0 && v.count > 0)
    .map(([task, v]) => ({
      task: `Задание ${task}`,
      studentCount: classRoom.students.filter((st) => {
        const s = st.progress?.taskStats?.[task] as { wrong?: number } | undefined
        return s && s.wrong && s.wrong > 0
      }).length,
      errorPercent: Math.round((v.count / v.total) * 100),
    }))
    .sort((a, b) => b.errorPercent - a.errorPercent)
    .slice(0, 10)

  const homework = classRoom.homework.map((hw) => {
    const total = classRoom.students.length
    const completed = 0 // Placeholder — homework completion tracking not implemented
    return {
      title: hw.taskTitle || hw.taskNumber,
      deadline: new Date(hw.deadline).toLocaleDateString('ru-RU'),
      completed,
      total,
      status: new Date(hw.deadline) < new Date() ? (completed >= total ? 'Сдано' : 'Просрочено') : 'Активно',
    }
  })

  const recommendations = classWeakTopics.length > 0
    ? [`Обратите внимание на ${classWeakTopics[0].task} — ${classWeakTopics[0].errorPercent}% ошибок`, `Повторите ${classWeakTopics.slice(0, 3).map((w) => w.task).join(', ')} на уроке`]
    : ['Класс справляется хорошо! Продолжайте в том же духе.']

  return {
    type: 'teacher',
    studentName: '',
    studentEmoji: '',
    date: new Date().toLocaleDateString('ru-RU'),
    footerText: 'ЕГЭ Русский — Подготовка',
    level: 0,
    xp: 0,
    streak: 0,
    accuracy: 0,
    predictedScore: 0,
    lessonsCompleted: 0,
    totalLessons: 0,
    daysToExam: 0,
    activityHistory: [],
    weakTopics: [],
    speedPercentile: 0,
    accuracyPercentile: 0,
    efficiencyPercentile: 0,
    streakPercentile: 0,
    recommendations,
    weeklySchedule: [],
    className: classRoom.name,
    teacherName: classRoom.teacherName,
    students,
    classWeakTopics,
    homework,
    achievements: [],
    examResults: [],
    taskStats: [],
    srsItems: [],
    smartPath: [],
    knowledgeMap: [],
  }
}

export function buildStudentReportData(): ReportPreviewData {
  const progress = useProgressStore.getState()
  const stats = progress.userStats
  const lessonProgress = progress.lessonProgress
  const taskStats = progress.taskStats
  const examResults = progress.examResults
  const examDate = progress.examDate
  const daysToExam = getDaysToExam(examDate)
  const completedLessons = (Object.values(lessonProgress) as any[]).filter((l: any) => l.status === 'completed').length
  const totalAttempts = (Object.values(taskStats) as any[]).reduce((sum: number, t: any) => sum + (t.total || 0), 0)
  const totalCorrect = (Object.values(taskStats) as any[]).reduce((sum: number, t: any) => sum + (t.correct || 0), 0)
  const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
  const score = getPredictiveScore(
    { taskStats, examResults, userStats: stats, lessonProgress, wrongAnswers: progress.wrongAnswers, examDate },
    daysToExam
  )
  const achievements = progress.achievements.map((id) => {
    const ach = allAchievements.find((a) => a.id === id)
    return {
      id,
      title: ach?.title || id,
      description: ach?.description || '',
      date: undefined,
    }
  })
  const examResultsFormatted = examResults.map((er) => ({
    variant: er.variantId || 'Вариант',
    date: er.date ? new Date(er.date).toLocaleDateString('ru-RU') : '—',
    primaryScore: er.primaryScore || 0,
    secondaryScore: er.secondaryScore || 0,
  }))
  const taskStatsFormatted = Object.entries(taskStats).map(([taskNum, stat]) => {
    const s = stat as { total: number; correct: number; lastAttemptAt: string }
    return {
      taskNum: Number(taskNum),
      total: s.total || 0,
      correct: s.correct || 0,
      accuracy: s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0,
      avgTime: 0, // Not tracked per task in current store
    }
  })
  const srsItems = Object.values(progress.srsData || {}).map((item) => ({
    lesson: item.lessonId,
    nextReview: formatNextReview(item),
    interval: formatInterval(item),
  }))
  const adaptiveState = {
    userStats: stats,
    lessonProgress,
    taskStats,
    srsData: progress.srsData,
    course,
    examDate,
  }
  const smartPath = getSmartRecommendations(adaptiveState, analyzeErrors(progress.answerHistory).patterns, 5).map((r) => ({
    title: r.lessonTitle,
    description: r.description,
    priority: r.priority,
    sectionColor: r.sectionColor,
  }))

  return {
    type: 'student',
    studentName: stats.name || 'Ученик',
    studentEmoji: '🎓',
    date: new Date().toLocaleDateString('ru-RU'),
    footerText: 'ЕГЭ Русский — Подготовка',
    level: stats.level || 1,
    xp: stats.xp || 0,
    streak: stats.streak || 0,
    accuracy,
    predictedScore: score.predictedSecondary,
    lessonsCompleted: completedLessons,
    totalLessons: getTotalLessons(),
    daysToExam,
    activityHistory: [],
    weakTopics: [],
    speedPercentile: 0,
    accuracyPercentile: 0,
    efficiencyPercentile: 0,
    streakPercentile: 0,
    recommendations: [],
    weeklySchedule: [],
    className: '',
    teacherName: '',
    students: [],
    classWeakTopics: [],
    homework: [],
    achievements,
    examResults: examResultsFormatted,
    taskStats: taskStatsFormatted,
    srsItems,
    smartPath,
    knowledgeMap: buildKnowledgeMap(lessonProgress),
  }
}

export function buildClassComparisonReportData(classId: string): ReportPreviewData {
  // Same as teacher but with type 'class'
  const data = buildTeacherReportData(classId)
  data.type = 'class'
  return data
}

