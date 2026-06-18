import { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, BookOpen } from 'lucide-react'
import { QuestionCard } from '../components/QuestionCard'
import { LessonResult } from '../components/LessonResult'
import { Hearts } from '../components/Hearts'
import { ComboDisplay } from '../components/ComboDisplay'
import { TheoryModal } from '../components/TheoryModal'
import { useComboToasts } from '../components/ComboToast'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { getTheoryForLesson } from '../lib/theoryMapper'
import { playCorrectSound, playWrongSound, playLessonCompleteSound, playComboSound } from '../lib/sounds'

export function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const startLesson = useProgressStore((s) => s.startLesson)
  const completeLesson = useProgressStore((s) => s.completeLesson)
  const loseHeart = useProgressStore((s) => s.loseHeart)
  const restoreHearts = useProgressStore((s) => s.restoreHearts)
  const hearts = useProgressStore((s) => s.userStats.hearts)
  const infiniteHearts = useProgressStore((s) => s.userStats.infiniteHearts)
  const userStats = useProgressStore((s) => s.userStats)
  const recordAtomAttempt = useProgressStore((s) => s.recordAtomAttempt)
  const recordWrongAnswer = useProgressStore((s) => s.recordWrongAnswer)
  const updateTaskStats = useProgressStore((s) => s.updateTaskStats)

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [combo, setCombo] = useState(0)
  const [gameOverReason, setGameOverReason] = useState<'hearts' | 'completed' | null>(null)
  const [direction, setDirection] = useState(0)
  const [showTheory, setShowTheory] = useState(false)
  const { showComboToast, ToastOverlay } = useComboToasts()

  const section = course.sections.find(s => s.lessons.some(l => l.id === lessonId))
  const lesson = section?.lessons.find(l => l.id === lessonId)
  const lessonProgress = useProgressStore((s) => s.lessonProgress[lessonId ?? ''])
  const theory = lesson ? getTheoryForLesson(lesson.id) : undefined

  // Show theory on first visit if lesson is not completed
  useEffect(() => {
    if (theory && lessonProgress?.status !== 'completed') {
      setShowTheory(true)
    }
  }, [theory, lessonProgress?.status])

  if (!lesson) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 text-center">
        <h2 className="text-xl font-bold text-gray-800">Урок не найден</h2>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">На главную</button>
      </div>
    )
  }

  const questions = useMemo(() => {
    return lesson.questions.map(q => {
      const shuffledOptions = q.options ? [...q.options].sort(() => Math.random() - 0.5) : q.options
      return { ...q, options: shuffledOptions }
    })
  }, [lesson.id])

  const currentQuestion = questions[currentQuestionIdx]

  useEffect(() => {
    startLesson(lesson.id)
  }, [lesson.id, startLesson])

  // Combo toast + sound
  useEffect(() => {
    if (combo >= 3) {
      showComboToast(combo)
      playComboSound(combo)
    }
  }, [combo])

  const recordQuestionAnswered = useProgressStore((s) => s.recordQuestionAnswered)
  const updateQuestProgress = useProgressStore((s) => s.updateQuestProgress)

  const handleAnswer = useCallback((isCorrect: boolean, userAnswer?: string[]) => {
    recordQuestionAnswered()
    if (isCorrect) {
      setCorrectCount(prev => prev + 1)
      setCombo(prev => prev + 1)
      playCorrectSound()
      updateQuestProgress('quest-questions-5')
    } else {
      setCombo(0)
      playWrongSound()
      if (currentQuestion && userAnswer) {
        recordWrongAnswer(currentQuestion, userAnswer, lesson.id)
      }
      if (!infiniteHearts) {
        const hasHeart = loseHeart()
        if (!hasHeart) {
          setGameOverReason('hearts')
        }
      }
    }
    // Track atom progress for diagnostic stats
    if (currentQuestion.atoms) {
      for (const atomId of currentQuestion.atoms) {
        recordAtomAttempt(atomId, isCorrect)
      }
    }
    // Track task stats
    if (currentQuestion.atoms) {
      const taskAtom = currentQuestion.atoms.find(a => a.startsWith('task'))
      if (taskAtom) {
        const taskNumber = taskAtom.replace('task', '')
        updateTaskStats(taskNumber, isCorrect)
      }
    }
  }, [loseHeart, currentQuestion, recordAtomAttempt, infiniteHearts, recordWrongAnswer, lesson.id, updateTaskStats])

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
    const baseXP = Math.round((correctCount / questions.length) * lesson.xpReward)
    
    // Combo multiplier
    let multiplier = 1
    if (combo >= 10) multiplier = 3
    else if (combo >= 7) multiplier = 2.5
    else if (combo >= 5) multiplier = 2
    else if (combo >= 3) multiplier = 1.5
    
    const xpEarned = Math.round(baseXP * multiplier)
    playLessonCompleteSound()
    completeLesson(lesson.id, score, xpEarned)
    
    // Update daily quests
    updateQuestProgress('quest-lessons-1')
    if (score === 100) {
      updateQuestProgress('quest-perfect-1')
    }
    
    navigate('/')
  }, [correctCount, questions.length, lesson.id, lesson.xpReward, combo, completeLesson, navigate, updateQuestProgress])

  const handleRetry = useCallback(() => {
    restoreHearts()
    setCurrentQuestionIdx(0)
    setCorrectCount(0)
    setCombo(0)
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
        {theory && (
          <button
            onClick={() => setShowTheory(true)}
            className="p-2 hover:bg-duo-blue/10 rounded-lg transition-colors"
            title="Открыть теорию"
          >
            <BookOpen size={20} className="text-duo-blue" />
          </button>
        )}
        <ComboDisplay combo={combo} multiplier={combo >= 10 ? 3 : combo >= 7 ? 2.5 : combo >= 5 ? 2 : combo >= 3 ? 1.5 : 1} />
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
                xpEarned={Math.round((correctCount / questions.length) * lesson.xpReward * (combo >= 10 ? 3 : combo >= 7 ? 2.5 : combo >= 5 ? 2 : combo >= 3 ? 1.5 : 1))}
                comboMultiplier={combo >= 10 ? 3 : combo >= 7 ? 2.5 : combo >= 5 ? 2 : combo >= 3 ? 1.5 : 1}
                isPerfect={correctCount === questions.length}
                lessonTitle={lesson.title}
                streak={userStats.streak}
                onContinue={handleFinish}
                onRetry={handleRetry}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Theory Modal */}
      <AnimatePresence>
        {showTheory && theory && (
          <TheoryModal
            theory={theory}
            onClose={() => setShowTheory(false)}
            onStart={() => setShowTheory(false)}
            actionLabel="Понятно, начать!"
          />
        )}
      </AnimatePresence>
    </div>
  )
}
