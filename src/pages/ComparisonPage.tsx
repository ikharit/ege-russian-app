import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Zap, Target, Flame, Timer, Trophy, AlertCircle } from 'lucide-react'
import { calculateComparisonStats, getPercentileLabel, getPercentileColor } from '../utils/comparisonEngine'

function PercentileBar({ label, value, norm, unit, percentile, color }: {
  label: string
  value: number
  norm: number
  unit: string
  percentile: number
  color: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700">{label}</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: color + '20', color }}>
            {getPercentileLabel(percentile)}
          </span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-gray-800">{value} {unit}</span>
          <span className="text-xs text-gray-400 ml-1">(норма: {norm})</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-3">
        <motion.div
          className="h-3 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentile}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
      <p className="text-xs text-gray-500">
        Ты быстрее {percentile}% учеников
      </p>
    </div>
  )
}

export function ComparisonPage() {
  const navigate = useNavigate()
  const stats = calculateComparisonStats()

  const metrics = [
    {
      label: 'Скорость',
      value: stats.details.speed.value,
      norm: stats.details.speed.norm,
      unit: stats.details.speed.label,
      percentile: stats.speedPercentile,
      color: getPercentileColor(stats.speedPercentile),
      icon: Timer,
    },
    {
      label: 'Точность',
      value: stats.details.accuracy.value,
      norm: stats.details.accuracy.norm,
      unit: stats.details.accuracy.label,
      percentile: stats.accuracyPercentile,
      color: getPercentileColor(stats.accuracyPercentile),
      icon: Target,
    },
    {
      label: 'Эффективность',
      value: stats.details.efficiency.value,
      norm: stats.details.efficiency.norm,
      unit: stats.details.efficiency.label,
      percentile: stats.efficiencyPercentile,
      color: getPercentileColor(stats.efficiencyPercentile),
      icon: Zap,
    },
    {
      label: 'Страйк',
      value: stats.details.streak.value,
      norm: stats.details.streak.norm,
      unit: stats.details.streak.label,
      percentile: stats.streakPercentile,
      color: getPercentileColor(stats.streakPercentile),
      icon: Flame,
    },
  ]

  return (
    <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/stats')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <TrendingUp size={24} className="text-duo-blue" />
          Сравнение с другими
        </h1>
      </div>

      {!stats.hasEnoughData ? (
        <div className="card bg-yellow-50 border-yellow-200 flex items-center gap-3 p-4">
          <AlertCircle size={24} className="text-yellow-500" />
          <div>
            <p className="font-bold text-sm text-gray-800">Недостаточно данных</p>
            <p className="text-xs text-gray-500">Реши 20 заданий, чтобы увидеть сравнение!</p>
          </div>
        </div>
      ) : (
        <>
          {/* Overall score */}
          <motion.div
            className="card bg-gradient-to-br from-duo-blue/10 to-white border-duo-blue/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-duo-blue uppercase tracking-wide font-bold">Общий перцентиль</p>
                <p className="text-3xl font-bold text-gray-800">{stats.overallPercentile}%</p>
              </div>
              <div className="w-16 h-16 rounded-full bg-duo-blue/10 flex items-center justify-center">
                <Trophy size={32} className="text-duo-blue" />
              </div>
            </div>
            <p className="text-sm font-bold mt-2" style={{ color: getPercentileColor(stats.overallPercentile) }}>
              {stats.motivation}
            </p>
          </motion.div>

          {/* Metrics */}
          <div className="card flex flex-col gap-5">
            <h3 className="font-bold text-gray-700">По метрикам</h3>
            {metrics.map((m, idx) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-start gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                  <m.icon size={16} style={{ color: m.color }} />
                </div>
                <div className="flex-1">
                  <PercentileBar
                    label={m.label}
                    value={m.value}
                    norm={m.norm}
                    unit={m.unit}
                    percentile={m.percentile}
                    color={m.color}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Task breakdown */}
          {stats.taskBreakdown.length > 0 && (
            <div className="card flex flex-col gap-3">
              <h3 className="font-bold text-gray-700">По заданиям</h3>
              <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
                {stats.taskBreakdown.map((task) => {
                  const color = getPercentileColor(task.percentile)
                  return (
                    <div key={task.taskNumber} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                      <span className="text-xs font-bold text-gray-700 w-16">Задание {task.taskNumber}</span>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${task.percentile}%`, backgroundColor: color }} />
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-bold" style={{ color }}>{task.percentile}%</p>
                        <p className="text-[10px] text-gray-400">{task.userAccuracy}% точность</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
