import React, { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { Target, AlertTriangle } from 'lucide-react'

interface ContentGapAnalysisProps {
  answerHistory: {
    taskNumber: string
    correct: boolean
    ruleId?: string
    word?: string
    errorType?: string
  }[]
}

export function ContentGapAnalysis({ answerHistory }: ContentGapAnalysisProps) {
  const data = useMemo(() => {
    // Group by taskNumber
    const byTask: Record<string, { total: number; correct: number; rules: Record<string, number> }> = {}
    const byRule: Record<string, { total: number; correct: number; tasks: string[] }> = {}

    answerHistory.forEach((entry) => {
      const task = entry.taskNumber || 'unknown'
      if (!byTask[task]) byTask[task] = { total: 0, correct: 0, rules: {} }
      byTask[task].total++
      if (entry.correct) byTask[task].correct++
      if (entry.ruleId) {
        byTask[task].rules[entry.ruleId] = (byTask[task].rules[entry.ruleId] || 0) + 1
        if (!byRule[entry.ruleId]) byRule[entry.ruleId] = { total: 0, correct: 0, tasks: [] }
        byRule[entry.ruleId].total++
        if (entry.correct) byRule[entry.ruleId].correct++
        if (!byRule[entry.ruleId].tasks.includes(task)) byRule[entry.ruleId].tasks.push(task)
      }
    })

    const taskData = Object.entries(byTask)
      .map(([task, stats]) => ({
        task: `Задание ${task}`,
        taskNum: task,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        total: stats.total,
        worstRule: Object.entries(stats.rules).sort((a, b) => b[1] - a[1])[0]?.[0] || '',
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10)

    const ruleData = Object.entries(byRule)
      .map(([rule, stats]) => ({
        rule,
        accuracy: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
        total: stats.total,
        tasks: stats.tasks.join(', '),
      }))
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10)

    return { taskData, ruleData }
  }, [answerHistory])

  if (answerHistory.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Target size={20} className="text-duo-purple" />
          <h3 className="font-bold text-gray-700">Анализ пробелов</h3>
        </div>
        <p className="text-sm text-gray-500">Нет данных об ответах для анализа.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Task Gap Analysis */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} className="text-duo-purple" />
          <h3 className="font-bold text-gray-700">Проблемные задания (класс)</h3>
          <span className="text-xs text-gray-400 ml-auto">{answerHistory.length} ответов</span>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.taskData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="task" tick={{ fontSize: 10 }} width={90} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Bar dataKey="accuracy" fill="#58cc02" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-gray-400 mt-2">
          Сортировка: сначала задания с наименьшей точностью. Кликните на задание для деталей.
        </p>
      </div>

      {/* Rule Gap Analysis */}
      {data.ruleData.length > 0 && (
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={18} className="text-red-500" />
            <h3 className="font-bold text-gray-700">Проблемные правила</h3>
          </div>
          <div className="space-y-2">
            {data.ruleData.map((rule) => (
              <div key={rule.rule} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-700 truncate">{rule.rule}</p>
                  <p className="text-[10px] text-gray-400">Задания: {rule.tasks}</p>
                </div>
                <div className="w-20">
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${rule.accuracy >= 70 ? 'bg-green-400' : rule.accuracy >= 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                      style={{ width: `${rule.accuracy}%` }}
                    />
                  </div>
                </div>
                <span className={`text-xs font-bold w-8 text-right ${rule.accuracy >= 70 ? 'text-green-600' : rule.accuracy >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {rule.accuracy}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
