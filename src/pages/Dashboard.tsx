import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Flame, Trophy, Star, ChevronRight, Zap, Volume2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useProgressStore } from '../stores/progressStore'
import { useAccentTrainerStore } from '../stores/accentTrainerStore'
import { course } from '../data/courseData'
import { RankBadge } from '../components/RankBadge'
import { XPDetailModal } from '../components/XPDetailModal'
import { DailyQuests } from '../components/DailyQuests'
import { Popover } from '../components/Popover'
import { getRankByLevel, getXPToNextLevel } from '../data/ranks'
import { getAchievementIcon } from '../data/achievementIcons'
import { achievements as allAchievements, getAchievementProgress } from '../data/achievements'

export function Dashboard() {
  const navigate = useNavigate()
  const [showXPModal, setShowXPModal] = useState(false)
  const stats = useProgressStore((s) => s.userStats)
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const achievements = useProgressStore((s) => s.achievements)
  const checkHeartRestore = useProgressStore((s) => s.checkHeartRestore)

  const rank = getRankByLevel(stats.level)
  const xpInfo = getXPToNextLevel(stats.xp)

  useEffect(() => {
    checkHeartRestore()
  }, [checkHeartRestore])

  // Find next available lesson
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
    // All completed - find worst score for repetition
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

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Welcome with rank */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <RankBadge level={stats.level} size="md" showName />
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800 mt-2">
          Привет, {stats.name || 'ученик'}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Готов к ЕГЭ по русскому?</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3">
        <motion.div
          className="card flex flex-col items-center gap-1"
          whileHover={{ scale: 1.02 }}
        >
          <Flame size={24} className="text-orange-500" />
          <span className="text-xl font-bold">{stats.streak}</span>
          <span className="text-xs text-gray-500">Дней подряд</span>
        </motion.div>

        {/* Level/XP — clickable */}
        <motion.div
          className="card flex flex-col items-center gap-1 cursor-pointer relative overflow-hidden"
          whileHover={{ scale: 1.05 }}
          onClick={() => setShowXPModal(true)}
        >
          <div className="absolute inset-0 opacity-10" style={{ backgroundColor: rank.color }} />
          <Zap size={24} className="text-duo-yellow" fill="currentColor" />
          <span className="text-xl font-bold">{stats.level}</span>
          <span className="text-xs text-gray-500">Уровень</span>
          <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
            <div 
              className="h-full rounded-full bg-duo-yellow"
              style={{ width: `${(xpInfo.current / 100) * 100}%` }}
            />
          </div>
        </motion.div>

        {/* Achievements — with popover */}
        <Popover
          position="bottom"
          content={
            <div className="space-y-3 max-h-72 overflow-y-auto">
              <p className="font-bold text-white">🏆 Достижения: {achievements.length} / {allAchievements.length}</p>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-duo-green h-2 rounded-full" 
                  style={{ width: `${(achievements.length / allAchievements.length) * 100}%` }}
                />
              </div>
              
              {achievements.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Собранные:</p>
                  {allAchievements
                    .filter(ach => achievements.includes(ach.id))
                    .slice(0, 5)
                    .map(ach => {
                      const Icon = getAchievementIcon(ach.id)
                      return (
                        <div key={ach.id} className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
                          <div className="w-7 h-7 rounded-full bg-duo-green/20 flex items-center justify-center">
                            <Icon size={14} className="text-duo-green" />
                          </div>
                          <p className="text-sm text-white">{ach.title}</p>
                        </div>
                      )
                    })}
                  {achievements.length > 5 && (
                    <p className="text-xs text-gray-500 text-center">+{achievements.length - 5} ещё...</p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-gray-400">Пока нет достижений. Продолжай учиться!</p>
              )}
            </div>
          }
        >
          <motion.div
            className="card flex flex-col items-center gap-1 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <Star size={24} className="text-duo-purple" />
            <span className="text-xl font-bold">{achievements.length}</span>
            <span className="text-xs text-gray-500">Достижения</span>
          </motion.div>
        </Popover>
      </div>

      {/* Daily Quests */}
      <DailyQuests />

      {/* Progress */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700">Прогресс курса</span>
          <span className="text-sm text-duo-green font-bold">{completedCount}/{totalLessons}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-duo-green h-3 rounded-full transition-all"
            style={{ width: `${totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Continue lesson */}
      {nextLesson && (
        <motion.div
          className={`card ${allCompleted ? 'bg-gradient-to-br from-duo-yellow/10 to-duo-yellow/5 border-duo-yellow/20' : 'bg-gradient-to-br from-duo-green/10 to-duo-green/5 border-duo-green/20'}`}
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate(`/lesson/${nextLesson.lesson.id}`)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${allCompleted ? 'bg-duo-yellow' : 'bg-duo-green'}`}>
                <BookOpen size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  {allCompleted ? 'Все уроки пройдены! 🎉' : lessonProgress[nextLesson.lesson.id]?.status === 'completed' ? 'Повторить' : 'Продолжить обучение'}
                </p>
                <p className="font-bold text-gray-800">{nextLesson.lesson.title}</p>
                <p className="text-xs text-gray-500">{nextLesson.section.title}</p>
              </div>
            </div>
            <ChevronRight size={24} className={allCompleted ? 'text-duo-yellow' : 'text-duo-green'} />
          </div>
        </motion.div>
      )}

      {/* Accent Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/accent-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-rose-400 flex items-center justify-center text-white">
              <Volume2 size={24} />
            </div>
            <div>
              <p className="text-xs text-rose-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Ударения</p>
              <p className="text-xs text-gray-500">Кликай на ударную букву</p>
            </div>
          </div>
          <div className="text-right">
            <AccentTrainerMiniProgress />
            <ChevronRight size={24} className="text-rose-400" />
          </div>
        </div>
      </motion.div>

      {/* Sections overview */}
      <div className="flex flex-col gap-3">
        <h3 className="font-bold text-gray-700">Разделы курса</h3>
        {course.sections.map((section, idx) => {
          const sectionCompleted = section.lessons.filter(l => lessonProgress[l.id]?.status === 'completed').length
          const sectionTotal = section.lessons.length
          return (
            <motion.div
              key={section.id}
              className="card flex items-center gap-3"
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate(`/course?section=${section.id}`)}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: section.color }}
              >
                {idx + 1}
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800">{section.title}</p>
                <p className="text-xs text-gray-500">{section.subtitle}</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-gray-700">{sectionCompleted}/{sectionTotal}</span>
              </div>
            </motion.div>
          )
        })}
      </div>

      <XPDetailModal isOpen={showXPModal} onClose={() => setShowXPModal(false)} />
    </div>
  )
}

function AccentTrainerMiniProgress() {
  const { getOverallProgress } = useAccentTrainerStore()
  const { total, mastered } = getOverallProgress()
  const pct = total > 0 ? (mastered / total) * 100 : 0

  return (
    <div className="w-16">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-rose-400 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-0.5 text-right">{mastered}/{total}</p>
    </div>
  )
}
