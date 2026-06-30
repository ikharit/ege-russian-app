import React, { useMemo } from 'react'
import { Trophy, Medal, Award } from 'lucide-react'

interface StudentData {
  studentId: string
  name: string
  xp: number
  accuracy: number
  streak: number
  totalLessonTimeMinutes: number
  answerHistory?: any[]
}

interface ClassLeaderboardProps {
  students: StudentData[]
}

export function ClassLeaderboard({ students }: ClassLeaderboardProps) {
  const boards = useMemo(() => {
    const withAnswerCount = students.map(s => ({
      ...s,
      answerCount: (s.answerHistory || []).length,
    }))

    return {
      xp: [...withAnswerCount].sort((a, b) => b.xp - a.xp).slice(0, 5),
      accuracy: [...withAnswerCount].sort((a, b) => b.accuracy - a.accuracy).slice(0, 5),
      streak: [...withAnswerCount].sort((a, b) => b.streak - a.streak).slice(0, 5),
      answers: [...withAnswerCount].sort((a, b) => b.answerCount - a.answerCount).slice(0, 5),
      time: [...withAnswerCount].sort((a, b) => b.totalLessonTimeMinutes - a.totalLessonTimeMinutes).slice(0, 5),
    }
  }, [students])

  const categories = [
    { key: 'xp' as const, label: '💎 XP', icon: Trophy, data: boards.xp, valueKey: 'xp' as const, suffix: ' XP' },
    { key: 'accuracy' as const, label: '🎯 Точность', icon: Award, data: boards.accuracy, valueKey: 'accuracy' as const, suffix: '%' },
    { key: 'streak' as const, label: '🔥 Стрик', icon: Medal, data: boards.streak, valueKey: 'streak' as const, suffix: ' дн' },
    { key: 'answers' as const, label: '✅ Ответов', icon: Award, data: boards.answers, valueKey: 'answerCount' as const, suffix: '' },
    { key: 'time' as const, label: '⏱️ Время', icon: Trophy, data: boards.time, valueKey: 'totalLessonTimeMinutes' as const, suffix: ' мин' },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => {
        const Icon = cat.icon
        return (
          <div key={cat.key} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Icon size={16} className="text-duo-yellow" />
              <h3 className="font-bold text-gray-700 text-sm">{cat.label}</h3>
            </div>
            <div className="space-y-2">
              {cat.data.map((s, i) => (
                <div key={s.studentId} className="flex items-center gap-2">
                  <span className={`w-5 text-center text-xs font-bold ${i === 0 ? 'text-yellow-600' : i === 1 ? 'text-gray-400' : i === 2 ? 'text-orange-400' : 'text-gray-300'}`}>
                    {i + 1}
                  </span>
                  <span className="text-xs font-bold text-gray-700 truncate flex-1">{s.name}</span>
                  <span className="text-xs font-bold text-gray-500">
                    {(s as any)[cat.valueKey]}{cat.suffix}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
