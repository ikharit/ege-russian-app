import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Award, Star, Flame, Trophy, Zap, Crown, BookOpen, Heart, Moon, Sun, Calendar, Timer, Repeat, Download, Infinity } from 'lucide-react'
import type { Achievement } from '../types'

const iconMap: Record<string, React.ElementType> = {
  Star, Flame, Trophy, Zap, Crown, Award, BookOpen, Heart, Moon, Sun, Calendar, Timer, Repeat, Download, Infinity
}

interface ToastProps {
  achievement: Achievement | null
  onClose: () => void
}

export function AchievementToast({ achievement, onClose }: ToastProps) {
  useEffect(() => {
    if (achievement) {
      const timer = setTimeout(onClose, 5000)
      return () => clearTimeout(timer)
    }
  }, [achievement, onClose])

  if (!achievement) return null

  const Icon = iconMap[achievement.icon] || Award

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="fixed top-4 left-0 right-0 z-[100] flex justify-center px-4 pointer-events-none"
      >
        <div className="bg-gray-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex items-center gap-4 max-w-sm w-full pointer-events-auto border border-gray-700">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-duo-green to-duo-blue flex items-center justify-center shrink-0">
            <Icon size={24} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">Достижение разблокировано!</p>
            <p className="font-bold text-sm truncate">{achievement.title}</p>
            <p className="text-xs text-gray-400">{achievement.description}</p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white shrink-0">
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
