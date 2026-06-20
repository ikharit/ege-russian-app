import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TrendingUp, Zap, Target, Timer, Flame } from 'lucide-react'
import { calculateComparisonStats, getPercentileColor, getPercentileLabel } from '../utils/comparisonEngine'

export function ComparisonStats() {
  const navigate = useNavigate()
  const stats = calculateComparisonStats()

  if (!stats.hasEnoughData) {
    return (
      <motion.div
        className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/comparison')}
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-duo-blue/10 flex items-center justify-center">
            <TrendingUp size={18} className="text-duo-blue" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-duo-blue uppercase tracking-wide font-bold">Сравнение</p>
            <p className="text-sm font-bold text-gray-800">Реши 20 заданий!</p>
            <p className="text-[10px] text-gray-400">Недостаточно данных для сравнения</p>
          </div>
        </div>
      </motion.div>
    )
  }

  // Найти лучшую метрику для показа
  const bestMetric = [
    { key: 'speed', label: 'Скорость', percentile: stats.speedPercentile, icon: Timer, unit: 'сек' },
    { key: 'accuracy', label: 'Точность', percentile: stats.accuracyPercentile, icon: Target, unit: '%' },
    { key: 'efficiency', label: 'Эффективность', percentile: stats.efficiencyPercentile, icon: Zap, unit: 'XP/день' },
    { key: 'streak', label: 'Страйк', percentile: stats.streakPercentile, icon: Flame, unit: 'дней' },
  ].sort((a, b) => b.percentile - a.percentile)[0]

  const color = getPercentileColor(bestMetric.percentile)
  const Icon = bestMetric.icon

  return (
    <motion.div
      className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate('/comparison')}
    >
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-lg bg-duo-blue/10 flex items-center justify-center">
          <Icon size={18} style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-xs text-duo-blue uppercase tracking-wide font-bold">Сравнение</p>
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: color + '20', color }}>
              {getPercentileLabel(bestMetric.percentile)}
            </span>
          </div>
          <p className="text-sm font-bold text-gray-800 truncate">
            Ты быстрее {bestMetric.percentile}% учеников! 🏃‍♂️
          </p>
          <p className="text-[10px] text-gray-400">По {bestMetric.label.toLowerCase()} — нажми для подробностей</p>
        </div>
      </div>
    </motion.div>
  )
}
