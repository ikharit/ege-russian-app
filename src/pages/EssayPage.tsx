import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  Clock,
  Save,
  CheckCircle,
  AlertCircle,
  PenTool,
  BookOpen,
  Lightbulb,
  Target,
  Star,
  ChevronDown,
  ChevronUp,
  Send,
  RotateCcw,
} from 'lucide-react'
import {
  essayTopics,
  essayCriteria,
  getEssayProgressForTopic,
  saveEssayProgressForTopic,
} from '../data/essayData'
import type { EssayProgress } from '../types'

const EXAM_TIME_SECONDS = 2.5 * 60 * 60 // 2.5 hours
const SHORT_TIME_SECONDS = 45 * 60 // 45 minutes for practice

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

export function EssayPage() {
  const navigate = useNavigate()
  const { topicId } = useParams<{ topicId: string }>()
  const topic = essayTopics.find((t) => t.id === topicId)

  const [timeLeft, setTimeLeft] = useState(SHORT_TIME_SECONDS)
  const [isExamMode, setIsExamMode] = useState(false)
  const [text, setText] = useState('')
  const [showHints, setShowHints] = useState(false)
  const [showKeyPoints, setShowKeyPoints] = useState(false)
  const [status, setStatus] = useState<'writing' | 'reviewing' | 'done'>('writing')
  const [selfScores, setSelfScores] = useState<Record<string, number>>({})
  const [savedMessage, setSavedMessage] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load existing progress
  useEffect(() => {
    if (!topicId) return
    const saved = getEssayProgressForTopic(topicId)
    if (saved) {
      setText(saved.draftText)
      if (saved.selfCheck) {
        setSelfScores({
          k1: saved.selfCheck.k1,
          k2: saved.selfCheck.k2,
          k3: saved.selfCheck.k3,
          k4: saved.selfCheck.k4,
        })
        setStatus(saved.status === 'completed' ? 'done' : 'reviewing')
      }
    }
  }, [topicId])

  // Timer
  useEffect(() => {
    if (status !== 'writing') return
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [status])

  const saveDraft = useCallback(() => {
    if (!topicId) return
    const saved: EssayProgress = {
      topicId,
      status: text.trim().length > 50 ? 'draft' : 'not_started',
      draftText: text,
      savedAt: new Date().toISOString(),
      selfCheck:
        status === 'done' || status === 'reviewing'
          ? {
              k1: selfScores.k1 || 0,
              k2: selfScores.k2 || 0,
              k3: selfScores.k3 || 0,
              k4: selfScores.k4 || 0,
            }
          : undefined,
    }
    saveEssayProgressForTopic(topicId, saved)
    setSavedMessage('Сохранено!')
    setTimeout(() => setSavedMessage(''), 2000)
  }, [topicId, text, status, selfScores])

  // Auto-save every 30 seconds
  useEffect(() => {
    if (status !== 'writing') return
    const interval = setInterval(() => {
      saveDraft()
    }, 30000)
    return () => clearInterval(interval)
  }, [saveDraft, status])

  const handleFinish = () => {
    if (!text.trim() || text.trim().length < 50) {
      alert('Напишите хотя бы несколько предложений перед завершением.')
      return
    }
    setStatus('reviewing')
    saveDraft()
  }

  const handleSelfScore = (criterionId: string, score: number) => {
    setSelfScores((prev) => ({ ...prev, [criterionId]: score }))
  }

  const handleDone = () => {
    if (!topicId) return
    const saved: EssayProgress = {
      topicId,
      status: 'completed',
      draftText: text,
      savedAt: new Date().toISOString(),
      selfCheck: {
        k1: selfScores.k1 || 0,
        k2: selfScores.k2 || 0,
        k3: selfScores.k3 || 0,
        k4: selfScores.k4 || 0,
      },
    }
    saveEssayProgressForTopic(topicId, saved)
    setStatus('done')
  }

  const totalScore =
    (selfScores.k1 || 0) + (selfScores.k2 || 0) + (selfScores.k3 || 0) + (selfScores.k4 || 0)
  const maxScore = essayCriteria.reduce((sum, c) => sum + c.maxScore, 0)

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length

  if (!topic) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <p className="text-gray-500">Тема не найдена</p>
        <button
          onClick={() => navigate('/essay')}
          className="mt-4 text-duo-green font-bold"
        >
          ← Назад к темам
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/essay')}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Назад к темам"
        >
          <ChevronLeft size={20} className="text-gray-600" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-800 truncate">
            Сочинение №{topic.number}
          </h1>
          <p className="text-xs text-gray-500">{topic.author}</p>
        </div>
      </div>

      {/* Topic Card */}
      <motion.div
        className="card bg-gradient-to-br from-duo-blue/10 to-blue-50 border-duo-blue/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-2">
          <BookOpen size={18} className="text-duo-blue mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-gray-700 leading-relaxed">{topic.text}</p>
            <p className="text-sm text-gray-600 mt-2 font-medium">{topic.task}</p>
          </div>
        </div>
      </motion.div>

      {/* Timer & Mode Toggle */}
      {status === 'writing' && (
        <motion.div
          className="card flex items-center justify-between"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center gap-2">
            <Clock
              size={20}
              className={timeLeft < 300 ? 'text-red-500' : 'text-duo-blue'}
            />
            <span
              className={`text-lg font-bold font-mono ${
                timeLeft < 300 ? 'text-red-500' : 'text-gray-800'
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
          <button
            onClick={() => {
              setIsExamMode(!isExamMode)
              setTimeLeft(!isExamMode ? EXAM_TIME_SECONDS : SHORT_TIME_SECONDS)
            }}
            className={`text-xs px-3 py-1.5 rounded-full font-bold transition-colors ${
              isExamMode
                ? 'bg-red-100 text-red-600'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            {isExamMode ? 'ЕГЭ режим' : 'Практика'}
          </button>
        </motion.div>
      )}

      {/* Hints & Key Points */}
      {status === 'writing' && (
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setShowHints(!showHints)}
            className="flex items-center gap-2 text-sm text-duo-blue font-medium hover:underline"
          >
            <Lightbulb size={16} />
            <span>Подсказки для рассуждения</span>
            {showHints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <AnimatePresence>
            {showHints && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="card bg-yellow-50 border-yellow-200 space-y-2">
                  {topic.hints.map((hint, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-yellow-500 font-bold text-sm">{i + 1}.</span>
                      <p className="text-sm text-gray-700">{hint}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setShowKeyPoints(!showKeyPoints)}
            className="flex items-center gap-2 text-sm text-duo-green font-medium hover:underline"
          >
            <Target size={16} />
            <span>Ключевые тезисы</span>
            {showKeyPoints ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          <AnimatePresence>
            {showKeyPoints && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="card bg-green-50 border-green-200 space-y-2">
                  {topic.keyPoints.map((kp, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-green-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-gray-700">{kp}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Writing Area */}
      {status === 'writing' && (
        <motion.div
          className="flex flex-col gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
              <PenTool size={16} className="text-duo-blue" />
              Ваше сочинение
            </span>
            <span className="text-xs text-gray-400">{wordCount} слов</span>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Начните писать сочинение здесь..."
            className="w-full h-64 p-4 rounded-xl border-2 border-gray-200 focus:border-duo-blue focus:outline-none resize-none text-sm leading-relaxed text-gray-700 bg-white"
            spellCheck={false}
          />
          <div className="flex items-center gap-3">
            <button
              onClick={saveDraft}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-bold text-gray-700"
            >
              <Save size={16} />
              Сохранить черновик
            </button>
            {savedMessage && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-duo-green font-bold"
              >
                {savedMessage}
              </motion.span>
            )}
            <button
              onClick={handleFinish}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-duo-green text-white hover:bg-green-600 transition-colors text-sm font-bold"
            >
              <Send size={16} />
              Завершить
            </button>
          </div>
        </motion.div>
      )}

      {/* Self-Check */}
      {(status === 'reviewing' || status === 'done') && (
        <motion.div
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="card bg-gradient-to-br from-duo-yellow/10 to-yellow-50 border-duo-yellow/20">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={18} className="text-duo-yellow" />
              <h2 className="font-bold text-gray-800">Самопроверка</h2>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Оцените своё сочинение по критериям ЕГЭ. Максимум: {maxScore} баллов.
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-duo-yellow h-2 rounded-full transition-all"
                style={{ width: `${maxScore > 0 ? (totalScore / maxScore) * 100 : 0}%` }}
              />
            </div>
            <p className="text-center text-sm font-bold text-gray-700 mt-1">
              {totalScore} / {maxScore} баллов
            </p>
          </div>

          {/* Criteria */}
          <div className="flex flex-col gap-3">
            {essayCriteria.map((criterion) => {
              const currentScore = selfScores[criterion.id] || 0
              return (
                <div
                  key={criterion.id}
                  className="card border-l-4"
                  style={{ borderLeftColor: '#ce82ff' }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-sm text-gray-800">
                      {criterion.name}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[...Array(criterion.maxScore)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelfScore(criterion.id, i + 1)}
                          className="p-1 transition-transform hover:scale-110"
                          disabled={status === 'done'}
                        >
                          <Star
                            size={18}
                            className={
                              i < currentScore
                                ? 'text-duo-yellow fill-duo-yellow'
                                : 'text-gray-300'
                            }
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-2">{criterion.description}</p>
                  <div className="space-y-1">
                    {criterion.checklist.map((item, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle size={12} className="text-gray-400 mt-0.5 shrink-0" />
                        <p className="text-xs text-gray-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {status === 'reviewing' && (
              <button
                onClick={handleDone}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-duo-green text-white hover:bg-green-600 transition-colors font-bold"
              >
                <CheckCircle size={18} />
                Сохранить оценку
              </button>
            )}
            {status === 'done' && (
              <div className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-100 text-green-700 font-bold">
                <CheckCircle size={18} />
                Оценка сохранена
              </div>
            )}
            <button
              onClick={() => {
                setStatus('writing')
                setTimeLeft(isExamMode ? EXAM_TIME_SECONDS : SHORT_TIME_SECONDS)
              }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-bold text-gray-700"
            >
              <RotateCcw size={16} />
              Продолжить писать
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
