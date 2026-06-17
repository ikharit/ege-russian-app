import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Medal, ArrowUp, ArrowDown, Minus, Flame } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'

export function Leaderboard() {
  const leaderboard = useProgressStore((s) => s.leaderboard)
  const userStats = useProgressStore((s) => s.userStats)
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('all')
  const [mode, setMode] = useState<'xp' | 'streak'>('xp')

  const currentUserEntry = {
    id: 'me',
    name: 'Вы',
    avatar: '🎓',
    xp: userStats.xp,
    level: userStats.level,
    streak: userStats.streak,
    maxStreak: userStats.maxStreak,
    lessonsCompleted: Object.values(useProgressStore.getState().lessonProgress).filter(l => l.status === 'completed').length
  }

  const sortedByXP = [...leaderboard, currentUserEntry].sort((a, b) => b.xp - a.xp)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }))

  const sortedByStreak = [...leaderboard, currentUserEntry].sort((a, b) => (b.streak || 0) - (a.streak || 0))
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }))

  const fullLeaderboard = mode === 'xp' ? sortedByXP : sortedByStreak

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown size={20} className="text-yellow-500" />
    if (rank === 2) return <Medal size={20} className="text-gray-400" />
    if (rank === 3) return <Medal size={20} className="text-amber-600" />
    return <span className="text-sm font-bold text-gray-400 w-5 text-center">{rank}</span>
  }

  const getTrend = (rank: number) => {
    const trends = ['up', 'down', 'same', 'up', 'same', 'down', 'up', 'same'] as const
    const trend = trends[rank % trends.length]
    if (trend === 'up') return <ArrowUp size={14} className="text-duo-green" />
    if (trend === 'down') return <ArrowDown size={14} className="text-duo-red" />
    return <Minus size={14} className="text-gray-400" />
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={28} className="text-duo-yellow" />
        <h1 className="text-2xl font-bold text-gray-800">Рейтинг</h1>
      </div>

      {/* Mode selector */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'xp' as const, label: 'По XP', icon: Trophy },
          { key: 'streak' as const, label: 'По страйку', icon: Flame },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${
              mode === m.key
                ? 'bg-duo-green text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            <m.icon size={14} />
            {m.label}
          </button>
        ))}
      </div>

      {/* Period selector */}
      <div className="flex gap-2 mb-6">
        {[
          { key: 'week' as const, label: 'Неделя' },
          { key: 'month' as const, label: 'Месяц' },
          { key: 'all' as const, label: 'Всё время' },
        ].map(p => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all ${
              period === p.key
                ? 'bg-duo-blue text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Top 3 podium */}
      <div className="flex items-end justify-center gap-3 mb-8">
        {fullLeaderboard.slice(0, 3).map((entry, idx) => {
          const heights = ['h-24', 'h-32', 'h-28']
          const positions = [2, 1, 3]
          const actualIdx = positions.indexOf(entry.rank)
          return (
            <motion.div
              key={entry.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <div className="text-2xl mb-1">{entry.avatar}</div>
              <div className={`${heights[actualIdx]} w-20 bg-duo-snow rounded-t-xl flex items-center justify-center relative border-2 border-b-0 ${
                entry.rank === 1 ? 'border-yellow-400 bg-yellow-50' : 
                entry.rank === 2 ? 'border-gray-300 bg-gray-50' : 'border-amber-600 bg-orange-50'
              }`}>
                <span className="text-2xl font-bold text-gray-700">{entry.rank}</span>
              </div>
              <div className="w-20 bg-white rounded-b-xl p-2 shadow-sm text-center">
                <p className="text-xs font-bold text-gray-800 truncate">{entry.name}</p>
                {mode === 'xp' ? (
                  <p className="text-xs text-duo-green font-bold">{entry.xp} XP</p>
                ) : (
                  <p className="text-xs text-orange-500 font-bold">🔥 {entry.streak || 0}</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Full list */}
      <div className="flex flex-col gap-2">
        {fullLeaderboard.map((entry, idx) => (
          <motion.div
            key={entry.id}
            className={`flex items-center gap-3 p-3 rounded-xl ${
              entry.id === 'me' ? 'bg-duo-green/10 border border-duo-green/20' : 'bg-white border border-gray-100'
            }`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
            <div className="text-2xl">{entry.avatar}</div>
            <div className="flex-1">
              <p className={`font-bold text-sm ${entry.id === 'me' ? 'text-duo-green' : 'text-gray-800'}`}>
                {entry.name}
              </p>
              <p className="text-xs text-gray-500">Уровень {entry.level} • {entry.lessonsCompleted} уроков</p>
            </div>
            <div className="text-right flex items-center gap-2">
              <div className="text-xs text-gray-400">{getTrend(entry.rank)}</div>
              <div>
                {mode === 'xp' ? (
                  <>
                    <p className="font-bold text-sm text-gray-800">{entry.xp}</p>
                    <p className="text-xs text-gray-400">XP</p>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-sm text-orange-500">🔥 {entry.streak || 0}</p>
                    <p className="text-xs text-gray-400">дней</p>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User position */}
      <div className="mt-6 card bg-duo-green/5 border border-duo-green/20">
        <p className="text-center text-sm text-gray-600">
          Ваше место: <span className="font-bold text-duo-green">#{fullLeaderboard.find(e => e.id === 'me')?.rank || '—'}</span>
        </p>
        <p className="text-center text-xs text-gray-500 mt-1">
          {mode === 'xp' 
            ? 'Решайте больше заданий, чтобы подняться выше!'
            : 'Занимайтесь каждый день, чтобы увеличить страйк!'}
        </p>
      </div>
    </div>
  )
}
