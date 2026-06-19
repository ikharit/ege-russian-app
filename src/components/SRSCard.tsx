import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RotateCcw, Zap } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import {
  getDueReviews,
  getDueThisWeek,
  calculateRetentionRate,
  getOverdueCount,
} from '../utils/spacedRepetition'

export function SRSCard() {
  const navigate = useNavigate()
  const srsData = useProgressStore((s) => s.srsData)
  const dueToday = getDueReviews(srsData)
  const dueWeek = getDueThisWeek(srsData)
  const overdueCount = getOverdueCount(srsData)
  const retentionRate = calculateRetentionRate(srsData)

  const dueTodayCount = dueToday.length
  const dueWeekCount = dueWeek.length

  if (dueTodayCount === 0 && overdueCount === 0 && dueWeekCount === 0) {
    return null
  }

  const handleReview = () => {
    if (dueToday.length > 0) {
      navigate(`/lesson/${dueToday[0].lessonId}`)
    } else if (dueWeek.length > 0) {
      navigate(`/lesson/${dueWeek[0].lessonId}`)
    }
  }

  return (
    <motion.div
      className="card bg-gradient-to-br from-duo-blue/5 to-white border-duo-blue/20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RotateCcw size={20} className="text-duo-blue" />
          <h3 className="font-bold text-gray-700">Интервальное повторение</h3>
        </div>
        {overdueCount > 0 && (
          <span className="text-xs font-bold bg-duo-red/10 text-duo-red px-2 py-0.5 rounded-full animate-pulse">
            Просрочено!
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-duo-blue">{dueTodayCount}</p>
          <p className="text-xs text-gray-500">Сегодня</p>
        </div>
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
          <p className="text-2xl font-bold text-duo-purple">{dueWeekCount}</p>
          <p className="text-xs text-gray-500">На этой неделе</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Retention rate</span>
          <span className="font-bold text-gray-700">{retentionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-duo-blue h-2 rounded-full transition-all"
            style={{ width: `${retentionRate}%` }}
          />
        </div>
      </div>

      <button
        onClick={handleReview}
        className="w-full py-2.5 rounded-xl bg-duo-blue text-white font-bold hover:bg-duo-blue-dark transition-colors flex items-center justify-center gap-2"
      >
        <Zap size={18} />
        Повторить сейчас
      </button>
    </motion.div>
  )
}
