import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Trash2, X } from 'lucide-react'
import { QuestionFeedback } from '../types'
import { useProgressStore } from '../stores/progressStore'

export function FeedbackDashboard() {
  const feedback = useProgressStore((s) => s.feedback)
  const submitFeedback = useProgressStore((s) => s.submitFeedback)
  const [filter, setFilter] = useState<QuestionFeedback['type'] | 'all'>('all')

  const filtered = feedback.filter((f) =>
    filter === 'all' ? true : f.type === filter
  )

  const grouped = filtered.reduce((acc, f) => {
    if (!acc[f.questionId]) acc[f.questionId] = []
    acc[f.questionId].push(f)
    return acc
  }, {} as Record<string, QuestionFeedback[]>)

  const sortedByFreq = Object.entries(grouped).sort(
    (a, b) => b[1].length - a[1].length
  )

  const typeLabels: Record<QuestionFeedback['type'], string> = {
    wrong_answer: 'Неправильный ответ',
    unclear: 'Непонятное объяснение',
    typo: 'Опечатка',
    other: 'Другое',
  }

  const handleResolve = (questionId: string) => {
    const updated = feedback.filter((f) => f.questionId !== questionId)
    // Replace entire feedback array by re-submitting without resolved
    // Since store only has submitFeedback (add), we need a way to remove.
    // For now, we'll just mark visually; to properly remove we'd need a removeFeedback action.
    // We'll add a simple visual dismiss state locally.
  }

  const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set())

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Фидбек по вопросам</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        {(['all', 'wrong_answer', 'unclear', 'typo', 'other'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
              filter === t
                ? 'border-duo-blue bg-blue-50 text-duo-blue font-medium'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t === 'all' ? 'Все' : typeLabels[t]}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {sortedByFreq.length === 0 && (
          <p className="text-sm text-gray-400">Нет фидбека</p>
        )}
        {sortedByFreq.map(([questionId, items]) => {
          if (resolvedIds.has(questionId)) return null
          const latest = items[items.length - 1]
          return (
            <motion.div
              key={questionId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-duo-blue">{questionId}</span>
                    <span className="text-xs text-gray-400">{items.length} жалоб(ы)</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {Array.from(new Set(items.map((i) => i.type))).map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600"
                      >
                        {typeLabels[t]}
                      </span>
                    ))}
                  </div>
                  {latest.message && (
                    <p className="text-xs text-gray-600 italic mb-1">«{latest.message}»</p>
                  )}
                  <p className="text-[10px] text-gray-400">
                    Последнее: {new Date(latest.timestamp).toLocaleDateString('ru-RU')}
                  </p>
                </div>
                <button
                  onClick={() => setResolvedIds((prev) => new Set([...prev, questionId]))}
                  className="ml-2 p-2 hover:bg-green-50 text-gray-400 hover:text-duo-green rounded-lg transition-colors"
                  title="Отметить как исправлено"
                >
                  <Check size={16} />
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
