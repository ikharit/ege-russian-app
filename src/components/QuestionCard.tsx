import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, ArrowRight, BookOpen, Bookmark, BookmarkCheck } from 'lucide-react'
import { Question, SavedExplanation } from '../types'
import { getRelevantRules } from '../data/theory'
import { ragRetriever, generateExplanation } from '../lib/rag'
import { TheoryQuickReference } from './TheoryQuickReference'
import { QuestionFeedback } from './QuestionFeedback'
import { questionTheoryMap } from '../data/questionTheoryMap'
import { useProgressStore } from '../stores/progressStore'

function getTaskNumberFromAtoms(atoms: string[] | undefined): string | null {
  if (!atoms) return null
  const taskAtom = atoms.find(a => a.startsWith('task'))
  return taskAtom ? taskAtom.replace('task', '') : null
}

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  onAnswer: (isCorrect: boolean, userAnswer?: string[], hintsUsed?: number) => void
  onNext: () => void
  heartsLeft: number
  onHintUsed?: (level: number, penalty: number) => void
}

export function QuestionCard({ question, questionNumber, totalQuestions, onAnswer, onNext, heartsLeft, onHintUsed }: QuestionCardProps) {
  const [selected, setSelected] = useState<string[]>([])
  const [textInput, setTextInput] = useState('')
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [focusedIdx, setFocusedIdx] = useState(0)
  const [hintsRevealed, setHintsRevealed] = useState(0)
  
  const savedExplanations = useProgressStore((s) => s.savedExplanations)
  const saveExplanation = useProgressStore((s) => s.saveExplanation)
  const isSaved = savedExplanations.some((e) => e.questionId === question.id)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const checkBtnRef = useRef<HTMLButtonElement>(null)

  const isTextType = question.type === 'text'
  const options = question.options || []

  // Reset focus on new question
  useEffect(() => {
    setFocusedIdx(0)
    setHintsRevealed(0)
    if (isTextType && inputRef.current) {
      inputRef.current.focus()
    } else if (!isTextType && optionRefs.current[0]) {
      optionRefs.current[0].focus()
    }
  }, [question.id, isTextType])

  // Auto-focus check button after answer, or first option on new question
  useEffect(() => {
    if (isChecked && checkBtnRef.current) {
      checkBtnRef.current.focus()
    }
  }, [isChecked])

  // Global keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isChecked) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          handleNext()
        }
        return
      }
      
      if (!isTextType && options.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault()
          setFocusedIdx(prev => {
            const next = Math.min(prev + 1, options.length - 1)
            optionRefs.current[next]?.focus()
            return next
          })
        } else if (e.key === 'ArrowUp') {
          e.preventDefault()
          setFocusedIdx(prev => {
            const next = Math.max(prev - 1, 0)
            optionRefs.current[next]?.focus()
            return next
          })
        } else if (e.key === 'Home') {
          e.preventDefault()
          setFocusedIdx(0)
          optionRefs.current[0]?.focus()
        } else if (e.key === 'End') {
          e.preventDefault()
          const last = options.length - 1
          setFocusedIdx(last)
          optionRefs.current[last]?.focus()
        } else if (e.key === 'Escape') {
          e.preventDefault()
          setSelected([])
          setFocusedIdx(0)
          optionRefs.current[0]?.focus()
        }
      }
      
      if (e.key === 'Enter' && !isTextType && selected.length > 0) {
        e.preventDefault()
        handleCheck()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isChecked, isTextType, options.length, selected.length])

  const handleOptionClick = (option: string, idx: number) => {
    if (isChecked) return
    setFocusedIdx(idx)
    if (question.type === 'single') {
      setSelected([option])
    } else if (question.type === 'multiple' || question.type === 'ege-multiple') {
      setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
    }
  }

  const handleOptionKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, option: string, idx: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      if (!isChecked) {
        handleOptionClick(option, idx)
        if (question.type === 'single') {
          // Auto-check for single-choice after selection
          setTimeout(() => handleCheck(), 50)
        }
      }
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
      onAnswer(correct, [userAnswer], hintsRevealed)
    } else {
      if (selected.length === 0) return
      const correct = question.type === 'single'
        ? selected[0] === question.correctAnswer[0]
        : selected.length === question.correctAnswer.length && selected.every(s => question.correctAnswer.includes(s))
      setIsCorrect(correct)
      setIsChecked(true)
      onAnswer(correct, selected, hintsRevealed)
    }
  }

  const handleRevealHint = () => {
    if (!question.hints || hintsRevealed >= question.hints.length) return
    const nextLevel = hintsRevealed + 1
    setHintsRevealed(nextLevel)
    const hint = question.hints[hintsRevealed]
    if (onHintUsed) {
      onHintUsed(hint.level, hint.xpPenalty)
    }
  }

  const handleNext = () => {
    setSelected([])
    setTextInput('')
    setIsChecked(false)
    setIsCorrect(false)
    setHintsRevealed(0)
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

      {/* Hints UI */}
      {question.hints && question.hints.length > 0 && (
        <div className="flex flex-col gap-2">
          {hintsRevealed === 0 && !isChecked && (
            <button
              onClick={handleRevealHint}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-yellow-200 bg-yellow-50 text-yellow-700 font-medium hover:bg-yellow-100 transition-colors w-fit"
              aria-label="Открыть подсказку"
            >
              <Lightbulb size={18} />
              💡 Подсказка
            </button>
          )}

          {hintsRevealed > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 space-y-3"
            >
              {question.hints.slice(0, hintsRevealed).map((hint) => (
                <motion.div
                  key={hint.level}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
                      Уровень {hint.level}
                    </span>
                    <span className="text-xs text-yellow-600 font-medium">
                      -{hint.xpPenalty} XP
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{hint.text}</p>
                </motion.div>
              ))}

              {hintsRevealed < question.hints.length && !isChecked && (
                <button
                  onClick={handleRevealHint}
                  className="text-sm text-yellow-700 underline hover:text-yellow-800 font-medium"
                >
                  Ещё подсказку? (-{question.hints[hintsRevealed].xpPenalty} XP)
                </button>
              )}

              {hintsRevealed >= question.hints.length && (
                <p className="text-xs text-yellow-600 italic">
                  Все подсказки открыты. Ответьте, но XP будет минимальным.
                </p>
              )}
            </motion.div>
          )}
        </div>
      )}

      {/* Text input for type === 'text' */}
      {isTextType && (
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            disabled={isChecked}
            placeholder="Впишите ответ..."
            aria-label="Введите ответ на вопрос"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && textInput.trim().length > 0 && !isChecked) {
                e.preventDefault()
                handleCheck()
              }
            }}
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
        <div className="flex flex-col gap-2" role="radiogroup" aria-label="Варианты ответа">
          <AnimatePresence>
            {question.options?.map((option, idx) => {
              const isSelected = selected.includes(option)
              const isCorrectOption = question.correctAnswer.includes(option)
              let buttonClass = 'border-2 rounded-xl p-4 text-left font-medium transition-all focus:outline-none focus:ring-2 focus:ring-duo-blue/30 '

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
                  ref={el => optionRefs.current[idx] = el}
                  key={option}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => handleOptionClick(option, idx)}
                  onKeyDown={(e) => handleOptionKeyDown(e, option, idx)}
                  className={buttonClass}
                  disabled={isChecked}
                  tabIndex={isChecked ? -1 : 0}
                  role={question.type === 'single' ? 'radio' : 'checkbox'}
                  aria-checked={isSelected}
                  aria-label={`Вариант ${option}${isSelected ? ', выбрано' : ''}`}
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
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className={`p-5 rounded-2xl border-2 shadow-sm ${
            isCorrect
              ? 'bg-green-50 border-duo-green'
              : 'bg-red-50 border-duo-red'
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            {isCorrect ? (
              <>
                <div className="w-8 h-8 bg-duo-green rounded-full flex items-center justify-center">
                  <Check size={18} className="text-white" />
                </div>
                <span className="font-bold text-duo-green text-lg">Правильно!</span>
              </>
            ) : (
              <>
                <div className="w-8 h-8 bg-duo-red rounded-full flex items-center justify-center">
                  <X size={18} className="text-white" />
                </div>
                <span className="font-bold text-duo-red text-lg">Неправильно</span>
              </>
            )}
          </div>

          {/* Explanation */}
          <div className="mb-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              {question.explanation}
            </p>
          </div>

          {/* Correct answer for wrong answers */}
          {!isCorrect && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-3 p-3 bg-white/70 rounded-xl border border-red-200"
            >
              <p className="text-sm text-gray-600">
                Правильный ответ:{' '}
                <span className="font-bold text-duo-green">
                  {question.correctAnswer.join(', ')}
                </span>
              </p>
            </motion.div>
          )}

          {/* RAG theory for wrong answers */}
          {!isCorrect && (() => {
            const taskNum = getTaskNumberFromAtoms(question.atoms)
            if (!taskNum) return null

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

          {/* Save explanation button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                if (isSaved) return
                const item: SavedExplanation = {
                  id: `${question.id}-${Date.now()}`,
                  questionId: question.id,
                  text: question.text,
                  explanation: question.explanation,
                  correctAnswer: question.correctAnswer,
                  taskNumber: getTaskNumberFromAtoms(question.atoms) || undefined,
                  savedAt: new Date().toISOString(),
                }
                saveExplanation(item)
              }}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isSaved
                  ? 'bg-yellow-100 text-yellow-700 cursor-default'
                  : 'bg-white hover:bg-yellow-50 text-gray-600 hover:text-yellow-600 border border-gray-200'
              }`}
              aria-label={isSaved ? 'Разбор сохранён' : 'Сохранить разбор'}
              disabled={isSaved}
            >
              {isSaved ? (
                <>
                  <BookmarkCheck size={16} />
                  <span>Сохранено</span>
                </>
              ) : (
                <>
                  <Bookmark size={16} />
                  <span>⭐ Сохранить разбор</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      )}

      <button
        ref={checkBtnRef}
        onClick={isChecked ? handleNext : handleCheck}
        disabled={!canCheck}
        aria-label={isChecked ? (questionNumber === totalQuestions ? 'Завершить урок' : 'Следующий вопрос') : 'Проверить ответ'}
        className={`btn-primary w-full ${isChecked ? (isCorrect ? '' : 'bg-duo-red shadow-[0_4px_0_#d32f2f]') : ''}`}
      >
        {isChecked ? (
          <span className="flex items-center justify-center gap-2">
            {questionNumber === totalQuestions ? 'Завершить' : 'Понятно, дальше →'}
            <ArrowRight size={18} />
          </span>
        ) : (
          'Проверить'
        )}
      </button>
    </div>
  )
}
