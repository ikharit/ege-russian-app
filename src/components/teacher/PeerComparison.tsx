import React, { useMemo } from 'react'
import { Users } from 'lucide-react'

interface PeerComparisonProps {
  students: { studentId: string; name: string; xp: number; accuracy: number; streak: number; totalLessonTimeMinutes: number; answerHistory?: any[] }[]
  selectedStudentId: string | null
}

export function PeerComparison({ students, selectedStudentId }: PeerComparisonProps) {
  const percentiles = useMemo(() => {
    if (students.length === 0) return null

    const metrics = {
      xp: students.map(s => s.xp).sort((a, b) => a - b),
      accuracy: students.map(s => s.accuracy).sort((a, b) => a - b),
      streak: students.map(s => s.streak).sort((a, b) => a - b),
      time: students.map(s => s.totalLessonTimeMinutes).sort((a, b) => a - b),
      answers: students.map(s => (s.answerHistory || []).length).sort((a, b) => a - b),
    }

    const student = students.find(s => s.studentId === selectedStudentId)
    if (!student) return null

    const answerCount = (student.answerHistory || []).length

    const getPercentile = (value: number, sorted: number[]) => {
      const idx = sorted.findIndex(v => v >= value)
      if (idx === -1) return 100
      return Math.round((idx / sorted.length) * 100)
    }

    return {
      name: student.name,
      xp: { value: student.xp, percentile: getPercentile(student.xp, metrics.xp) },
      accuracy: { value: student.accuracy, percentile: getPercentile(student.accuracy, metrics.accuracy) },
      streak: { value: student.streak, percentile: getPercentile(student.streak, metrics.streak) },
      time: { value: student.totalLessonTimeMinutes, percentile: getPercentile(student.totalLessonTimeMinutes, metrics.time) },
      answers: { value: answerCount, percentile: getPercentile(answerCount, metrics.answers) },
    }
  }, [students, selectedStudentId])

  if (!percentiles) return null

  const metrics = [
    { key: 'xp', label: '💎 XP', value: percentiles.xp.value, percentile: percentiles.xp.percentile },
    { key: 'accuracy', label: '🎯 Точность', value: `${percentiles.accuracy.value}%`, percentile: percentiles.accuracy.percentile },
    { key: 'streak', label: '🔥 Стрик', value: `${percentiles.streak.value} дн`, percentile: percentiles.streak.percentile },
    { key: 'time', label: '⏱️ Время', value: `${percentiles.time.value} мин`, percentile: percentiles.time.percentile },
    { key: 'answers', label: '✅ Ответов', value: `${percentiles.answers.value}`, percentile: percentiles.answers.percentile },
  ]

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Users size={18} className="text-duo-blue" />
        <h3 className="font-bold text-gray-700">Сравнение с классом: {percentiles.name}</h3>
      </div>
      <div className="space-y-3">
        {metrics.map((m) => (
          <div key={m.key}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold text-gray-600">{m.label}</span>
              <span className="text-xs font-bold text-gray-800">{m.value}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${m.percentile >= 80 ? 'bg-green-400' : m.percentile >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                style={{ width: `${m.percentile}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-0.5">
              Выше {m.percentile}% класса
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
