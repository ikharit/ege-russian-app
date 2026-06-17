import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Trophy, Flame, Star, Heart, Zap, Trash2, Download } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { achievements as allAchievements, getAchievementProgress } from '../data/achievements'
import { getAchievementIcon } from '../data/achievementIcons'
import { Popover } from '../components/Popover'

export function Profile() {
  const navigate = useNavigate()
  const stats = useProgressStore((s) => s.userStats)
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const achievements = useProgressStore((s) => s.achievements)
  const setUserName = useProgressStore((s) => s.setUserName)
  const toggleInfiniteHearts = useProgressStore((s) => s.toggleInfiniteHearts)
  const incrementExportCount = useProgressStore((s) => s.incrementExportCount)
  const name = useProgressStore((s) => s.userStats.name || 'ученик')

  const [isEditing, setIsEditing] = useState(false)
  const nameRef = useRef<HTMLInputElement>(null)

  const completedLessons = Object.values(lessonProgress).filter(l => l.status === 'completed').length
  const totalQuestions = Object.values(lessonProgress).reduce((sum, lp) => sum + (lp.attempts || 0), 0)
  const bestScore = Object.values(lessonProgress).reduce((max, lp) => Math.max(max, lp.bestScore || 0), 0)

  const handleNameSave = () => {
    const newName = nameRef.current?.value.trim()
    if (newName) {
      setUserName(newName)
    }
    setIsEditing(false)
  }

  const handleReset = () => {
    if (confirm('Весь прогресс будет удалён безвозвратно. Продолжить?')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  const handleExport = () => {
    incrementExportCount()
    const data = {
      userStats: stats,
      lessonProgress,
      achievements,
      exportedAt: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ege-progress-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Профиль</h1>
      </div>

      {/* Avatar + Name */}
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-duo-green flex items-center justify-center text-white">
          <User size={40} />
        </div>
        {isEditing ? (
          <div className="flex items-center justify-center gap-2">
            <input
              ref={nameRef}
              defaultValue={name}
              autoFocus
              className="border-2 border-duo-green rounded-lg px-3 py-1 text-center font-bold text-gray-800 focus:outline-none"
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
            />
            <button onClick={handleNameSave} className="text-duo-green font-bold text-sm">OK</button>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl font-bold text-gray-800">{name}</h2>
            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-gray-600 text-sm">
              ✎
            </button>
          </div>
        )}
        <p className="text-gray-500 text-sm">Уровень {stats.level}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="card flex items-center gap-3">
          <Zap size={20} className="text-duo-yellow" />
          <div>
            <p className="text-lg font-bold">{stats.xp}</p>
            <p className="text-xs text-gray-500">XP</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Flame size={20} className="text-orange-500" />
          <div>
            <p className="text-lg font-bold">{stats.streak}</p>
            <p className="text-xs text-gray-500">Дней подряд</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Heart size={20} className="text-red-500" />
          <div>
            <p className="text-lg font-bold">{stats.hearts}/{stats.maxHearts}</p>
            <p className="text-xs text-gray-500">Сердечки</p>
          </div>
        </div>
        <div className="card flex items-center gap-3">
          <Trophy size={20} className="text-duo-purple" />
          <div>
            <p className="text-lg font-bold">{stats.maxStreak}</p>
            <p className="text-xs text-gray-500">Рекорд</p>
          </div>
        </div>
      </div>

      {/* Infinite Hearts Toggle - moved up for visibility */}
      <div className="card flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart size={20} className="text-red-500" />
          <div>
            <p className="font-bold text-sm text-gray-800">Бесконечные сердечки</p>
            <p className="text-xs text-gray-500">Не терять жизни при ошибках</p>
          </div>
        </div>
        <button
          onClick={toggleInfiniteHearts}
          className={`w-12 h-6 rounded-full transition-colors relative ${
            stats.infiniteHearts ? 'bg-duo-green' : 'bg-gray-300'
          }`}
        >
          <div
            className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
              stats.infiniteHearts ? 'translate-x-6' : 'translate-x-0.5'
            }`}
          />
        </button>
      </div>

      {/* Progress details */}
      <div className="card">
        <h3 className="font-bold text-gray-700 mb-3">Прогресс</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Уроков пройдено</span><span className="font-bold">{completedLessons}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Всего попыток</span><span className="font-bold">{totalQuestions}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Лучший результат</span><span className="font-bold">{bestScore}%</span></div>
        </div>
      </div>

      {/* Achievements with popover */}
      <Popover
        position="top"
        content={
          <div className="space-y-3 max-h-80 overflow-y-auto">
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
                  .map(ach => {
                    const Icon = getAchievementIcon(ach.id)
                    return (
                      <div key={ach.id} className="flex items-center gap-2 bg-gray-800 rounded-lg p-2">
                        <div className="w-8 h-8 rounded-full bg-duo-green/20 flex items-center justify-center">
                          <Icon size={16} className="text-duo-green" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{ach.title}</p>
                          <p className="text-xs text-gray-400">{ach.description}</p>
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <p className="text-xs text-gray-400">Пока нет достижений. Продолжай учиться!</p>
            )}
            
            {allAchievements.filter(ach => !achievements.includes(ach.id)).length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-400">Осталось:</p>
                {allAchievements
                  .filter(ach => !achievements.includes(ach.id))
                  .slice(0, 5)
                  .map(ach => {
                    const Icon = getAchievementIcon(ach.id)
                    const progress = getAchievementProgress(ach.id, stats, lessonProgress)
                    const pct = progress.target > 1 ? Math.min(100, Math.round((progress.current / progress.target) * 100)) : 0
                    return (
                      <div key={ach.id} className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-2">
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                          <Icon size={16} className="text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-400">{ach.title}</p>
                          {progress.target > 1 && (
                            <div className="w-full bg-gray-700 rounded-full h-1 mt-1">
                              <div className="bg-gray-500 h-1 rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                {allAchievements.filter(ach => !achievements.includes(ach.id)).length > 5 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{allAchievements.filter(ach => !achievements.includes(ach.id)).length - 5} ещё...
                  </p>
                )}
              </div>
            )}
          </div>
        }
      >
        <div className="card cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700">Достижения</h3>
            <span className="text-sm font-bold text-duo-green">{achievements.length}/{allAchievements.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
            <div 
              className="bg-duo-green h-2.5 rounded-full transition-all"
              style={{ width: `${(achievements.length / allAchievements.length) * 100}%` }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {allAchievements
              .filter(ach => achievements.includes(ach.id))
              .slice(0, 6)
              .map(ach => {
                const Icon = getAchievementIcon(ach.id)
                return (
                  <div key={ach.id} className="w-9 h-9 rounded-full bg-duo-green/10 flex items-center justify-center">
                    <Icon size={18} className="text-duo-green" />
                  </div>
                )
              })}
            {achievements.length > 6 && (
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-500">+{achievements.length - 6}</span>
              </div>
            )}
            {achievements.length === 0 && (
              <p className="text-xs text-gray-400">Нет достижений</p>
            )}
          </div>
        </div>
      </Popover>

      {/* Full achievement list */}
      <div className="card">
        <h3 className="font-bold text-gray-700 mb-3">Все достижения</h3>
        <div className="flex flex-col gap-2">
          {allAchievements.map((ach) => {
            const unlocked = achievements.includes(ach.id)
            const Icon = getAchievementIcon(ach.id)
            const progress = getAchievementProgress(ach.id, stats, lessonProgress)
            const hasProgress = progress.target > 1
            const percent = hasProgress ? Math.min(100, Math.round((progress.current / progress.target) * 100)) : 0
            
            return (
              <div key={ach.id} className={`flex flex-col gap-1 p-2 rounded-lg ${unlocked ? 'bg-green-50' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${unlocked ? 'bg-duo-green text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <Icon size={16} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-bold text-sm ${unlocked ? 'text-gray-800' : 'text-gray-400'}`}>{ach.title}</p>
                    <p className="text-xs text-gray-500">{ach.description}</p>
                  </div>
                  {unlocked && <Star size={16} className="text-duo-yellow shrink-0" />}
                </div>
                {!unlocked && hasProgress && (
                  <div className="ml-11">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div className="bg-duo-green h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{progress.current} / {progress.target}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button onClick={handleExport} className="card flex items-center gap-3 text-left hover:bg-gray-50 transition-colors">
          <Download size={20} className="text-duo-blue" />
          <div>
            <p className="font-bold text-sm">Экспорт прогресса</p>
            <p className="text-xs text-gray-500">Сохранить JSON-файл</p>
          </div>
        </button>
        <button onClick={handleReset} className="card flex items-center gap-3 text-left hover:bg-red-50 transition-colors border-red-200">
          <Trash2 size={20} className="text-red-500" />
          <div>
            <p className="font-bold text-sm text-red-600">Сбросить прогресс</p>
            <p className="text-xs text-gray-500">Удалить все данные</p>
          </div>
        </button>
      </div>
    </div>
  )
}
