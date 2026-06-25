import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Flame, Zap, Heart, ChevronRight, BookOpen, Target, Route, Swords, PenTool, GraduationCap } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useStudentStore } from '../stores/studentStore'
import { useStudyPlanStore } from '../stores/studyPlanStore'
import { course } from '../data/courseData'
import { dailyQuests } from '../data/dailyQuests'
import { RankBadge } from '../components/RankBadge'
import { DailyQuestionCard } from '../components/DailyQuestionCard'
import { getRankByLevel, getXPToNextLevel } from '../data/ranks'
import { getEssayStats } from '../data/essayData'

function TodayQuests() {
  const questProgress = useProgressStore((s) => s.dailyQuestProgress)
  const todayStr = new Date().toISOString().split('T')[0]

  const activeQuests = dailyQuests.filter((q) => {
    const prog = questProgress[q.id]
    if (!prog) return true
    return prog.date === todayStr ? !prog.completed : true
  })
  const completedCount = dailyQuests.filter((q) => {
    const prog = questProgress[q.id]
    return prog?.date === todayStr && prog.completed
  }).length
  const totalCount = dailyQuests.length

  if (dailyQuests.length === 0) return null

  return (
    <motion.div
      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-duo-yellow" fill="currentColor" />
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wide">Квесты на сегодня</h3>
        </div>
        <span className="text-[10px] font-bold text-gray-400">{completedCount}/{totalCount}</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {activeQuests.slice(0, 2).map((quest) => {
          const prog = questProgress[quest.id]
          const progress = prog?.date === todayStr ? prog.current : 0
          return (
            <div key={quest.id} className="flex items-center gap-2 py-1.5 px-2 bg-gray-50 rounded-xl">
              <div className="w-2 h-2 rounded-full bg-duo-yellow shrink-0" />
              <span className="text-xs text-gray-700 flex-1 truncate">{quest.title}</span>
              <span className="text-[10px] text-gray-400">{progress}/{quest.target}</span>
              <span className="text-[10px] font-bold text-duo-yellow">+{quest.rewardXP} XP</span>
            </div>
          )
        })}
        {activeQuests.length > 2 && (
          <p className="text-[10px] text-gray-400 text-center">+{activeQuests.length - 2} ещё...</p>
        )}
        {activeQuests.length === 0 && (
          <p className="text-xs text-duo-green font-bold text-center py-1">Все квесты выполнены! 🎉</p>
        )}
      </div>
    </motion.div>
  )
}

export function TodayPage() {
  const navigate = useNavigate()
  const stats = useProgressStore((s) => s.userStats)
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const achievements = useProgressStore((s) => s.achievements)
  const checkHeartRestore = useProgressStore((s) => s.checkHeartRestore)
  const activeProfile = useStudentStore((s) => s.getActiveProfile())
  const displayName = activeProfile?.name || stats.name || 'ученик'
  const examDate = useStudyPlanStore((s) => s.examDate)
  const plan = useStudyPlanStore((s) => s.plan)
  const getStudentClass = useClassStore((s) => s.getStudentClass)
  const getLeaderboard = useClassStore((s) => s.getLeaderboard)
  const studentClass = activeProfile ? getStudentClass(activeProfile.id) : null
  const classLeaderboard = studentClass ? getLeaderboard(studentClass.id) : []
  const myClassRank = activeProfile && studentClass
    ? classLeaderboard.findIndex(e => e.profileId === activeProfile.id) + 1
    : -1

  const isTeacher = activeProfile?.role === 'teacher' || false

  const rank = getRankByLevel(stats.level)
  const xpInfo = getXPToNextLevel(stats.xp)
  const daysToExam = examDate
    ? Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0

  useEffect(() => {
    checkHeartRestore()
  }, [checkHeartRestore])

  // Find next lesson
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

  const completedCount = Object.values(lessonProgress).filter((l: any) => l.status === 'completed').length
  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0)
  const allCompleted = completedCount === totalLessons && totalLessons > 0

  const canContinue = stats.hearts > 0

  return (
    <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Привет, {displayName}! 👋</h1>
          <p className="text-xs text-gray-500">Готов к ЕГЭ по русскому?</p>
        </div>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <RankBadge level={stats.level} size="sm" showName />
        </motion.div>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-2">
        <motion.div
          className="flex-1 bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <Flame size={18} className="text-orange-500" />
          <div>
            <span className="text-sm font-bold text-gray-800">{stats.streak}</span>
            <span className="text-[10px] text-gray-500 ml-1">дней</span>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex items-center gap-2 cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => navigate('/profile')}
        >
          <Heart size={18} className="text-duo-red" fill={stats.hearts > 0 ? 'currentColor' : 'none'} />
          <div>
            <span className="text-sm font-bold text-gray-800">{stats.hearts}</span>
            <span className="text-[10px] text-gray-500 ml-1">/{stats.maxHearts}</span>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
        >
          <Zap size={18} className="text-duo-yellow" fill="currentColor" />
          <div>
            <span className="text-sm font-bold text-gray-800">{stats.level}</span>
            <span className="text-[10px] text-gray-500 ml-1">уровень</span>
          </div>
          <div className="w-8 bg-gray-200 rounded-full h-1 ml-auto">
            <div className="h-full rounded-full bg-duo-yellow" style={{ width: `${xpInfo.current}%` }} />
          </div>
        </motion.div>
      </div>

      {/* Main Action — Continue Lesson */}
      {nextLesson && (
        <motion.div
          className={`rounded-2xl p-4 cursor-pointer shadow-sm ${allCompleted ? 'bg-gradient-to-r from-duo-yellow/10 to-amber-50 border border-duo-yellow/20' : 'bg-gradient-to-r from-duo-green/10 to-emerald-50 border border-duo-green/20'}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => canContinue ? navigate(`/lesson/${nextLesson.lesson.id}`) : navigate('/profile')}
        >
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${allCompleted ? 'bg-duo-yellow' : canContinue ? 'bg-duo-green' : 'bg-gray-400'}`}>
              <BookOpen size={24} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-[10px] uppercase tracking-wide font-bold ${allCompleted ? 'text-duo-yellow' : canContinue ? 'text-duo-green' : 'text-gray-400'}`}>
                {allCompleted ? 'Все уроки пройдены! 🎉' : lessonProgress[nextLesson.lesson.id]?.status === 'completed' ? 'Повторить' : 'Продолжить обучение'}
              </p>
              <p className="font-bold text-base text-gray-800 truncate">{nextLesson.lesson.title}</p>
              <p className="text-xs text-gray-500 truncate">{nextLesson.section.title}</p>
              {!canContinue && !allCompleted && (
                <p className="text-xs text-duo-red font-bold mt-0.5">Сердечки закончились! 💔</p>
              )}
            </div>
            <ChevronRight size={24} className={allCompleted ? 'text-duo-yellow' : canContinue ? 'text-duo-green' : 'text-gray-400'} />
          </div>
        </motion.div>
      )}

      {/* Progress */}
      <div className="flex items-center gap-2">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs font-bold text-gray-600">Прогресс курса</span>
            <span className="text-xs font-bold text-duo-green">{completedCount}/{totalLessons}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-duo-green h-2 rounded-full transition-all" style={{ width: `${totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0}%` }} />
          </div>
        </div>
        {examDate && daysToExam > 0 && (
          <div className="text-right shrink-0">
            <p className="text-[10px] text-gray-400">До экзамена</p>
            <p className="text-sm font-bold text-gray-700">{daysToExam} дн.</p>
          </div>
        )}
      </div>

      {/* Daily Question */}
      <DailyQuestionCard />

      {/* Daily Quests */}
      <TodayQuests />

      {/* Quick Training — 4 items only */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Быстрый старт</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <motion.div
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/trainers')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-duo-green flex items-center justify-center text-white">
                <Target size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">Все задания</p>
                <p className="text-[11px] text-gray-400 truncate">13 тренажёров</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/marathon')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                <Route size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">Марафон</p>
                <p className="text-[11px] text-gray-400 truncate">20 вопросов</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/duel')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-500 flex items-center justify-center text-white">
                <Swords size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">Дуэль</p>
                <p className="text-[11px] text-gray-400 truncate">1 на 1</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/essay')}
          >
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-rose-500 flex items-center justify-center text-white">
                <PenTool size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-gray-800 truncate">Сочинения</p>
                <p className="text-[11px] text-gray-400 truncate">{getEssayStats().completed}/{getEssayStats().total} тем</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Teacher Panel */}
      {isTeacher && (
        <motion.div
          className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => navigate('/teacher')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-duo-purple/10 flex items-center justify-center">
                <GraduationCap size={18} className="text-duo-purple" />
              </div>
              <div>
                <p className="font-semibold text-sm text-gray-800">Учительская панель</p>
                <p className="text-[11px] text-gray-400">Классы, ДЗ, отчёты</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </div>
        </motion.div>
      )}

      {/* Link to full overview */}
      <motion.div
        className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => navigate('/dashboard')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-duo-blue/10 flex items-center justify-center">
              <Trophy size={18} className="text-duo-blue" />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">Полный обзор</p>
              <p className="text-[11px] text-gray-400">Статистика, достижения, класс, план</p>
            </div>
          </div>
          <ChevronRight size={20} className="text-gray-300" />
        </div>
      </motion.div>
    </div>
  )
}
