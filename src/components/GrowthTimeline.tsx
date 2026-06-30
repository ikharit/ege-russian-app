import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts'
import { useProgressStore } from '../stores/progressStore'
import { Play, Pause, TrendingUp, RotateCcw, Calendar, Trophy, Target } from 'lucide-react'

export interface GrowthDataPoint {
  date: string
  dateLabel: string
  xp: number
  level: number
  accuracy: number
  lessonsCompleted: number
  events: string[]
}

// Generate demo data if real data is sparse
function generateDemoData(): GrowthDataPoint[] {
  const points: GrowthDataPoint[] = []
  const today = new Date()
  let xp = 0
  let lessons = 0
  let level = 1

  for (let i = 59; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]

    const dailyXP = Math.floor(Math.random() * 120) + (i % 7 === 0 ? 200 : 0)
    xp += dailyXP

    const dailyLessons = Math.floor(Math.random() * 3) + (i % 7 === 0 ? 2 : 0)
    lessons += dailyLessons

    const newLevel = Math.floor(xp / 500) + 1
    const levelUp = newLevel > level
    level = newLevel

    const accuracy = Math.min(95, Math.max(40, 55 + Math.sin(i * 0.15) * 20 + Math.random() * 10))

    const events: string[] = []
    if (levelUp) events.push(`Получен уровень ${level}`)
    if (i % 14 === 0) events.push(`Пройден вариант ${Math.floor((59 - i) / 14) + 1}`)
    if (i % 10 === 3) events.push('Новое достижение')

    points.push({
      date: dateStr,
      dateLabel: `${d.getDate()}.${d.getMonth() + 1}`,
      xp,
      level,
      accuracy: Math.round(accuracy),
      lessonsCompleted: lessons,
      events,
    })
  }

  return points
}

function buildGrowthData(
  answerHistory: { timestamp: string; correct: boolean }[],
  examResults: { date: string; variantId: string; secondaryScore: number }[],
  userStats: { xp: number; level: number },
  lessonProgress: Record<string, { status: string; completedAt?: string; xpEarned?: number }>,
  predictiveScoreHistory: { date: string; score: number }[]
): GrowthDataPoint[] {
  // Collect all dates
  const dateMap = new Map<string, GrowthDataPoint>()

  // Process answer history
  const sortedAnswers = [...answerHistory].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
  let cumulativeXP = 0
  let cumulativeLessons = 0
  let currentLevel = 1
  let lastLevel = 1

  const dayAnswers = new Map<string, { correct: number; total: number }>()
  for (const ans of sortedAnswers) {
    const day = ans.timestamp.split('T')[0]
    const prev = dayAnswers.get(day) || { correct: 0, total: 0 }
    prev.total++
    if (ans.correct) prev.correct++
    dayAnswers.set(day, prev)
  }

  // Process lesson completions
  const dayLessons = new Map<string, number>()
  const dayXPEarned = new Map<string, number>()
  for (const [lessonId, prog] of Object.entries(lessonProgress)) {
    if (prog.status === 'completed' && prog.completedAt) {
      const day = prog.completedAt.split('T')[0]
      dayLessons.set(day, (dayLessons.get(day) || 0) + 1)
      dayXPEarned.set(day, (dayXPEarned.get(day) || 0) + (prog.xpEarned || 40))
    }
  }

  // Build all unique dates sorted
  const allDates = new Set<string>([
    ...dayAnswers.keys(),
    ...dayLessons.keys(),
    ...examResults.filter((e: any) => e?.date).map((e: any) => e.date.split('T')[0]),
    ...predictiveScoreHistory.filter((p: any) => p?.date).map((p: any) => p.date),
  ])

  const sortedDates = Array.from(allDates).sort()

  if (sortedDates.length < 3) {
    return generateDemoData()
  }

  // Rolling window for accuracy
  const rollingWindow: { correct: number; total: number }[] = []

  for (const date of sortedDates) {
    // Skip invalid dates
    if (!date || isNaN(new Date(date).getTime())) continue

    const ans = dayAnswers.get(date) || { correct: 0, total: 0 }
    if (ans.total > 0) {
      rollingWindow.push(ans)
      if (rollingWindow.length > 7) rollingWindow.shift()
    }

    const totalCorrect = rollingWindow.reduce((s, w) => s + w.correct, 0)
    const totalAns = rollingWindow.reduce((s, w) => s + w.total, 0)
    const accuracy = totalAns > 0 ? Math.round((totalCorrect / totalAns) * 100) : 0

    cumulativeXP += dayXPEarned.get(date) || 0
    cumulativeLessons += dayLessons.get(date) || 0

    currentLevel = Math.floor(cumulativeXP / 500) + 1
    const levelUp = currentLevel > lastLevel
    if (levelUp) lastLevel = currentLevel

    const events: string[] = []
    if (levelUp) events.push(`Получен уровень ${currentLevel}`)

    const examsToday = examResults.filter((e) => e.date.split('T')[0] === date)
    for (const exam of examsToday) {
      events.push(`Пройден вариант ${exam.variantId}`)
    }

    const d = new Date(date)
    dateMap.set(date, {
      date,
      dateLabel: `${d.getDate()}.${d.getMonth() + 1}`,
      xp: cumulativeXP,
      level: currentLevel,
      accuracy,
      lessonsCompleted: cumulativeLessons,
      events,
    })
  }

  return sortedDates.map((d) => dateMap.get(d)!)
}

export function GrowthTimeline() {
  const navigate = useNavigate()
  const answerHistory = useProgressStore((s) => s.answerHistory || [])
  const examResults = useProgressStore((s) => s.examResults || [])
  const userStats = useProgressStore((s) => s.userStats || { xp: 0, level: 1 })
  const lessonProgress = useProgressStore((s) => s.lessonProgress || {})
  const predictiveScoreHistory = useProgressStore((s) => s.predictiveScoreHistory || [])

  const fullData = useMemo(() => {
    try {
      return buildGrowthData(answerHistory, examResults, userStats, lessonProgress, predictiveScoreHistory)
    } catch (e) {
      console.error('Error building growth data:', e)
      return generateDemoData()
    }
  }, [answerHistory, examResults, userStats, lessonProgress, predictiveScoreHistory])

  const safeFullData = useMemo(() => {
    return fullData.filter((d): d is GrowthDataPoint => 
      d !== null && d !== undefined && 
      typeof d.dateLabel === 'string' &&
      d.dateLabel !== 'NaN.NaN' &&
      !d.dateLabel.includes('NaN') &&
      typeof d.xp === 'number' && !isNaN(d.xp) &&
      typeof d.accuracy === 'number' && !isNaN(d.accuracy)
    )
  }, [fullData])

  const [playing, setPlaying] = useState(false)
  const [progressIndex, setProgressIndex] = useState(() => Math.max(0, safeFullData.length - 1))
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const prevFullDataLength = useRef(safeFullData.length)

  // Reset progressIndex when fullData changes (e.g. after rehydration)
  useEffect(() => {
    if (safeFullData.length !== prevFullDataLength.current) {
      prevFullDataLength.current = safeFullData.length
      setProgressIndex(Math.max(0, safeFullData.length - 1))
    }
  }, [safeFullData])

  const visibleData = useMemo(() => {
    const idx = Math.max(0, Math.min(progressIndex, safeFullData.length - 1))
    return safeFullData.slice(0, idx + 1)
  }, [safeFullData, progressIndex])

  // Fallback if no data or not enough data for chart
  if (!visibleData || visibleData.length < 2) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={24} className="text-duo-green" />
          <h1 className="text-xl font-bold text-gray-800">Мой рост</h1>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm text-center">
          <p className="text-gray-500">Недостаточно данных для построения графика.</p>
          <p className="text-sm text-gray-400 mt-2">Решай задания, чтобы увидеть свой прогресс!</p>
        </div>
      </div>
    )
  }

  const currentPoint = visibleData[visibleData.length - 1]

  // Play animation
  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setProgressIndex((prev) => {
          if (prev >= safeFullData.length - 1) {
            setPlaying(false)
            return prev
          }
          return prev + 1
        })
      }, 80)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [playing, safeFullData.length])

  const togglePlay = useCallback(() => {
    if (progressIndex >= safeFullData.length - 1) {
      setProgressIndex(0)
      setPlaying(true)
    } else {
      setPlaying((p) => !p)
    }
  }, [progressIndex, safeFullData.length])

  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setPlaying(false)
    setProgressIndex(parseInt(e.target.value, 10))
  }, [])

  const reset = useCallback(() => {
    setPlaying(false)
    setProgressIndex(safeFullData.length - 1)
  }, [safeFullData.length])

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || payload.length === 0) return null
    const data = payload[0].payload as GrowthDataPoint
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-xl border border-gray-200 p-3 shadow-md">
        <p className="text-xs font-bold text-gray-500 mb-1">{data.date}</p>
        <div className="space-y-1 text-sm">
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className="text-duo-green" />
            <span className="font-bold text-gray-800">{data.xp} XP</span>
          </div>
          <div className="flex items-center gap-2">
            <Target size={14} className="text-duo-blue" />
            <span className="text-gray-700">Точность: {data.accuracy}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-duo-yellow" />
            <span className="text-gray-700">Уровень {data.level}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-gray-400" />
            <span className="text-gray-700">Уроков: {data.lessonsCompleted}</span>
          </div>
        </div>
        {data.events.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100 space-y-1">
            {data.events.map((ev, i) => (
              <p key={i} className="text-xs font-bold text-duo-purple">{ev}</p>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Event dots
  const eventDots = useMemo(() => {
    return visibleData
      .filter((d) => d && d.events && d.events.length > 0 && d.dateLabel && d.dateLabel !== 'NaN.NaN')
      .map((d, i) => (
        <ReferenceDot
          key={i}
          x={d.dateLabel}
          y={d.xp}
          r={5}
          fill="#ce82ff"
          stroke="white"
          strokeWidth={2}
        />
      ))
  }, [visibleData])

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={24} className="text-duo-green" />
          <h1 className="text-xl font-bold text-gray-800">Мой рост</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={togglePlay}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-duo-green text-white font-bold text-sm hover:bg-duo-green-dark transition-colors"
          >
            {playing ? <Pause size={16} /> : <Play size={16} />}
            {playing ? 'Пауза' : progressIndex >= fullData.length - 1 ? 'Повторить' : 'Воспроизвести'}
          </button>
          <button
            onClick={reset}
            className="p-2 rounded-xl bg-white border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
            aria-label="Сбросить"
          >
            <RotateCcw size={18} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Current stats */}
      {currentPoint && (
        <motion.div
          className="grid grid-cols-4 gap-3"
          key={currentPoint.date}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-duo-green/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-duo-green">{currentPoint.xp}</p>
            <p className="text-[10px] text-gray-600 font-medium">XP</p>
          </div>
          <div className="bg-duo-blue/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-duo-blue">{currentPoint.accuracy}%</p>
            <p className="text-[10px] text-gray-600 font-medium">Точность</p>
          </div>
          <div className="bg-duo-yellow/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-duo-yellow">{currentPoint.level}</p>
            <p className="text-[10px] text-gray-600 font-medium">Уровень</p>
          </div>
          <div className="bg-duo-purple/10 rounded-xl p-3 text-center">
            <p className="text-lg font-bold text-duo-purple">{currentPoint.lessonsCompleted}</p>
            <p className="text-[10px] text-gray-600 font-medium">Уроков</p>
          </div>
        </motion.div>
      )}

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={visibleData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#58cc02" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#58cc02" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1cb0f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1cb0f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
              <XAxis dataKey="dateLabel" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
              <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                yAxisId="left"
                type="monotone"
                dataKey="xp"
                stroke="#58cc02"
                strokeWidth={2}
                fill="url(#xpGradient)"
                animationDuration={playing ? 300 : 2000}
                animationEasing="ease-out"
                isAnimationActive={true}
              />
              <Area
                yAxisId="right"
                type="monotone"
                dataKey="accuracy"
                stroke="#1cb0f6"
                strokeWidth={2}
                fill="url(#accuracyGradient)"
                animationDuration={playing ? 300 : 2000}
                animationEasing="ease-out"
                isAnimationActive={true}
              />
              {eventDots}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Slider */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{safeFullData[0]?.date}</span>
          <span className="font-bold text-gray-800">{currentPoint?.date}</span>
          <span>{safeFullData[safeFullData.length - 1]?.date}</span>
        </div>
        <input
          type="range"
          min={0}
          max={safeFullData.length - 1}
          value={progressIndex}
          onChange={handleSlider}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-duo-green"
        />
      </div>

      {/* Events list */}
      {currentPoint && currentPoint.events.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-duo-purple/5 rounded-2xl border border-duo-purple/20 p-4"
        >
          <p className="text-sm font-bold text-duo-purple mb-2">События {currentPoint.date}</p>
          <div className="flex flex-wrap gap-2">
            {currentPoint.events.map((ev, i) => (
              <span
                key={i}
                className="text-xs font-bold bg-white text-duo-purple px-2.5 py-1 rounded-full border border-duo-purple/20"
              >
                {ev}
              </span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
