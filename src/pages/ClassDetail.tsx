import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Users, BookOpen, GraduationCap, Zap, Target } from 'lucide-react'
import { useClassStore } from '../stores/classStore'
import { useStudentStore } from '../stores/studentStore'
import { useProgressStore } from '../stores/progressStore'

export function ClassDetail() {
  const { classId } = useParams<{ classId: string }>()
  const navigate = useNavigate()
  const classRoom = useClassStore((s) => classId ? s.getClassById(classId) : null)
  const getLeaderboard = useClassStore((s) => s.getLeaderboard)
  const activeProfile = useStudentStore((s) => s.getActiveProfile())
  const userStats = useProgressStore((s) => s.userStats)

  useEffect(() => {
    if (!classRoom) {
      // Allow a short delay for hydration before redirecting
      const timer = setTimeout(() => {
        if (!useClassStore.getState().getClassById(classId || '')) {
          navigate('/')
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [classRoom, classId, navigate])

  if (!classRoom) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duo-green mx-auto" />
        <p className="text-gray-500 mt-4">Загрузка...</p>
      </div>
    )
  }

  const leaderboard = getLeaderboard(classRoom.id)
  const myRank = activeProfile
    ? leaderboard.findIndex(e => e.profileId === activeProfile.id) + 1
    : -1

  const totalLessons = Object.values(userStats || {}).length > 0
    ? Object.values(useProgressStore.getState().lessonProgress || {}).filter(l => l.status === 'completed').length
    : 0

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-gray-500 mb-4"
      >
        <ArrowLeft size={18} /> Назад
      </button>

      {/* Header */}
      <div className="card mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-duo-blue flex items-center justify-center text-white">
            <GraduationCap size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{classRoom.name}</h1>
            <p className="text-sm text-gray-500">Учитель: {classRoom.teacherName}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-duo-snow rounded-xl p-2 text-center">
            <p className="text-xl font-bold text-duo-green">{classRoom.students.length}</p>
            <p className="text-xs text-gray-500">Учеников</p>
          </div>
          <div className="bg-duo-snow rounded-xl p-2 text-center">
            <p className="text-xl font-bold text-duo-blue">{classRoom.homework.length}</p>
            <p className="text-xs text-gray-500">ДЗ</p>
          </div>
          <div className="bg-duo-snow rounded-xl p-2 text-center">
            <p className="text-xl font-bold text-duo-purple">
              {myRank > 0 ? `#${myRank}` : '—'}
            </p>
            <p className="text-xs text-gray-500">Место</p>
          </div>
        </div>
      </div>

      {/* My progress card */}
      {activeProfile && (
        <motion.div
          className="card bg-gradient-to-br from-duo-green/10 to-duo-green/5 border-duo-green/20 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap size={20} className="text-duo-green" />
            <h3 className="font-bold text-gray-700">Мой прогресс</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="text-center">
              <p className="text-lg font-bold text-duo-yellow">{userStats.xp}</p>
              <p className="text-xs text-gray-500">XP</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-duo-blue">{totalLessons}</p>
              <p className="text-xs text-gray-500">Уроков</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-duo-purple">{userStats.streak}</p>
              <p className="text-xs text-gray-500">Стрик</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Homework */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen size={20} className="text-duo-blue" />
          <h3 className="font-bold text-gray-700">Домашнее задание</h3>
        </div>
        {classRoom.homework.length === 0 ? (
          <div className="card text-center py-6">
            <p className="text-sm text-gray-500">Нет активных заданий</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {classRoom.homework.map((hw) => {
              const isOverdue = new Date(hw.deadline) < new Date()
              return (
                <motion.div
                  key={hw.id}
                  className={`card ${isOverdue ? 'border-duo-red/30' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{hw.taskTitle}</p>
                      <p className={`text-xs ${isOverdue ? 'text-duo-red' : 'text-gray-500'}`}>
                        Дедлайн: {new Date(hw.deadline).toLocaleDateString('ru-RU')}
                        {isOverdue && ' (просрочено)'}
                      </p>
                    </div>
                    <Target size={16} className={isOverdue ? 'text-duo-red' : 'text-duo-blue'} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={20} className="text-duo-yellow" />
          <h3 className="font-bold text-gray-700">Лидерборд класса</h3>
        </div>
        {leaderboard.length === 0 ? (
          <div className="card text-center py-6">
            <p className="text-sm text-gray-500">Пока нет участников</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {leaderboard.map((entry, idx) => (
              <motion.div
                key={entry.profileId}
                className={`card flex items-center gap-3 ${
                  activeProfile?.id === entry.profileId ? 'bg-duo-green/5 border-duo-green/20' : ''
                } ${idx === 0 ? 'bg-yellow-50 border-yellow-200' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                  idx === 0 ? 'bg-yellow-400 text-white' :
                  idx === 1 ? 'bg-gray-300 text-white' :
                  idx === 2 ? 'bg-amber-600 text-white' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {idx + 1}
                </div>
                <span className="text-2xl">{entry.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">
                    {entry.name}
                    {activeProfile?.id === entry.profileId && (
                      <span className="text-xs text-duo-green ml-1">(вы)</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-500">{entry.lessonsCompleted} уроков • {entry.accuracy}% точность</p>
                </div>
                <span className="text-sm font-bold text-duo-yellow">{entry.xp} XP</span>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
