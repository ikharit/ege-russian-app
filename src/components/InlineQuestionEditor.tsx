import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Save, RotateCcw, AlertTriangle, Cloud } from 'lucide-react'
import { Question } from '../types'
import { saveQuestionEdit, deleteQuestionEdit, loadLocalEdits, isPendingSync } from '../lib/questionEdits'

interface InlineQuestionEditorProps {
  question: Question
  lessonId?: string
  onClose: () => void
  onSaved?: () => void
}

export function InlineQuestionEditor({ question, lessonId = '', onClose, onSaved }: InlineQuestionEditorProps) {
  const [text, setText] = useState(question.text)
  const [explanation, setExplanation] = useState(question.explanation)
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer.join(', '))
  const [options, setOptions] = useState(question.options?.join(', ') || '')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(question.difficulty || 'medium')
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  const handleSave = () => {
    setError('')
    const changes: Partial<Question> = {}

    if (text.trim() !== question.text) changes.text = text.trim()
    if (explanation.trim() !== question.explanation) changes.explanation = explanation.trim()

    const parsedAnswer = correctAnswer.split(',').map(s => s.trim()).filter(Boolean)
    if (parsedAnswer.join(',') !== question.correctAnswer.join(',')) {
      changes.correctAnswer = parsedAnswer
    }

    if (question.options) {
      const parsedOptions = options.split(',').map(s => s.trim()).filter(Boolean)
      if (parsedOptions.join(',') !== question.options?.join(',')) {
        changes.options = parsedOptions
      }
    }

    if (difficulty !== question.difficulty) changes.difficulty = difficulty

    if (Object.keys(changes).length === 0) {
      setError('Нет изменений')
      return
    }

    // Save instantly — Supabase sync happens in background
    saveQuestionEdit(question.id, lessonId, changes)

    setSaved(true)
    onSaved?.()
    setTimeout(() => setSaved(false), 2000)
  }

  const handleRevert = () => {
    deleteQuestionEdit(question.id)
    setText(question.text)
    setExplanation(question.explanation)
    setCorrectAnswer(question.correctAnswer.join(', '))
    setOptions(question.options?.join(', ') || '')
    setDifficulty(question.difficulty || 'medium')
    onSaved?.()
  }

  const hasEdit = question.id in loadLocalEdits()
  const pending = isPendingSync(question.id)

  return (
    <motion.div
      initial={{ opacity: 0, y: '100%' }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="fixed inset-x-0 bottom-0 z-[100] bg-white border-t border-gray-200 rounded-t-2xl shadow-2xl max-h-[80vh] flex flex-col"
    >
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-amber-500" />
          <span className="font-bold text-sm">Редактировать задание</span>
          <span className="text-xs text-gray-400 font-mono">{question.id}</span>
          {pending && <Cloud size={14} className="text-duo-blue animate-pulse" title="Синхронизация..." />}
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X size={20} />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {/* Text */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Текст вопроса</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-duo-green min-h-[60px]"
          />
        </div>

        {/* Explanation */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Объяснение</label>
          <textarea
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-duo-green min-h-[80px]"
          />
        </div>

        {/* Correct Answer */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Правильный ответ (через запятую)</label>
          <input
            type="text"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
            className="w-full mt-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-duo-green"
          />
        </div>

        {/* Options */}
        {question.options && (
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase">Варианты (через запятую)</label>
            <input
              type="text"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-duo-green"
            />
          </div>
        )}

        {/* Difficulty */}
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">Сложность</label>
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
            className="mt-1 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-duo-green"
          >
            <option value="easy">Легко</option>
            <option value="medium">Средне</option>
            <option value="hard">Сложно</option>
          </select>
        </div>

        {error && <p className="text-xs text-amber-600 font-bold">{error}</p>}
        {saved && <p className="text-xs text-duo-green font-bold">✓ Сохранено!</p>}
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-duo-green text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-duo-green-dark transition-colors"
        >
          <Save size={16} />
          {saved ? 'Сохранено!' : 'Сохранить правку'}
        </button>
        {hasEdit && (
          <button
            onClick={handleRevert}
            className="px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <RotateCcw size={16} />
            Отменить
          </button>
        )}
      </div>
    </motion.div>
  )
}
