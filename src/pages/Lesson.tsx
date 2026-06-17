import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart } from 'lucide-react'
import { QuestionCard } from '../components/QuestionCard'
import { LessonResult } from '../components/LessonResult'
import { Hearts } from '../components/Hearts'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'

export function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const startLesson = useProgressStore((s) => s.startLesson)
  const completeLesson = useProgressStore((s) => s.completeLesson)
  const loseHeart = useProgressStore((s) => s.loseHeart)
  const restoreHearts = useProgressStore((s) => s.restoreHearts)
  const hearts = useProgressStore((s) => s.userStats.hearts)
  const infiniteHearts = useProgressStore((s) => s.userStats.infiniteHearts)
  const recordAtomAttempt = useProgressStore((s) => s.recordAtomAttempt)

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [gameOverReason, setGameOverReason] = useState<'hearts' | 'completed' | null>(null)
  const [direction, setDirection] = useState(0)

  const section = course.sections.find(s => s.lessons.some(l => l.id === lessonId))
  const lesson = section?.lessons.find(l => l.id === lessonId)

  if (!lesson) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-gray-800">Урок не найден</h2>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">На главную</button>
      </div>
    )
  }

  const questions = lesson.questions.map(q => {
    // Shuffle options so correct answer isn't always first
    const shuffledOptions = q.options ? [...q.options].sort(() => Math.random() - 0.5) : q.options
    return { ...q, options: shuffledOptions }
  })
  const currentQuestion = questions[currentQuestionIdx]

  const handleAnswer = useCallback((isCorrect: boolean) => {
    if (isCorrect) {
      setCorrectCount(prev => prev + 1)
    } else if (!infiniteHearts) {
      const hasHeart = loseHeart()
      if (!hasHeart) {
        setGameOverReason('hearts')
      }
    }
    // Track atom progress for diagnostic stats
    if (currentQuestion.atoms) {
      for (const atomId of currentQuestion.atoms) {
        recordAtomAttempt(atomId, isCorrect)
      }
    }
  }, [loseHeart, currentQuestion, recordAtomAttempt, infiniteHearts])

  const handleNext = useCallback(() => {
    if (currentQuestionIdx < questions.length - 1) {
      setDirection(1)
      setCurrentQuestionIdx(prev => prev + 1)
    } else {
      setGameOverReason('completed')
    }
  }, [currentQuestionIdx, questions.length])

  const handleFinish = useCallback(() => {
    const score = Math.round((correctCount / questions.length) * 100)
    const xpEarned = Math.round((correctCount / questions.length) * lesson.xpReward)
    completeLesson(lesson.id, score, xpEarned)
    navigate('/')
  }, [correctCount, questions.length, lesson.id, lesson.xpReward, completeLesson, navigate])

  const handleRetry = useCallback(() => {
    restoreHearts()
    setCurrentQuestionIdx(0)
    setCorrectCount(0)
    setGameOverReason(null)
    startLesson(lesson.id)
  }, [restoreHearts, startLesson, lesson.id])

  const isFinished = gameOverReason !== null

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <p className="text-xs text-gray-500">{section?.title}</p>
          <p className="font-bold text-sm">{lesson.title}</p>
        </div>
        <Hearts />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIdx + 1}
                totalQuestions={questions.length}
                onAnswer={handleAnswer}
                onNext={handleNext}
                heartsLeft={hearts}
              />
            </motion.div>
          ) : gameOverReason === 'hearts' ? (
            <motion.div
              key="hearts"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="max-w-md mx-auto text-center py-12"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <Heart size={48} className="text-red-500 fill-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Сердечки закончились! 💔</h2>
              <p className="text-gray-600 mb-8">У вас закончились жизни. Попробуйте пройти урок ещё раз.</p>
              <div className="flex flex-col gap-3 max-w-xs mx-auto">
                <button onClick={handleRetry} className="btn-primary w-full">Повторить</button>
                <button onClick={() => navigate('/')} className="btn-secondary w-full">Вернуться к курсу</button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <LessonResult
                correctCount={correctCount}
                totalQuestions={questions.length}
                xpEarned={Math.round((correctCount / questions.length) * lesson.xpReward)}
                isPerfect={correctCount === questions.length}
                onContinue={handleFinish}
                onRetry={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
