import { Flame, Heart, Gem, User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../stores/progressStore'
import { Popover } from './Popover'
import { motion } from 'framer-motion'

export function Header() {
  const navigate = useNavigate()
  const stats = useProgressStore((s) => s.userStats)

  const streakStart = stats.lastActivityDate
    ? new Date(new Date(stats.lastActivityDate).getTime() - (stats.streak - 1) * 86400000).toLocaleDateString('ru-RU')
    : '—'

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-50">
      <div className="max-w-md mx-auto flex items-center justify-between">
        <div className="flex items-center gap-1">
          <img src="./icon.svg" alt="" className="w-8 h-8 rounded-lg" onError={(e) => (e.currentTarget.style.display = 'none')} />
          <span className="font-bold text-duo-green text-lg">ЕГЭ Русский</span>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak */}
          <Popover
            content={
              <div>
                <p className="font-bold">🔥 Страйк дней</p>
                <p className="text-gray-300 text-xs mt-1">{stats.streak} дней подряд</p>
                {stats.streak > 0 && (
                  <p className="text-gray-400 text-xs">Начало: {streakStart}</p>
                )}
                <p className="text-gray-400 text-xs mt-1">Максимум: {stats.maxStreak}</p>
              </div>
            }
          >
            <motion.div
              className="flex items-center gap-1 text-orange-500 cursor-pointer"
              whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
              transition={{ duration: 0.3 }}
              animate={stats.streak > 0 ? { scale: [1, 1.1, 1] } : {}}
            >
              <Flame size={20} fill={stats.streak > 0 ? 'currentColor' : 'none'} />
              <span className="font-bold text-sm">{stats.streak}</span>
            </motion.div>
          </Popover>

          {/* Hearts */}
          <Popover
            content={
              <div>
                <p className="font-bold">❤️ Сердечки</p>
                <p className="text-gray-300 text-xs mt-1">{stats.hearts} / {stats.maxHearts}</p>
                <p className="text-gray-400 text-xs mt-1">Сердечки тратятся при ошибках.</p>
                <p className="text-gray-400 text-xs">Восстанавливаются по 1 каждые 4 часа.</p>
                {stats.infiniteHearts && (
                  <p className="text-duo-green text-xs mt-1 font-bold">♾️ Бесконечные сердечки включены!</p>
                )}
              </div>
            }
          >
            <motion.div
              className="flex items-center gap-1 text-duo-red cursor-pointer"
              whileHover={{ scale: 1.15, y: -2 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <Heart size={20} fill={stats.hearts < stats.maxHearts ? 'currentColor' : 'none'} />
              <span className="font-bold text-sm">{stats.hearts}</span>
            </motion.div>
          </Popover>

          {/* XP */}
          <Popover
            content={
              <div>
                <p className="font-bold">⚡ XP — очки опыта</p>
                <p className="text-gray-300 text-xs mt-1">Всего: {stats.xp} XP</p>
                <p className="text-gray-400 text-xs mt-1">Набираются за правильные ответы.</p>
                <p className="text-gray-400 text-xs">Уровень {stats.level}: нужно ещё {stats.level * 100 - stats.xp} XP</p>
              </div>
            }
          >
            <motion.div
              className="flex items-center gap-1 text-duo-blue cursor-pointer"
              whileHover={{ scale: 1.15, rotate: 360 }}
              transition={{ duration: 0.5 }}
            >
              <Gem size={20} />
              <span className="font-bold text-sm">{stats.xp}</span>
            </motion.div>
          </Popover>

          {/* Profile */}
          <motion.button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
            whileHover={{ scale: 1.15, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <User size={20} />
          </motion.button>
        </div>
      </div>
    </header>
  )
}
