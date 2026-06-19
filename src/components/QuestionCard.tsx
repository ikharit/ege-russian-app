import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight, BookOpen, Lightbulb } from 'lucide-react'
import { Question } from '../types'
import { getRelevantRules } from '../data/theory'
import { ragRetriever, generateExplanation } from '../lib/rag'
import { TheoryQuickReference } from './TheoryQuickReference'

function getTaskNumberFromAtoms(atoms: string[] | undefined): string | null {
  if (!atoms) return null
  const taskAtom = atoms.find(a => a.startsWith('task'))
  return taskAtom ? taskAtom.replace('task', '') : null
}

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onAnswer: (isCorrect: boolean, userAnswer?: string[]) => void
  onNext: () => void
  heartsLeft: number
}

export function QuestionCard({ question, questionNumber, totalQuestions, onAnswer, onNext, heartsLeft }: QuestionCardProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [textInput, setTextInput] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const isTextType = question.type === 'text'

  const handleOptionClick = (option: string) => {
    if (isChecked) return
    if (question.type === 'single') {
      setSelected([option])
    } else if (question.type === 'multiple' || question.type === 'ege-multiple') {
      setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
    }
  }

  const handleCheck = () => {
    if (isTextType) {
      if (textInput.trim() === '') return
      const userAnswer = textInput.trim()
      const correct = question.correctAnswer.some(
        ans => ans.toLowerCase() === userAnswer.toLowerCase()
      )
      setIsCorrect(correct)
      setIsChecked(true)
      onAnswer(correct, [userAnswer])
    } else {
      if (selected.length === 0) return
      const correct = question.type === 'single'
        ? selected[0] === question.correctAnswer[0]
        : selected.length === question.correctAnswer.length && selected.every(s => question.correctAnswer.includes(s))
      setIsCorrect(correct)
      setIsChecked(true)
      onAnswer(correct, selected)
    }
  }

  const handleNext = () => {
    setSelected([])
    setTextInput('')
    setIsChecked(false)
    setIsCorrect(false)
    onNext()
  }

  const canCheck = isTextType
    ? textInput.trim().length > 0
    : selected.length > 0

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

      {/* Text input for type === 'text' */}
      {isTextType && (
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isChecked}
            placeholder="Впишите ответ..."
            className={`w-full border-2 rounded-xl p-4 text-lg font-medium text-center uppercase transition-all focus:outline-none focus:ring-2 focus:ring-duo-blue/20 ${
              isChecked
                ? isCorrect
                  ? 'border-duo-green bg-green-50 text-duo-green'
                  : 'border-duo-red bg-red-50 text-duo-red'
                : 'border-gray-200 bg-white focus:border-duo-blue'
            }`}
            maxLength={5}
          />
          {isChecked && (
            <p className="text-sm text-gray-500 text-center">
              Ваш ответ: <span className={isCorrect ? 'text-duo-green font-bold' : 'text-duo-red font-bold'}>{textInput}</span>
            </p>
          )}
        </div>
      )}

      {/* Options for single/multiple/ege-multiple */}
      {!isTextType && (
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
      )}

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

          {/* Show RAG-powered theory explanation on wrong answer */}
          {!isCorrect && (() => {
            const taskNum = getTaskNumberFromAtoms(question.atoms)
            if (!taskNum) return null
            
            // Try RAG first, fallback to theory rules
            const ragResults = ragRetriever.retrieve(question.text, taskNum, 3)
            const ragExplanation = ragResults.length > 0 
              ? generateExplanation(question.text, question.correctAnswer, ragResults)
              : null
            
            const rules = getRelevantRules(taskNum, question.atoms)
            
            return (
              <div className="mt-3 pt-3 border-t border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={16} className="text-duo-blue" />
                  <span className="text-sm font-bold text-gray-700">Правило по заданию {taskNum}:</span>
                </div>
                
                {ragExplanation && (
                  <p className="text-sm text-gray-700 mb-2 bg-blue-50 p-2 rounded-lg">
                    {ragExplanation}
                  </p>
                )}
                
                {rules.length > 0 && (
                  <TheoryQuickReference rules={rules.slice(0, 2)} showExamples={false} />
                )}
                
                <p className="text-xs text-gray-400 mt-1 italic">
                  Полная теория в разделе «Учиться» → Задание {taskNum}
                </p>
              </div>
            )
          })()}
        </motion.div>
      )}

      <button
        onClick={isChecked ? handleNext : handleCheck}
        disabled={!canCheck}
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
