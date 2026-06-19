import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Gift, Target, Zap, Clock, Star, Flame, BookOpen, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { dailyQuests } from '../data/dailyQuests'
import { useMemo } from 'react'

const typeIcons = {
  questions: Target,
  lessons: BookOpen,
  perfect: Star,
  time: Clock,
  streak: Flame,
}

const typeColors = {
  questions: { bg: 'bg-emerald-100', icon: 'text-emerald-600', ring: 'ring-emerald-400', bar: 'bg-emerald-400' },
  lessons: { bg: 'bg-blue-100', icon: 'text-blue-600', ring: 'ring-blue-400', bar: 'bg-blue-400' },
  perfect: { bg: 'bg-amber-100', icon: 'text-amber-600', ring: 'ring-amber-400', bar: 'bg-amber-400' },
  time: { bg: 'bg-sky-100', icon: 'text-sky-600', ring: 'ring-sky-400', bar: 'bg-sky-400' },
  streak: { bg: 'bg-orange-100', icon: 'text-orange-600', ring: 'ring-orange-400', bar: 'bg-orange-400' },
}

export function DailyQuests() {
  const dailyQuestProgress = useProgressStore((s) => s.dailyQuestProgress)
  const claimQuestReward = useProgressStore((s) => s.claimQuestReward)
  const [showCompleted, setShowCompleted] = useState(false)
  const [showNotStarted, setShowNotStarted] = useState(false)

  const today = new Date().toISOString().split('T')[0]

  const questsWithProgress = useMemo(() => {
    const quests = dailyQuests.map(quest => {
      const prog = dailyQuestProgress[quest.id]
      const isToday = prog?.date === today
      const current = isToday ? (prog?.current || 0) : 0
      const completed = isToday && prog?.completed
      const claimed = isToday && prog?.claimed
      const percent = Math.min(100, Math.round((current / quest.target) * 100))
      return { ...quest, current, completed, claimed, percent }
    })
    return quests
  }, [dailyQuestProgress, today])

  const activeQuests = questsWithProgress.filter(q => !q.claimed && q.percent > 0)
  const completedQuests = questsWithProgress.filter(q => q.completed && !q.claimed)
  const claimedQuests = questsWithProgress.filter(q => q.claimed)
  const notStartedQuests = questsWithProgress.filter(q => !q.claimed && !q.completed && q.percent === 0)

  const handleClaim = (questId: string) => {
    claimQuestReward(questId)
  }

  const totalReward = completedQuests.reduce((sum, q) => sum + q.rewardXP, 0)

  const QuestCard = ({ quest }: { quest: typeof questsWithProgress[0] }) => {
    const Icon = typeIcons[quest.type]
    const colors = typeColors[quest.type]
    const isNotStarted = !quest.claimed && !quest.completed && quest.percent === 0

    return (
      <motion.div
        key={quest.id}
        className={`flex items-center gap-2 p-2 rounded-xl border transition-all duration-300 ${
          quest.claimed
            ? 'bg-green-50/60 border-green-200'
            : quest.completed
              ? 'bg-amber-50 border-amber-200 shadow-sm'
              : isNotStarted
                ? 'bg-gray-50 border-gray-100 opacity-50'
                : 'bg-white border-gray-200 shadow-sm'
        }`}
        whileHover={!quest.claimed ? { scale: 1.02 } : undefined}
        whileTap={!quest.claimed ? { scale: 0.98 } : undefined}
      >
        {/* Icon with state-based styling */}
        <div className="relative shrink-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 ${
            quest.claimed
              ? 'bg-duo-green text-white'
              : quest.completed
                ? `${colors.bg} ${colors.icon} ring-2 ${colors.ring} ring-offset-1`
                : isNotStarted
                  ? 'bg-gray-200 text-gray-400 grayscale'
                  : `${colors.bg} ${colors.icon}`
          }`}>
            <AnimatePresence mode="wait">
              {quest.claimed ? (
                <motion.div
                  key="claimed"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  exit={{ scale: 0 }}
                >
                  <Sparkles size={16} />
                </motion.div>
              ) : quest.completed ? (
                <motion.div
                  key="completed"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check size={16} strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  <Icon size={16} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Little check badge for completed */}
          {quest.completed && !quest.claimed && (
            <motion.div
              className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-duo-green rounded-full flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
            >
              <Check size={8} className="text-white" strokeWidth={3} />
            </motion.div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className={`text-xs font-bold truncate ${
              quest.claimed ? 'text-gray-400 line-through' :
              quest.completed ? 'text-gray-800' :
              isNotStarted ? 'text-gray-400' : 'text-gray-700'
            }`}>
              {quest.title}
            </p>
            <span className={`text-[10px] font-bold flex items-center gap-0.5 shrink-0 ${
              quest.claimed ? 'text-duo-green' : 'text-duo-yellow'
            }`}>
              <Zap size={10} />
              {quest.rewardXP}
            </span>
          </div>

          {/* Progress bar — hidden for not started, colored for active/completed */}
          {!quest.claimed && !isNotStarted && (
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <motion.div
                  className={`h-1.5 rounded-full ${
                    quest.completed
                      ? 'bg-duo-yellow'
                      : quest.percent > 60
                        ? colors.bar
                        : quest.percent > 30
                          ? 'bg-amber-400'
                          : 'bg-gray-400'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${quest.percent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {quest.current} / {quest.target}
              </p>
            </div>
          )}
          {/* For not started, show faint dash */}
          {isNotStarted && (
            <p className="text-[10px] text-gray-300 mt-0.5">—</p>
          )}
        </div>

        {/* Claim button */}
        {quest.completed && !quest.claimed && (
          <motion.button
            className="bg-duo-green text-white px-2 py-0.5 rounded-md text-[10px] font-bold shrink-0 shadow-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleClaim(quest.id)}
          >
            Забрать
          </motion.button>
        )}
      </motion.div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-duo-purple" />
          <h3 className="font-bold text-gray-700 text-sm">Ежедневные квесты</h3>
          <span className="text-[10px] text-gray-400 font-medium">{claimedQuests.length}/{dailyQuests.length}</span>
        </div>
        {totalReward > 0 && (
          <motion.button
            className="flex items-center gap-1 bg-duo-green text-white px-2.5 py-1 rounded-full text-[10px] font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              completedQuests.forEach(q => handleClaim(q.id))
            }}
          >
            <Gift size={12} />
            Забрать {totalReward} XP
          </motion.button>
        )}
      </div>

      {/* Active + Completed (not claimed) — always visible */}
      {(activeQuests.length > 0 || completedQuests.length > 0) && (
        <div className="grid grid-cols-2 gap-2 mb-2">
          {[...activeQuests, ...completedQuests].map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      )}

      {/* Claimed — collapsible */}
      {claimedQuests.length > 0 && (
        <div className="border-t border-gray-100 pt-2">
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold hover:text-gray-600 transition-colors mb-1"
          >
            {showCompleted ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            Завершено ({claimedQuests.length})
          </button>
          <AnimatePresence>
            {showCompleted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-2 gap-2 overflow-hidden"
              >
                {claimedQuests.map(quest => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Not started — collapsible */}
      {notStartedQuests.length > 0 && (
        <div className={`border-t border-gray-100 pt-2 ${claimedQuests.length > 0 ? 'mt-1' : ''}`}>
          <button
            onClick={() => setShowNotStarted(!showNotStarted)}
            className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold hover:text-gray-600 transition-colors mb-1"
          >
            {showNotStarted ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            Не начато ({notStartedQuests.length})
          </button>
          <AnimatePresence>
            {showNotStarted && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-2 gap-2 overflow-hidden"
              >
                {notStartedQuests.map(quest => (
                  <QuestCard key={quest.id} quest={quest} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
