import { motion } from 'framer-motion'
import { Check, Gift, Target, Zap, Clock, Star, Flame, BookOpen } from 'lucide-react'
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

export function DailyQuests() {
  const dailyQuestProgress = useProgressStore((s) => s.dailyQuestProgress)
  const updateQuestProgress = useProgressStore((s) => s.updateQuestProgress)
  const claimQuestReward = useProgressStore((s) => s.claimQuestReward)
  const addXP = useProgressStore((s) => s.addXP)

  const today = new Date().toISOString().split('T')[0]

  const questsWithProgress = useMemo(() => {
    return dailyQuests.map(quest => {
      const prog = dailyQuestProgress[quest.id]
      const isToday = prog?.date === today
      const current = isToday ? (prog?.current || 0) : 0
      const completed = isToday && prog?.completed
      const claimed = isToday && prog?.claimed
      const percent = Math.min(100, Math.round((current / quest.target) * 100))
      return { ...quest, current, completed, claimed, percent }
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
          return (
            <motion.div
              key={quest.id}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                quest.claimed ? 'bg-green-50' : 'bg-gray-50'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                quest.claimed ? 'bg-duo-green text-white' : 
                quest.completed ? 'bg-duo-yellow text-white' : 
                'bg-gray-200 text-gray-500'
              }`}>
                {quest.claimed ? <Check size={18} /> : <Icon size={18} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className={`font-bold text-sm ${quest.claimed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {quest.title}
                  </p>
                  <span className="text-xs font-bold text-duo-yellow flex items-center gap-0.5">
                    <Zap size={10} />
                    {quest.rewardXP}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{quest.description}</p>

                {/* Progress bar */}
                {!quest.claimed && (
                  <div className="mt-1">
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <motion.div
                        className={`h-1.5 rounded-full ${quest.completed ? 'bg-duo-yellow' : 'bg-duo-green'}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${quest.percent}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {quest.current} / {quest.target}
                    </p>
                  </div>
                )}
              </div>

              {/* Claim button */}
              {quest.completed && !quest.claimed && (
                <motion.button
                  className="bg-duo-green text-white px-3 py-1 rounded-lg text-xs font-bold shrink-0"
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
