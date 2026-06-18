import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X, RotateCcw } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import type { WrongAnswer } from '../types'

interface Props {
  questions: WrongAnswer[]
  onClose: () => void
}

export function MistakesPractice({ questions, onClose }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)

  const removeWrongAnswer = useProgressStore((s) => s.removeWrongAnswer)
  const incrementWrongAnswerAttempt = useProgressStore((s) => s.incrementWrongAnswerAttempt)
  const addXP = useProgressStore((s) => s.addXP)

  const current = questions[currentIdx]

  const handleSelect = (option: string) => {
    if (isChecked) return
    setSelected([option])
  }

  const handleCheck = useCallback(() => {
    if (!current || selected.length === 0) return
    const correct = current.correctAnswer.length === selected.length &&
      selected.every(s => current.correctAnswer.includes(s))
    setIsCorrect(correct)
    setIsChecked(true)
    if (correct) {
      setCorrectCount(c => c + 1)
      removeWrongAnswer(current.questionId)
    } else {
      incrementWrongAnswerAttempt(current.questionId, selected)
    }
  }, [selected, current, removeWrongAnswer, incrementWrongAnswerAttempt])

  const handleNext = useCallback(() => {
    setSelected([])
    setIsChecked(false)
    setIsCorrect(false)
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1)
    } else {
      setIsFinished(true)
      addXP(Math.round((correctCount / questions.length) * 50))
    }
  }, [currentIdx, questions.length, correctCount, addXP])

  const handleRetry = () => {
    setCurrentIdx(0)
    setCorrectCount(0)
    setIsFinished(false)
    setSelected([])
    setIsChecked(false)
  }

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
          className="text-center"
        >
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {correctCount === questions.length ? 'Идеально!' : 'Готово!'}
          </h2>
          <p className="text-gray-500 mb-6">
            {correctCount} из {questions.length} правильно
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleRetry} className="btn-secondary flex items-center gap-2">
              <RotateCcw size={18} /> Ещё раз
            </button>
            <button onClick={onClose} className="btn-primary">Назад к списку</button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-duo-green h-2 rounded-full transition-all"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>
        <span className="text-sm text-gray-500">
          {currentIdx + 1}/{questions.length}
        </span>
      </div>

      {/* Question */}
      <div className="flex-1 px-4 py-6 max-w-md mx-auto w-full">
        <p className="text-lg font-medium text-gray-800 mb-6">{current.text}</p>

        {current.options && (
          <div className="flex flex-col gap-3">
            {current.options.map((option) => {
              const isSelected = selected.includes(option)
              let btnClass = 'w-full p-4 rounded-xl border-2 text-left font-medium transition-all '
              if (isChecked) {
                if (current.correctAnswer.includes(option)) {
                  btnClass += 'border-duo-green bg-duo-green/10 text-duo-green'
                } else if (isSelected) {
                  btnClass += 'border-duo-red bg-duo-red/10 text-duo-red'
                } else {
                  btnClass += 'border-gray-200 text-gray-400'
                }
              } else {
                btnClass += isSelected
                  ? 'border-duo-blue bg-duo-blue/10 text-duo-blue'
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  className={btnClass}
                  disabled={isChecked}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {isChecked && current.correctAnswer.includes(option) && (
                      <Check size={20} className="text-duo-green" />
                    )}
                    {isChecked && isSelected && !current.correctAnswer.includes(option) && (
                      <X size={20} className="text-duo-red" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {!current.options && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-gray-500 mb-2">Введите правильный ответ:</p>
            <input
              type="text"
              className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-duo-blue focus:outline-none"
              placeholder="Ваш ответ..."
              value={selected[0] || ''}
              onChange={(e) => setSelected([e.target.value])}
              disabled={isChecked}
            />
          </div>
        )}

        {/* Check / Next button */}
        <AnimatePresence mode="wait">
          {!isChecked ? (
            <motion.button
              key="check"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={handleCheck}
              disabled={selected.length === 0}
              className="btn-primary w-full mt-6 disabled:opacity-50"
            >
              Проверить
            </motion.button>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <div className={`p-4 rounded-xl mb-4 ${isCorrect ? 'bg-duo-green/10 border border-duo-green/20' : 'bg-duo-red/10 border border-duo-red/20'}`}>
                <p className={`font-bold ${isCorrect ? 'text-duo-green' : 'text-duo-red'}`}>
                  {isCorrect ? '✅ Правильно!' : '❌ Неправильно'}
                </p>
                {!isCorrect && (
                  <p className="text-sm text-gray-600 mt-1">
                    Правильно: {current.correctAnswer.join(', ')}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">{current.explanation}</p>
              </div>
              <button onClick={handleNext} className="btn-primary w-full">
                {currentIdx < questions.length - 1 ? 'Дальше' : 'Завершить'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
