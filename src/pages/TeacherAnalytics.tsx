import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Users, AlertTriangle, TrendingUp, Target, Award, ChevronRight, Filter, BarChart3, BrainCircuit, Heart, Zap, Clock, CheckCircle, AlertCircle, BookOpen, Trophy, Flame, Activity, Lightbulb, Bell
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid, BarChart, Bar } from 'recharts'
import { useClassStore } from '../stores/classStore'
import { useProgressStore } from '../stores/progressStore'
import { analyzeClass, analyzeStudent, StudentAnalytics } from '../utils/studentAnalytics'
import { getPlayerTypeLabel, getPlayerTypeColor } from '../utils/personalityEngine'
import type { PlayerType } from '../utils/personalityEngine'

const RISK_CONFIG = {
  low: { color: '#58cc02', label: 'Всё хорошо', icon: CheckCircle },
  medium: { color: '#ffc800', label: 'Требует внимания', icon: AlertCircle },
  high: { color: '#ff4b4b', label: 'Риск отвала', icon: AlertTriangle },
}

export function TeacherAnalytics() {
  const navigate = useNavigate()
  const classes = useClassStore((s) => s.classes)
  const classList = Object.values(classes)
  const [selectedClassId, setSelectedClassId] = useState<string | null>(classList[0]?.id || null)
  const [riskFilter, setRiskFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | PlayerType>('all')
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'alerts' | 'recommendations'>('overview')
  const [trendDays, setTrendDays] = useState<7 | 14 | 30>(14)

  const selectedClass = selectedClassId ? classes[selectedClassId] : null

  const students = selectedClass?.students || []
  const analytics = students.map(s => 
    analyzeStudent(s.id, s.name, s.progress)
  )
  const summary = analyzeClass(students.map(s => ({ profileId: s.id, name: s.name, progress: s.progress })))

  // Aggregate trends from all students' behavior profiles
  const trendData = (() => {
    const dates: string[] = []
    const sessions: number[] = []
    const clicks: number[] = []
    const timeMinutes: number[] = []
    const accuracy: number[] = []
    const motivationAchievement: number[] = []
    const motivationSocial: number[] = []
    const motivationExploration: number[] = []
    const motivationCompetition: number[] = []

    // Build from last N days
    for (let i = trendDays - 1; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      dates.push(dateStr)
      
      // Sum across all students for this date
      let daySessions = 0, dayClicks = 0, dayTime = 0, dayAccuracy = 0
      let dayAchieve = 0, daySocial = 0, dayExplore = 0, dayCompete = 0
      let studentCount = 0

      students.forEach(s => {
        const bp = s.progress?.behaviorProfile
        if (!bp) return
        // We don't have per-day data in behaviorProfile, use averages
        daySessions += bp.totalSessions / 30
        dayClicks += bp.totalClicks / 30
        dayTime += bp.avgSessionDuration / 60
        dayAchieve += bp.motivationSignals.achievementDriven
        daySocial += bp.motivationSignals.socialDriven
        dayExplore += bp.motivationSignals.explorationDriven
        dayCompete += bp.motivationSignals.competitionDriven
        studentCount++
      })

      sessions.push(Math.round(daySessions))
      clicks.push(Math.round(dayClicks))
      timeMinutes.push(Math.round(dayTime))
      accuracy.push(studentCount > 0 ? Math.round(dayAccuracy / studentCount) : 0)
      motivationAchievement.push(studentCount > 0 ? Math.round(dayAchieve / studentCount) : 0)
      motivationSocial.push(studentCount > 0 ? Math.round(daySocial / studentCount) : 0)
      motivationExploration.push(studentCount > 0 ? Math.round(dayExplore / studentCount) : 0)
      motivationCompetition.push(studentCount > 0 ? Math.round(dayCompete / studentCount) : 0)
    }

    return dates.map((date, i) => ({
      date: date.slice(5), // MM-DD
      sessions: sessions[i],
      clicks: clicks[i],
      time: timeMinutes[i],
      achievement: motivationAchievement[i],
      social: motivationSocial[i],
      exploration: motivationExploration[i],
      competition: motivationCompetition[i],
    }))
  })()

  // Alerts from all students
  const alerts = students.flatMap(s => {
    // Generate alerts based on student data
    const alerts: { id: string; type: 'risk' | 'trend' | 'achievement' | 'behavior'; severity: 'low' | 'medium' | 'high'; title: string; message: string; studentName: string; date: string }[] = []
    const a = analytics.find(an => an.profileId === s.id)
    if (!a) return alerts
    const now = new Date().toISOString().split('T')[0]

    if (a.riskLevel === 'high') {
      alerts.push({ id: s.id + '-risk', type: 'risk', severity: 'high', title: 'Риск отвала', message: `Ученик давно не проявлял активности. Рекомендуется связаться.`, studentName: s.name, date: now })
    } else if (a.riskLevel === 'medium') {
      alerts.push({ id: s.id + '-medium', type: 'risk', severity: 'medium', title: 'Требует внимания', message: `Активность снизилась. Проверьте, всё ли в порядке.`, studentName: s.name, date: now })
    }

    if (a.lastActivityDays > 7) {
      alerts.push({ id: s.id + '-inactive', type: 'risk', severity: 'high', title: 'Давно не заходил', message: `Последняя активность ${a.lastActivityDays} дней назад.`, studentName: s.name, date: now })
    }

    if (a.accuracy < 50 && a.totalTimeMinutes > 30) {
      alerts.push({ id: s.id + '-accuracy', type: 'trend', severity: 'medium', title: 'Низкая точность', message: `Точность ответов ${a.accuracy}%. Возможно, нужно повторить теорию.`, studentName: s.name, date: now })
    }

    if (a.streak >= 7) {
      alerts.push({ id: s.id + '-streak', type: 'achievement', severity: 'low', title: 'Отличный стрик!', message: `${a.streak} дней подряд. Можно предложить более сложные задания.`, studentName: s.name, date: now })
    }

    return alerts
  }).sort((a, b) => {
    const severityOrder = { high: 0, medium: 1, low: 2 }
    return severityOrder[a.severity] - severityOrder[b.severity]
  })

  // Recommendations based on class data
  const recommendations = (() => {
    const recs: { id: string; category: 'motivation' | 'content' | 'engagement' | 'risk'; priority: 'low' | 'medium' | 'high'; title: string; description: string; action: string; targetStudents?: string[] }[] = []
    const now = new Date().toISOString().split('T')[0]

    // Risk-based
    const atRisk = analytics.filter(a => a.riskLevel === 'high')
    if (atRisk.length > 0) {
      recs.push({ id: 'rec-risk', category: 'risk', priority: 'high', title: 'Срочное внимание', description: `${atRisk.length} учеников рискуют отвалиться.`, action: 'Свяжитесь с учениками, выясните причины пропусков.', targetStudents: atRisk.map(a => a.name) })
    }

    // Motivation-based
    if (summary.dominantType === 'achiever') {
      recs.push({ id: 'rec-achieve', category: 'motivation', priority: 'medium', title: 'Достиженцы в классе', description: 'Большинство мотивируется целями и XP.', action: 'Добавьте чёткие цели на неделю и достижения за прогресс.' })
    } else if (summary.dominantType === 'socializer') {
      recs.push({ id: 'rec-social', category: 'motivation', priority: 'medium', title: 'Коммуникаторы', description: 'Класс мотивируется общением.', action: 'Организуйте групповые задания и обсуждения в классе.' })
    } else if (summary.dominantType === 'killer') {
      recs.push({ id: 'rec-compete', category: 'engagement', priority: 'medium', title: 'Соревновательный дух', description: 'Ученики любят конкуренцию.', action: 'Запустите турнир или дуэль в классе.' })
    }

    // Accuracy-based
    if (summary.avgAccuracy < 60) {
      recs.push({ id: 'rec-accuracy', category: 'content', priority: 'high', title: 'Низкая точность класса', description: `Средняя точность ${summary.avgAccuracy}%.`, action: 'Повторите базовые темы, уделите внимание типичным ошибкам.' })
    }

    // Low completion
    if (summary.avgCompletionRate < 30) {
      recs.push({ id: 'rec-completion', category: 'engagement', priority: 'medium', title: 'Мало пройдено', description: `Средний прогресс ${summary.avgCompletionRate}%.`, action: 'Предложите план на неделю с короткими ежедневными заданиями.' })
    }

    return recs.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  })()

  const filtered = analytics.filter(a => {
    if (riskFilter !== 'all' && a.riskLevel !== riskFilter) return false
    if (typeFilter !== 'all' && a.playerProfile.type !== typeFilter) return false
    return true
  })

  const typeLabels: Record<PlayerType, string> = {
    achiever: 'Достиженцы',
    explorer: 'Исследователи',
    socializer: 'Коммуникаторы',
    killer: 'Соревнователи',
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/teacher/classroom')} className="p-2 hover:bg-gray-100 rounded-xl">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">Аналитика класса</h1>
            <p className="text-xs text-gray-500">Понимание учеников — ключ к успеху</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col gap-4">
        {/* Class selector */}
        {classList.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {classList.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedClassId(c.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${
                  selectedClassId === c.id
                    ? 'bg-duo-green text-white'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        )}

        {students.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-bold">В классе пока нет учеников</p>
            <p className="text-sm text-gray-400">Добавьте учеников, чтобы увидеть аналитику</p>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-duo-green/10 flex items-center justify-center">
                    <Users size={18} className="text-duo-green" />
                  </div>
                  <span className="text-xs text-gray-500 font-bold uppercase">Учеников</span>
                </div>
                <p className="text-2xl font-black text-gray-800">{summary.totalStudents}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-duo-yellow/10 flex items-center justify-center">
                    <BarChart3 size={18} className="text-duo-yellow" />
                  </div>
                  <span className="text-xs text-gray-500 font-bold uppercase">Точность</span>
                </div>
                <p className="text-2xl font-black text-gray-800">{summary.avgAccuracy}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-duo-blue/10 flex items-center justify-center">
                    <BookOpen size={18} className="text-duo-blue" />
                  </div>
                  <span className="text-xs text-gray-500 font-bold uppercase">Пройдено</span>
                </div>
                <p className="text-2xl font-black text-gray-800">{summary.avgCompletionRate}%</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 ${
                  summary.atRiskCount > 0 ? 'ring-2 ring-red-100' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    summary.atRiskCount > 0 ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    <AlertTriangle size={18} className={summary.atRiskCount > 0 ? 'text-red-500' : 'text-green-500'} />
                  </div>
                  <span className="text-xs text-gray-500 font-bold uppercase">Риск</span>
                </div>
                <p className={`text-2xl font-black ${summary.atRiskCount > 0 ? 'text-red-500' : 'text-gray-800'}`}>
                  {summary.atRiskCount}
                </p>
              </motion.div>
            </div>

            {/* Type Distribution */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                <BrainCircuit size={18} className="text-duo-purple" />
                Типы мотивации
              </h3>
              <div className="flex gap-2">
                {(Object.entries(summary.typeDistribution) as [PlayerType, number][]).map(([type, count]) => {
                  if (count === 0) return null
                  const pct = Math.round((count / summary.totalStudents) * 100)
                  return (
                    <div key={type} className="flex-1 text-center">
                      <div
                        className="rounded-xl p-2 text-white font-bold text-sm mb-1"
                        style={{ backgroundColor: getPlayerTypeColor(type) }}
                      >
                        {pct}%
                      </div>
                      <p className="text-[10px] text-gray-500 font-bold">{typeLabels[type]}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Class Behavior Overview */}
            {students.some(s => s.progress?.behaviorProfile) && (
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                  <Target size={18} className="text-duo-blue" />
                  Чем занимается класс
                </h3>
                
                {/* Aggregate time by category */}
                <div className="mb-3">
                  <p className="text-xs font-bold text-gray-500 mb-2">Время по разделам (суммарно)</p>
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      const timeByCat: Record<string, number> = {}
                      students.forEach(s => {
                        const bp = s.progress?.behaviorProfile?.timeDistribution
                        if (bp) {
                          Object.entries(bp).forEach(([cat, seconds]) => {
                            if (seconds > 0) {
                              timeByCat[cat] = (timeByCat[cat] || 0) + seconds
                            }
                          })
                        }
                      })
                      return Object.entries(timeByCat)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([cat, seconds]) => {
                          const mins = Math.round(seconds / 60)
                          return (
                            <span key={cat} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg font-bold">
                              {cat}: {mins}м
                            </span>
                          )
                        })
                    })()}
                  </div>
                </div>

                {/* Aggregate clicks by category */}
                <div className="mb-3">
                  <p className="text-xs font-bold text-gray-500 mb-2">Клики по разделам</p>
                  <div className="flex flex-wrap gap-1">
                    {(() => {
                      const clicksByCat: Record<string, number> = {}
                      students.forEach(s => {
                        const bp = s.progress?.behaviorProfile?.clickDistribution
                        if (bp) {
                          Object.entries(bp).forEach(([cat, count]) => {
                            if (count > 0) {
                              clicksByCat[cat] = (clicksByCat[cat] || 0) + count
                            }
                          })
                        }
                      })
                      return Object.entries(clicksByCat)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 6)
                        .map(([cat, count]) => (
                          <span key={cat} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg font-bold">
                            {cat}: {count}
                          </span>
                        ))
                    })()}
                  </div>
                </div>

                {/* Class motivation signals */}
                <div>
                  <p className="text-xs font-bold text-gray-500 mb-2">Что мотивирует класс</p>
                  <div className="grid grid-cols-4 gap-2">
                    {(() => {
                      const signals = { achievementDriven: 0, socialDriven: 0, explorationDriven: 0, competitionDriven: 0 }
                      let count = 0
                      students.forEach(s => {
                        const bp = s.progress?.behaviorProfile?.motivationSignals
                        if (bp) {
                          signals.achievementDriven += bp.achievementDriven
                          signals.socialDriven += bp.socialDriven
                          signals.explorationDriven += bp.explorationDriven
                          signals.competitionDriven += bp.competitionDriven
                          count++
                        }
                      })
                      if (count === 0) return null
                      const avg = (k: keyof typeof signals) => Math.round(signals[k] / count)
                      const items = [
                        { label: 'Достижения', value: avg('achievementDriven'), color: 'bg-amber-50 text-amber-700' },
                        { label: 'Общение', value: avg('socialDriven'), color: 'bg-blue-50 text-blue-700' },
                        { label: 'Исследование', value: avg('explorationDriven'), color: 'bg-violet-50 text-violet-700' },
                        { label: 'Соревнование', value: avg('competitionDriven'), color: 'bg-red-50 text-red-700' },
                      ]
                      return items.map(item => (
                        <div key={item.label} className={`${item.color} rounded-xl p-2 text-center`}>
                          <p className="text-[10px] font-bold opacity-80">{item.label}</p>
                          <p className="text-sm font-bold">{item.value}%</p>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* Insights */}
            {summary.classInsights.length > 0 && (
              <div className="bg-gradient-to-r from-duo-green/5 to-blue-50 rounded-2xl p-4 border border-duo-green/10">
                <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Activity size={18} className="text-duo-green" />
                  Инсайты
                </h3>
                <ul className="space-y-2">
                  {summary.classInsights.map((insight, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-duo-green mt-0.5">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => setRiskFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  riskFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                Все
              </button>
              <button
                onClick={() => setRiskFilter('high')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  riskFilter === 'high' ? 'bg-red-500 text-white' : 'bg-white text-red-500 border border-red-200'
                }`}
              >
                Риск отвала
              </button>
              <button
                onClick={() => setRiskFilter('medium')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  riskFilter === 'medium' ? 'bg-yellow-500 text-white' : 'bg-white text-yellow-600 border border-yellow-200'
                }`}
              >
                Внимание
              </button>
              <button
                onClick={() => setRiskFilter('low')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  riskFilter === 'low' ? 'bg-green-500 text-white' : 'bg-white text-green-600 border border-green-200'
                }`}
              >
                Всё хорошо
              </button>
            </div>

            {/* Students List */}
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-gray-700 text-sm">
                Ученики ({filtered.length})
              </h3>
              {filtered.map((a) => (
                <motion.div
                  key={a.profileId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                >
                  {/* Header row */}
                  <div
                    className="p-4 flex items-center gap-3 cursor-pointer"
                    onClick={() => setExpandedStudent(expandedStudent === a.profileId ? null : a.profileId)}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
                      style={{ backgroundColor: getPlayerTypeColor(a.playerProfile.type) }}
                    >
                      {a.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-bold text-gray-800 text-sm">{a.name}</p>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white"
                          style={{ backgroundColor: RISK_CONFIG[a.riskLevel].color }}
                        >
                          {RISK_CONFIG[a.riskLevel].label}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        {getPlayerTypeLabel(a.playerProfile.type)} • Точность {a.accuracy}% • Пройдено {a.completionRate}%
                      </p>
                    </div>
                    <ChevronRight
                      size={18}
                      className={`text-gray-400 transition-transform ${
                        expandedStudent === a.profileId ? 'rotate-90' : ''
                      }`}
                    />
                  </div>

                  {/* Expanded details */}
                  {expandedStudent === a.profileId && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      className="border-t border-gray-100 p-4 space-y-3"
                    >
                      {/* Stats row */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-gray-50 rounded-xl p-2">
                          <Flame size={16} className="text-orange-500 mx-auto mb-1" />
                          <p className="text-sm font-bold">{a.streak}</p>
                          <p className="text-[10px] text-gray-400">Стрик</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2">
                          <Zap size={16} className="text-duo-yellow mx-auto mb-1" />
                          <p className="text-sm font-bold">{a.accuracy}%</p>
                          <p className="text-[10px] text-gray-400">Точность</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2">
                          <Clock size={16} className="text-duo-blue mx-auto mb-1" />
                          <p className="text-sm font-bold">{a.lastActivityDays === 999 ? '—' : `${a.lastActivityDays}д`}</p>
                          <p className="text-[10px] text-gray-400">Активность</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-2">
                          <Trophy size={16} className="text-duo-purple mx-auto mb-1" />
                          <p className="text-sm font-bold">{a.completionRate}%</p>
                          <p className="text-[10px] text-gray-400">Пройдено</p>
                        </div>
                      </div>

                      {/* Strengths / Weaknesses */}
                      {a.strengths.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-gray-500 mb-1">Сильные стороны</p>
                          <div className="flex flex-wrap gap-1">
                            {a.strengths.map((s, i) => (
                              <span key={i} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-lg font-bold">
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {a.weaknesses.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-gray-500 mb-1">Что требует внимания</p>
                          <div className="flex flex-wrap gap-1">
                            {a.weaknesses.map((w, i) => (
                              <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-lg font-bold">
                                {w}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Behavior Profile */}
                      {a.behaviorProfile && (
                        <div className="space-y-3">
                          {/* Time spent */}
                          <div>
                            <p className="text-xs font-bold text-gray-500 mb-2">Где проводит время</p>
                            <div className="flex flex-wrap gap-1">
                              {Object.entries(a.behaviorProfile.timeDistribution)
                                .filter(([, v]) => v > 0)
                                .sort((a, b) => b[1] - a[1])
                                .slice(0, 5)
                                .map(([cat, seconds]) => {
                                  const mins = Math.round(seconds / 60)
                                  return (
                                    <span key={cat} className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg font-bold">
                                      {cat}: {mins}м
                                    </span>
                                  )
                                })}
                            </div>
                          </div>

                          {/* Clicks */}
                          <div>
                            <p className="text-xs font-bold text-gray-500 mb-2">Что больше кликает</p>
                            <div className="flex flex-wrap gap-1">
                              {a.behaviorProfile.topClickedElements.slice(0, 5).map((el, i) => (
                                <span key={i} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-lg font-bold">
                                  {el.element.split('::').pop() || el.element}: {el.count}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Motivation signals */}
                          <div>
                            <p className="text-xs font-bold text-gray-500 mb-2">Что мотивирует (сигналы)</p>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="bg-amber-50 rounded-xl p-2">
                                <p className="text-[10px] text-amber-600 font-bold">Достижения</p>
                                <p className="text-sm font-bold text-amber-700">{a.behaviorProfile.motivationSignals.achievementDriven}%</p>
                              </div>
                              <div className="bg-blue-50 rounded-xl p-2">
                                <p className="text-[10px] text-blue-600 font-bold">Общение</p>
                                <p className="text-sm font-bold text-blue-700">{a.behaviorProfile.motivationSignals.socialDriven}%</p>
                              </div>
                              <div className="bg-violet-50 rounded-xl p-2">
                                <p className="text-[10px] text-violet-600 font-bold">Исследование</p>
                                <p className="text-sm font-bold text-violet-700">{a.behaviorProfile.motivationSignals.explorationDriven}%</p>
                              </div>
                              <div className="bg-red-50 rounded-xl p-2">
                                <p className="text-[10px] text-red-600 font-bold">Соревнование</p>
                                <p className="text-sm font-bold text-red-700">{a.behaviorProfile.motivationSignals.competitionDriven}%</p>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-center text-xs text-gray-500">
                            <div className="bg-gray-50 rounded-xl p-2">
                              <p className="font-bold text-gray-700">{a.behaviorProfile.totalClicks}</p>
                              <p>Кликов</p>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-2">
                              <p className="font-bold text-gray-700">{Math.round(a.behaviorProfile.avgSessionDuration / 60)}м</p>
                              <p>Средняя сессия</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Motivation & Recommendation */}
                      <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs font-bold text-blue-700 mb-1">Что мотивирует (тип)</p>
                        <p className="text-xs text-blue-600">{a.motivation}</p>
                      </div>
                      <div className="bg-duo-green/5 rounded-xl p-3 border border-duo-green/10">
                        <p className="text-xs font-bold text-duo-green-dark mb-1">Рекомендация</p>
                        <p className="text-xs text-gray-600">{a.recommendation}</p>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
