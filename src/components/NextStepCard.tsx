import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, RotateCcw, Zap, AlertCircle, ChevronRight, Flame, Target } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { getFocusArea } from '../utils/adaptiveEngine'
import { getDueReviews, getOverdueCount, getDueThisWeek } from '../utils/spacedRepetition'

export function NextStepCard() {
  const navigate = useNavigate()
  const userStats = useProgressStore((s) => s.userStats)
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const taskStats = useProgressStore((s) => s.taskStats)
  const srsData = useProgressStore((s) => s.srsData)

  const focusArea = useMemo(() => {
    return getFocusArea({ userStats, lessonProgress, taskStats, course })
  }, [userStats, lessonProgress, taskStats])

  const overdueCount = getOverdueCount(srsData)
  const dueToday = getDueReviews(srsData)
  const dueWeek = getDueThisWeek(srsData)

  const nextLesson = useMemo(() => {
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        const prog = lessonProgress[lesson.id]
        if (!prog || prog.status === 'available' || prog.status === 'started') {
          return { lesson, section }
        }
      }
    }
    return null
  }, [lessonProgress])

  const allCompleted = Object.values(lessonProgress).filter(l => l.status === 'completed').length === course.sections.reduce((s, sec) => s + sec.lessons.length, 0)

  // Determine what to show
  let mode: 'srs-overdue' | 'srs-due' | 'smart-path' | 'next-lesson' | 'all-done' = 'next-lesson'
  let title = ''
  let subtitle = ''
  let lessonId = ''
  let lessonTitle = ''
  let sectionColor = '#58cc02'
  let icon = BookOpen
  let iconColor = 'text-duo-green'
  let bgGradient = 'from-duo-green/10 to-emerald-50'
  let borderColor = 'border-duo-green/20'
  let buttonText = 'Начать'
  let buttonColor = 'bg-duo-green'
  let progressPct = 0

  if (overdueCount > 0) {
    mode = 'srs-overdue'
    title = 'Повторение просрочено'
    subtitle = `${overdueCount} ${overdueCount === 1 ? 'урок' : overdueCount < 5 ? 'урока' : 'уроков'} нужно повторить`
    lessonId = dueToday[0]?.lessonId || ''
    const lesson = course.sections.flatMap(s => s.lessons).find(l => l.id === lessonId)
    lessonTitle = lesson?.title || 'Повторение'
    sectionColor = '#ef4444'
    icon = AlertCircle
    iconColor = 'text-duo-red'
    bgGradient = 'from-duo-red/10 to-red-50'
    borderColor = 'border-duo-red/20'
    buttonText = 'Повторить сейчас'
    buttonColor = 'bg-duo-red'
  } else if (dueToday.length > 0) {
    mode = 'srs-due'
    title = 'Интервальное повторение'
    subtitle = `${dueToday.length} ${dueToday.length === 1 ? 'урок' : dueToday.length < 5 ? 'урока' : 'уроков'} на сегодня`
    lessonId = dueToday[0].lessonId
    const lesson = course.sections.flatMap(s => s.lessons).find(l => l.id === lessonId)
    lessonTitle = lesson?.title || 'Повторение'
    sectionColor = '#3b82f6'
    icon = RotateCcw
    iconColor = 'text-duo-blue'
    bgGradient = 'from-duo-blue/10 to-blue-50'
    borderColor = 'border-duo-blue/20'
    buttonText = 'Повторить'
    buttonColor = 'bg-duo-blue'
  } else if (focusArea.topLessonId) {
    mode = 'smart-path'
    title = 'Продолжить обучение'
    progressPct = focusArea.total > 0 ? Math.round((focusArea.completed / focusArea.total) * 100) : 0
    subtitle = `${focusArea.sectionTitle} • ${focusArea.completed}/${focusArea.total} (${progressPct}%)`
    lessonId = focusArea.topLessonId
    lessonTitle = focusArea.topLessonTitle || 'Следующий урок'
    sectionColor = focusArea.sectionColor || '#58cc02'
    icon = BookOpen
    iconColor = 'text-duo-green'
    bgGradient = 'from-duo-green/10 to-emerald-50'
    borderColor = 'border-duo-green/20'
    buttonText = 'Продолжить'
    buttonColor = 'bg-duo-green'
  } else if (nextLesson) {
    mode = 'next-lesson'
    title = 'Продолжить обучение'
    const prog = lessonProgress[nextLesson.lesson.id]
    const completed = nextLesson.section.lessons.filter(l => lessonProgress[l.id]?.status === 'completed').length
    const total = nextLesson.section.lessons.length
    progressPct = total > 0 ? Math.round((completed / total) * 100) : 0
    subtitle = `${nextLesson.section.title} • ${completed}/${total} (${progressPct}%)`
    lessonId = nextLesson.lesson.id
    lessonTitle = nextLesson.lesson.title
    sectionColor = nextLesson.section.color
    icon = BookOpen
    iconColor = 'text-duo-green'
    bgGradient = 'from-duo-green/10 to-emerald-50'
    borderColor = 'border-duo-green/20'
    buttonText = prog?.status === 'completed' ? 'Повторить' : 'Начать'
    buttonColor = 'bg-duo-green'
  } else {
    mode = 'all-done'
    title = 'Все уроки пройдены! 🎉'
    subtitle = 'Повторяй слабые места или проходи варианты ЕГЭ'
    lessonId = ''
    lessonTitle = ''
    sectionColor = '#f59e0b'
    icon = Zap
    iconColor = 'text-duo-yellow'
    bgGradient = 'from-duo-yellow/10 to-amber-50'
    borderColor = 'border-duo-yellow/20'
    buttonText = 'Пройти вариант'
    buttonColor = 'bg-duo-yellow'
  }

  const handleAction = () => {
    if (lessonId) {
      navigate(`/lesson/${lessonId}`)
    } else if (mode === 'all-done') {
      navigate('/exam')
    }
  }

  return (
    <motion.div
      className={`rounded-2xl p-4 shadow-sm border-2 bg-gradient-to-br ${bgGradient} ${borderColor}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconColor}`} style={{ backgroundColor: `${sectionColor}20` }}>
            <icon size={18} style={{ color: sectionColor }} />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: sectionColor }}>
              {title}
            </p>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        {mode === 'srs-due' && dueWeek.length > 0 && (
          <span className="text-[10px] text-gray-400 bg-white/60 px-2 py-0.5 rounded-full">
            +{dueWeek.length} на неделе
          </span>
        )}
      </div>

      {/* Lesson info */}
      {lessonTitle && (
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: sectionColor }}
          >
            {lessonTitle.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-800 truncate">{lessonTitle}</p>
            {mode === 'smart-path' && (
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                <div className="h-1.5 rounded-full" style={{ width: `${progressPct}%`, backgroundColor: sectionColor }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleAction}
        className={`w-full py-2.5 rounded-xl ${buttonColor} text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2`}
      >
        {buttonText}
        <ChevronRight size={16} />
      </button>
    </motion.div>
  )
}
