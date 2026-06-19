import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Flame, Trophy, Star, ChevronRight, ChevronDown, Zap, Calendar, AlertCircle, Gamepad2, Users, UserPlus, Target, ClipboardList, School, PenTool, Swords, Route, BookOpenText } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useStudentStore } from '../stores/studentStore'
import { useClassStore } from '../stores/classStore'
import { course } from '../data/courseData'
import { RankBadge } from '../components/RankBadge'
import { XPDetailModal } from '../components/XPDetailModal'
import { DailyQuests } from '../components/DailyQuests'
import { Popover } from '../components/Popover'
import { getRankByLevel, getXPToNextLevel } from '../data/ranks'
import { getAchievementIcon } from '../data/achievementIcons'
import { achievements as allAchievements } from '../data/achievements'
import { allHomework, studentsWithHomework } from '../data/gsheets/homeworkData'
import { ReleaseNotesWidget } from '../components/ReleaseNotes'
import { MotivationalBanner } from '../components/MotivationalBanner'
import { MistakesCard } from '../components/dashboard/MistakesCard'
import { DashboardNotificationWidget } from '../components/dashboard/DashboardNotificationWidget'
import { DashboardDeadlineWidget } from '../components/dashboard/DashboardDeadlineWidget'
import { SmartPathCard } from '../components/SmartPathCard'
import { PredictiveScoreWidget } from '../components/PredictiveScoreWidget'
import { DailyQuestionCard } from '../components/DailyQuestionCard'
import { WhatToStudyToday } from '../components/WhatToStudyToday'
import { SRSCard } from '../components/SRSCard'
import { useStudyPlanStore } from '../stores/studyPlanStore'
import { getEssayStats } from '../data/essayData'
import { getPlayerTypeLabel, getPlayerTypeIcon, getPlayerTypeColor, getPersonalityMotivation, getPlayerTypeGradient, getPlayerTypeBorder } from '../utils/personalityEngine'
import { getDueReviews, getOverdueCount } from '../utils/spacedRepetition'
import type { PlayerType } from '../utils/personalityEngine'
import { detectPlayerType } from '../utils/personalityEngine'
import type { LucideIcon } from 'lucide-react'

function SRSIndicator() {
  const srsData = useProgressStore((s) => s.srsData)
  const dueToday = getDueReviews(srsData)
  const overdueCount = getOverdueCount(srsData)

  if (dueToday.length === 0 && overdueCount === 0) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-1">
      <span className="text-xs text-gray-500">
        🔁 {dueToday.length} {dueToday.length === 1 ? 'урок' : dueToday.length < 5 ? 'урока' : 'уроков'} на повторение
      </span>
      {overdueCount > 0 && (
        <span className="text-xs font-bold bg-duo-red text-white px-1.5 py-0.5 rounded-full animate-pulse">
          Просрочено!
        </span>
      )}
    </div>
  )
}

interface CompactCardProps {
  icon: LucideIcon
  iconColor: string
  iconBg: string
  title: string
  subtitle?: string
  onClick: () => void
  badge?: string
  badgeColor?: string
  rightElement?: React.ReactNode
  className?: string
}

function CompactCard({ icon: Icon, iconColor, iconBg, title, subtitle, onClick, badge, badgeColor, rightElement, className = '' }: CompactCardProps) {
  return (
    <motion.div
      className={`bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow ${className}`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick() } }}
    >
      <div className="flex items-center gap-2.5">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0`} style={{ backgroundColor: iconBg }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-semibold text-sm text-gray-800 truncate">{title}</p>
            {badge && (
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 ${badgeColor || 'bg-gray-100 text-gray-600'}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-[11px] text-gray-400 truncate">{subtitle}</p>}
        </div>
        {rightElement || <ChevronRight size={16} className="text-gray-300 shrink-0" />}
      </div>
    </motion.div>
  )
}

function WeeklyScheduleCard() {
  const navigate = useNavigate()
  const schedule = useProgressStore((s) => s.weeklySchedule)

  const completedCount = schedule?.reduce((sum, day) => sum + day.items.filter(i => i.type === 'break' && i.title.startsWith('✅')).length, 0) || 0
  const totalDays = schedule?.filter(d => d.items.length > 0).length || 0

  return (
    <motion.div
      className="card bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 cursor-pointer"
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate('/weekly-schedule')}
      role="button"
      tabIndex={0}
      aria-label="Расписание на неделю"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-xs text-indigo-500 uppercase tracking-wide font-bold">Расписание</p>
            <p className="font-bold text-gray-800">Недельный план</p>
            <p className="text-xs text-gray-500">
              {schedule ? `${totalDays}/7 дней запланировано, ${completedCount} выполнено` : 'Ещё не создано'}
            </p>
          </div>
        </div>
        <ChevronRight size={24} className="text-indigo-400" />
      </div>
    </motion.div>
  )
}

function StudyPlanWidget() {
  const navigate = useNavigate()
  const plan = useStudyPlanStore((s) => s.plan)
  const examDate = useStudyPlanStore((s) => s.examDate)
  const getTodayTasks = useStudyPlanStore((s) => s.getTodayTasks)
  const completeTask = useStudyPlanStore((s) => s.completeTask)
  const getProgress = useStudyPlanStore((s) => s.getProgress)
  const getAssessment = useStudyPlanStore((s) => s.getAssessment)

  if (!plan || !examDate) return null

  const todayTasks = getTodayTasks()
  const progress = getProgress()
  const assessment = getAssessment()
  const daysToExam = Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  const completedToday = todayTasks.filter((t) => t.completed).length

  return (
    <motion.div
      className={`card bg-gradient-to-br from-duo-green/10 to-white border-duo-green/20 cursor-pointer ${assessment.status === 'critical' ? 'border-duo-red/30' : assessment.status === 'behind' ? 'border-duo-yellow/30' : ''}`}
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate('/study-plan')}
      role="button"
      tabIndex={0}
      aria-label="План подготовки к ЕГЭ"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-duo-green flex items-center justify-center text-white">
            <Target size={24} />
          </div>
          <div>
            <p className="text-xs text-duo-green uppercase tracking-wide font-bold">План подготовки</p>
            <p className="font-bold text-gray-800">
              {daysToExam > 0 ? `${daysToExam} дн. до экзамена` : 'Экзамен сегодня!'}
            </p>
            <p className="text-xs text-gray-500">
              {todayTasks.length > 0
                ? `${completedToday}/${todayTasks.length} задач сегодня • ${progress.percent}% всего плана`
                : 'Нет задач на сегодня'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">Цель</p>
          <p className="text-lg font-bold text-duo-green">{plan.targetScore}</p>
        </div>
      </div>

      <div className={`mt-2 text-xs font-bold ${assessment.color}`}>
        {assessment.label} — {assessment.message}
      </div>

      {todayTasks.length > 0 && (
        <div className="mt-3 pt-3 border-t border-duo-green/10 space-y-2">
          {todayTasks.slice(0, 2).map((task) => (
            <div key={task.id} className="flex items-center justify-between text-sm">
              <span className={`${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {task.title}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  completeTask(task.id)
                }}
                className={`text-sm ${task.completed ? 'text-duo-green' : 'text-gray-300 hover:text-duo-green'}`}
              >
                {task.completed ? '✓' : '○'}
              </button>
            </div>
          ))}
          {todayTasks.length > 2 && (
            <p className="text-xs text-gray-400 text-center">+{todayTasks.length - 2} ещё...</p>
          )}
        </div>
      )}

      <div className="w-full bg-gray-100 rounded-full h-2 mt-3">
        <div
          className="bg-duo-green h-2 rounded-full transition-all"
          style={{ width: `${progress.percent}%` }}
        />
      </div>
    </motion.div>
  )
}

function SectionTitle({ title, action }: { title: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div className="flex items-center justify-between px-1">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
      {action && (
        <button onClick={action.onClick} className="text-xs text-duo-blue font-semibold hover:underline">
          {action.label}
        </button>
      )}
    </div>
  )
}

export function Dashboard() {
  const navigate = useNavigate()
  const [showXPModal, setShowXPModal] = useState(false)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const stats = useProgressStore((s) => s.userStats)
  const isTeacher = useProgressStore((s) => s.isTeacher)
  const playerProfile = useProgressStore((s) => s.getPlayerProfile())
  const setPlayerProfile = useProgressStore((s) => s.setPlayerProfile)
  const activeProfile = useStudentStore((s) => s.getActiveProfile())
  const displayName = activeProfile?.name || stats.name || 'ученик'
  const classes = useClassStore((s) => s.classes)
  const totalClassStudents = Object.values(classes).reduce((sum, c) => sum + c.students.length, 0)

  const playerType: PlayerType = playerProfile?.type || 'achiever'

  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const achievements = useProgressStore((s) => s.achievements)
  const checkHeartRestore = useProgressStore((s) => s.checkHeartRestore)
  const getStudentClass = useClassStore((s) => s.getStudentClass)
  const getLeaderboard = useClassStore((s) => s.getLeaderboard)
  const studentClass = activeProfile ? getStudentClass(activeProfile.id) : null
  const classLeaderboard = studentClass ? getLeaderboard(studentClass.id) : []
  const myClassRank = activeProfile && studentClass
    ? classLeaderboard.findIndex(e => e.profileId === activeProfile.id) + 1
    : -1

  const rank = getRankByLevel(stats.level)
  const xpInfo = getXPToNextLevel(stats.xp)

  useEffect(() => {
    if (!playerProfile && Object.keys(lessonProgress).length > 0) {
      const detected = detectPlayerType(stats, lessonProgress, course, classLeaderboard.length, 0, 0, !!studentClass)
      setPlayerProfile(detected)
    }
  }, [playerProfile, lessonProgress, stats, setPlayerProfile, classLeaderboard.length, studentClass])

  useEffect(() => {
    checkHeartRestore()
  }, [checkHeartRestore])

  let nextLesson = null
  for (const section of course.sections) {
    for (const lesson of section.lessons) {
      const prog = lessonProgress[lesson.id]
      if (!prog || prog.status === 'available' || prog.status === 'started') {
        nextLesson = { lesson, section }
        break
      }
    }
    if (nextLesson) break
  }
  if (!nextLesson) {
    let worstLesson = null
    let worstScore = 101
    for (const section of course.sections) {
      for (const lesson of section.lessons) {
        const score = lessonProgress[lesson.id]?.bestScore ?? 0
        if (score < worstScore) {
          worstScore = score
          worstLesson = { lesson, section }
        }
      }
    }
    nextLesson = worstLesson || { lesson: course.sections[0].lessons[0], section: course.sections[0] }
  }

  const completedCount = Object.values(lessonProgress).filter(l => l.status === 'completed').length
  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0)
  const allCompleted = completedCount === totalLessons && totalLessons > 0

  const getProblematicTasks = useProgressStore((s) => s.getProblematicTasks)
  const problematicTasks = getProblematicTasks(3)

  const plan = useStudyPlanStore((s) => s.plan)
  const examDate = useStudyPlanStore((s) => s.examDate)
  const getTodayTasks = useStudyPlanStore((s) => s.getTodayTasks)
  const getProgress = useStudyPlanStore((s) => s.getProgress)
  const getAssessment = useStudyPlanStore((s) => s.getAssessment)
  const todayTasks = plan && examDate ? getTodayTasks() : []
  const progress = plan && examDate ? getProgress() : null
  const assessment = plan && examDate ? getAssessment() : null
  const daysToExam = examDate ? Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0
  const completedToday = todayTasks.filter((t) => t.completed).length

  const schedule = useProgressStore((s) => s.weeklySchedule)
  const totalDays = schedule?.filter(d => d.items.length > 0).length || 0

  return (
    <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Welcome */}
      <div className="text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }}>
          <RankBadge level={stats.level} size="sm" showName />
        </motion.div>
        <h1 className="text-lg font-bold text-gray-800 mt-1">Привет, {displayName}! 👋</h1>
        <p className="text-xs text-gray-500">Готов к ЕГЭ по русскому?</p>
        <SRSIndicator />
      </div>

      {/* Release Notes */}
      <ReleaseNotesWidget />

      {/* Motivational Banner */}
      <MotivationalBanner />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <motion.div className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex flex-col items-center gap-0.5" whileHover={{ scale: 1.02 }}>
          <Flame size={20} className="text-orange-500" />
          <span className="text-lg font-bold leading-tight">{stats.streak}</span>
          <span className="text-[10px] text-gray-500">Дней подряд</span>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex flex-col items-center gap-0.5 cursor-pointer relative overflow-hidden"
          whileHover={{ scale: 1.03 }}
          onClick={() => setShowXPModal(true)}
        >
          <div className="absolute inset-0 opacity-5" style={{ backgroundColor: rank.color }} />
          <Zap size={20} className="text-duo-yellow" fill="currentColor" />
          <span className="text-lg font-bold leading-tight">{stats.level}</span>
          <span className="text-[10px] text-gray-500">Уровень</span>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-0.5">
            <div className="h-full rounded-full bg-duo-yellow" style={{ width: `${xpInfo.current}%` }} />
          </div>
        </motion.div>

        <Popover
          position="bottom"
          content={
            <div className="space-y-2 max-h-64 overflow-y-auto">
              <p className="font-bold text-white text-sm">🏆 Достижения: {achievements.length} / {allAchievements.length}</p>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div className="bg-duo-green h-1.5 rounded-full" style={{ width: `${(achievements.length / allAchievements.length) * 100}%` }} />
              </div>
              {achievements.length > 0 ? (
                <div className="space-y-1.5">
                  {allAchievements.filter(ach => achievements.includes(ach.id)).slice(0, 5).map(ach => {
                    const Icon = getAchievementIcon(ach.id)
                    return (
                      <div key={ach.id} className="flex items-center gap-2 bg-gray-800 rounded-lg p-1.5">
                        <div className="w-6 h-6 rounded-full bg-duo-green/20 flex items-center justify-center">
                          <Icon size={12} className="text-duo-green" />
                        </div>
                        <p className="text-xs text-white">{ach.title}</p>
                      </div>
                    )
                  })}
                  {achievements.length > 5 && <p className="text-xs text-gray-500 text-center">+{achievements.length - 5} ещё...</p>}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Пока нет достижений. Продолжай учиться!</p>
              )}
            </div>
          }
        >
          <motion.div className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex flex-col items-center gap-0.5 cursor-pointer" whileHover={{ scale: 1.02 }}>
            <Star size={20} className="text-duo-purple" />
            <span className="text-lg font-bold leading-tight">{achievements.length}</span>
            <span className="text-[10px] text-gray-500">Достижения</span>
          </motion.div>
        </Popover>
      </div>

      {/* Daily Quests */}
      <DailyQuests />

      {/* Smart Path */}
      <SmartPathCard />

      {/* SRS Card */}
      <SRSCard />

      {/* Predictive Score */}
      <PredictiveScoreWidget />

      <WeeklyScheduleCard />

      {/* What to study today */}
      <WhatToStudyToday />

      {/* Daily Question — compact, one question per day */}
      <DailyQuestionCard />

      {/* Main Action — Continue Lesson */}
      {nextLesson && (
        <motion.div
          className={`rounded-2xl p-4 cursor-pointer shadow-sm ${allCompleted ? 'bg-gradient-to-r from-duo-yellow/10 to-amber-50 border border-duo-yellow/20' : 'bg-gradient-to-r from-duo-green/10 to-emerald-50 border border-duo-green/20'}`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate(`/lesson/${nextLesson.lesson.id}`)}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${allCompleted ? 'bg-duo-yellow' : 'bg-duo-green'}`}>
              <BookOpen size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] uppercase tracking-wide font-bold ${allCompleted ? 'text-duo-yellow' : 'text-duo-green'}`}>
                {allCompleted ? 'Все уроки пройдены! 🎉' : lessonProgress[nextLesson.lesson.id]?.status === 'completed' ? 'Повторить' : 'Продолжить обучение'}
              </p>
              <p className="font-bold text-sm text-gray-800 truncate">{nextLesson.lesson.title}</p>
              <p className="text-xs text-gray-500 truncate">{nextLesson.section.title}</p>
            </div>
            <ChevronRight size={20} className={allCompleted ? 'text-duo-yellow' : 'text-duo-green'} />
          </div>
        </motion.div>
      )}

      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-gray-600">Прогресс</span>
            <span className="text-xs font-bold text-duo-green">{completedCount}/{totalLessons}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-duo-green h-2 rounded-full transition-all" style={{ width: `${totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0}%` }} />
          </div>
        </div>
      </div>

      {/* Training — 2-column grid */}
      <div className="flex flex-col gap-2">
        <SectionTitle title="Тренировка" />
        <div className="grid grid-cols-2 gap-2">
          <CompactCard
            icon={Target}
            iconColor="#fff"
            iconBg="#58cc02"
            title="Все задания"
            subtitle="13 тренажёров"
            onClick={() => navigate('/trainers')}
          />
          <CompactCard
            icon={ClipboardList}
            iconColor="#fff"
            iconBg="#3b82f6"
            title="Варианты ЕГЭ"
            subtitle="5 вариантов"
            onClick={() => navigate('/exam')}
          />
          <CompactCard
            icon={Route}
            iconColor="#fff"
            iconBg="#f97316"
            title="Марафон"
            subtitle="20 вопросов"
            onClick={() => navigate('/marathon')}
          />
          <CompactCard
            icon={PenTool}
            iconColor="#fff"
            iconBg="#e11d48"
            title="Сочинения"
            subtitle={`${getEssayStats().completed}/${getEssayStats().total} тем`}
            onClick={() => navigate('/essay')}
          />
          <CompactCard
            icon={Target}
            iconColor="#fff"
            iconBg="#14b8a6"
            title="Мой тренажёр"
            subtitle="Слабые места"
            onClick={() => navigate('/adaptive-trainer')}
            className="col-span-2"
          />
        </div>
      </div>

      {/* Competition — 2-column grid */}
      <div className="flex flex-col gap-2">
        <SectionTitle title="Соревнование" />
        <div className="grid grid-cols-2 gap-2">
          <CompactCard
            icon={Swords}
            iconColor="#fff"
            iconBg="#ef4444"
            title="Дуэль"
            subtitle="5 вопросов"
            onClick={() => navigate('/duel')}
          />
          <CompactCard
            icon={Trophy}
            iconColor="#fff"
            iconBg="#f59e0b"
            title="Челленджи"
            subtitle="XP, страйки"
            onClick={() => navigate('/challenges')}
          />
          <CompactCard
            icon={Gamepad2}
            iconColor="#fff"
            iconBg="#a855f7"
            title="Игры"
            subtitle="Отдохни 🎮"
            onClick={() => navigate('/games')}
            className="col-span-2"
          />
        </div>
      </div>

      {/* Weak topics */}
      {problematicTasks.length > 0 && (
        <motion.div
          className="bg-white rounded-2xl p-3 shadow-sm border border-duo-red/20 cursor-pointer hover:shadow-md transition-all"
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate('/mistakes')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={18} className="text-duo-red" />
              <h3 className="font-bold text-sm text-gray-700">Стоит подтянуть</h3>
            </div>
            <span className="text-xs text-duo-red font-bold">{problematicTasks.length} заданий</span>
          </div>
          <div className="flex flex-col gap-1 mt-2">
            {problematicTasks.slice(0, 3).map((task) => (
              <div key={task.taskNumber} className="flex items-center justify-between py-1 px-2 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-700">Задание {task.taskNumber}</span>
                  <span className="text-[10px] text-gray-400">{task.accuracy}%</span>
                </div>
                <ChevronRight size={14} className="text-gray-400" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Plan & Schedule */}
      {(plan && examDate) && (
        <div className="flex flex-col gap-2">
          <SectionTitle title="План" />
          <div className="grid grid-cols-2 gap-2">
            <motion.div
              className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/study-plan')}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-duo-green flex items-center justify-center text-white">
                  <Target size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-duo-green font-bold uppercase">До экзамена</p>
                  <p className="text-sm font-bold text-gray-800">{daysToExam} дн.</p>
                  <p className="text-[10px] text-gray-400">{completedToday}/{todayTasks.length} сегодня</p>
                </div>
              </div>
              {progress && (
                <div className="w-full bg-gray-100 rounded-full h-1 mt-1.5">
                  <div className="bg-duo-green h-1 rounded-full" style={{ width: `${progress.percent}%` }} />
                </div>
              )}
            </motion.div>

            <motion.div
              className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/weekly-schedule')}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white">
                  <Calendar size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] text-indigo-500 font-bold uppercase">Расписание</p>
                  <p className="text-sm font-bold text-gray-800">Недельный план</p>
                  <p className="text-[10px] text-gray-400">{totalDays}/7 дней</p>
                </div>
              </div>
            </motion.div>
          </div>
          {assessment && (
            <p className={`text-[10px] font-bold px-3 ${assessment.color}`}>{assessment.label} — {assessment.message}</p>
          )}
        </div>
      )}

      {/* Class & Teacher */}
      <div className="flex flex-col gap-2">
        <SectionTitle title="Класс" />
        {studentClass ? (
          <CompactCard
            icon={Users}
            iconColor="#fff"
            iconBg="#6366f1"
            title={studentClass.name}
            subtitle={`${studentClass.teacherName} • ${studentClass.students.length} уч.`}
            onClick={() => navigate(`/class/${studentClass.id}`)}
            rightElement={myClassRank > 0 ? (
              <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-full">
                <Trophy size={12} className="text-yellow-600" />
                <span className="text-xs font-bold text-yellow-700">#{myClassRank}</span>
              </div>
            ) : undefined}
          />
        ) : (
          <CompactCard
            icon={UserPlus}
            iconColor="#fff"
            iconBg="#9ca3af"
            title="Присоединиться к классу"
            subtitle="Код от учителя"
            onClick={() => navigate('/join-class')}
          />
        )}
        {isTeacher && (
          <CompactCard
            icon={School}
            iconColor="#fff"
            iconBg="#6366f1"
            title="Мои классы"
            subtitle={`${Object.values(classes).length} класс. • ${totalClassStudents} уч.`}
            onClick={() => navigate('/teacher/classroom')}
          />
        )}
        <CompactCard
          icon={Calendar}
          iconColor="#fff"
          iconBg="#3b82f6"
          title="Домашнее задание"
          subtitle={`${studentsWithHomework.length} учеников`}
          onClick={() => navigate('/teacher')}
        />
      </div>

      {/* Personality */}
      {playerProfile && (
        <motion.div
          className={`rounded-2xl p-3 cursor-pointer border ${getPlayerTypeBorder(playerType)} bg-gradient-to-r ${getPlayerTypeGradient(playerType)}`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/personality-quiz')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/personality-quiz') } }}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ backgroundColor: getPlayerTypeColor(playerType) }}>
              {getPlayerTypeIcon(playerType)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide" style={{ color: getPlayerTypeColor(playerType) }}>Мой тип</p>
              <p className="font-bold text-sm text-gray-800">{getPlayerTypeLabel(playerType)}</p>
              <p className="text-[10px] text-gray-500 truncate">
                {getPersonalityMotivation(playerType, { xpToNext: xpInfo.needed, level: stats.level, unlockedTopics: completedCount, totalTopics: totalLessons, classRank: myClassRank > 0 ? myClassRank : undefined, className: studentClass?.name })}
              </p>
            </div>
            <ChevronRight size={16} className="text-gray-400 shrink-0" />
          </div>
        </motion.div>
      )}

      {/* Notifications */}
      <DashboardNotificationWidget />
      <DashboardDeadlineWidget />

      {/* Sections overview — accordion */}
      <div className="flex flex-col gap-2">
        <SectionTitle
          title="Разделы курса"
          action={{ label: 'Все уроки →', onClick: () => navigate('/course') }}
        />
        {course.sections.map((section, idx) => {
          const sectionCompleted = section.lessons.filter(l => lessonProgress[l.id]?.status === 'completed').length
          const sectionTotal = section.lessons.length
          const isExpanded = expandedSection === section.id
          return (
            <motion.div
              key={section.id}
              className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 overflow-hidden"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <div
                className="flex items-center gap-2.5 cursor-pointer"
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ backgroundColor: section.color }}>
                  {idx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-800 truncate">{section.title}</p>
                  <p className="text-[10px] text-gray-400 truncate">{section.subtitle}</p>
                </div>
                <div className="flex items-center gap-1.5 text-right shrink-0">
                  <span className="text-xs font-bold text-gray-600">{sectionCompleted}/{sectionTotal}</span>
                  <ChevronDown size={16} className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    className="mt-2 pt-2 border-t border-gray-50 flex flex-col gap-0.5"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {section.lessons.map((lesson) => {
                      const prog = lessonProgress[lesson.id]
                      const isCompleted = prog?.status === 'completed'
                      const isAvailable = prog?.status === 'available' || prog?.status === 'started'
                      return (
                        <div
                          key={lesson.id}
                          className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => navigate(`/lesson/${lesson.id}`)}
                        >
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${isCompleted ? 'bg-duo-green text-white' : isAvailable ? 'bg-duo-blue/10 text-duo-blue' : 'bg-gray-100 text-gray-400'}`}>
                            {isCompleted ? '✓' : lesson.id}
                          </div>
                          <span className={`text-xs flex-1 truncate ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                            {lesson.title}
                          </span>
                          {prog?.bestScore !== undefined && (
                            <span className="text-[10px] text-gray-400 shrink-0">{prog.bestScore}%</span>
                          )}
                        </div>
                      )
                    })}
                    <button
                      className="mt-1 text-xs text-duo-blue font-bold text-center py-1.5 rounded-lg hover:bg-duo-blue/5 transition-colors"
                      onClick={() => navigate(`/course?section=${section.id}`)}
                    >
                      Открыть раздел →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      <XPDetailModal isOpen={showXPModal} onClose={() => setShowXPModal(false)} />
    </div>
  )
}
