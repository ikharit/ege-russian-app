import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Trophy, Zap, Flame, Users, Plus, Target, UserPlus, School } from 'lucide-react'
import { useStudentStore } from '../stores/studentStore'
import { useProgressStore } from '../stores/progressStore'
import { useClassStore } from '../stores/classStore'

interface Challenge {
  id: string
  title: string
  description: string
  metric: 'xp' | 'streak' | 'lessons' | 'accuracy'
  target: number
  duration: 'week' | 'month'
  participants: { profileId: string; progress: number }[]
  startDate: string
  endDate: string
}

export function ChallengesPage() {
  const navigate = useNavigate()
  const profiles = useStudentStore((s) => s.profiles)
  const getProfileStats = useStudentStore((s) => s.getProfileStats)
  const userStats = useProgressStore((s) => s.userStats)
  const activeProfile = useStudentStore((s) => s.getActiveProfile())
  const getStudentClass = useClassStore((s) => s.getStudentClass)
  const getLeaderboard = useClassStore((s) => s.getLeaderboard)
  const studentClass = activeProfile ? getStudentClass(activeProfile.id) : null
  const classLeaderboard = studentClass ? getLeaderboard(studentClass.id) : []
  const myClassRank = activeProfile && studentClass
    ? classLeaderboard.findIndex(e => e.profileId === activeProfile.id) + 1
    : -1

  const [activeTab, setActiveTab] = useState<'challenges' | 'class'>('challenges')

  const [challenges] = useState<Challenge[]>([
    {
      id: 'challenge-1',
      title: 'XP Марафон',
      description: 'Кто наберёт больше XP за неделю?',
      metric: 'xp',
      target: 500,
      duration: 'week',
      participants: profiles.map((p) => ({
        profileId: p.id,
        progress: getProfileStats(p.id).xp,
      })),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    },
    {
      id: 'challenge-2',
      title: 'Огненный страйк',
      description: 'Поддержи streak 7 дней',
      metric: 'streak',
      target: 7,
      duration: 'week',
      participants: profiles.map((p) => ({
        profileId: p.id,
        progress: getProfileStats(p.id).streak,
      })),
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 86400000).toISOString(),
    },
  ])

  const getIcon = (metric: string) => {
    switch (metric) {
      case 'xp': return <Zap size={20} className="text-duo-yellow" />
      case 'streak': return <Flame size={20} className="text-orange-500" />
      case 'lessons': return <Target size={20} className="text-duo-blue" />
      default: return <Trophy size={20} className="text-duo-green" />
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Соревнования</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'challenges' as const, label: 'Челленджи', icon: Trophy },
          { key: 'class' as const, label: 'Класс', icon: School },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === tab.key
                ? 'bg-duo-green text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'challenges' && (
        <>
          {challenges.map((challenge) => {
            const sorted = [...challenge.participants].sort((a, b) => b.progress - a.progress)
            const leader = sorted[0]
            const leaderProfile = profiles.find((p) => p.id === leader?.profileId)

            return (
              <motion.div
                key={challenge.id}
                className="card"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  {getIcon(challenge.metric)}
                  <div>
                    <p className="font-bold text-gray-800">{challenge.title}</p>
                    <p className="text-xs text-gray-500">{challenge.description}</p>
                  </div>
                </div>

                {leaderProfile && (
                  <div className="p-3 bg-yellow-50 rounded-xl mb-3">
                    <div className="flex items-center gap-2">
                      <Trophy size={16} className="text-yellow-500" />
                      <span className="text-sm font-bold">Лидер: {leaderProfile.emoji} {leaderProfile.name}</span>
                      <span className="text-sm text-gray-500 ml-auto">{leader.progress} / {challenge.target}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-yellow-400 h-2 rounded-full"
                        style={{ width: `${Math.min(100, (leader.progress / challenge.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  {sorted.slice(0, 3).map((participant, idx) => {
                    const profile = profiles.find((p) => p.id === participant.profileId)
                    if (!profile) return null
                    return (
                      <div key={participant.profileId} className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-400 w-4">{idx + 1}</span>
                        <span className="text-lg">{profile.emoji}</span>
                        <span className="text-sm flex-1">{profile.name}</span>
                        <span className="text-sm font-bold">{participant.progress}</span>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}

          <button
            onClick={() => navigate('/leaderboard')}
            className="card flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
          >
            <Users size={20} className="text-duo-blue" />
            <div>
              <p className="font-bold text-sm">Общий рейтинг</p>
              <p className="text-xs text-gray-500">Все участники</p>
            </div>
          </button>
        </>
      )}

      {activeTab === 'class' && (
        <div className="flex flex-col gap-4">
          {studentClass ? (
            <>
              <div className="card">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
                    <School size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{studentClass.name}</p>
                    <p className="text-xs text-gray-500">{studentClass.teacherName} • {studentClass.students.length} учеников</p>
                  </div>
                  {myClassRank > 0 && (
                    <div className="ml-auto flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                      <Trophy size={14} className="text-yellow-500" />
                      <span className="text-xs font-bold text-gray-600">#{myClassRank}</span>
                    </div>
                  )}
                </div>
              </div>

              {classLeaderboard.length === 0 ? (
                <div className="card text-center py-8">
                  <Trophy size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">Пока нет данных</p>
                </div>
              ) : (
                classLeaderboard.map((entry, idx) => (
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
                ))
              )}
            </>
          ) : (
            <div className="card text-center py-12">
              <School size={48} className="text-gray-300 mx-auto mb-4" />
              <h3 className="font-bold text-gray-700 mb-2">Вы не в классе</h3>
              <p className="text-sm text-gray-500 mb-6">Присоединитесь к классу учителя, чтобы участвовать в классовом рейтинге</p>
              <button
                onClick={() => navigate('/join-class')}
                className="btn-primary flex items-center justify-center gap-2 mx-auto"
              >
                <UserPlus size={16} />
                Присоединиться к классу
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
