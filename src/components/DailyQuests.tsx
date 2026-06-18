import { motion, AnimatePresence } from 'framer-motion'
import { Check, Gift, Target, Zap, Clock, Star, Flame, BookOpen, Sparkles } from 'lucide-react'
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
  questions: { bg: 'bg-emerald-100', icon: 'text-emerald-600', ring: 'ring-emerald-400' },
  lessons: { bg: 'bg-blue-100', icon: 'text-blue-600', ring: 'ring-blue-400' },
  perfect: { bg: 'bg-amber-100', icon: 'text-amber-600', ring: 'ring-amber-400' },
  time: { bg: 'bg-sky-100', icon: 'text-sky-600', ring: 'ring-sky-400' },
  streak: { bg: 'bg-orange-100', icon: 'text-orange-600', ring: 'ring-orange-400' },
}

export function DailyQuests() {
  const dailyQuestProgress = useProgressStore((s) => s.dailyQuestProgress)
  const updateQuestProgress = useProgressStore((s) => s.updateQuestProgress)
  const claimQuestReward = useProgressStore((s) => s.claimQuestReward)
  const addXP = useProgressStore((s) => s.addXP)

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
    // Sort: claimed first, then completed, then active, then not started
    return quests.sort((a, b) => {
      const score = (q: typeof a) => q.claimed ? 3 : q.completed ? 2 : q.percent > 0 ? 1 : 0
      return score(b) - score(a)
    })
  }, [dailyQuestProgress, today])

  const handleClaim = (questId: string, rewardXP: number) => {
    const success = claimQuestReward(questId)
    if (success) {
      // XP already added by store
    }
  }

  const totalReward = questsWithProgress
    .filter(q => q.completed && !q.claimed)
    .reduce((sum, q) => sum + q.rewardXP, 0)

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={20} className="text-duo-purple" />
          <h3 className="font-bold text-gray-700">Ежедневные квесты</h3>
        </div>
        {totalReward > 0 && (
          <motion.button
            className="flex items-center gap-1 bg-duo-green text-white px-3 py-1 rounded-full text-xs font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              questsWithProgress.forEach(q => {
                if (q.completed && !q.claimed) handleClaim(q.id, q.rewardXP)
              })
            }}
          >
            <Gift size={14} />
            Забрать {totalReward} XP
          </motion.button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {questsWithProgress.map((quest, idx) => {
          const Icon = typeIcons[quest.type]
          const colors = typeColors[quest.type]
          const isNotStarted = !quest.claimed && !quest.completed && quest.percent === 0
          return (
            <motion.div
              key={quest.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                quest.claimed 
                  ? 'bg-green-50/60 border border-green-200' 
                  : quest.completed 
                    ? 'bg-amber-50 border border-amber-200 shadow-sm' 
                    : isNotStarted
                      ? 'bg-gray-50 border border-gray-100 opacity-40'
                      : 'bg-white border border-gray-200 shadow-sm'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              {/* Icon with state-based styling */}
              <div className="relative">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                  quest.claimed 
                    ? 'bg-duo-green text-white scale-110' 
                    : quest.completed 
                      ? `${colors.bg} ${colors.icon} ring-2 ${colors.ring} ring-offset-2` 
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
                        <Sparkles size={20} />
                      </motion.div>
                    ) : quest.completed ? (
                      <motion.div
                        key="completed"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <Check size={20} strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="default"
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                      >
                        <Icon size={20} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Little check badge for completed */}
                {quest.completed && !quest.claimed && (
                  <motion.div
                    className="absolute -top-1 -right-1 w-4 h-4 bg-duo-green rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <Check size={10} className="text-white" strokeWidth={3} />
                  </motion.div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`font-bold text-sm ${
                    quest.claimed ? 'text-gray-400 line-through' : 
                    quest.completed ? 'text-gray-800' : 
                    isNotStarted ? 'text-gray-400' : 'text-gray-700'
                  }`}>
                    {quest.title}
                  </p>
                  <span className={`text-xs font-bold flex items-center gap-0.5 ${
                    quest.claimed ? 'text-duo-green' : 'text-duo-yellow'
                  }`}>
                    <Zap size={10} />
                    {quest.rewardXP}
                  </span>
                </div>
                <p className={`text-xs ${quest.claimed || isNotStarted ? 'text-gray-400' : 'text-gray-500'}`}>{quest.description}</p>

                {/* Progress bar — hidden for not started, colored for active/completed */}
                {!quest.claimed && !isNotStarted && (
                  <div className="mt-1.5">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div
                        className={`h-2 rounded-full ${
                          quest.completed 
                            ? 'bg-duo-yellow' 
                            : quest.percent > 60 
                              ? 'bg-emerald-400' 
                              : quest.percent > 30 
                                ? 'bg-amber-400' 
                                : 'bg-gray-400'
                        }`}
                        initial={{ width: 0 }}
                        animate={{ width: `${quest.percent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <div className="flex justify-between mt-0.5">
                      <p className="text-xs text-gray-400">
                        {quest.current} / {quest.target}
                      </p>
                      {quest.percent > 0 && quest.percent < 100 && (
                        <p className="text-xs text-gray-400">{quest.percent}%</p>
                      )}
                    </div>
                  </div>
                )}
                {/* For not started, show just a faint hint */}
                {isNotStarted && (
                  <p className="text-xs text-gray-300 mt-1">Ещё не начато</p>
                )}
              </div>

              {/* Claim button */}
              {quest.completed && !quest.claimed && (
                <motion.button
                  className="bg-duo-green text-white px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleClaim(quest.id, quest.rewardXP)}
                >
                  Забрать
                </motion.button>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
