import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Zap, Trophy, Flame, Target, Clock, Heart, Star, Brain, TrendingUp } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { getRankByLevel, getNextRank, getXPToNextLevel } from '../data/ranks'
import { RankBadge } from './RankBadge'

interface XPDetailModalProps {
  isOpen: boolean
  onClose: () => void
}

export function XPDetailModal({ isOpen, onClose }: XPDetailModalProps) {
  const userStats = useProgressStore((s) => s.userStats)
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const atomProgress = useProgressStore((s) => s.atomProgress)

  const rank = getRankByLevel(userStats.level)
  const nextRank = getNextRank(userStats.level)
  const xpInfo = getXPToNextLevel(userStats.xp)

  const completedLessons = Object.values(lessonProgress).filter(l => l.status === 'completed')
  const perfectLessons = completedLessons.filter(l => l.score === 100)
  const masteredAtoms = Object.values(atomProgress).filter(a => a.masteryLevel === 'mastered').length
  const learningAtoms = Object.values(atomProgress).filter(a => a.masteryLevel === 'learning' || a.masteryLevel === 'review').length

  const totalTime = userStats.totalLessonTimeMinutes || 0
  const totalQuestions = userStats.totalQuestionsAnswered || 0
  const totalHeartsLost = userStats.totalHeartsLost || 0

  const progressPct = (xpInfo.current / 100) * 100

  const statsCards = [
    { icon: Target, label: 'Уроков пройдено', value: completedLessons.length, color: 'text-duo-green', bg: 'bg-duo-green/10' },
    { icon: Star, label: 'Идеальных уроков', value: perfectLessons.length, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { icon: Brain, label: 'Атомов освоено', value: masteredAtoms, color: 'text-duo-purple', bg: 'bg-duo-purple/10' },
    { icon: Clock, label: 'Минут в уроках', value: totalTime, color: 'text-duo-blue', bg: 'bg-duo-blue/10' },
    { icon: Zap, label: 'Вопросов решено', value: totalQuestions, color: 'text-duo-yellow', bg: 'bg-duo-yellow/10' },
    { icon: Heart, label: 'Жизней потеряно', value: totalHeartsLost, color: 'text-duo-red', bg: 'bg-duo-red/10' },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />

          {/* Modal */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10"
            >
              <X size={20} className="text-gray-500" />
            </button>

            {/* Header */}
            <div className="px-6 pt-8 pb-4 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', delay: 0.1 }}
              >
                <RankBadge level={userStats.level} size="lg" showName />
              </motion.div>

              <h2 className="text-2xl font-bold text-gray-800 mt-3">
                {rank.name}
              </h2>
              <p className="text-sm text-gray-500">{rank.description}</p>

              {/* XP Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-gray-700">Уровень {userStats.level}</span>
                  <span className="text-gray-500">Уровень {xpInfo.nextLevel}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: rank.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
                <div className="flex justify-between text-xs mt-1">
                  <span className="font-bold" style={{ color: rank.color }}>{xpInfo.current} XP</span>
                  <span className="text-gray-400">{xpInfo.needed} XP до следующего</span>
                </div>
              </div>

              {/* Next rank info */}
              {nextRank && (
                <div className="mt-3 text-xs text-gray-500">
                  Следующее звание: <span className="font-bold" style={{ color: nextRank.color }}>{nextRank.name}</span> (уровень {nextRank.minLevel})
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="px-6 pb-4">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">
                Ты молодец! Вот твои достижения:
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {statsCards.map((card, idx) => (
                  <motion.div
                    key={card.label}
                    className="bg-gray-50 rounded-xl p-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`${card.bg} p-1.5 rounded-lg`}>
                        <card.icon size={14} className={card.color} />
                      </div>
                      <span className="text-xs text-gray-500">{card.label}</span>
                    </div>
                    <p className={`text-xl font-bold ${card.color}`}>{card.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Streak highlight */}
            <div className="px-6 pb-6">
              <motion.div
                className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center gap-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <Flame size={24} className="text-orange-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">Страйк: {userStats.streak} дней</p>
                  <p className="text-xs text-gray-500">Максимум: {userStats.maxStreak} дней</p>
                  {userStats.streak === 0 ? (
                    <p className="text-xs text-orange-600 mt-1">Начни заниматься сегодня!</p>
                  ) : (
                    <p className="text-xs text-orange-600 mt-1">Так держать!</p>
                  )}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
