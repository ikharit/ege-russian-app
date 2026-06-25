import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Lightbulb, ArrowRight, RotateCcw, Zap, TrendingDown } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useAdaptiveEngine } from '../hooks/useAdaptiveEngine'
import { course } from '../data/courseData'
import { playCorrectSound, playWrongSound } from '../lib/sounds'

function getDailyQuestionSeed(): string {
  const today = new Date().toISOString().split('T')[0]
  return `daily-${today}`
}

function seededRandom(seed: string): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  const x = Math.sin(hash) * 10000
  return x - Math.floor(x)
}

export function DailyQuestionCard() {
  const addXP = useProgressStore((s) => s.addXP)
  const updateStreak = useProgressStore((s) => s.updateStreak)
  const recordWrongAnswer = useProgressStore((s) => s.recordWrongAnswer)
  const updateTaskStats = useProgressStore((s) => s.updateTaskStats)
  const getProblematicQuestions = useProgressStore((s) => s.getProblematicQuestions)

  const seed = getDailyQuestionSeed()

  const question = useMemo(() => {
    // 1. Try problematic questions first (most wrong answers across all users)
    const problematic = getProblematicQuestions(50)
    const allQuestions = course.sections.flatMap(s => s.lessons.flatMap(l => l.questions))

    if (problematic.length > 0) {
      // Pick from top problematic using seeded random
      const idx = Math.floor(seededRandom(seed) * Math.min(problematic.length, 10))
      const problematicQ = problematic[idx]
      // Find full question object from course
      const fullQuestion = allQuestions.find(q => q.id === problematicQ.questionId)
      if (fullQuestion) {
        return {
          ...fullQuestion,
          options: fullQuestion.options ? [...fullQuestion.options].sort(() => seededRandom(seed + fullQuestion.id) - 0.5) : undefined,
          _isProblematic: true,
          _wrongCount: problematicQ.wrongCount,
        }
      }
    }

    // 2. Fallback: random question from course
    if (allQuestions.length === 0) return null
    const idx = Math.floor(seededRandom(seed) * allQuestions.length)
    const q = allQuestions[idx]
    return q ? { ...q, options: q.options ? [...q.options].sort(() => seededRandom(seed + q.id) - 0.5) : undefined, _isProblematic: false } : null
  }, [seed, getProblematicQuestions])

  // Load saved state from localStorage for today
  const [savedState, setSavedState] = useState<{ answered: boolean; correct: boolean } | null>(() => {
    try {
      const raw = localStorage.getItem(`daily-question-${seed}`)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  const [selected, setSelected] = useState<string[]>([])
  const [textAnswer, setTextAnswer] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [xpAwarded, setXpAwarded] = useState(false)

  // If already answered today, restore state
  useEffect(() => {
    if (savedState?.answered) {
      setIsChecked(true)
      setIsCorrect(savedState.correct)
    }
  }, [savedState])

  if (!question) return null

  const taskNumber = question.atoms?.find((a: string) => a.startsWith('task'))?.replace('task', '') || '1'
  const isProblematic = (question as any)._isProblematic
  const wrongCount = (question as any)._wrongCount
  const hasOptions = question.options && question.options.length > 0

  // Adaptive engine for daily question (invisible to user)
  const { observeAnswer } = useAdaptiveEngine(
    [{ id: question.id, atoms: question.atoms }],
    taskNumber
  )

  const handleSelect = (option: string) => {
    if (isChecked || savedState?.answered) return
    if (question.type === 'single') {
      setSelected([option])
    } else {
      setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
    }
  }

  const handleCheck = () => {
    if (isChecked) return
    let correct = false
    if (hasOptions) {
      if (selected.length === 0) return
      correct = question.type === 'single'
        ? selected[0] === question.correctAnswer[0]
        : selected.length === question.correctAnswer.length && selected.every(s => question.correctAnswer.includes(s))
    } else {
      if (!textAnswer.trim()) return
      const normalized = textAnswer.trim().toLowerCase()
      correct = question.correctAnswer.some((a: string) => a.toLowerCase() === normalized)
    }
    setIsCorrect(correct)
    setIsChecked(true)

    // Adaptive: IRT + BKT (invisible engine)
    observeAnswer(question.id, correct, question.atoms)

    // Save state
    localStorage.setItem(`daily-question-${seed}`, JSON.stringify({ answered: true, correct }))

    if (correct) {
      playCorrectSound()
      addXP(15)
      updateStreak()
      setXpAwarded(true)
      updateTaskStats(taskNumber, true)
    } else {
      playWrongSound()
      updateTaskStats(taskNumber, false)
      recordWrongAnswer({
        id: question.id,
        text: question.text,
        options: question.options,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        atoms: question.atoms,
      }, hasOptions ? selected : [textAnswer.trim()])
    }
  }

  const handleReset = () => {
    localStorage.removeItem(`daily-question-${seed}`)
    setSavedState(null)
    setSelected([])
    setTextAnswer('')
    setIsChecked(false)
    setIsCorrect(false)
    setShowHint(false)
    setXpAwarded(false)
  }

  const isAnswered = isChecked || savedState?.answered

  return (
    <motion.div
      className="card bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-duo-yellow" fill="currentColor" />
          <h3 className="font-bold text-sm text-gray-700">
            {isProblematic ? '🔥 Сложное слово дня' : 'Вопрос дня'}
          </h3>
          {isProblematic && wrongCount && (
            <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
              <TrendingDown size={10} />
              {wrongCount} ошибок
            </span>
          )}
        </div>
        {isAnswered && (
          <button onClick={handleReset} className="text-gray-400 hover:text-gray-600">
            <RotateCcw size={16} />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-800 mb-4 font-medium">{question.text}</p>

      {hasOptions ? (
        <div className="flex flex-col gap-2 mb-4">
          {question.options.map((option: string) => {
            const isSelected = selected.includes(option)
            const isCorrectOption = question.correctAnswer.includes(option)
            let optionClass = 'bg-white border-gray-200 hover:border-duo-green'
            if (isAnswered) {
              if (isCorrectOption) optionClass = 'bg-duo-green border-duo-green text-white'
              else if (isSelected) optionClass = 'bg-red-100 border-red-300 text-red-700'
              else optionClass = 'bg-white border-gray-200 opacity-60'
            } else if (isSelected) {
              optionClass = 'bg-duo-blue/10 border-duo-blue'
            }
            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                disabled={isAnswered}
                className={`p-3 rounded-xl border-2 text-left text-sm font-medium transition-all ${optionClass}`}
              >
                {option}
              </button>
            )
          })}
        </div>
      ) : (
        <div className="mb-4">
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => {
              if (!isAnswered) setTextAnswer(e.target.value)
            }}
            disabled={isAnswered}
            maxLength={10}
            className={`w-full p-3 rounded-xl border-2 text-center text-lg font-bold tracking-widest transition-all ${
              isAnswered
                ? isCorrect
                  ? 'bg-duo-green/10 border-duo-green text-duo-green-dark'
                  : 'bg-red-50 border-red-300 text-red-700'
                : 'bg-white border-gray-200 focus:border-duo-green focus:outline-none'
            }`}
            placeholder="Введите ответ"
            autoFocus
          />
        </div>
      )}

      {isAnswered && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mb-3"
          >
            <div className={`p-3 rounded-xl text-sm ${isCorrect ? 'bg-duo-green/10 text-duo-green-dark' : 'bg-red-50 text-red-700'}`}>
              <div className="flex items-center gap-2 mb-1">
                {isCorrect ? <Check size={16} /> : <X size={16} />}
                <span className="font-bold">{isCorrect ? 'Правильно! +15 XP' : 'Неправильно'}</span>
              </div>
              {!isCorrect && question.correctAnswer && (
                <p className="text-xs mt-1">
                  Правильный ответ: <strong className="text-green-700">{question.correctAnswer.join(', ')}</strong>
                </p>
              )}
              {question.explanation && (
                <p className="mt-1 text-xs opacity-80">{question.explanation}</p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      )}

      {!isAnswered && (
        <button
          onClick={handleCheck}
          disabled={hasOptions ? selected.length === 0 : !textAnswer.trim()}
          className="btn-primary w-full disabled:opacity-50"
        >
          Проверить
        </button>
      )}

      {isAnswered && !isCorrect && question.explanation && (
        <button
          onClick={() => setShowHint(!showHint)}
          className="mt-2 text-xs text-duo-blue flex items-center gap-1 mx-auto"
        >
          <Lightbulb size={14} />
          {showHint ? 'Скрыть подсказку' : 'Показать подсказку'}
        </button>
      )}

      {showHint && question.explanation && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-2 p-3 bg-blue-50 rounded-xl text-xs text-gray-700"
        >
          {question.explanation}
        </motion.div>
      )}
    </motion.div>
  )
}
