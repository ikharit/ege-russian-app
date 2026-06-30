import React, { useMemo } from 'react'
import { TrendingUp, TrendingDown, Zap, Award } from 'lucide-react'

interface StudentData {
  studentId: string
  name: string
  xp: number
  accuracy: number
  streak: number
  dailySnapshots?: any[]
  answerHistory?: any[]
}

interface LearningVelocityProps {
  students: StudentData[]
}

export function LearningVelocity({ students }: LearningVelocityProps) {
  const velocity = useMemo(() => {
    const now = Date.now()
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000

    return students.map((s) => {
      const snaps = s.dailySnapshots || []
      const answers = s.answerHistory || []

      // This week (last 7 days)
      const thisWeekSnaps = snaps.filter((sn: any) => sn.date && new Date(sn.date).getTime() >= weekAgo)
      const thisWeekAnswers = answers.filter((a: any) => a.timestamp && new Date(a.timestamp).getTime() >= weekAgo)

      // Previous week (7-14 days ago)
      const prevWeekSnaps = snaps.filter((sn: any) => {
        const t = new Date(sn.date).getTime()
        return t >= twoWeeksAgo && t < weekAgo
      })
      const prevWeekAnswers = answers.filter((a: any) => {
        const t = new Date(a.timestamp).getTime()
        return t >= twoWeeksAgo && t < weekAgo
      })

      const thisWeekAcc = thisWeekAnswers.length > 0
        ? Math.round((thisWeekAnswers.filter((a: any) => a.correct).length / thisWeekAnswers.length) * 100)
        : 0
      const prevWeekAcc = prevWeekAnswers.length > 0
        ? Math.round((prevWeekAnswers.filter((a: any) => a.correct).length / prevWeekAnswers.length) * 100)
        : 0
      const accDelta = thisWeekAcc - prevWeekAcc

      const thisWeekSessions = thisWeekSnaps.reduce((sum: number, sn: any) => sum + (sn.totalSessions || 0), 0)
      const prevWeekSessions = prevWeekSnaps.reduce((sum: number, sn: any) => sum + (sn.totalSessions || 0), 0)
      const sessionDelta = prevWeekSessions > 0
        ? Math.round(((thisWeekSessions - prevWeekSessions) / prevWeekSessions) * 100)
        : 0

      const thisWeekAnswersCount = thisWeekAnswers.length
      const prevWeekAnswersCount = prevWeekAnswers.length
      const answersDelta = prevWeekAnswersCount > 0
        ? Math.round(((thisWeekAnswersCount - prevWeekAnswersCount) / prevWeekAnswersCount) * 100)
        : 0

      return {
        studentId: s.studentId,
        name: s.name,
        thisWeekAcc,
        prevWeekAcc,
        accDelta,
        thisWeekSessions,
        prevWeekSessions,
        sessionDelta,
        thisWeekAnswersCount,
        prevWeekAnswersCount,
        answersDelta,
        xp: s.xp,
        streak: s.streak,
        // Composite velocity score: accuracy delta + answers delta
        velocityScore: accDelta + (answersDelta / 2),
      }
    }).sort((a, b) => b.velocityScore - a.velocityScore)
  }, [students])

  const topRisers = velocity.slice(0, 5)
  const topFallers = velocity.slice(-5).reverse()

  return (
    <div className="space-y-4">
      {/* Top Risers */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} className="text-green-500" />
          <h3 className="font-bold text-gray-700">🚀 Рост недели</h3>
        </div>
        <div className="space-y-2">
          {topRisers.map((v) => (
            <div key={v.studentId} className="flex items-center gap-3 p-2 bg-green-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-green-400 text-white flex items-center justify-center font-bold text-xs">
                {v.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{v.name}</p>
                <p className="text-[10px] text-gray-500">
                  Точность: {v.prevWeekAcc}% → {v.thisWeekAcc}%
                  {v.answersDelta !== 0 && ` • Ответы: ${v.prevWeekAnswersCount} → ${v.thisWeekAnswersCount}`}
                </p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-black ${v.accDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {v.accDelta > 0 ? '+' : ''}{v.accDelta}%
                </p>
                <p className="text-[10px] text-gray-400">точность</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Fallers */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <TrendingDown size={18} className="text-red-500" />
          <h3 className="font-bold text-gray-700">📉 Падение недели</h3>
        </div>
        <div className="space-y-2">
          {topFallers.map((v) => (
            <div key={v.studentId} className="flex items-center gap-3 p-2 bg-red-50 rounded-xl">
              <div className="w-8 h-8 rounded-lg bg-red-400 text-white flex items-center justify-center font-bold text-xs">
                {v.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-800 truncate">{v.name}</p>
                <p className="text-[10px] text-gray-500">
                  Точность: {v.prevWeekAcc}% → {v.thisWeekAcc}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-red-600">
                  {v.accDelta > 0 ? '+' : ''}{v.accDelta}%
                </p>
                <p className="text-[10px] text-gray-400">точность</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Velocity Table */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={18} className="text-duo-yellow" />
          <h3 className="font-bold text-gray-700">Скорость обучения (все)</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 text-xs">
                <th className="pb-2">Ученик</th>
                <th className="pb-2 text-right">Точность</th>
                <th className="pb-2 text-right">Ответы</th>
                <th className="pb-2 text-right">Сессии</th>
                <th className="pb-2 text-right">Итог</th>
              </tr>
            </thead>
            <tbody>
              {velocity.slice(0, 10).map((v) => (
                <tr key={v.studentId} className="border-t border-gray-50">
                  <td className="py-2 text-xs font-bold text-gray-700">{v.name}</td>
                  <td className={`py-2 text-xs text-right font-bold ${v.accDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {v.accDelta > 0 ? '+' : ''}{v.accDelta}%
                  </td>
                  <td className={`py-2 text-xs text-right font-bold ${v.answersDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {v.answersDelta > 0 ? '+' : ''}{v.answersDelta}%
                  </td>
                  <td className={`py-2 text-xs text-right font-bold ${v.sessionDelta >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {v.sessionDelta > 0 ? '+' : ''}{v.sessionDelta}%
                  </td>
                  <td className="py-2 text-xs text-right font-black text-gray-800">
                    {v.velocityScore > 0 ? '+' : ''}{v.velocityScore.toFixed(1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
