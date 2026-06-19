import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Lightbulb, ArrowRight, RotateCcw, Zap } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
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

  const seed = getDailyQuestionSeed()

  const question = useMemo(() => {
    const allQuestions = course.sections.flatMap(s => s.lessons.flatMap(l => l.questions))
    if (allQuestions.length === 0) return null
    const idx = Math.floor(seededRandom(seed) * allQuestions.length)
    const q = allQuestions[idx]
    return q ? { ...q, options: q.options ? [...q.options].sort(() => seededRandom(seed + q.id) - 0.5) : undefined } : null
  }, [seed])

  // Load saved state from localStorage for today
  const [savedState, setSavedState] = useState<{ answered: boolean; correct: boolean } | null>(() => {
    try {
      const raw = localStorage.getItem(`daily-question-${seed}`)
      return raw ? JSON.parse(raw) : null
    } catch { return null }
  })

  const [selected, setSelected] = useState<string[]>([])
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

  const taskNumber = question.atoms?.find(a => a.startsWith('task'))?.replace('task', '') || '1'

  const handleSelect = (option: string) => {
    if (isChecked || savedState?.answered) return
    if (question.type === 'single') {
      setSelected([option])
    } else {
      setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
    }
  }

  const handleCheck = () => {
    if (selected.length === 0 || isChecked) return
    const correct = question.type === 'single'
      ? selected[0] === question.correctAnswer[0]
      : selected.length === question.correctAnswer.length && selected.every(s => question.correctAnswer.includes(s))
    setIsCorrect(correct)
    setIsChecked(true)

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
      }, selected)
    }
  }

  const handleReset = () => {
    localStorage.removeItem(`daily-question-${seed}`)
    setSavedState(null)
    setSelected([])
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
          <Zap size={18} className="text-amber-500" />
          <h3 className="font-bold text-gray-800">Вопрос дня</h3>
          <span className="text-xs text-amber-600 font-bold bg-amber-100 px-2 py-0.5 rounded-full">+15 XP</span>
        </div>
        {isAnswered && (
          <button onClick={handleReset} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1">
            <RotateCcw size={12} /> Снова
          </button>
        )}
      </div>

      <p className="text-sm text-gray-700 mb-3">{question.text}</p>

      {question.options && (
        <div className="flex flex-col gap-2">
          {question.options.map((option) => {
            const isSelected = selected.includes(option)
            const isCorrectOption = question.correctAnswer.includes(option)
            let btnClass = 'border-2 rounded-xl p-3 text-left text-sm font-medium transition-all '

            if (!isAnswered) {
              btnClass += isSelected ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-gray-200 bg-white hover:bg-gray-50'
            } else {
              if (isCorrectOption) btnClass += 'border-green-400 bg-green-50 text-green-700'
              else if (isSelected && !isCorrectOption) btnClass += 'border-red-400 bg-red-50 text-red-700'
              else btnClass += 'border-gray-200 bg-white opacity-60'
            }

            return (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={btnClass}
                disabled={isAnswered}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isAnswered && isCorrectOption && <Check size={16} className="text-green-600" />}
                  {isAnswered && isSelected && !isCorrectOption && <X size={16} className="text-red-600" />}
                </div>
              </button>
            )
          })}
        </div>
      )}

      {question.type === 'text' && !question.options && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={selected[0] || ''}
            onChange={(e) => {
              if (!isAnswered) setSelected([e.target.value])
            }}
            placeholder="Введите ответ..."
            className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-medium focus:border-amber-400 focus:outline-none transition-colors"
            disabled={isAnswered}
          />
        </div>
      )}

      {!isAnswered && (
        <button
          onClick={handleCheck}
          disabled={selected.length === 0}
          className="btn-primary w-full mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Проверить
        </button>
      )}

      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className={`mt-3 p-3 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              {isCorrect ? (
                <><Check size={16} className="text-green-600" /><span className="font-bold text-green-700 text-sm">Правильно!</span></>
              ) : (
                <><X size={16} className="text-red-600" /><span className="font-bold text-red-700 text-sm">Неправильно</span></>
              )}
            </div>
            <p className="text-xs text-gray-600">{question.explanation}</p>
            <p className="text-xs text-gray-500 mt-1">Правильный ответ: {question.correctAnswer.join(', ')}</p>
            {xpAwarded && (
              <p className="text-xs text-amber-600 font-bold mt-1">+15 XP получено!</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
