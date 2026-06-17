import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight } from 'lucide-react'
import { Question } from '../types'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onAnswer: (isCorrect: boolean) => void
  onNext: () => void
  heartsLeft: number
}

export function QuestionCard({ question, questionNumber, totalQuestions, onAnswer, onNext, heartsLeft }: QuestionCardProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleOptionClick = (option: string) => {
    if (isChecked) return
    if (question.type === 'single') {
      setSelected([option])
    } else if (question.type === 'multiple' || question.type === 'ege-multiple') {
      setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
    }
  }

  const handleCheck = () => {
    if (selected.length === 0) return
    const correct = question.type === 'single'
      ? selected[0] === question.correctAnswer[0]
      : selected.length === question.correctAnswer.length && selected.every(s => question.correctAnswer.includes(s))
    setIsCorrect(correct)
    setIsChecked(true)
    onAnswer(correct)
  }

  const handleNext = () => {
    setSelected([])
    setIsChecked(false)
    setIsCorrect(false)
    onNext()
  }

  return (
    <div className="flex flex-col gap-4 max-w-md mx-auto">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-duo-green h-2 rounded-full transition-all"
          style={{ width: `${((questionNumber) / totalQuestions) * 100}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-sm text-gray-500">
        <span>Вопрос {questionNumber} из {totalQuestions}</span>
        <span>❤️ {heartsLeft}</span>
      </div>

      <h2 className="text-xl font-bold text-gray-800">{question.text}</h2>

      {question.theory && (
        <div className="bg-duo-snow p-3 rounded-xl text-sm text-gray-600">
          {question.theory}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <AnimatePresence>
          {question.options?.map((option, idx) => {
            const isSelected = selected.includes(option)
            const isCorrectOption = question.correctAnswer.includes(option)
            let buttonClass = 'border-2 rounded-xl p-4 text-left font-medium transition-all '

            if (!isChecked) {
              buttonClass += isSelected
                ? 'border-duo-blue bg-blue-50 text-duo-blue'
                : 'border-gray-200 bg-white hover:bg-gray-50'
            } else {
              if (isCorrectOption) {
                buttonClass += 'border-duo-green bg-green-50 text-duo-green'
              } else if (isSelected && !isCorrectOption) {
                buttonClass += 'border-duo-red bg-red-50 text-duo-red'
              } else {
                buttonClass += 'border-gray-200 bg-white opacity-60'
              }
            }

            return (
              <motion.button
                key={option}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => handleOptionClick(option)}
                className={buttonClass}
                disabled={isChecked}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {isChecked && isCorrectOption && <Check size={20} className="text-duo-green" />}
                  {isChecked && isSelected && !isCorrectOption && <X size={20} className="text-duo-red" />}
                </div>
              </motion.button>
            )
          })}
        </AnimatePresence>
      </div>

      {isChecked && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-duo-green' : 'bg-red-50 border border-duo-red'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            {isCorrect ? (
              <>
                <Check size={20} className="text-duo-green" />
                <span className="font-bold text-duo-green">Правильно!</span>
              </>
            ) : (
              <>
                <X size={20} className="text-duo-red" />
                <span className="font-bold text-duo-red">Неправильно</span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-700">{question.explanation}</p>
          <p className="text-sm text-gray-500 mt-1">
            Правильный ответ: {question.correctAnswer.join(', ')}
          </p>
        </motion.div>
      )}

      <button
        onClick={isChecked ? handleNext : handleCheck}
        disabled={selected.length === 0}
        className={`btn-primary w-full ${isChecked ? (isCorrect ? '' : 'bg-duo-red shadow-[0_4px_0_#d32f2f]') : ''}`}
      >
        {isChecked ? (
          <span className="flex items-center justify-center gap-2">
            {questionNumber === totalQuestions ? 'Завершить' : 'Далее'}
            <ArrowRight size={18} />
          </span>
        ) : (
          'Проверить'
        )}
      </button>
    </div>
  )
}
