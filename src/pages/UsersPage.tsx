import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Search, Trophy, Zap, Flame, Target, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../stores/progressStore'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

interface UserProfile {
  id: string
  name: string
  email?: string
  xp: number
  level: number
  streak: number
  lessonsCompleted: number
  lastActive: string
  accuracy: number
}

export function UsersPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'xp' | 'level' | 'streak' | 'accuracy'>('xp')

  const isTeacher = useProgressStore((s) => s.isTeacher)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false)
      return
    }

    const loadUsers = async () => {
      setIsLoading(true)
      // Use SECURITY DEFINER RPC function (bypasses RLS) instead of user_progress
      const { data, error } = await supabase
        .rpc('get_all_users_basic')

      if (error) {
        console.error('Error loading users:', error)
        setIsLoading(false)
        return
      }

      const mapped: UserProfile[] = (data || []).map((row: any) => {
        const stats = row.user_stats || {}
        const lessons = row.lesson_progress || {}
        const taskStats = row.task_stats || {}
        const completedCount = Object.values(lessons).filter((l: any) => l.status === 'completed').length
        const taskStatArr = Object.values(taskStats) as { total: number; correct: number }[]
        const totalAttempts = taskStatArr.reduce((sum, s) => sum + (s.total || 0), 0)
        const correctAnswers = taskStatArr.reduce((sum, s) => sum + (s.correct || 0), 0)
        const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0

        return {
          id: row.user_id,
          name: stats.name || 'Ученик',
          email: stats.email,
          xp: stats.xp || 0,
          level: stats.level || 1,
          streak: stats.streak || 0,
          lessonsCompleted: completedCount,
          lastActive: row.updated_at || stats.lastActivityDate || '',
          accuracy,
        }
      })

      setUsers(mapped)
      setIsLoading(false)
    }

    loadUsers()
  }, [])

  const filtered = users
    .filter(u => u.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'xp') return b.xp - a.xp
      if (sortBy === 'level') return b.level - a.level
      if (sortBy === 'streak') return b.streak - a.streak
      return b.accuracy - a.accuracy
    })

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800">Все пользователи</h1>
          <p className="text-xs text-gray-500">{users.length} зарегистрированных</p>
        </div>
      </div>

      {!isTeacher && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-xs text-amber-800">
          Режим учителя позволяет видеть email и детальную статистику каждого пользователя.
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Поиск по имени..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-duo-green"
        />
      </div>

      {/* Sort */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'xp' as const, label: 'XP', icon: Zap },
          { key: 'level' as const, label: 'Уровень', icon: Trophy },
          { key: 'streak' as const, label: 'Страйк', icon: Flame },
          { key: 'accuracy' as const, label: 'Точность', icon: Target },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setSortBy(s.key)}
            className={`flex-1 py-2 px-1 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              sortBy === s.key
                ? 'bg-duo-green text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <s.icon size={16} />
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-gray-100 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-gray-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-3 bg-gray-200 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-12">
          <Users size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500">Пользователей не найдено</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((user, idx) => (
            <motion.div
              key={user.id}
              className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 flex justify-center">
                  <span className="text-sm font-bold text-gray-400">{idx + 1}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-duo-green/10 flex items-center justify-center text-lg">
                  👤
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-gray-800 truncate">{user.name}</p>
                  {isTeacher && user.email && (
                    <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-0.5"><Zap size={12} className="text-duo-yellow" /> {user.xp}</span>
                    <span className="flex items-center gap-0.5"><Flame size={12} className="text-orange-500" /> {user.streak}</span>
                    <span className="flex items-center gap-0.5"><Target size={12} className="text-duo-blue" /> {user.lessonsCompleted}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{user.accuracy}%</p>
                  <p className="text-[10px] text-gray-400">точность</p>
                </div>
              </div>
              {user.lastActive && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-gray-400">
                  <Calendar size={10} />
                  <span>Последняя активность: {new Date(user.lastActive).toLocaleDateString('ru-RU')}</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
