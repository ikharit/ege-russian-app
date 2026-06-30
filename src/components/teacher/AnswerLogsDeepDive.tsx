import React, { useMemo } from 'react'
import { AlertTriangle, BookOpen, Clock } from 'lucide-react'

interface AnswerLog {
  questionId: string
  word?: string
  ruleId?: string
  taskNumber: string
  correct: boolean
  errorType?: string
  hintsUsed?: number
  timestamp: string
  timeSpent: number
  userAnswer?: string[]
}

interface AnswerLogsDeepDiveProps {
  answerHistory: AnswerLog[]
}

export function AnswerLogsDeepDive({ answerHistory }: AnswerLogsDeepDiveProps) {
  const data = useMemo(() => {
    const wrong = answerHistory.filter(a => !a.correct)
    
    // Group by taskNumber
    const byTask: Record<string, { count: number; recent: AnswerLog[] }> = {}
    wrong.forEach(entry => {
      const task = entry.taskNumber || 'unknown'
      if (!byTask[task]) byTask[task] = { count: 0, recent: [] }
      byTask[task].count++
      byTask[task].recent.push(entry)
    })

    // Group by errorType
    const byError: Record<string, number> = {}
    wrong.forEach(entry => {
      const et = entry.errorType || 'unknown'
      byError[et] = (byError[et] || 0) + 1
    })

    // Group by word
    const byWord: Record<string, { count: number; taskNumber: string }> = {}
    wrong.forEach(entry => {
      if (entry.word) {
        if (!byWord[entry.word]) byWord[entry.word] = { count: 0, taskNumber: entry.taskNumber }
        byWord[entry.word].count++
      }
    })

    // Recent errors (last 20)
    const recent = [...wrong].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 20)

    return { byTask, byError, byWord, recent, totalWrong: wrong.length, total: answerHistory.length }
  }, [answerHistory])

  if (answerHistory.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle size={20} className="text-red-500" />
          <h3 className="font-bold text-gray-700">Детальный анализ ошибок</h3>
        </div>
        <p className="text-sm text-gray-500">Нет данных об ответах.</p>
      </div>
    )
  }

  const accuracy = data.total > 0 ? Math.round(((data.total - data.totalWrong) / data.total) * 100) : 0

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={18} className="text-red-500" />
          <h3 className="font-bold text-gray-700">Анализ ошибок</h3>
          <span className="text-xs text-gray-400 ml-auto">{data.total} ответов, {accuracy}% точность</span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-red-50 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-red-600">{data.totalWrong}</p>
            <p className="text-[10px] text-red-500 font-bold">Ошибок</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-amber-600">{Object.keys(data.byTask).length}</p>
            <p className="text-[10px] text-amber-500 font-bold">Заданий с ошибками</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3 text-center">
            <p className="text-lg font-black text-blue-600">{Object.keys(data.byError).length}</p>
            <p className="text-[10px] text-blue-500 font-bold">Типов ошибок</p>
          </div>
        </div>
      </div>

      {/* Errors by Task */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2">
          <BookOpen size={16} className="text-duo-blue" />
          Ошибки по заданиям
        </h3>
        <div className="space-y-2">
          {Object.entries(data.byTask)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 10)
            .map(([task, info]) => {
              const taskAccuracy = data.total > 0 ? Math.round(((data.total - info.count) / data.total) * 100) : 0
              return (
                <div key={task} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-500 w-20">Задание {task}</span>
                  <div className="flex-1">
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="bg-red-400 h-2 rounded-full" style={{ width: `${Math.min((info.count / (data.totalWrong || 1)) * 100, 100)}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-red-600 w-8 text-right">{info.count}</span>
                </div>
              )
            })}
        </div>
      </div>

      {/* Errors by Word */}
      {Object.keys(data.byWord).length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-700 mb-3 text-sm">Самые проблемные слова</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(data.byWord)
              .sort((a, b) => b[1].count - a[1].count)
              .slice(0, 15)
              .map(([word, info]) => (
                <span key={word} className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-[10px] font-bold">
                  {word} ({info.count})
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Recent Errors */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-3 text-sm flex items-center gap-2">
          <Clock size={16} className="text-gray-400" />
          Последние ошибки ({data.recent.length})
        </h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {data.recent.map((entry, i) => (
            <div key={i} className="p-2 bg-red-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-700">{entry.word || entry.questionId}</span>
                <span className="text-[10px] text-gray-400">Задание {entry.taskNumber}</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] px-1.5 py-0.5 bg-red-200 text-red-700 rounded-full font-bold">{entry.errorType || 'ошибка'}</span>
                <span className="text-[10px] text-gray-400">{Math.round((entry.timeSpent || 0) / 1000)}с</span>
                {entry.hintsUsed ? <span className="text-[10px] text-amber-500">💡 {entry.hintsUsed}</span> : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
