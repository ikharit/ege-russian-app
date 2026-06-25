import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import { ArrowLeft, X, Check, Volume2 } from 'lucide-react'
import { speak, isTTSAvailable } from '../lib/tts'
import { useAdaptiveStore } from '../stores/adaptiveStore'
import { useProgressStore } from '../stores/progressStore'

export interface SwipeQuestion {
  id: string
  text: string
  question: string
  options: string[]
  correctAnswer: string[]
  explanation: string
  atoms?: string[]
}

interface SwipeTrainerPageProps {
  title: string
  taskNumber: string
  questions: SwipeQuestion[]
  mode?: 'binary' | 'multi'
  getAtoms?: (q: SwipeQuestion) => string[]
}

export function SwipeTrainerPage({ title, taskNumber, questions, mode = 'multi', getAtoms }: SwipeTrainerPageProps) {
  const navigate = useNavigate()

  // Adaptive (IRT + BKT) — invisible engine
  const observeIRT = useAdaptiveStore((s) => s.observeIRT)
  const observeBKT = useAdaptiveStore((s) => s.observeBKT)
  const selectNextQuestion = useAdaptiveStore((s) => s.selectNextQuestion)

  const addXP = useProgressStore((s) => s.addXP)
  const updateTaskStats = useProgressStore((s) => s.updateTaskStats)
  const recordWrongAnswer = useProgressStore((s) => s.recordWrongAnswer)
  const updateStreak = useProgressStore((s) => s.updateStreak)
  const recordQuestionAnswered = useProgressStore((s) => s.recordQuestionAnswered)

  const [questionOrder] = useState(() => {
    const pool = new Set(questions.map((q) => q.id))
    const ordered: string[] = []
    while (pool.size > 0) {
      const next = selectNextQuestion(Array.from(pool), 0.7)
      if (!next) break
      ordered.push(next)
      pool.delete(next)
    }
    return ordered
  })

  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState<'left' | 'right' | null>(null)
  const [flash, setFlash] = useState<'green' | 'red' | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [stats, setStats] = useState({ correct: 0, wrong: 0 })
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  const currentQuestion = questions.find(q => q.id === questionOrder[currentIndex]) ?? questions[0]

  // Register all questions with adaptive store
  useEffect(() => {
    for (const q of questions) {
      useAdaptiveStore.getState().calibrateItem(q.id, 0.5)
    }
  }, [questions])

  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 200], [-15, 15])
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0])

  const handleAnswer = useCallback((dir: 'left' | 'right' | string) => {
    if (!currentQuestion) return

    let isCorrect = false
    if (mode === 'binary') {
      // For binary mode: right = first option, left = second option
      isCorrect = dir === 'right' && currentQuestion.correctAnswer.includes(currentQuestion.options[0])
    } else {
      // For multi mode: dir is the selected option
      isCorrect = currentQuestion.correctAnswer.includes(dir)
    }

    // Adaptive: IRT + BKT
    observeIRT(currentQuestion.id, isCorrect)
    const atoms = getAtoms?.(currentQuestion) || currentQuestion.atoms || [`task${taskNumber}`]
    for (const atom of atoms) {
      observeBKT(atom, isCorrect)
    }

    // Progress tracking
    addXP(isCorrect ? 5 : 0)
    updateTaskStats(taskNumber, isCorrect)
    recordQuestionAnswered(taskNumber, isCorrect)
    if (isCorrect) {
      updateStreak()
    } else {
      recordWrongAnswer(
        {
          id: currentQuestion.id,
          text: currentQuestion.text,
          options: currentQuestion.options,
          correctAnswer: currentQuestion.correctAnswer,
          explanation: currentQuestion.explanation,
          atoms,
        },
        typeof dir === 'string' ? dir : ''
      )
    }

    setDirection(dir as 'left' | 'right')
    setFlash(isCorrect ? 'green' : 'red')
    setShowExplanation(true)
    setStats((s) => ({
      correct: s.correct + (isCorrect ? 1 : 0),
      wrong: s.wrong + (isCorrect ? 0 : 1),
    }))

    // Haptic feedback
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(isCorrect ? 50 : [30, 30, 30])
    }

    // Next question after delay
    setTimeout(() => {
      setFlash(null)
      setShowExplanation(false)
      setSelectedOption(null)
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((i) => i + 1)
      } else {
        // Finished - could navigate to results
      }
    }, 2000)
  }, [currentQuestion, mode, taskNumber, observeIRT, observeBKT, addXP, updateTaskStats, recordQuestionAnswered, updateStreak, recordWrongAnswer, getAtoms, currentIndex, questions.length])

  const handleDragEnd = useCallback(
    (_event: any, info: { offset: { x: number }; velocity: { x: number } }) => {
      if (mode !== 'binary') return
      const threshold = 80
      const velocity = info.velocity.x
      const offset = info.offset.x

      if (offset > threshold || velocity > 500) {
        handleAnswer('right')
      } else if (offset < -threshold || velocity < -500) {
        handleAnswer('left')
      }
    },
    [currentQuestion, mode, handleAnswer]
  )

  const handleOptionTap = (option: string) => {
    if (showExplanation) return
    setSelectedOption(option)
    handleAnswer(option)
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Тренировка завершена!</h2>
          <p className="text-gray-500 mb-4">
            Правильно: {stats.correct} / {questions.length}
          </p>
          <button onClick={() => navigate('/')} className="btn-primary">
            На главную
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative overflow-hidden">
      {/* Flash overlay */}
      <AnimatePresence>
        {flash && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 z-50 ${flash === 'green' ? 'bg-green-400' : 'bg-red-400'}`}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between z-10">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="text-center">
          <h1 className="text-sm font-bold text-gray-800">{title}</h1>
          <p className="text-xs text-gray-500">
            {currentIndex + 1} / {questions.length}
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 h-1">
        <div
          className="bg-duo-green h-1 transition-all"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-4 py-2 text-xs z-10">
        <span className="text-green-600 font-bold">✓ {stats.correct}</span>
        <span className="text-red-500 font-bold">✗ {stats.wrong}</span>
      </div>

      {/* Card area */}
      <div className="flex-1 flex items-center justify-center p-4 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            style={{ x, rotate, opacity }}
            drag={mode === 'binary' ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md bg-white rounded-3xl shadow-xl p-6 space-y-4 relative"
          >
            {/* Swipe indicators */}
            {mode === 'binary' && (
              <>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-100 rounded-full p-2 opacity-50">
                  <X size={24} className="text-red-500" />
                </div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-green-100 rounded-full p-2 opacity-50">
                  <Check size={24} className="text-green-500" />
                </div>
              </>
            )}

            {/* TTS button */}
            {isTTSAvailable() && (
              <button
                onClick={() => speak(currentQuestion.text)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full"
                aria-label="Озвучить"
              >
                <Volume2 size={18} className="text-gray-400" />
              </button>
            )}

            {/* Question text */}
            <div className="text-sm text-gray-600 leading-relaxed max-h-32 overflow-y-auto">
              {currentQuestion.text}
            </div>

            {/* Question */}
            <p className="text-base font-bold text-gray-800">{currentQuestion.question}</p>

            {/* Options */}
            <div className="space-y-2">
              {currentQuestion.options.map((option) => {
                const isSelected = selectedOption === option
                const isCorrect = currentQuestion.correctAnswer.includes(option)
                const showCorrect = showExplanation && isCorrect
                const showWrong = showExplanation && isSelected && !isCorrect

                return (
                  <button
                    key={option}
                    onClick={() => handleOptionTap(option)}
                    disabled={showExplanation}
                    className={`w-full p-4 rounded-xl text-sm font-medium transition-all border-2 text-left ${
                      showCorrect
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : showWrong
                        ? 'bg-red-100 border-red-400 text-red-700'
                        : isSelected
                        ? 'bg-duo-blue/10 border-duo-blue text-duo-blue'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:border-duo-blue/50'
                    }`}
                  >
                    {option}
                  </button>
                )
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-blue-50 rounded-xl p-3 border border-blue-100"
                >
                  <p className="text-xs text-blue-700">{currentQuestion.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Swipe hint */}
            {mode === 'binary' && !showExplanation && (
              <div className="flex justify-between text-xs text-gray-400 mt-4">
                <span>← {currentQuestion.options[1] || 'Нет'}</span>
                <span>{currentQuestion.options[0] || 'Да'} →</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom actions for binary mode */}
      {mode === 'binary' && !showExplanation && (
        <div className="p-4 flex justify-center gap-6 z-10">
          <button
            onClick={() => handleAnswer('left')}
            className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center shadow-lg hover:bg-red-200 transition-colors"
          >
            <X size={28} className="text-red-500" />
          </button>
          <button
            onClick={() => handleAnswer('right')}
            className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center shadow-lg hover:bg-green-200 transition-colors"
          >
            <Check size={28} className="text-green-500" />
          </button>
        </div>
      )}
    </div>
  )
}
