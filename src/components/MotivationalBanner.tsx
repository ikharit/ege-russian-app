import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { getMotivationalMessage, getToneColor, getToneIconBg } from '../utils/emotionalState'

const DISMISS_KEY = 'ege-motivational-banner-dismissed'

function getDismissedDate(): string | null {
  try { return localStorage.getItem(DISMISS_KEY) } catch { return null }
}

function setDismissedDate(date: string) {
  try { localStorage.setItem(DISMISS_KEY, date) } catch {}
}

export function MotivationalBanner() {
  const userStats = useProgressStore((s) => s.userStats)
  const emotionalState = userStats.emotionalState
  const [dismissedDate, setDismissedDateState] = useState(getDismissedDate())
  const today = new Date().toISOString().split('T')[0]

  const message = emotionalState
    ? getMotivationalMessage(emotionalState, userStats)
    : { text: 'Продолжай в том же духе! Каждый урок приближает к цели 🎯', tone: 'encouraging' as const, icon: '🎯' }

  const isDismissed = dismissedDate === today

  if (isDismissed) return null

  const handleDismiss = () => {
    setDismissedDate(today)
    setDismissedDateState(today)
  }

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className={`relative rounded-2xl border p-4 shadow-sm ${getToneColor(message.tone)}`}
        >
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${getToneIconBg(message.tone)}`}>
              {message.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold leading-snug">{message.text}</p>
            </div>
            <button
              onClick={handleDismiss}
              className="p-1.5 hover:bg-black/5 rounded-lg transition-colors shrink-0"
              aria-label="Скрыть"
            >
              <X size={16} className="opacity-50" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
