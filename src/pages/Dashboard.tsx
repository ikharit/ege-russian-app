import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Flame, Trophy, Star, ChevronRight, Zap, Volume2, Calendar, AlertCircle } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useStudentStore } from '../stores/studentStore'
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
import { AccentTrainerMiniProgress } from '../components/dashboard/AccentTrainerMiniProgress'
import { Task5MiniProgress } from '../components/dashboard/Task5MiniProgress'
import { Task10MiniProgress } from '../components/dashboard/Task10MiniProgress'
import { MistakesCard } from '../components/dashboard/MistakesCard'
import { DashboardNotificationWidget } from '../components/dashboard/DashboardNotificationWidget'
import { DashboardDeadlineWidget } from '../components/dashboard/DashboardDeadlineWidget'
import { WhatToStudyToday } from '../components/WhatToStudyToday'

export function Dashboard() {
  const navigate = useNavigate()
  const [showXPModal, setShowXPModal] = useState(false)
  const stats = useProgressStore((s) => s.userStats)
  const activeProfile = useStudentStore((s) => s.getActiveProfile())
  const displayName = activeProfile?.name || stats.name || 'ученик'
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

      {/* Task 16 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task16-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№16</span>
            </div>
            <div>
              <p className="text-xs text-orange-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Пунктуация</p>
              <p className="text-xs text-gray-500">Сложные предложения</p>
            </div>
          </div>
          <div className="text-right">
            <ChevronRight size={24} className="text-orange-400" />
          </div>
        </div>
      </motion.div>

      {/* Task 6 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-cyan-50 to-sky-50 border-cyan-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task6-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№6</span>
            </div>
            <div>
              <p className="text-xs text-cyan-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Суффиксы</p>
              <p className="text-xs text-gray-500">Чередование в корнях</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-cyan-400" />
        </div>
      </motion.div>

      {/* Task 7 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task7-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-violet-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№7</span>
            </div>
            <div>
              <p className="text-xs text-violet-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Окончания глаголов</p>
              <p className="text-xs text-gray-500">I и II спряжение</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-violet-400" />
        </div>
      </motion.div>

      {/* Task 8 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task8-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№8</span>
            </div>
            <div>
              <p className="text-xs text-amber-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Слитное/раздельное</p>
              <p className="text-xs text-gray-500">Написание с НЕ</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-amber-400" />
        </div>
      </motion.div>

      {/* Task 9 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-lime-50 to-green-50 border-lime-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task9-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-lime-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№9</span>
            </div>
            <div>
              <p className="text-xs text-lime-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Пропущенные буквы</p>
              <p className="text-xs text-gray-500">Буквы в корнях</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-lime-400" />
        </div>
      </motion.div>

      {/* Task 11 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-pink-50 to-rose-50 border-pink-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task11-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-pink-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№11</span>
            </div>
            <div>
              <p className="text-xs text-pink-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Суффиксы прилагательных</p>
              <p className="text-xs text-gray-500">-нн- / -н-</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-pink-400" />
        </div>
      </motion.div>

      {/* Task 12 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task12-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№12</span>
            </div>
            <div>
              <p className="text-xs text-indigo-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Окончания причастий</p>
              <p className="text-xs text-gray-500">Причастия и деепричастия</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-indigo-400" />
        </div>
      </motion.div>

      {/* Task 13 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task13-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№13</span>
            </div>
            <div>
              <p className="text-xs text-teal-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">НЕ/НИ с причастиями</p>
              <p className="text-xs text-gray-500">Слитно или раздельно</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-teal-400" />
        </div>
      </motion.div>

      {/* Task 14 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-fuchsia-50 to-pink-50 border-fuchsia-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task14-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-fuchsia-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№14</span>
            </div>
            <div>
              <p className="text-xs text-fuchsia-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Слитное/раздельное/дефисное</p>
              <p className="text-xs text-gray-500">Наречия и предлоги</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-fuchsia-400" />
        </div>
      </motion.div>

      {/* Task 15 Trainer Card */}
      <motion.div
        className="card bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200"
        whileHover={{ scale: 1.01 }}
        onClick={() => navigate('/task15-trainer')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-500 flex items-center justify-center text-white">
              <span className="text-lg font-bold">№15</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide font-bold">Тренажёр</p>
              <p className="font-bold text-gray-800">Пунктуация</p>
              <p className="text-xs text-gray-500">Знаки препинания</p>
            </div>
          </div>
          <ChevronRight size={24} className="text-slate-400" />
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
