import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Flame, Trophy, Star, ChevronRight, Zap, Calendar, AlertCircle, Gamepad2, Users, UserPlus } from 'lucide-react'
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
import { achievements as allAchievements, getAchievementProgress } from '../data/achievements'
import { allHomework, studentsWithHomework } from '../data/gsheets/homeworkData'
import { ReleaseNotesWidget } from '../components/ReleaseNotes'
import { MistakesCard } from '../components/dashboard/MistakesCard'
import { DashboardNotificationWidget } from '../components/dashboard/DashboardNotificationWidget'
import { DashboardDeadlineWidget } from '../components/dashboard/DashboardDeadlineWidget'
import { WhatToStudyToday } from '../components/WhatToStudyToday'
import { SmartPathCard } from '../components/SmartPathCard'

export function Dashboard() {
  const navigate = useNavigate()
  const [showXPModal, setShowXPModal] = useState(false)
  const stats = useProgressStore((s) => s.userStats)
  const activeProfile = useStudentStore((s) => s.getActiveProfile())
  const displayName = activeProfile?.name || stats.name || 'ученик'

  const handleKeyNav = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

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

  const getProblematicTasks = useProgressStore((s) => s.getProblematicTasks)
  const problematicTasks = getProblematicTasks(3)

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
          Привет, {displayName}! 👋
        </h1>
        <p className="text-gray-500 mt-1">Готов к ЕГЭ по русскому?</p>
      </div>

      {/* Release Notes */}
      <ReleaseNotesWidget />

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

      {/* Smart Path */}
      <SmartPathCard />

      {/* What to study today */}
      <WhatToStudyToday />

      {/* Notification & Retention Widgets */}
      <DashboardNotificationWidget />
      <DashboardDeadlineWidget />

      {/* Weak topics — link to unified center */}
      {problematicTasks.length > 0 && (
        <motion.div
          className="card bg-duo-red/5 border border-duo-red/20 cursor-pointer hover:shadow-md transition-all"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/mistakes')}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={20} className="text-duo-red" />
              <h3 className="font-bold text-gray-700">⚠️ Стоит подтянуть</h3>
            </div>
            <span className="text-xs text-duo-red font-bold">{problematicTasks.length} заданий</span>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {problematicTasks.slice(0, 3).map((task) => (
              <div key={task.taskNumber} className="flex items-center justify-between p-2 bg-white rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">Задание {task.taskNumber}</span>
                  <span className="text-xs text-gray-400">{task.accuracy}% точность</span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            ))}
            {problematicTasks.length > 3 && (
              <p className="text-xs text-gray-400 text-center">+{problematicTasks.length - 3} ещё...</p>
            )}
          </div>
          <p className="text-xs text-duo-red/70 mt-2 text-center font-medium">Нажми, чтобы перейти в «Работу над ошибками» →</p>
        </motion.div>
      )}

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

      {/* Teacher / Homework Card — renamed for clarity */}
      <motion.div
        className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/teacher')}
        onKeyDown={(e) => handleKeyNav(e, () => navigate('/teacher'))}
        role="button"
        tabIndex={0}
        aria-label="Кабинет учителя и домашнее задание"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs text-blue-500 uppercase tracking-wide font-bold">👨‍🏫 Кабинет учителя</p>
              <p className="font-bold text-gray-800">Домашнее задание</p>
              <p className="text-xs text-gray-500">
                {studentsWithHomework.length} учеников • актуально на сегодня
              </p>
            </div>
          </div>
          <ChevronRight size={24} className="text-blue-400" />
        </div>
        {studentsWithHomework.length > 0 && (
          <div className="mt-3 pt-3 border-t border-blue-100 flex flex-col gap-2">
            {studentsWithHomework.slice(0, 3).map(name => {
              const hw = allHomework[name]?.current
              return hw ? (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-700">{name}</span>
                    <span className="text-xs text-gray-500 truncate max-w-[140px]">{hw.homework}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${hw.status === 'да' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                    {hw.status === 'да' ? '✅' : '⏳'}
                  </span>
                </div>
              ) : null
            })}
            {studentsWithHomework.length > 3 && (
              <p className="text-xs text-gray-400 text-center">+{studentsWithHomework.length - 3} ещё...</p>
            )}
          </div>
        )}
      </motion.div>

      {/* My Class Card */}
      {studentClass ? (
        <motion.div
          className="card bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 cursor-pointer"
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate(`/class/${studentClass.id}`)}
          onKeyDown={(e) => handleKeyNav(e, () => navigate(`/class/${studentClass.id}`))}
          role="button"
          tabIndex={0}
          aria-label="Мой класс"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs text-indigo-500 uppercase tracking-wide font-bold">Мой класс</p>
                <p className="font-bold text-gray-800">{studentClass.name}</p>
                <p className="text-xs text-gray-500">{studentClass.teacherName} • {studentClass.students.length} учеников</p>
              </div>
            </div>
            <div className="text-right">
              {myClassRank > 0 && (
                <div className="flex items-center gap-1">
                  <Trophy size={14} className="text-yellow-500" />
                  <span className="text-xs font-bold text-gray-600">#{myClassRank}</span>
                </div>
              )}
              <ChevronRight size={24} className="text-indigo-400" />
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          className="card bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 cursor-pointer"
          whileHover={{ scale: 1.01 }}
          onClick={() => navigate('/join-class')}
          onKeyDown={(e) => handleKeyNav(e, () => navigate('/join-class'))}
          role="button"
          tabIndex={0}
          aria-label="Присоединиться к классу"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gray-300 flex items-center justify-center text-white">
                <UserPlus size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wide font-bold">Класс</p>
                <p className="font-bold text-gray-800">Присоединиться к классу</p>
                <p className="text-xs text-gray-500">Введите код приглашения от учителя</p>
              </div>
            </div>
            <ChevronRight size={24} className="text-gray-400" />
          </div>
        </motion.div>
      )}

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

      {/* All Trainers — compact gateway */}
      <motion.div
        className="card bg-gradient-to-br from-duo-green/10 to-duo-green/5 border-duo-green/20 cursor-pointer"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/trainers')}
        onKeyDown={(e) => handleKeyNav(e, () => navigate('/trainers'))}
        role="button"
        tabIndex={0}
        aria-label="Все тренажёры, 13 заданий"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-duo-green flex items-center justify-center text-white">
              <span className="text-lg font-bold">13</span>
            </div>
            <div>
              <p className="text-xs text-duo-green uppercase tracking-wide font-bold">Тренажёры</p>
              <p className="font-bold text-gray-800">Все задания</p>
              <p className="text-xs text-gray-500">Ударения, паронимы, пунктуация и др.</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-duo-green/50" />
        </div>
      </motion.div>

      {/* Games Card — compact, fun, distinct from trainers */}
      <motion.div
        className="card bg-gradient-to-br from-purple-100 to-fuchsia-50 border-purple-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/games')}
        onKeyDown={(e) => handleKeyNav(e, () => navigate('/games'))}
        role="button"
        tabIndex={0}
        aria-label="Игры и развлечения"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white">
              <Gamepad2 size={24} />
            </div>
            <div>
              <p className="text-xs text-purple-500 uppercase tracking-wide font-bold">Развлечения</p>
              <p className="font-bold text-gray-800">Игры</p>
              <p className="text-xs text-gray-500">Переключись и отдохни 🎮</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-purple-400" />
        </div>
      </motion.div>

      {/* Challenges Card — compete with classmates */}
      <motion.div
        className="card bg-gradient-to-br from-amber-100 to-orange-50 border-amber-200 cursor-pointer"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/challenges')}
        onKeyDown={(e) => handleKeyNav(e, () => navigate('/challenges'))}
        role="button"
        tabIndex={0}
        aria-label="Соревнования и челленджи"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white">
              <Trophy size={24} />
            </div>
            <div>
              <p className="text-xs text-amber-600 uppercase tracking-wide font-bold">Соревнования</p>
              <p className="font-bold text-gray-800">Челленджи</p>
              <p className="text-xs text-gray-500">XP Марафон, Огненный страйк ⚡</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-amber-400" />
        </div>
      </motion.div>

      {/* Mistakes Review Card */}
      <MistakesCard />

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
