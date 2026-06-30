import React, { useMemo } from 'react'
import { Clock, Zap, AlertTriangle, BarChart3 } from 'lucide-react'

interface AnswerLog {
  questionId: string
  correct: boolean
  hintsUsed?: number
  timeSpent: number
  taskNumber: string
  timestamp: string
}

interface SessionQualityProps {
  answerHistory: AnswerLog[]
}

export function SessionQuality({ answerHistory }: SessionQualityProps) {
  const data = useMemo(() => {
    if (answerHistory.length === 0) return null

    const sorted = [...answerHistory].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    // Group into sessions (gap > 5 min = new session)
    const sessions: AnswerLog[][] = []
    let currentSession: AnswerLog[] = []
    sorted.forEach((entry, i) => {
      if (i === 0) {
        currentSession.push(entry)
      } else {
        const prevTime = new Date(sorted[i - 1].timestamp).getTime()
        const currTime = new Date(entry.timestamp).getTime()
        if (currTime - prevTime > 5 * 60 * 1000) {
          sessions.push([...currentSession])
          currentSession = [entry]
        } else {
          currentSession.push(entry)
        }
      }
    })
    if (currentSession.length > 0) sessions.push(currentSession)

    // Session stats
    const sessionStats = sessions.map(session => {
      const start = new Date(session[0].timestamp).getTime()
      const end = new Date(session[session.length - 1].timestamp).getTime()
      const duration = Math.round((end - start) / 1000) + (session[session.length - 1].timeSpent || 0) / 1000
      const correct = session.filter(s => s.correct).length
      const accuracy = session.length > 0 ? Math.round((correct / session.length) * 100) : 0
      const hints = session.reduce((sum, s) => sum + (s.hintsUsed || 0), 0)
      const avgTime = session.length > 0 ? Math.round(session.reduce((sum, s) => sum + (s.timeSpent || 0), 0) / session.length / 1000) : 0
      const rageQuit = session.length < 3 && accuracy < 50 && duration < 60

      return { duration, questions: session.length, accuracy, hints, avgTime, rageQuit }
    })

    const avgSessionDuration = sessionStats.length > 0 ? Math.round(sessionStats.reduce((s, st) => s + st.duration, 0) / sessionStats.length) : 0
    const avgQuestionsPerSession = sessionStats.length > 0 ? Math.round(sessionStats.reduce((s, st) => s + st.questions, 0) / sessionStats.length) : 0
    const avgTimePerQuestion = answerHistory.length > 0 ? Math.round(answerHistory.reduce((s, a) => s + (a.timeSpent || 0), 0) / answerHistory.length / 1000) : 0
    const totalHints = answerHistory.reduce((s, a) => s + (a.hintsUsed || 0), 0)
    const rageQuits = sessionStats.filter(s => s.rageQuit).length
    const fastAnswers = answerHistory.filter(a => (a.timeSpent || 0) < 3000).length // < 3 sec
    const slowAnswers = answerHistory.filter(a => (a.timeSpent || 0) > 30000).length // > 30 sec

    // Time distribution
    const timeDistribution = [
      { label: '< 3с', count: answerHistory.filter(a => (a.timeSpent || 0) < 3000).length, color: 'bg-red-300' },
      { label: '3-10с', count: answerHistory.filter(a => (a.timeSpent || 0) >= 3000 && (a.timeSpent || 0) < 10000).length, color: 'bg-yellow-300' },
      { label: '10-30с', count: answerHistory.filter(a => (a.timeSpent || 0) >= 10000 && (a.timeSpent || 0) < 30000).length, color: 'bg-green-300' },
      { label: '> 30с', count: answerHistory.filter(a => (a.timeSpent || 0) >= 30000).length, color: 'bg-blue-300' },
    ]

    return {
      sessionCount: sessions.length,
      avgSessionDuration,
      avgQuestionsPerSession,
      avgTimePerQuestion,
      totalHints,
      rageQuits,
      fastAnswers,
      slowAnswers,
      timeDistribution,
    }
  }, [answerHistory])

  if (!data) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={20} className="text-duo-blue" />
          <h3 className="font-bold text-gray-700">Качество сессий</h3>
        </div>
        <p className="text-sm text-gray-500">Нет данных для анализа.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-duo-blue" />
            <span className="text-[10px] text-gray-400 font-bold">Средняя сессия</span>
          </div>
          <p className="text-lg font-black text-gray-800">{Math.round(data.avgSessionDuration / 60)}м</p>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Zap size={14} className="text-duo-yellow" />
            <span className="text-[10px] text-gray-400 font-bold">Вопросов/сессия</span>
          </div>
          <p className="text-lg font-black text-gray-800">{data.avgQuestionsPerSession}</p>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <Clock size={14} className="text-duo-green" />
            <span className="text-[10px] text-gray-400 font-bold">Время/вопрос</span>
          </div>
          <p className="text-lg font-black text-gray-800">{data.avgTimePerQuestion}с</p>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={14} className="text-red-400" />
            <span className="text-[10px] text-gray-400 font-bold">Rage quit</span>
          </div>
          <p className="text-lg font-black text-red-500">{data.rageQuits}</p>
        </div>
      </div>

      {/* Time Distribution */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-3 text-sm">Распределение времени ответа</h3>
        <div className="space-y-2">
          {data.timeDistribution.map((item) => {
            const total = answerHistory.length || 1
            const pct = Math.round((item.count / total) * 100)
            return (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-500 w-12">{item.label}</span>
                <div className="flex-1">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-600 w-10 text-right">{item.count} ({pct}%)</span>
              </div>
            )
          })}
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
          <span className="text-red-500 font-bold">&lt; 3с</span> — угадал, <span className="text-yellow-500 font-bold">3-10с</span> — быстро, <span className="text-green-500 font-bold">10-30с</span> — норма, <span className="text-blue-500 font-bold">&gt; 30с</span> — задумался
        </p>
      </div>

      {/* Hints usage */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-3 text-sm">Использование подсказок</h3>
        <div className="flex items-center gap-4">
          <div className="text-3xl font-black text-duo-yellow">{data.totalHints}</div>
          <div>
            <p className="text-xs text-gray-500">всего подсказок использовано</p>
            <p className="text-xs text-gray-400">
              {answerHistory.length > 0 ? Math.round((data.totalHints / answerHistory.length) * 100) : 0}% вопросов с подсказкой
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
