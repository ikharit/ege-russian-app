import { ReactNode, useState } from 'react'
import { Flame, Heart, Zap, User, Megaphone } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../stores/progressStore'
import { Popover } from './Popover'
import { motion } from 'framer-motion'
import { ProfileSwitcher } from './ProfileSwitcher'
import { StudentRegistrationModal } from './StudentRegistrationModal'
import { NotificationCenter } from './NotificationCenter'
import { LATEST_VERSION } from '../data/releaseNotes'
import { useShopStore } from '../stores/shopStore'

const RN_STORAGE_KEY = 'ege-release-notes-dismissed'
function isReleaseUnread(): boolean {
  try { return localStorage.getItem(RN_STORAGE_KEY) !== LATEST_VERSION } catch { return true }
}

export function Header({ syncIndicator }: { syncIndicator?: ReactNode }) {
  const navigate = useNavigate()
  const stats = useProgressStore((s) => s.userStats)
  const [showRegModal, setShowRegModal] = useState(false)

  const streakStart = stats.lastActivityDate
    ? new Date(new Date(stats.lastActivityDate).getTime() - (stats.streak - 1) * 86400000).toLocaleDateString('ru-RU')
    : '—'

  return (
    <header className="bg-white border-b border-gray-100 px-4 py-2.5 sticky top-0 z-50">
      <style>{`
        @keyframes xp-bounce { 0%,100%{transform:scale(1) rotate(0deg)} 20%{transform:scale(1.2) rotate(-2deg)} 40%{transform:scale(0.9) rotate(1deg)} 60%{transform:scale(1.15) rotate(-1deg)} 80%{transform:scale(1) rotate(0deg)} }
        @keyframes flame-flicker { 0%,100%{transform:scale(1);opacity:1} 25%{transform:scale(1.12);opacity:0.8} 50%{transform:scale(0.95);opacity:1} 75%{transform:scale(1.08);opacity:0.9} }
        @keyframes heart-pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes sparkle { 0%,100%{opacity:0;transform:scale(0)} 50%{opacity:1;transform:scale(1)} }
      `}</style>
      <div className="max-w-md mx-auto flex items-center justify-between">
        {/* Left: Logo + compact profile */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <img src="./icon.svg" alt="" className="w-8 h-8 rounded-lg" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <span className="font-bold text-duo-green text-lg">ЕГЭ Русский</span>
            <span className="hidden sm:inline text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-bold ml-1">v{LATEST_VERSION}</span>
          </div>
          <ProfileSwitcher onAddStudent={() => setShowRegModal(true)} />
        </div>

        {/* Right: stats only */}
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
              className="flex items-center gap-0.5 text-orange-500 cursor-pointer"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.2 }}
              animate={stats.streak > 0 ? { scale: [1, 1.08, 1] } : {}}
            >
              <Flame size={20} fill={stats.streak > 0 ? 'currentColor' : 'none'} className="animate-[flame-flicker_1.2s_ease-in-out_infinite]" />
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
              className="flex items-center gap-0.5 text-duo-red cursor-pointer"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.2 }}
            >
              <Heart size={20} fill={stats.hearts < stats.maxHearts ? 'currentColor' : 'none'} className="animate-[heart-pulse_1.2s_ease-in-out_infinite]" />
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
              className="flex items-center gap-0.5 text-duo-yellow cursor-pointer relative"
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.2 }}
            >
              <div className="absolute -top-1 -right-1 w-1 h-1 bg-yellow-400 rounded-full animate-[sparkle_1.5s_infinite]" style={{ animationDelay: '0s' }} />
              <div className="absolute -bottom-0.5 -left-1 w-0.5 h-0.5 bg-orange-400 rounded-full animate-[sparkle_1.5s_infinite]" style={{ animationDelay: '0.5s' }} />
              <Zap size={20} fill="currentColor" className="animate-[xp-bounce_2s_ease-in-out_infinite]" />
              <span className="font-bold text-sm">{stats.xp}</span>
            </motion.div>
          </Popover>

          {/* Notification Center */}
          <NotificationCenter />

          {/* What's New */}
          <motion.button
            onClick={() => navigate('/?scroll=news')}
            className="flex items-center text-gray-500 hover:text-duo-blue transition-colors relative"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <Megaphone size={18} />
            {isReleaseUnread() && (
              <span className="absolute -top-1.5 -right-1.5 w-2 h-2 bg-duo-red rounded-full" />
            )}
          </motion.button>

          {/* Profile */}
          <motion.button
            onClick={() => navigate('/profile')}
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.9 }}
          >
            <User size={18} />
          </motion.button>
        </div>
      </div>
      <StudentRegistrationModal isOpen={showRegModal} onClose={() => setShowRegModal(false)} />
    </header>
  )
}
