import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Zap, ArrowLeft, RotateCcw, Settings,
  ChevronRight, Check, X, Volume2, VolumeX, BookOpen,
  ThumbsUp, ThumbsDown
} from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { ragRetriever, generateExplanation, recordFeedback } from '../lib/rag'
import { getGlobalIRT } from '../utils/irtEngine'
import { getGlobalBKT } from '../utils/bktEngine'
import { detectErrorType } from '../utils/errorPatternAnalyzer'

export type TrainerAnswerState = 'idle' | 'correct' | 'wrong'

export interface TrainerSettings {
  sound: boolean
  showExplanation: boolean
}

export interface TrainerStats {
  totalCorrect: number
  totalWrong: number
  streak: number
  bestStreak: number
}

export interface BaseTrainerProps<T> {
  title: string
  taskNumber: string
  questions: T[]
  getQuestionId: (q: T) => string
  getQuestionText: (q: T) => string
  getOptions: (q: T) => string[]
  getCorrectAnswer: (q: T) => string[]
  getExplanation: (q: T) => string
  getAtoms?: (q: T) => string[]
  xpPerCorrect?: number
  /** Render the question UI. Receives question, selected answers, state, and selection handler. */
  renderQuestion: (props: {
    question: T
    selectedAnswer: string[]
    answerState: TrainerAnswerState
    onSelect: (answer: string[]) => void
    disabled: boolean
  }) => React.ReactNode
  /** Optional prompt text above the question */
  renderPrompt?: (question: T) => React.ReactNode
  /** Custom settings panel content (in addition to sound + explanation toggles) */
  extraSettings?: React.ReactNode
}

export function BaseTrainer<T>({
  title,
  taskNumber,
  questions,
  getQuestionId,
  getQuestionText,
  getOptions,
  getCorrectAnswer,
  getExplanation,
  getAtoms,
  xpPerCorrect = 5,
  renderQuestion,
  renderPrompt,
  extraSettings,
}: BaseTrainerProps<T>) {
  const navigate = useNavigate()

  // Local state
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answerState, setAnswerState] = useState<TrainerAnswerState>('idle')
  const [selectedAnswer, setSelectedAnswer] = useState<string[]>([])
  const [isCorrect, setIsCorrect] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [settings, setSettings] = useState<TrainerSettings>({ sound: true, showExplanation: true })
  const [stats, setStats] = useState<TrainerStats>({ totalCorrect: 0, totalWrong: 0, streak: 0, bestStreak: 0 })

  const addXP = useProgressStore((s) => s.addXP)
  const updateStreak = useProgressStore((s) => s.updateStreak)
  const recordQuestionAnswered = useProgressStore((s) => s.recordQuestionAnswered)
  const recordWrongAnswer = useProgressStore((s) => s.recordWrongAnswer)
  const updateTaskStats = useProgressStore((s) => s.updateTaskStats)

  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'up' | 'down'>>({})
  const wrongAnswers = useProgressStore((s) => s.wrongAnswers)

  const currentQuestion = questions[currentIndex]
  const overall = {
    passed: Math.min(currentIndex, questions.length),
    total: questions.length,
  }
  const currentStage = Math.floor(currentIndex / 4) // 4 questions per stage

  // IRT-based adaptive question ordering
  const irt = useState(() => getGlobalIRT())[0]
  const bkt = useState(() => getGlobalBKT())[0]

  // Register all questions with IRT
  useEffect(() => {
    for (const q of questions) {
      const qid = getQuestionId(q)
      const diff = (q as any).irtDifficulty ?? 0 // default average difficulty
      if (!irt.items[qid]) {
        irt.calibrateDifficulty(qid, 0.5) // placeholder, will refine with data
      }
    }
  }, [questions, irt])

  // Adaptive question ordering via IRT
  const [questionOrder, setQuestionOrder] = useState<number[]>(() => {
    const ids = questions.map((_, i) => String(i))
    const ordered: number[] = []
    const pool = new Set(ids)
    while (pool.size > 0) {
      const next = irt.selectNextQuestion(Array.from(pool), 0.7)
      if (!next) break
      const idx = Number(next)
      ordered.push(idx)
      pool.delete(next)
    }
    return ordered.length > 0 ? ordered : questions.map((_, i) => i)
  })

  const effectiveQuestion = questions[questionOrder[currentIndex]] ?? currentQuestion

  const handleSelect = useCallback((answer: string[]) => {
    if (answerState !== 'idle') return
    setSelectedAnswer(answer)
  }, [answerState])

  const handleCheck = useCallback(() => {
    if (!effectiveQuestion || selectedAnswer.length === 0) return
    const correct = getCorrectAnswer(effectiveQuestion)
    const isRight =
      correct.length === selectedAnswer.length &&
      selectedAnswer.every((s) => correct.includes(s))
    setIsCorrect(isRight)
    setAnswerState(isRight ? 'correct' : 'wrong')
    recordQuestionAnswered()

    // Update IRT ability
    const qid = getQuestionId(effectiveQuestion)
    irt.updateAbility([{ questionId: qid, correct: isRight }])

    // Update BKT for each atom
    const atoms = getAtoms?.(effectiveQuestion) || []
    for (const atom of atoms) {
      bkt.observe(atom, isRight)
    }

    if (isRight) {
      addXP(xpPerCorrect)
      updateStreak()
      setStats((s) => ({
        ...s,
        totalCorrect: s.totalCorrect + 1,
        streak: s.streak + 1,
        bestStreak: Math.max(s.bestStreak, s.streak + 1),
      }))
      // Haptic feedback for correct answer (Android)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(50)
      }
    } else {
      recordWrongAnswer(
        {
          id: getQuestionId(effectiveQuestion),
          text: getQuestionText(effectiveQuestion),
          options: getOptions(effectiveQuestion),
          correctAnswer: correct,
          explanation: getExplanation(effectiveQuestion),
          atoms: getAtoms ? getAtoms(effectiveQuestion) : [`task${taskNumber}`],
        },
        selectedAnswer
      )
      updateTaskStats(taskNumber, false)
      setStats((s) => ({ ...s, totalWrong: s.totalWrong + 1, streak: 0 }))
      // Haptic feedback for wrong answer (stronger pattern)
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 30, 30])
      }
    }
  }, [effectiveQuestion, selectedAnswer, taskNumber, xpPerCorrect])

  const handleNext = useCallback(() => {
    if (currentIndex >= questions.length - 1) {
      setShowCompleted(true)
    } else {
      setCurrentIndex((i) => i + 1)
      setAnswerState('idle')
      setSelectedAnswer([])
      setIsCorrect(false)
    }
  }, [currentIndex, questions.length])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setAnswerState('idle')
    setSelectedAnswer([])
    setIsCorrect(false)
    setShowCompleted(false)
    setStats({ totalCorrect: 0, totalWrong: 0, streak: 0, bestStreak: 0 })
  }, [])

  const handleReset = useCallback(() => {
    if (confirm('Сбросить весь прогресс тренажёра?')) {
      handleRestart()
    }
  }, [handleRestart])

  const bgColor =
    answerState === 'correct'
      ? 'bg-green-50'
      : answerState === 'wrong'
      ? 'bg-red-50'
      : 'bg-duo-snow'

  // Completion screen
  if (showCompleted) {
    return (
      <div className="min-h-screen bg-duo-snow flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-duo-green rounded-full flex items-center justify-center mx-auto">
            <Trophy size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{title} — завершено!</h2>
            <p className="text-gray-500 mt-1">
              {stats.totalCorrect === questions.length
                ? 'Идеально! Все задания решены правильно.'
                : 'Отличная работа! Продолжай тренироваться.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <Zap size={20} className="text-duo-yellow mx-auto" />
              <p className="text-xl font-bold mt-1">{stats.totalCorrect}</p>
              <p className="text-xs text-gray-500">Правильно</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <X size={20} className="text-red-400 mx-auto" />
              <p className="text-xl font-bold mt-1">{stats.totalWrong}</p>
              <p className="text-xs text-gray-500">Ошибки</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <Zap size={20} className="text-duo-purple mx-auto" />
              <p className="text-xl font-bold mt-1">{stats.bestStreak}</p>
              <p className="text-xs text-gray-500">Рекорд серии</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-gray-700">Прогресс</span>
              <span className="text-duo-green font-bold">
                {stats.totalCorrect}/{questions.length}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-duo-green h-3 rounded-full transition-all"
                style={{
                  width: `${(stats.totalCorrect / questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRestart}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Начать заново
            </button>
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Вернуться на главную
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!effectiveQuestion) {
    return (
      <div className="min-h-screen bg-duo-snow flex flex-col items-center justify-center p-6">
        <div className="card max-w-md w-full text-center space-y-4">
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${bgColor} flex flex-col`}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Вернуться на главную"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>

          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-duo-purple">
              Ур. {currentStage + 1}
            </span>
            <span className="text-sm font-bold text-gray-700">
              {currentIndex + 1}/{questions.length}
            </span>
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-orange-500 fill-current" />
              <span className="text-sm font-bold text-orange-500">
                {stats.streak}
              </span>
            </div>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Открыть настройки"
            >
              <Settings size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Уровень {currentStage + 1}</span>
            <span>
              {currentIndex + 1}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-duo-green h-1.5 rounded-full transition-all"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border-b border-gray-100">
              <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
                <h3 className="font-bold text-gray-700 text-sm uppercase">
                  Настройки
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Звук</span>
                  <button
                    onClick={() =>
                      setSettings((s) => ({ ...s, sound: !s.sound }))
                    }
                    className="p-2 rounded-lg hover:bg-gray-100"
                  >
                    {settings.sound ? (
                      <Volume2 size={18} />
                    ) : (
                      <VolumeX size={18} />
                    )}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Показывать объяснение
                  </span>
                  <button
                    onClick={() =>
                      setSettings((s) => ({
                        ...s,
                        showExplanation: !s.showExplanation,
                      }))
                    }
                    className={`w-12 h-6 rounded-full transition-colors ${
                      settings.showExplanation ? 'bg-duo-green' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        settings.showExplanation
                          ? 'translate-x-6'
                          : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                {extraSettings}
                <button
                  onClick={handleReset}
                  className="text-red-400 text-sm hover:text-red-600 transition-colors"
                >
                  Сбросить прогресс
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full">
        {/* Prompt */}
        {renderPrompt && (
          <div className="bg-white rounded-2xl p-5 shadow-sm mb-4 w-full">
            {renderPrompt(effectiveQuestion)}
          </div>
        )}

        {/* Question */}
        <div className="w-full mb-4">
          {renderQuestion({
            question: effectiveQuestion,
            selectedAnswer,
            answerState,
            onSelect: handleSelect,
            disabled: answerState !== 'idle',
          })}
        </div>

        {/* Answer feedback */}
        {answerState !== 'idle' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full rounded-2xl p-4 mb-4 ${
              isCorrect ? 'bg-green-100' : 'bg-red-100'
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span className="font-bold text-green-700">Правильно!</span>
                </>
              ) : (
                <>
                  <X size={20} className="text-red-600" />
                  <span className="font-bold text-red-700">Неправильно</span>
                </>
              )}
            </div>
            {settings.showExplanation && (
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  {getExplanation(effectiveQuestion)}
                </p>
                {/* RAG-powered additional explanation for wrong answers */}
                {!isCorrect && (() => {
                  const atoms = getAtoms?.(effectiveQuestion) || []
                  const taskAtom = atoms.find((a: string) => a.startsWith('task'))
                  const taskNum = taskAtom ? taskAtom.replace('task', '') : taskNumber

                  if (!taskNum) return null

                  const ragResults = ragRetriever.retrieve(getQuestionText(effectiveQuestion), taskNum, 2)
                  if (ragResults.length === 0) return null

                  // Build user history for personalization (P4)
                  const userHistory = wrongAnswers
                    .filter(w => w.taskNumber === taskNum)
                    .reduce((acc, w) => {
                      const existing = acc.find(a => a.word === w.text)
                      if (existing) existing.wrongCount++
                      else acc.push({ word: w.text, wrongCount: 1 })
                      return acc
                    }, [] as { word: string; wrongCount: number }[])

                  const ragExp = generateExplanation(
                    getQuestionText(effectiveQuestion),
                    getCorrectAnswer(effectiveQuestion),
                    ragResults,
                    userHistory
                  )

                  const topEntry = ragResults[0].entry
                  const topEntryId = topEntry.id
                  const hasFeedback = feedbackGiven[topEntryId]
                  const lessonId = topEntry.lessonId

                  return (
                    <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center gap-2 mb-1">
                        <BookOpen size={14} className="text-duo-blue" />
                        <span className="text-xs font-bold text-duo-blue">Правило из теории:</span>
                      </div>
                      <p className="text-xs text-gray-700 mb-2">{ragExp}</p>
                      {/* Cross-link to lesson (P5) */}
                      {lessonId && (
                        <button
                          onClick={() => navigate(`/lesson/${lessonId}`)}
                          className="text-xs text-duo-blue underline hover:text-blue-700 mb-2 block"
                        >
                          Перейти к уроку →
                        </button>
                      )}
                      {/* Feedback buttons (P3) */}
                      <div className="flex items-center gap-2 pt-2 border-t border-blue-100">
                        <span className="text-xs text-gray-500">Было полезно?</span>
                        <button
                          onClick={() => {
                            if (hasFeedback) return
                            recordFeedback(topEntryId, true)
                            setFeedbackGiven(prev => ({ ...prev, [topEntryId]: 'up' }))
                          }}
                          disabled={!!hasFeedback}
                          className={`p-1 rounded hover:bg-blue-100 transition ${hasFeedback === 'up' ? 'text-green-600' : 'text-gray-400'} ${hasFeedback ? 'opacity-50 cursor-default' : ''}`}
                          aria-label="Полезно"
                        >
                          <ThumbsUp size={16} />
                        </button>
                        <button
                          onClick={() => {
                            if (hasFeedback) return
                            recordFeedback(topEntryId, false)
                            setFeedbackGiven(prev => ({ ...prev, [topEntryId]: 'down' }))
                          }}
                          disabled={!!hasFeedback}
                          className={`p-1 rounded hover:bg-blue-100 transition ${hasFeedback === 'down' ? 'text-red-600' : 'text-gray-400'} ${hasFeedback ? 'opacity-50 cursor-default' : ''}`}
                          aria-label="Не полезно"
                        >
                          <ThumbsDown size={16} />
                        </button>
                      </div>
                    </div>
                  )
                })()}
              </div>
            )}
          </motion.div>
        )}

        {/* Action button */}
        <div className="w-full max-w-md">
          {answerState === 'idle' ? (
            <button
              onClick={handleCheck}
              disabled={selectedAnswer.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Проверить ответ"
            >
              Проверить
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn-primary w-full flex items-center justify-center gap-2"
              aria-label="Следующий вопрос"
            >
              Дальше <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Footer stats */}
      <div className="bg-white border-t border-gray-100 py-3">
        <div className="max-w-2xl mx-auto px-4 flex justify-center gap-8 text-sm">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Правильно</p>
            <p className="font-bold text-green-500">{stats.totalCorrect}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Ошибки</p>
            <p className="font-bold text-red-400">{stats.totalWrong}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Серия</p>
            <p className="font-bold text-orange-500">{stats.streak}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
