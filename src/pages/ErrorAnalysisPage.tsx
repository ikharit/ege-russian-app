import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, BookOpen, TrendingDown, Target, Zap, AlertTriangle } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { getSubskillName } from '../utils/errorPatternAnalyzer'

const COLORS = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#22c55e']

export function ErrorAnalysisPage() {
  const navigate = useNavigate()
  const analysis = useProgressStore((s) => s.getErrorAnalysis())
  const wrongAnswers = useProgressStore((s) => s.getWrongAnswers())

  const topPatterns = useMemo(() => analysis.patterns.slice(0, 5), [analysis.patterns])

  const accuracyData = useMemo(() => {
    const stats = useProgressStore.getState().taskStats
    return Object.entries(stats)
      .map(([taskNumber, data]) => ({
        task: `Задание ${taskNumber}`,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        total: data.total,
      }))
      .filter((d) => d.total > 0)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 10)
  }, [])

  const weakSubskills = useMemo(() => analysis.weakSubskills.slice(0, 5), [analysis.weakSubskills])

  const getExampleForPattern = (errorType: string, taskNumber: number) => {
    const match = wrongAnswers.find(
      (w) => w.taskNumber === String(taskNumber) && w.explanation.toLowerCase().includes(errorType.toLowerCase())
    )
    if (match) return { text: match.text, correctAnswer: match.correctAnswer.join(', ') }
    // fallback: any wrong answer for this task
    const fallback = wrongAnswers.find((w) => w.taskNumber === String(taskNumber))
    if (fallback) return { text: fallback.text, correctAnswer: fallback.correctAnswer.join(', ') }
    return null
  }

  const getTrainerLink = (taskNumber: number): string => {
    const map: Record<number, string> = {
      5: '/trainers/task5',
      9: '/trainers/task9',
      10: '/trainers/task10',
      16: '/trainers/task16',
    }
    return map[taskNumber] ?? '/trainers'
  }

  return (
    <div className="min-h-screen bg-duo-snow flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-4 bg-white border-b border-gray-100">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-gray-800">Анализ ошибок</h1>
          <p className="text-xs text-gray-500">IRT + Error Pattern Analysis</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full flex flex-col gap-6">
        {/* Weak spots */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={18} className="text-duo-red" />
            <h2 className="font-bold text-gray-800">Твои слабые места</h2>
          </div>
          {topPatterns.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
              <p className="text-sm text-gray-500">Пока недостаточно данных для анализа. Решай больше заданий!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {topPatterns.map((p, idx) => {
                const example = getExampleForPattern(p.errorType, p.taskNumber)
                return (
                  <motion.div
                    key={`${p.taskNumber}-${p.errorType}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className="bg-white rounded-2xl border border-gray-100 p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-duo-blue uppercase">Задание {p.taskNumber}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                        p.confidence >= 0.8 ? 'bg-red-100 text-red-700' :
                        p.confidence >= 0.5 ? 'bg-amber-100 text-amber-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {Math.round(p.confidence * 100)}% уверенность
                      </span>
                    </div>
                    <p className="font-medium text-gray-800 mb-1">{getSubskillName(p.errorType)}</p>
                    <p className="text-xs text-gray-500 mb-2">Ошибок: {p.frequency}</p>
                    {example && (
                      <div className="bg-gray-50 rounded-xl p-3 text-sm mb-2">
                        <p className="text-gray-700 mb-1">{example.text}</p>
                        <p className="text-duo-green font-medium">Правильно: {example.correctAnswer}</p>
                      </div>
                    )}
                    <button
                      onClick={() => navigate(getTrainerLink(p.taskNumber))}
                      className="text-sm text-duo-blue font-medium flex items-center gap-1 hover:underline"
                    >
                      <Target size={14} /> Тренировать слабое место
                    </button>
                  </motion.div>
                )
              })}
            </div>
          )}
        </section>

        {/* Accuracy chart */}
        {accuracyData.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown size={18} className="text-duo-blue" />
              <h2 className="font-bold text-gray-800">Точность по заданиям</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-4">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={accuracyData} layout="vertical" margin={{ left: 10, right: 10 }}>
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="task" type="category" width={90} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value}%`, 'Точность']}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="accuracy" radius={[0, 8, 8, 0]} barSize={20}>
                    {accuracyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.accuracy < 60 ? COLORS[0] : entry.accuracy < 80 ? COLORS[2] : COLORS[4]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* Weak subskills */}
        {weakSubskills.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Zap size={18} className="text-amber-500" />
              <h2 className="font-bold text-gray-800">Слабые поднавыки</h2>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              {weakSubskills.map((w) => (
                <div key={`${w.taskNumber}-${w.subskill}`} className="p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{getSubskillName(w.subskill)}</p>
                    <p className="text-xs text-gray-500">Задание {w.taskNumber}</p>
                  </div>
                  <span className={`text-sm font-bold ${w.accuracy < 50 ? 'text-red-500' : 'text-amber-500'}`}>
                    {w.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Recommendations */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={18} className="text-duo-green" />
            <h2 className="font-bold text-gray-800">Рекомендации</h2>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            {analysis.recommendations.length === 0 ? (
              <p className="text-sm text-gray-500">Продолжай регулярную практику!</p>
            ) : (
              <ul className="flex flex-col gap-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="text-sm text-gray-700 flex items-start gap-2">
                    <span className="text-duo-green mt-0.5">•</span>
                    {rec}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
