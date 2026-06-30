import React, { useMemo } from 'react'
import { AlertTriangle, Bell, Phone, BookOpen, TrendingDown } from 'lucide-react'

interface StudentData {
  studentId: string
  name: string
  accuracy: number
  lastActivityDays: number
  streak: number
  dailySnapshots?: any[]
  answerHistory?: any[]
  xp: number
}

interface EarlyWarningProps {
  students: StudentData[]
}

export function EarlyWarning({ students }: EarlyWarningProps) {
  const warnings = useMemo(() => {
    const now = Date.now()
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000

    return students.map((s) => {
      const snaps = s.dailySnapshots || []
      const answers = s.answerHistory || []

      // This week
      const thisWeekAnswers = answers.filter((a: any) => a.timestamp && new Date(a.timestamp).getTime() >= weekAgo)
      const thisWeekAcc = thisWeekAnswers.length > 0
        ? Math.round((thisWeekAnswers.filter((a: any) => a.correct).length / thisWeekAnswers.length) * 100)
        : 0

      // Previous week
      const prevWeekAnswers = answers.filter((a: any) => {
        const t = new Date(a.timestamp).getTime()
        return t >= twoWeeksAgo && t < weekAgo
      })
      const prevWeekAcc = prevWeekAnswers.length > 0
        ? Math.round((prevWeekAnswers.filter((a: any) => a.correct).length / prevWeekAnswers.length) * 100)
        : 0

      const accDrop = prevWeekAcc - thisWeekAcc
      const isInactive = s.lastActivityDays > 3
      const isStreakBroken = s.streak === 0 && s.lastActivityDays > 1
      const lowAccuracy = s.accuracy < 50
      const rapidDecline = accDrop > 20

      const riskScore = (isInactive ? 30 : 0) + (isStreakBroken ? 20 : 0) + (lowAccuracy ? 25 : 0) + (rapidDecline ? 25 : 0)

      let action = ''
      if (riskScore >= 70) action = 'Срочно: позвонить родителям, назначить встречу'
      else if (riskScore >= 50) action = 'Важно: написать сообщение, предложить помощь'
      else if (riskScore >= 30) action = 'Рекомендуется: напомнить о занятиях'
      else action = ''

      return {
        studentId: s.studentId,
        name: s.name,
        riskScore,
        isInactive,
        isStreakBroken,
        lowAccuracy,
        rapidDecline,
        accDrop,
        action,
      }
    }).filter(w => w.riskScore > 0).sort((a, b) => b.riskScore - a.riskScore)
  }, [students])

  const highRisk = warnings.filter(w => w.riskScore >= 70)
  const mediumRisk = warnings.filter(w => w.riskScore >= 40 && w.riskScore < 70)
  const lowRisk = warnings.filter(w => w.riskScore > 0 && w.riskScore < 40)

  return (
    <div className="space-y-4">
      {/* Risk Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle size={16} className="text-red-500" />
            <span className="text-xs font-bold text-red-600">Критично</span>
          </div>
          <p className="text-2xl font-black text-red-600">{highRisk.length}</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
          <div className="flex items-center gap-2 mb-2">
            <Bell size={16} className="text-yellow-500" />
            <span className="text-xs font-bold text-yellow-600">Внимание</span>
          </div>
          <p className="text-2xl font-black text-yellow-600">{mediumRisk.length}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={16} className="text-blue-500" />
            <span className="text-xs font-bold text-blue-600">Наблюдать</span>
          </div>
          <p className="text-2xl font-black text-blue-600">{lowRisk.length}</p>
        </div>
      </div>

      {/* Warning List */}
      {warnings.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <div className="w-8 h-8 bg-green-400 rounded-full" />
          </div>
          <p className="text-gray-500 font-bold">Все ученики в порядке!</p>
          <p className="text-sm text-gray-400">Нет признаков риска отвала.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {warnings.map((w) => (
            <div
              key={w.studentId}
              className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${
                w.riskScore >= 70 ? 'border-red-500' : w.riskScore >= 40 ? 'border-yellow-500' : 'border-blue-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm ${
                  w.riskScore >= 70 ? 'bg-red-500' : w.riskScore >= 40 ? 'bg-yellow-500' : 'bg-blue-400'
                }`}>
                  {w.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-800 text-sm">{w.name}</p>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold text-white ${
                      w.riskScore >= 70 ? 'bg-red-500' : w.riskScore >= 40 ? 'bg-yellow-500' : 'bg-blue-400'
                    }`}>
                      {w.riskScore} баллов
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {w.isInactive && <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full">Неактивен</span>}
                    {w.isStreakBroken && <span className="text-[10px] px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full">Стрик прерван</span>}
                    {w.lowAccuracy && <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded-full">Точность &lt; 50%</span>}
                    {w.rapidDecline && <span className="text-[10px] px-1.5 py-0.5 bg-yellow-100 text-yellow-600 rounded-full">Падение точности</span>}
                  </div>
                </div>
              </div>
              {w.action && (
                <div className="mt-2 p-2 bg-gray-50 rounded-xl flex items-center gap-2">
                  <Phone size={14} className="text-gray-400" />
                  <p className="text-xs text-gray-600 font-bold">{w.action}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
