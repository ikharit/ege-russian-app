import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Zap, Star, Trophy } from 'lucide-react'

interface ComboToast {
  id: number
  combo: number
  message: string
  icon: 'flame' | 'zap' | 'star' | 'trophy'
}

let toastId = 0

export function useComboToasts() {
  const [toasts, setToasts] = useState<ComboToast[]>([])

  const showComboToast = (combo: number) => {
    if (combo < 3) return
    let message = ''
    let icon: ComboToast['icon'] = 'flame'
    if (combo >= 10) {
      message = `🔥🔥🔥 Комбо x${combo}! Бонус XP x3!`
      icon = 'trophy'
    } else if (combo >= 7) {
      message = `🔥🔥 Комбо x${combo}! Бонус XP x2.5!`
      icon = 'star'
    } else if (combo >= 5) {
      message = `🔥 Комбо x${combo}! Бонус XP x2!`
      icon = 'zap'
    } else if (combo >= 3) {
      message = `🔥 Комбо x${combo}! Отличная серия!`
      icon = 'flame'
    }
    const id = ++toastId
    setToasts(prev => [...prev, { id, combo, message, icon }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 2500)
  }

  const ToastOverlay = () => (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col items-center justify-start pt-20 gap-2">
      <AnimatePresence>
        {toasts.map(t => {
          const Icon = { flame: Flame, zap: Zap, star: Star, trophy: Trophy }[t.icon]
          return (
            <motion.div
              key={t.id}
              className="bg-gray-900/90 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 pointer-events-auto"
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <Icon size={22} className={t.combo >= 10 ? 'text-yellow-400' : t.combo >= 5 ? 'text-orange-400' : 'text-red-400'} />
              <span className="font-bold text-sm">{t.message}</span>
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )

  return { showComboToast, ToastOverlay }
}
