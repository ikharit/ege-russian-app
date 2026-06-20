import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts'
import { EGEScorePredictor } from '../components/EGEScorePredictor'
import { GrowthTimeline } from '../components/GrowthTimeline'
import { getPredictiveScore, getWeakTasks } from '../utils/predictiveScore'
import { TrendingUp, AlertCircle, Target, FileText } from 'lucide-react'

export function Statistics() {
  const navigate = useNavigate()
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const stats = useProgressStore((s) => s.userStats)
  const taskStats = useProgressStore((s) => s.taskStats)
  const examResults = useProgressStore((s) => s.examResults)
  const wrongAnswers = useProgressStore((s) => s.wrongAnswers)
  const examDate = useProgressStore((s) => s.examDate)
  const predictiveScoreHistory = useProgressStore((s) => s.predictiveScoreHistory)
  const [activeTab, setActiveTab] = useState<'progress' | 'topics' | 'forecast' | 'knowledge' | 'growth'>('progress')

  const completedLessons = Object.values(lessonProgress).filter(l => l.status === 'completed')
  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0)

  // Predictive score data
  const daysToExam = examDate
    ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 180

  const score = getPredictiveScore(
    { taskStats, examResults, userStats: stats, lessonProgress, wrongAnswers, examDate },
    daysToExam
  )
  const weakTasks = getWeakTasks(score.breakdown, 5)

  // Map dooshin task numbers to base sections
  const dooshinTaskToSection: Record<string, string> = {
    '9': 'section-orthography',
    '10': 'section-orthography',
    '11': 'section-orthography',
    '12': 'section-orthography',
    '13': 'section-orthography',
    '14': 'section-orthography',
    '15': 'section-orthography',
    '16': 'section-punctuation',
    '17': 'section-punctuation',
    '18': 'section-punctuation',
    '19': 'section-punctuation',
    '20': 'section-punctuation',
  }

  // Distribute dooshin lessons into base sections
  const dooshinSection = course.sections.find(s => s.id === 'section-dooshin-all')
  const dooshinLessonIdsBySection: Map<string, string[]> = new Map()
  if (dooshinSection) {
    for (const lesson of dooshinSection.lessons) {
      const match = lesson.id.match(/lesson-dooshin-(\d+)-/)
      if (match) {
        const targetSection = dooshinTaskToSection[match[1]]
        if (targetSection) {
          const arr = dooshinLessonIdsBySection.get(targetSection) || []
          arr.push(lesson.id)
          dooshinLessonIdsBySection.set(targetSection, arr)
        }
      }
    }
  }

  // Calculate per-section stats (excluding dooshin, merging its lessons)
  const sectionStats = course.sections
    .filter(s => s.id !== 'section-dooshin-all')
    .map(section => {
      const baseLessonIds = section.lessons.map(l => l.id)
      const dooshinIds = dooshinLessonIdsBySection.get(section.id) || []
      const allLessonIds = [...baseLessonIds, ...dooshinIds]

      const completed = allLessonIds.filter(id => lessonProgress[id]?.status === 'completed').length
      const totalScore = allLessonIds.reduce((sum, id) => sum + (lessonProgress[id]?.bestScore || 0), 0)
      const avgScore = completed > 0 ? Math.round(totalScore / completed) : 0
      return {
        name: section.title,
        completed,
        total: allLessonIds.length,
        score: avgScore,
        fill: section.color
      }
    })

  const radarData = sectionStats.map(s => ({
    subject: s.name.replace('Орфография: ', '').replace('Пунктуация: ', '').slice(0, 15),
    A: s.score,
    fullMark: 100
  }))

  // Weekly activity (mock data for now, can be made real)
  const weeklyData = [
    { day: 'Пн', xp: 30, lessons: 1 },
    { day: 'Вт', xp: 45, lessons: 2 },
    { day: 'Ср', xp: 0, lessons: 0 },
    { day: 'Чт', xp: 60, lessons: 2 },
    { day: 'Пт', xp: 20, lessons: 1 },
    { day: 'Сб', xp: 80, lessons: 3 },
    { day: 'Вс', xp: 50, lessons: 2 },
  ]

  // Weak topics based on low scores
  const weakTopics = sectionStats
    .filter(s => s.score > 0 && s.score < 70)
    .sort((a, b) => a.score - b.score)

  // Forecast chart data
  const forecastChartData = predictiveScoreHistory.length > 0
    ? predictiveScoreHistory.map(h => ({ date: h.date, score: h.score }))
    : [
        { date: 'Начало', score: 0 },
        { date: 'Сейчас', score: score.predictedSecondary },
      ]

  // Task breakdown table
  const taskBreakdown = Array.from({ length: 26 }, (_, i) => i + 1).map(taskNum => {
    const stat = taskStats[String(taskNum)]
    const accuracy = stat && stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 50
    const predicted = score.breakdown[taskNum] || 0
    const maxScore = 2 // simplified for display
    const needFor80 = accuracy < 80 ? Math.ceil((0.8 - accuracy / 100) * maxScore * 10) / 10 : 0
    return { taskNum, accuracy, predicted, needFor80 }
  }).filter(t => t.predicted > 0 || t.accuracy !== 50)

  // Pace projection
  const totalXP = stats.xp || 0
  const completedDates = Object.values(lessonProgress)
    .filter(l => l.completedAt)
    .map(l => new Date(l.completedAt!).getTime())
    .sort((a, b) => a - b)
  let daysSinceStart = 30
  if (completedDates.length > 0) {
    daysSinceStart = Math.max(1, Math.floor((Date.now() - completedDates[0]) / (1000 * 60 * 60 * 24)))
  }
  const xpPerDay = totalXP / daysSinceStart
  const projectedFinal = Math.min(100, Math.round(score.predictedSecondary + (xpPerDay * daysSinceStart * 0.02)))

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Статистика</h1>
        <button
          onClick={() => {
            import('../utils/pdfGenerator').then(({ generateStudentPortfolioHTML, openReportInNewTab }) => {
              const html = generateStudentPortfolioHTML()
              openReportInNewTab(html)
            })
          }}
          className="flex items-center gap-2 px-4 py-2 bg-duo-green text-white rounded-xl font-bold text-sm hover:bg-duo-green-dark transition-colors shadow-md"
        >
          <FileText size={16} />
          PDF
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card bg-duo-green/10">
          <p className="text-3xl font-bold text-duo-green">{completedLessons.length}/{totalLessons}</p>
          <p className="text-sm text-gray-600">Уроков пройдено</p>
        </div>
        <div className="card bg-duo-blue/10">
          <p className="text-3xl font-bold text-duo-blue">{stats.xp}</p>
          <p className="text-sm text-gray-600">Всего XP</p>
        </div>
        <div className="card bg-duo-yellow/10">
          <p className="text-3xl font-bold text-duo-yellow">{stats.level}</p>
          <p className="text-sm text-gray-600">Уровень</p>
        </div>
        <div className="card bg-duo-red/10">
          <p className="text-3xl font-bold text-duo-red">{stats.streak}</p>
          <p className="text-sm text-gray-600">Дней подряд</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'progress' as const, label: 'Прогресс' },
          { key: 'topics' as const, label: 'Темы' },
          { key: 'forecast' as const, label: 'Прогноз' },
          { key: 'knowledge' as const, label: 'Карта' },
          { key: 'growth' as const, label: 'Рост' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-duo-green text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'progress' && (
        <div className="flex flex-col gap-4">
          <EGEScorePredictor />

          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">Активность за неделю</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="day" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="xp" fill="#58cc02" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">Прогресс по разделам</h3>
            <div className="flex flex-col gap-3">
              {sectionStats.map((section, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{section.name}</span>
                    <span className="text-gray-500">{section.completed}/{section.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      className="h-2.5 rounded-full"
                      style={{ backgroundColor: section.fill }}
                      initial={{ width: 0 }}
                      animate={{ width: `${section.total > 0 ? (section.completed / section.total) * 100 : 0}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="card">
          <h3 className="font-bold text-gray-700 mb-3">Сильные и слабые стороны</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 11}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Прогресс" dataKey="A" stroke="#58cc02" fill="#58cc02" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {sectionStats.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.fill }} />
                  <span className="text-sm text-gray-700">{s.name}</span>
                </div>
                <span className={`text-sm font-bold ${s.score >= 80 ? 'text-duo-green' : s.score >= 60 ? 'text-duo-yellow' : 'text-duo-red'}`}>
                  {s.score > 0 ? `${s.score}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'forecast' && (
        <div className="flex flex-col gap-4">
          {/* Score prediction summary */}
          <div className="card bg-purple-50 border-purple-200">
            <div className="flex items-center gap-2 mb-3">
              <Target size={20} className="text-purple-600" />
              <h3 className="font-bold text-gray-700">Прогноз на ЕГЭ</h3>
            </div>
            <div className="text-center mb-3">
              <div className="text-4xl font-bold text-gray-800">
                {score.predictedSecondary}
                <span className="text-lg text-gray-400">/100</span>
              </div>
              <p className="text-sm text-gray-500">
                Первичный: {score.predictedPrimary}/58 · Уверенность: {Math.round(score.confidence * 100)}%
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <motion.div
                className="h-3 rounded-full bg-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, score.predictedSecondary)}%` }}
                transition={{ duration: 0.8 }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>36</span>
              <span>60</span>
              <span>80</span>
            </div>
          </div>

          {/* History chart */}
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">Динамика прогноза</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="date" tick={{fontSize: 11}} />
                  <YAxis domain={[0, 100]} tick={{fontSize: 12}} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#9333ea" strokeWidth={2} dot={{ r: 4, fill: '#9333ea' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task breakdown table */}
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">По заданиям</h3>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {taskBreakdown.map((t) => (
                <div key={t.taskNum} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-700 w-16">Задание {t.taskNum}</span>
                    <span className={`text-xs font-bold ${t.accuracy >= 80 ? 'text-green-600' : t.accuracy >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {t.accuracy}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold text-gray-800">{t.predicted.toFixed(1)}</span>
                    <span className="text-xs text-gray-400"> балл</span>
                    {t.needFor80 > 0 && (
                      <p className="text-[10px] text-red-500">+{t.needFor80.toFixed(1)} до 80%</p>
                    )}
                  </div>
                </div>
              ))}
              {taskBreakdown.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">Пока нет данных по заданиям. Решай больше!</p>
              )}
            </div>
          </div>

          {/* Pace projection */}
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={20} className="text-blue-600" />
              <h3 className="font-bold text-gray-700">Если продолжишь в таком темпе...</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Текущий темп:</span>
                <span className="font-bold text-gray-800">{Math.round(xpPerDay)} XP/день</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Прогноз к экзамену:</span>
                <span className="font-bold text-blue-600">~{projectedFinal} баллов</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">До минимума (36):</span>
                <span className="font-bold text-gray-800">{score.neededForThreshold > 0 ? `${score.neededForThreshold} XP` : '✅ Достигнуто'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">До 60:</span>
                <span className="font-bold text-gray-800">{score.neededForGood > 0 ? `${score.neededForGood} XP` : '✅ Достигнуто'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">До 80+:</span>
                <span className="font-bold text-gray-800">{score.neededForExcellent > 0 ? `${score.neededForExcellent} XP` : '✅ Достигнуто'}</span>
              </div>
              {score.recommendedDaily > 0 && (
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <AlertCircle size={16} />
                  <span>Рекомендуемое время: <strong>{score.recommendedDaily} мин/день</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Weak tasks */}
          {weakTasks.length > 0 && (
            <div className="card bg-red-50 border-red-200">
              <h3 className="font-bold text-gray-700 mb-3">Что подтянуть для 80+</h3>
              <div className="flex flex-col gap-2">
                {weakTasks.map((t) => (
                  <div key={t.taskNumber} className="flex items-center justify-between p-2 bg-white rounded-lg">
                    <span className="text-sm font-bold text-gray-700">Задание {t.taskNumber}</span>
                    <span className="text-xs text-red-600 font-bold">−{t.gap.toFixed(1)} балл</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'knowledge' && (
        <div className="flex flex-col gap-4 items-center">
          <div className="card w-full text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Target size={20} className="text-duo-green" />
              <h3 className="font-bold text-gray-700">Карта знаний</h3>
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Узнай, как задания ЕГЭ связаны между собой. Кликай на круги, чтобы перейти к разделу.
            </p>
            <button
              onClick={() => navigate('/knowledge-map')}
              className="px-6 py-3 rounded-xl bg-duo-green text-white font-bold text-sm hover:bg-duo-green-dark transition-colors"
            >
              Открыть карту знаний
            </button>
          </div>
        </div>
      )}

      {activeTab === 'growth' && (
        <div className="flex flex-col gap-4">
          <GrowthTimeline />
        </div>
      )}
    </div>
  )
}
