import { useState, useMemo, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Search, Edit3, Save, X, Check, Filter,
  ChevronDown, ChevronUp, BookOpen, AlertTriangle, CheckCircle
} from 'lucide-react'
import { course } from '../data/courseData'
import { Question } from '../types'
import { useProgressStore } from '../stores/progressStore'
import { loadLocalEdits, saveQuestionEdit, deleteQuestionEdit, QuestionEdit } from '../lib/questionEdits'

const ALL_QUESTIONS = course.sections.flatMap(s =>
  s.lessons.flatMap(l =>
    l.questions.map(q => ({ ...q, _sourceLessonId: l.id, _sourceSectionTitle: s.title }))
  )
)

const QUESTIONS_BY_ID = new Map(ALL_QUESTIONS.map(q => [q.id, q]))

export function QuestionEditorPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [filterTask, setFilterTask] = useState('')
  const [filterType, setFilterType] = useState<Question['type'] | ''>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [edits, setEdits] = useState<Record<string, QuestionEdit>>(loadLocalEdits)
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set())
  const [showOnlyEdited, setShowOnlyEdited] = useState(false)

  // Merge original questions with edits
  const questions = useMemo(() => {
    return ALL_QUESTIONS.map(q => {
      const edit = edits[q.id]
      return edit ? { ...q, ...edit.changes } : q
    })
  }, [edits])

  const filtered = useMemo(() => {
    let result = questions
    if (query.trim()) {
      const lower = query.toLowerCase()
      result = result.filter(q =>
        q.id.toLowerCase().includes(lower) ||
        q.text.toLowerCase().includes(lower) ||
        q.explanation.toLowerCase().includes(lower) ||
        q.correctAnswer.some(a => a.toLowerCase().includes(lower))
      )
    }
    if (filterTask) {
      result = result.filter(q =>
        q.atoms?.some(a => a.includes(filterTask)) ||
        q.id.toLowerCase().includes(filterTask.toLowerCase())
      )
    }
    if (filterType) {
      result = result.filter(q => q.type === filterType)
    }
    if (showOnlyEdited) {
      result = result.filter(q => q.id in edits)
    }
    return result
  }, [questions, query, filterTask, filterType, showOnlyEdited, edits])

  const handleSave = useCallback((id: string, changes: Partial<Question>) => {
    const original = QUESTIONS_BY_ID.get(id)
    if (!original) return

    // Save instantly — Supabase sync happens in background
    saveQuestionEdit(id, original._sourceLessonId || '', changes)
    setEdits(loadLocalEdits())
    setSavedIds(prev => new Set(prev).add(id))
    setTimeout(() => {
      setSavedIds(prev => {
        const n = new Set(prev)
        n.delete(id)
        return n
      })
    }, 2000)
  }, [])

  const handleRevert = useCallback((id: string) => {
    deleteQuestionEdit(id)
    setEdits(loadLocalEdits())
  }, [])

  const editedCount = Object.keys(edits).length

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={() => navigate('/teacher/classroom')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="font-bold text-gray-800">Редактор заданий</h1>
          <p className="text-xs text-gray-500">
            {ALL_QUESTIONS.length} заданий · {editedCount} правок
          </p>
        </div>
        <button
          onClick={() => setShowOnlyEdited(!showOnlyEdited)}
          className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors ${
            showOnlyEdited ? 'bg-duo-green text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          Только правки ({editedCount})
        </button>
      </div>

      {/* Search & Filters */}
      <div className="px-4 py-4 space-y-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Поиск по ID, тексту, ответу, объяснению..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-duo-green focus:ring-1 focus:ring-duo-green"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Задание (task9, task12...)"
            value={filterTask}
            onChange={(e) => setFilterTask(e.target.value)}
            className="flex-1 px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-duo-green"
          />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-2 bg-gray-50 rounded-xl text-sm border border-gray-200 focus:outline-none focus:border-duo-green"
          >
            <option value="">Все типы</option>
            <option value="single">single</option>
            <option value="multiple">multiple</option>
            <option value="text">text</option>
            <option value="ege-multiple">ege-multiple</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="px-4 pb-8 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-400">
            <BookOpen size={32} className="mx-auto mb-2" />
            <p className="text-sm">Ничего не найдено</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 font-bold">
              Найдено: {filtered.length}
            </p>
            {filtered.map((q) => (
              <QuestionEditCard
                key={q.id}
                question={q}
                isExpanded={expandedId === q.id}
                onToggle={() => setExpandedId(expandedId === q.id ? null : q.id)}
                onSave={handleSave}
                onRevert={handleRevert}
                isSaved={savedIds.has(q.id)}
                hasEdit={q.id in edits}
              />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

interface QuestionEditCardProps {
  question: Question & { _sourceSectionTitle?: string; _sourceLessonId?: string }
  isExpanded: boolean
  onToggle: () => void
  onSave: (id: string, changes: Partial<Question>) => void
  onRevert: (id: string) => void
  isSaved: boolean
  hasEdit: boolean
  agent?: string
}
  const [text, setText] = useState(question.text)
  const [explanation, setExplanation] = useState(question.explanation)
  const [correctAnswer, setCorrectAnswer] = useState(question.correctAnswer.join(', '))
  const [options, setOptions] = useState(question.options?.join(', ') || '')
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>(question.difficulty || 'medium')
  const [error, setError] = useState('')

  const taskNumbers = useMemo(() => {
    return question.atoms?.filter(a => a.startsWith('task')).map(a => a.replace('task', '')) || []
  }, [question.atoms])

  const handleSubmit = () => {
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

    if (difficulty !== question.difficulty) changes.difficulty = difficulty as any

    if (Object.keys(changes).length === 0) {
      setError('Нет изменений')
      return
    }

    onSave(question.id, changes)
  }

  return (
    <motion.div
      layout
      className={`border rounded-xl overflow-hidden transition-colors ${
        hasEdit ? 'border-duo-green bg-green-50/30' : 'border-gray-200 bg-white'
      }`}
    >
      {/* Header (always visible) */}
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-gray-50 transition-colors"
      >
        {isExpanded ? <ChevronUp size={16} className="text-gray-400 shrink-0" /> : <ChevronDown size={16} className="text-gray-400 shrink-0" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">{question.id}</span>
            {taskNumbers.map(t => (
              <span key={t} className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded font-bold text-gray-500">
                №{t}
              </span>
            ))}
            <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded text-gray-500">
              {question.type}
            </span>
            {hasEdit && (
              <span className="text-[10px] px-1.5 py-0.5 bg-duo-green text-white rounded font-bold">
                правка
              </span>
            )}
          </div>
          <p className="text-sm text-gray-800 truncate mt-0.5">{question.text}</p>
        </div>
        {isSaved && <CheckCircle size={16} className="text-duo-green shrink-0" />}
      </button>

      {/* Expanded editor */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
              {/* Text */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Текст вопроса</label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-duo-green focus:ring-1 focus:ring-duo-green min-h-[60px]"
                />
              </div>

              {/* Explanation */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Объяснение</label>
                <textarea
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-duo-green focus:ring-1 focus:ring-duo-green min-h-[80px]"
                />
              </div>

              {/* Correct Answer */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Правильный ответ (через запятую)</label>
                <input
                  type="text"
                  value={correctAnswer}
                  onChange={(e) => setCorrectAnswer(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-duo-green focus:ring-1 focus:ring-duo-green"
                />
              </div>

              {/* Options (if applicable) */}
              {question.options && (
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Варианты (через запятую)</label>
                  <input
                    type="text"
                    value={options}
                    onChange={(e) => setOptions(e.target.value)}
                    className="w-full mt-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-duo-green focus:ring-1 focus:ring-duo-green"
                  />
                </div>
              )}

              {/* Difficulty */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Сложность</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                  className="mt-1 px-3 py-2 bg-white rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-duo-green"
                >
                  <option value="easy">Легко</option>
                  <option value="medium">Средне</option>
                  <option value="hard">Сложно</option>
                </select>
              </div>

              {error && (
                <p className="text-xs text-amber-600 font-bold">{error}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 bg-duo-green text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-duo-green-dark transition-colors"
                >
                  {isSaved ? <Check size={16} /> : <Save size={16} />}
                  {isSaved ? 'Сохранено!' : 'Сохранить правку'}
                </button>
                {hasEdit && (
                  <button
                    onClick={() => {
                      onRevert(question.id)
                      setText(question.text)
                      setExplanation(question.explanation)
                      setCorrectAnswer(question.correctAnswer.join(', '))
                      setOptions(question.options?.join(', ') || '')
                      setDifficulty(question.difficulty || 'medium')
                    }}
                    className="px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-gray-200 transition-colors"
                  >
                    <X size={16} />
                    Отменить
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
