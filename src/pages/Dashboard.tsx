import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Flame, Trophy, Star, ChevronRight, Zap, Volume2, Calendar, AlertCircle, Bell, Clock } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useNotificationStore } from '../stores/notificationStore'
import { useAccentTrainerStore } from '../stores/accentTrainerStore'
import { useTask5Store } from '../stores/task5Store'
import { useTask10Store } from '../stores/task10Store'
import { useTask16Store } from '../stores/task16Store'
import { course } from '../data/courseData'
import { RankBadge } from '../components/RankBadge'
import { XPDetailModal } from '../components/XPDetailModal'
import { DailyQuests } from '../components/DailyQuests'
import { Popover } from '../components/Popover'
import { getRankByLevel, getXPToNextLevel } from '../data/ranks'
import { getAchievementIcon } from '../data/achievementIcons'
import { achievements as allAchievements, getAchievementProgress } from '../data/achievements'
import { allHomework, studentsWithHomework } from '../data/gsheets/homeworkData'

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

      {/* Notification & Retention Widgets */}
      <NotificationWidget />
      <DeadlineWidget />

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

      {/* Homework from Google Sheets */}
      <motion.div
        className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/teacher')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
              <Calendar size={24} />
            </div>
            <div>
              <p className="text-xs text-blue-500 uppercase tracking-wide font-bold">Google Sheets</p>
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

      {/* Task 16 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task16-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№16</span>
            </div>
            <div>
              <p className="text-xs text-purple-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Пунктуация</p>
              <p className="text-xs text-gray-500">Запятые в сложных предложениях</p>
            </div>
          </div>
          <div className="text-right">
            <Task16MiniProgress />
            <ChevronRight size={24} className="text-purple-400" />
          </div>
        </div>
      </motion.div>

      {/* Task 5 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task5-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№5</span>
            </div>
            <div>
              <p className="text-xs text-emerald-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Паронимы</p>
              <p className="text-xs text-gray-500">Словарь ФИПИ</p>
            </div>
          </div>
          <div className="text-right">
            <Task5MiniProgress />
            <ChevronRight size={24} className="text-emerald-400" />
          </div>
        </div>
      </motion.div>

      {/* Task 10 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task10-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№10</span>
            </div>
            <div>
              <p className="text-xs text-blue-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">ПРЕ/ПРИ, Ъ/Ь, Ы/И</p>
              <p className="text-xs text-gray-500">Сложные слова</p>
            </div>
          </div>
          <div className="text-right">
            <Task10MiniProgress />
            <ChevronRight size={24} className="text-blue-400" />
          </div>
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

function Task16MiniProgress() {
  const { getOverallProgress } = useTask16Store()
  const { total, passed } = getOverallProgress()
  const pct = total > 0 ? (passed / total) * 100 : 0

  return (
    <div className="w-16">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-0.5 text-right">{passed}/{total}</p>
    </div>
  )
}

function Task5MiniProgress() {
  const { getOverallProgress } = useTask5Store()
  const { total, passed } = getOverallProgress()
  const pct = total > 0 ? (passed / total) * 100 : 0

  return (
    <div className="w-16">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-0.5 text-right">{passed}/{total}</p>
    </div>
  )
}

function Task10MiniProgress() {
  const { getOverallProgress } = useTask10Store()
  const { total, passed } = getOverallProgress()
  const pct = total > 0 ? (passed / total) * 100 : 0

  return (
    <div className="w-16">
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400 mt-0.5 text-right">{passed}/{total}</p>
    </div>
  )
}

function MistakesCard() {
  const navigate = useNavigate()
  const wrongAnswers = useProgressStore((s) => s.getUnreviewedWrongAnswers())
  const count = wrongAnswers.length

  if (count === 0) return null

  return (
    <motion.div
      className="card bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate('/mistakes')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white relative">
            <AlertCircle size={24} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-duo-yellow text-gray-900 text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {count}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-red-500 uppercase tracking-wide font-bold">Работа над ошибками</p>
            <p className="font-bold text-gray-800">{count} {count === 1 ? 'ошибка' : count < 5 ? 'ошибки' : 'ошибок'} для повторения</p>
            <p className="text-xs text-gray-500">Повтори, чтобы закрепить материал</p>
          </div>
        </div>
        <ChevronRight size={24} className="text-red-400" />
      </div>
    </motion.div>
  )
}

function NotificationWidget() {
  const navigate = useNavigate()
  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = notifications.filter(n => !n.read).length
  const markRead = useNotificationStore((s) => s.markRead)
  const settings = useNotificationStore((s) => s.settings)
  const requestPermission = useNotificationStore((s) => s.requestPermission)
  const [expanded, setExpanded] = useState(false)

  if (!settings.enabled) return null
  if (unreadCount === 0) return null

  return (
    <motion.div
      className="card bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-400 flex items-center justify-center text-white relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-800">Уведомления</p>
            <p className="text-xs text-gray-500">{unreadCount} новых</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-orange-500 font-bold"
        >
          {expanded ? 'Скрыть' : 'Показать'}
        </button>
      </div>
      {expanded && (
        <div className="mt-3 flex flex-col gap-2">
          {notifications.filter(n => !n.read).slice(0, 5).map((n) => (
            <div key={n.id} className="p-2 bg-white rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700">{n.title}</p>
                <p className="text-xs text-gray-500">{n.body}</p>
              </div>
              <button
                onClick={() => markRead(n.id)}
                className="text-xs text-orange-500 font-bold"
              >
                Прочитано
              </button>
            </div>
          ))}
          <button
            onClick={() => requestPermission()}
            className="text-xs text-orange-500 font-bold mt-1"
          >
            🔕 Включить push-уведомления
          </button>
        </div>
      )}
    </motion.div>
  )
}

function DeadlineWidget() {
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]

  // Find upcoming deadlines from homework data
  const deadlines = Object.entries(allHomework)
    .filter(([_, hw]) => hw.current !== null)
    .map(([name, hw]) => {
      const hwDate = hw.current!.date
      const daysLeft = Math.ceil((new Date(hwDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return {
        name,
        homework: hw.current!.homework,
        date: hwDate,
        daysLeft,
        urgent: daysLeft <= 2 && daysLeft >= 0,
      }
    })
    .filter(d => d.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  const urgentCount = deadlines.filter(d => d.urgent).length

  if (deadlines.length === 0) return null

  return (
    <motion.div
      className={`card ${urgentCount > 0 ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate('/my-homework')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${urgentCount > 0 ? 'bg-red-400' : 'bg-blue-500'}`}>
            <Clock size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-800">Дедлайны домашки</p>
            <p className="text-xs text-gray-500">
              {urgentCount > 0 ? `${urgentCount} срочных` : `${deadlines.length} активных`}
            </p>
          </div>
        </div>
        <ChevronRight size={20} className={urgentCount > 0 ? 'text-red-400' : 'text-blue-400'} />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {deadlines.slice(0, 3).map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <span className="text-gray-700">{d.name}</span>
            <span className={d.daysLeft <= 1 ? 'text-red-500 font-bold' : 'text-gray-500'}>
              {d.daysLeft === 0 ? 'Сегодня!' : `${d.daysLeft} дн.`}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
