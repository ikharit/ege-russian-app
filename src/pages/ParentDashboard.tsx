import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Trophy, Flame, BookOpen, Target, TrendingUp, Calendar, AlertTriangle, Zap, FileText } from 'lucide-react'
import { useStudentStore } from '../stores/studentStore'
import { useProgressStore } from '../stores/progressStore'
import { allHomework } from '../data/gsheets/homeworkData'

export function ParentDashboard() {
  const navigate = useNavigate()
  const profiles = useStudentStore((s) => s.profiles)
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(
    profiles.length > 0 ? profiles[0].id : null
  )

  const getProfileStats = useStudentStore((s) => s.getProfileStats)
  const stats = selectedProfileId ? getProfileStats(selectedProfileId) : null
  const profile = profiles.find((p) => p.id === selectedProfileId)

  // Get homework deadlines for this student
  const homeworkEntries = selectedProfileId
    ? Object.entries(allHomework).filter(([name]) => name === profile?.name)
    : []

  const hasHomework = homeworkEntries.length > 0
  const currentHomework = hasHomework ? homeworkEntries[0][1].current : null

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Родительский кабинет</h1>
        {selectedProfileId && (
          <button
            onClick={() => {
              import('../utils/pdfGenerator').then(({ generateParentReportHTML, openReportInNewTab }) => {
                const html = generateParentReportHTML(selectedProfileId)
                openReportInNewTab(html)
              })
            }}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-duo-green text-white rounded-xl font-bold text-sm hover:bg-duo-green-dark transition-colors shadow-md"
          >
            <FileText size={16} />
            Отчёт PDF
          </button>
        )}
      </div>

      {/* Child selector */}
      {profiles.length === 0 ? (
        <div className="card text-center py-8">
          <Users size={48} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Нет зарегистрированных учеников</p>
          <p className="text-sm text-gray-400 mt-1">
            Создайте профиль в настройках
          </p>
        </div>
      ) : (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {profiles.map((p) => (
            <button
              key={p.id}
              onClick={() => setSelectedProfileId(p.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${
                selectedProfileId === p.id
                  ? 'bg-duo-green text-white shadow-md'
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-lg">{p.emoji}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      )}

      {/* Stats grid */}
      {stats && (
        <>
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              className="card flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Zap size={20} className="text-duo-yellow" />
              <div>
                <p className="text-lg font-bold">{stats.xp}</p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
            </motion.div>

            <motion.div
              className="card flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Flame size={20} className="text-orange-500" />
              <div>
                <p className="text-lg font-bold">{stats.streak}</p>
                <p className="text-xs text-gray-500">Дней подряд</p>
              </div>
            </motion.div>

            <motion.div
              className="card flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <BookOpen size={20} className="text-duo-blue" />
              <div>
                <p className="text-lg font-bold">{stats.lessonsCompleted}</p>
                <p className="text-xs text-gray-500">Уроков пройдено</p>
              </div>
            </motion.div>

            <motion.div
              className="card flex items-center gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Target size={20} className="text-duo-green" />
              <div>
                <p className="text-lg font-bold">{stats.accuracy}%</p>
                <p className="text-xs text-gray-500">Точность</p>
              </div>
            </motion.div>
          </div>

          {/* Weak topics */}
          {stats.weakTopics.length > 0 && (
            <motion.div
              className="card border-l-4 border-red-400"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle size={18} className="text-red-500" />
                <p className="font-bold text-gray-800">Стоит подтянуть</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {stats.weakTopics.map((topic) => (
                  <span
                    key={topic}
                    className="px-2 py-1 bg-red-50 text-red-600 rounded-lg text-xs font-bold"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </motion.div>
          )}

          {/* Activity history */}
          {profile && profile.history.length > 0 && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp size={18} className="text-duo-blue" />
                <p className="font-bold text-gray-800">Активность</p>
              </div>
              <div className="flex items-end gap-1 h-24">
                {profile.history.slice(-14).map((h, i) => (
                  <motion.div
                    key={h.date}
                    className="flex-1 bg-duo-green rounded-t-sm min-w-[16px]"
                    style={{ height: `${Math.max(10, (h.xp / Math.max(...profile.history.map((h2) => h2.xp))) * 100)}%` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(10, (h.xp / Math.max(...profile.history.map((h2) => h2.xp))) * 100)}%` }}
                    transition={{ delay: i * 0.05 }}
                    title={`${h.date}: ${h.xp} XP, ${h.lessonsCompleted} уроков`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-2 text-center">
                Последние {Math.min(14, profile.history.length)} дней
              </p>
            </div>
          )}

          {/* Homework */}
          {hasHomework && currentHomework && (
            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Calendar size={18} className="text-duo-blue" />
                <p className="font-bold text-gray-800">Домашнее задание</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <p className="font-bold text-sm">{currentHomework?.homework}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Дедлайн: {currentHomework?.date || 'Не указан'}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
