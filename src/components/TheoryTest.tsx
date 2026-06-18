import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, BookOpen, Zap } from 'lucide-react'
import { TheoryQuestion, TheoryTest } from '../data/theoryTests'

interface TheoryTestProps {
  test: TheoryTest
  onComplete: (score: number, xpEarned: number) => void
  onClose: () => void
}

export function TheoryTestRunner({ test, onComplete, onClose }: TheoryTestProps) {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: string; correct: boolean; selected: string }[]>([])

  const question = test.questions[currentQuestionIdx]
  const isCorrect = selectedAnswer === question.correctAnswer
  const progress = ((currentQuestionIdx + (showExplanation ? 1 : 0)) / test.questions.length) * 100

  const handleAnswer = useCallback((answer: string) => {
    if (showExplanation) return
    setSelectedAnswer(answer)
    setShowExplanation(true)
    const correct = answer === question.correctAnswer
    if (correct) setCorrectCount(c => c + 1)
    setAnswers(prev => [...prev, { questionId: question.id, correct, selected: answer }])
  }, [showExplanation, question])

  const handleNext = useCallback(() => {
    if (currentQuestionIdx + 1 >= test.questions.length) {
      const score = Math.round(correctCount / test.questions.length * 100)
      const xpEarned = Math.round(score / 10) * 3 // max 30 XP at 100%
      setIsFinished(true)
      onComplete(score, xpEarned)
    } else {
      setCurrentQuestionIdx(c => c + 1)
      setSelectedAnswer(null)
      setShowExplanation(false)
    }
  }, [currentQuestionIdx, test.questions.length, correctCount, isCorrect, onComplete])

  const handleRetry = useCallback(() => {
    setCurrentQuestionIdx(0)
    setSelectedAnswer(null)
    setShowExplanation(false)
    setCorrectCount(0)
    setIsFinished(false)
    setAnswers([])
  }, [])

  if (isFinished) {
    const finalScore = Math.round((correctCount) / test.questions.length * 100)
    const xpEarned = Math.round(finalScore / 10) * 3 // max 30 XP at 100%
    const allCorrect = finalScore === 100

    return (
      <div className="min-h-screen bg-duo-snow flex flex-col">
        <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowRight size={20} className="text-gray-600 rotate-180" />
          </button>
          <div className="flex-1">
            <p className="font-bold text-sm">Результат теста</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 max-w-md w-full text-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${allCorrect ? 'bg-duo-green/10' : 'bg-amber-50'}`}>
              {allCorrect ? <Trophy size={40} className="text-duo-green" /> : <Zap size={40} className="text-amber-500" />}
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {allCorrect ? 'Отлично!' : finalScore >= 70 ? 'Хороший результат!' : 'Попробуй ещё раз!'}
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {allCorrect ? 'Ты отлично усвоил теорию!' : 'Прочитай теорию внимательнее и попробуй снова.'}
            </p>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-duo-green">{finalScore}%</p>
                <p className="text-xs text-gray-500">Правильных</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-duo-yellow">{xpEarned}</p>
                <p className="text-xs text-gray-500">XP</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{correctCount}/{test.questions.length}</p>
                <p className="text-xs text-gray-500">Вопросов</p>
              </div>
            </div>
            <div className="space-y-2">
              <button onClick={onClose} className="btn-primary w-full">
                Продолжить
              </button>
              {!allCorrect && (
                <button onClick={handleRetry} className="btn-secondary w-full flex items-center justify-center gap-2">
                  <RotateCcw size={16} />
                  Пройти снова
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-duo-snow flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowRight size={20} className="text-gray-600 rotate-180" />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-500">Тест по теории</p>
          <p className="font-bold text-sm">Задание {test.taskNumber}. {test.title}</p>
        </div>
        <div className="text-sm font-bold text-duo-green">
          {currentQuestionIdx + 1}/{test.questions.length}
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white px-4 pb-3">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-duo-green rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 px-4 py-6 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <p className="text-base font-medium text-gray-800 leading-relaxed mb-4">{question.text}</p>
              <div className="space-y-2">
                {question.options.map((option) => {
                  const isSelected = selectedAnswer === option
                  const isCorrectOption = option === question.correctAnswer
                  const showCorrect = showExplanation && isCorrectOption
                  const showWrong = showExplanation && isSelected && !isCorrectOption

                  return (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={showExplanation}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm font-medium ${
                        showCorrect
                          ? 'border-duo-green bg-duo-green/5 text-duo-green'
                          : showWrong
                          ? 'border-red-400 bg-red-50 text-red-700'
                          : isSelected
                          ? 'border-duo-blue bg-duo-blue/5 text-duo-blue'
                          : 'border-gray-100 hover:border-gray-200 bg-white text-gray-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {showCorrect && <CheckCircle size={18} />}
                        {showWrong && <XCircle size={18} />}
                        <span>{option}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-xl p-4 border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}
                >
                  <p className={`text-sm font-bold mb-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                    {isCorrect ? '✅ Правильно!' : '❌ Неправильно'}
                  </p>
                  <p className="text-sm text-gray-700 leading-relaxed">{question.explanation}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer action */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border-t border-gray-100 px-4 py-3"
          >
            <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
              {currentQuestionIdx + 1 >= test.questions.length ? 'Завершить' : 'Следующий вопрос'}
              <ArrowRight size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
