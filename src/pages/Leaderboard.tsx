import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Crown, Medal, ArrowUp, ArrowDown, Minus, Flame, Zap, Target, Calendar, BookOpen, TrendingUp } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { Popover } from '../components/Popover'
import { getStatusById } from '../data/statuses'
import { allHomework } from '../data/gsheets/homeworkData'

function getPeriodStart(period: 'week' | 'month' | 'all'): Date {
  const now = new Date()
  if (period === 'week') {
    const d = new Date(now)
    d.setDate(d.getDate() - 7)
    return d
  }
  if (period === 'month') {
    const d = new Date(now)
    d.setDate(d.getDate() - 30)
    return d
  }
  return new Date(0)
}

export function Leaderboard() {
  const leaderboard = useProgressStore((s) => s.leaderboard)
  const userStats = useProgressStore((s) => s.userStats)
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const [period, setPeriod] = useState<'week' | 'month' | 'all'>('all')
  const [mode, setMode] = useState<'xp' | 'streak' | 'homework' | 'accuracy'>('xp')

  const checkRanks = useProgressStore((s) => s.checkLeaderboardRanks)
  useEffect(() => {
    checkRanks()
  }, [checkRanks, period, mode])

  const completedCount = Object.values(lessonProgress).filter(l => l.status === 'completed').length

  const currentUserEntry = {
    id: 'me',
    name: 'Вы',
    avatar: '🎓',
    xp: userStats.xp,
    level: userStats.level,
    streak: userStats.streak,
    lessonsCompleted: completedCount,
    achievements: useProgressStore((s) => s.achievements),
    updatedAt: userStats.lastActivityDate || new Date().toISOString()
  }

  const periodStart = getPeriodStart(period)

  const filtered = useMemo(() => {
    const all = [...leaderboard, currentUserEntry]
      .filter(e => period === 'all' || new Date(e.updatedAt) >= periodStart)
    return all
  }, [leaderboard, currentUserEntry, period, periodStart])

  const sortedByXP = [...filtered].sort((a, b) => b.xp - a.xp)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }))

  const sortedByStreak = [...filtered].sort((a, b) => (b.streak || 0) - (a.streak || 0))
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }))

  const sortedByAchievements = [...filtered].sort((a, b) => (b.achievements?.length || 0) - (a.achievements?.length || 0))
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }))

  const sortedByAccuracy = [...filtered]
    .filter(e => e.lessonsCompleted > 0)
    .map(e => ({ 
      ...e, 
      accuracy: e.lessonsCompleted > 0 ? Math.round((e.xp / (e.lessonsCompleted * 20)) * 100) : 0 
    }))
    .sort((a, b) => (b as any).accuracy - (a as any).accuracy)
    .map((entry, idx) => ({ ...entry, rank: idx + 1 }))

  // Homework champions — real students only
  const homeworkRankings = useMemo(() => {
    const entries = Object.entries(allHomework)
      .filter(([_, hw]) => hw.history.length > 0)
      .map(([name, hw]) => {
        const total = hw.history.length
        const done = hw.history.filter(h => h.status === 'да').length
        const percent = total > 0 ? Math.round((done / total) * 100) : 0
        return {
          id: name,
          name,
          avatar: '👨‍🎓',
          xp: percent,
          level: 1,
          streak: done,
          lessonsCompleted: total,
          updatedAt: hw.current?.date || '',
          rank: 0,
          homeworkPercent: percent,
          homeworkDone: done,
          homeworkTotal: total,
        }
      })
      .sort((a, b) => b.homeworkPercent - a.homeworkPercent)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }))
    return entries
  }, [])

  const fullLeaderboard = mode === 'xp' ? sortedByXP 
    : mode === 'streak' ? sortedByStreak 
    : mode === 'accuracy' ? sortedByAccuracy
    : homeworkRankings

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

  const getPlayerPopover = (entry: typeof fullLeaderboard[0]) => {
    const status = entry.id === 'me' 
      ? getStatusById(useProgressStore.getState().userStats.activeStatus || '')
      : undefined
    return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-2xl">{entry.avatar}</span>
        <div>
          <p className="font-bold text-white">{entry.name}</p>
          <p className="text-xs text-gray-400">Уровень {entry.level}</p>
        </div>
      </div>
      {status && (
        <div 
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ backgroundColor: status.color + '30', color: status.color }}
        >
          <span>{status.emoji}</span>
          <span>{status.name}</span>
        </div>
      )}
      <div className="grid grid-cols-2 gap-2 mt-2">
        <div className="bg-gray-800 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-duo-yellow">
            <Zap size={12} />
            <span className="font-bold">{entry.xp}</span>
          </div>
          <p className="text-xs text-gray-400">XP</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-400">
            <Flame size={12} />
            <span className="font-bold">{entry.streak || 0}</span>
          </div>
          <p className="text-xs text-gray-400">Страйк</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-duo-green">
            <Target size={12} />
            <span className="font-bold">{entry.lessonsCompleted}</span>
          </div>
          <p className="text-xs text-gray-400">Уроков</p>
        </div>
        <div className="bg-gray-800 rounded-lg p-2 text-center">
          <div className="flex items-center justify-center gap-1 text-duo-blue">
            <Calendar size={12} />
            <span className="font-bold">{new Date(entry.updatedAt).toLocaleDateString('ru-RU')}</span>
          </div>
          <p className="text-xs text-gray-400">Активность</p>
        </div>
      </div>
    </div>
  )}

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-2 mb-6">
        <Trophy size={28} className="text-duo-yellow" />
        <h1 className="text-2xl font-bold text-gray-800">Рейтинг</h1>
      </div>

      {/* Weekly Challenge Badge */}
      {period === 'week' && fullLeaderboard.length > 0 && (
        <motion.div 
          className="card bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200 mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3">
            <Crown size={24} className="text-yellow-500" />
            <div>
              <p className="text-sm font-bold text-gray-800">🏆 Лидер недели</p>
              <p className="text-xs text-gray-500">
                {fullLeaderboard[0].name} — {mode === 'xp' ? `${fullLeaderboard[0].xp} XP` : 
                  mode === 'streak' ? `🔥 ${fullLeaderboard[0].streak || 0} дней` :
                  mode === 'accuracy' ? `${(fullLeaderboard[0] as any).accuracy || 0}% точность` :
                  `${(fullLeaderboard[0] as any).homeworkPercent}% домашки`}
              </p>
            </div>
          </div>
        </motion.div>
      )}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'xp' as const, label: 'По XP', icon: Trophy },
          { key: 'streak' as const, label: 'По страйку', icon: Flame },
          { key: 'accuracy' as const, label: 'По точности', icon: TrendingUp },
          { key: 'homework' as const, label: 'По домашке', icon: BookOpen },
        ].map(m => (
          <button
            key={m.key}
            onClick={() => setMode(m.key)}
            className={`flex-1 py-3 px-2 rounded-xl text-sm font-bold transition-all flex flex-col items-center justify-center gap-1 ${
              mode === m.key
                ? 'bg-duo-green text-white shadow-md'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <m.icon size={20} className={mode === m.key ? 'text-white' : 'text-gray-400'} />
            <span className="text-xs">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Period selector — hidden for homework mode */}
      {mode !== 'homework' && (
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
      )}

      {mode === 'homework' && (
        <p className="text-xs text-gray-400 text-center mb-4">Реальные ученики из Google Sheets</p>
      )}

      {fullLeaderboard.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500">Нет данных за выбранный период</p>
          <p className="text-xs text-gray-400 mt-2">Попробуйте выбрать другой период</p>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {fullLeaderboard.length >= 3 && (
            <div className="flex items-end justify-center gap-3 mb-8">
              {(() => {
                const top3 = fullLeaderboard.slice(0, 3)
                const maxVal = Math.max(...top3.map(e => {
                  const values: Record<string, number> = {
                    xp: e.xp,
                    streak: e.streak || 0,
                    achievements: (e as any).achievements?.length || 0,
                    accuracy: (e as any).accuracy || 0,
                    homework: (e as any).homeworkPercent || 0,
                  }
                  return values[mode] || 0
                }))
                const minHeight = 90
                const maxHeight = 170
                const getHeight = (entry: typeof top3[0]) => {
                  const values: Record<string, number> = {
                    xp: entry.xp,
                    streak: entry.streak || 0,
                    achievements: (entry as any).achievements?.length || 0,
                    accuracy: (entry as any).accuracy || 0,
                    homework: (entry as any).homeworkPercent || 0,
                  }
                  const val = values[mode] || 0
                  return minHeight + (val / maxVal) * (maxHeight - minHeight)
                }
                return [1, 0, 2].map(podiumIdx => {
                  const entry = fullLeaderboard[podiumIdx]
                  if (!entry) return null
                  const height = getHeight(entry)
                  return (
                    <motion.div
                      key={entry.id}
                      className="flex flex-col items-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: podiumIdx * 0.1 }}
                    >
                      <div className="text-2xl mb-1 relative">
                        {entry.avatar}
                        {entry.rank === 1 && (
                          <Crown size={20} className="text-yellow-500 absolute -top-3 left-1/2 -translate-x-1/2" />
                        )}
                      </div>
                      <div
                        style={{ height: `${height}px` }}
                        className={`w-20 bg-duo-snow rounded-t-xl flex items-center justify-center relative border-2 border-b-0 ${
                          entry.rank === 1 ? 'border-yellow-400 bg-yellow-50 shadow-lg shadow-yellow-200/50' :
                          entry.rank === 2 ? 'border-gray-300 bg-gray-50' : 'border-amber-600 bg-orange-50'
                        }`}
                      >
                        <span className="text-2xl font-bold text-gray-700">{entry.rank}</span>
                      </div>
                      <div className={`w-20 rounded-b-xl p-2 shadow-sm text-center ${
                        entry.rank === 1 ? 'bg-yellow-100' : 'bg-white'
                      }`}>
                        <p className="text-xs font-bold text-gray-800 truncate">{entry.name}</p>
                        {mode === 'xp' ? (
                          <p className="text-xs text-duo-green font-bold">{entry.xp} XP</p>
                        ) : mode === 'streak' ? (
                          <p className="text-xs text-orange-500 font-bold">🔥 {entry.streak || 0}</p>
                        ) : mode === 'accuracy' ? (
                          <p className="text-xs text-duo-blue font-bold">{(entry as any).accuracy || 0}%</p>
                        ) : (
                          <p className="text-xs text-duo-blue font-bold">{(entry as any).homeworkPercent}%</p>
                        )}
                      </div>
                    </motion.div>
                  )
                })
              })()}
            </div>
          )}

          {/* Full list */}
          <div className="flex flex-col gap-2">
            {fullLeaderboard.map((entry, idx) => (
              <Popover key={entry.id} position="left" content={getPlayerPopover(entry)}>
                <motion.div
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:shadow-md transition-shadow ${
                    entry.id === 'me' ? 'bg-duo-green/10 border border-duo-green/20' : 'bg-white border border-gray-100'
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="w-8 flex justify-center">{getRankIcon(entry.rank)}</div>
                  <div className="text-2xl">{entry.avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className={`font-bold text-sm ${entry.id === 'me' ? 'text-duo-green' : 'text-gray-800'}`}>
                        {entry.name}
                      </p>
                      {entry.id === 'me' && (
                        (() => {
                          const myStatus = getStatusById(useProgressStore.getState().userStats.activeStatus || '')
                          return myStatus ? (
                            <span 
                              className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                              style={{ backgroundColor: myStatus.color + '20', color: myStatus.color }}
                            >
                              {myStatus.emoji}
                            </span>
                          ) : null
                        })()
                      )}
                    </div>
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
                      ) : mode === 'streak' ? (
                        <>
                          <p className="font-bold text-sm text-orange-500">🔥 {entry.streak || 0}</p>
                          <p className="text-xs text-gray-400">дней</p>
                        </>
                      ) : mode === 'accuracy' ? (
                        <>
                          <p className="font-bold text-sm text-duo-blue">{(entry as any).accuracy || 0}%</p>
                          <p className="text-xs text-gray-400">точность</p>
                        </>
                      ) : (
                        <>
                          <p className="font-bold text-sm text-duo-blue">{(entry as any).homeworkPercent}%</p>
                          <p className="text-xs text-gray-400">{(entry as any).homeworkDone}/{(entry as any).homeworkTotal} сдано</p>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Popover>
            ))}
          </div>
        </>
      )}

      {/* User position */}
      <div className="mt-6 card bg-duo-green/5 border border-duo-green/20">
        <p className="text-center text-sm text-gray-600">
          Ваше место: <span className="font-bold text-duo-green">#{fullLeaderboard.find(e => e.id === 'me')?.rank || '—'}</span>
        </p>
        <p className="text-center text-xs text-gray-500 mt-1">
          {mode === 'xp' 
            ? 'Решайте больше заданий, чтобы подняться выше!'
            : mode === 'streak'
            ? 'Занимайтесь каждый день, чтобы увеличить страйк!'
            : mode === 'accuracy'
            ? 'Отвечайте правильно чаще, чтобы повысить точность!'
            : 'Выполняйте домашнее задание, чтобы быть в топе!'}
        </p>
      </div>
    </div>
  )
}
