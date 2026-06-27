import { useState, useCallback, useEffect, useMemo } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Heart, BookOpen, Pencil } from 'lucide-react'
import { QuestionCard } from '../components/QuestionCard'
import { LessonResult } from '../components/LessonResult'
import { Hearts } from '../components/Hearts'
import { ComboDisplay } from '../components/ComboDisplay'
import { TheoryModal } from '../components/TheoryModal'
import { useComboToasts } from '../components/ComboToast'
import { useProgressStore } from '../stores/progressStore'
import { useTeacherMode } from '../hooks/useTeacherMode'
import { applyQuestionEdits } from '../lib/questionEdits'
import { InlineQuestionEditor } from '../components/InlineQuestionEditor'
import { course } from '../data/courseData'
import { getTheoryForLesson } from '../lib/theoryMapper'
import { playCorrectSound, playWrongSound, playLessonCompleteSound, playComboSound } from '../lib/sounds'
import { detectErrorType } from '../utils/errorPatternAnalyzer'
import { getCanonicalWordId, getRuleId, extractWordFromQuestion } from '../data/questionMapping'

export function Lesson() {
  const { lessonId } = useParams()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
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
  const recordAnswer = useProgressStore((s) => s.recordAnswer)

  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [combo, setCombo] = useState(0)
  const [gameOverReason, setGameOverReason] = useState<'hearts' | 'completed' | null>(null)
  const [direction, setDirection] = useState(0)
  const [showTheory, setShowTheory] = useState(false)
  const { showComboToast, ToastOverlay } = useComboToasts()

  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [hintsUsedPerQuestion, setHintsUsedPerQuestion] = useState<Record<string, number>>({})
  const [answers, setAnswers] = useState<Record<number, { isCorrect: boolean; userAnswer?: string[] }>>({})

  const [showEditor, setShowEditor] = useState(false)
  const [editorKey, setEditorKey] = useState(0)
  const [editVersion, setEditVersion] = useState(0)
  const isTeacherMode = useTeacherMode()

  // Real-time: re-apply question edits when they arrive from Supabase
  useEffect(() => {
    const handler = () => setEditVersion(v => v + 1)
    window.addEventListener('question-edited', handler)
    return () => window.removeEventListener('question-edited', handler)
  }, [])

  const section = course.sections.find(s => s.lessons.some(l => l.id === lessonId))
  const courseLesson = section?.lessons.find(l => l.id === lessonId)
  const [lesson, setLesson] = useState(courseLesson)
  const lessonProgress = useProgressStore((s) => s.lessonProgress[lessonId ?? ''])
  const theory = lesson ? getTheoryForLesson(lesson.id) : undefined

  // Lazy-load dooshin questions if lesson has empty questions array
  useEffect(() => {
    setLesson(courseLesson)
    if (courseLesson && courseLesson.questions.length === 0 && lessonId?.startsWith('lesson-dooshin')) {
      import('../data/sections/dooshinUnified').then(({ dooshinSection }) => {
        const fullLesson = dooshinSection.lessons.find(l => l.id === lessonId)
        if (fullLesson) setLesson(fullLesson)
      })
    }
  }, [courseLesson, lessonId])

  // Reset all local game state when lessonId changes
  useEffect(() => {
    setCurrentQuestionIdx(0)
    setCorrectCount(0)
    setCombo(0)
    setGameOverReason(null)
    setHasAutoCompleted(false)
    setDirection(0)
    setQuestionStartTime(Date.now())
    setHintsUsedPerQuestion({})
    setAnswers({})
    setShowEditor(false)
  }, [lessonId])

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
      // Не перемешиваем options для ege-multiple, т.к. correctAnswer — номера вариантов
      const shuffledOptions = (q.options && q.type !== 'ege-multiple')
        ? [...q.options].sort(() => Math.random() - 0.5)
        : q.options
      return { ...q, options: shuffledOptions }
    })
  }, [lesson])

  const rawQuestion = questions[currentQuestionIdx]
  const currentQuestion = useMemo(() => {
    if (!rawQuestion) return rawQuestion
    return applyQuestionEdits(rawQuestion as any) as typeof rawQuestion
  }, [rawQuestion, editVersion])

  // Navigate to specific question via ?q= parameter
  useEffect(() => {
    const qId = searchParams.get('q')
    if (qId && questions.length > 0) {
      const idx = questions.findIndex(q => q.id === qId)
      if (idx !== -1 && idx !== currentQuestionIdx) {
        setCurrentQuestionIdx(idx)
        setDirection(idx > currentQuestionIdx ? 1 : -1)
      }
    }
  }, [searchParams.get('q'), questions.length]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleAnswer = useCallback((isCorrect: boolean, userAnswer?: string[], hintsUsed?: number) => {
    const timeSpent = Date.now() - questionStartTime
    const hintsCount = hintsUsed || 0
    if (hintsCount > 0 && currentQuestion) {
      setHintsUsedPerQuestion(prev => ({ ...prev, [currentQuestion.id]: Math.max(prev[currentQuestion.id] || 0, hintsCount) }))
    }
    recordQuestionAnswered()
    const wasAnswered = currentQuestionIdx in answers
    setAnswers(prev => ({ ...prev, [currentQuestionIdx]: { isCorrect, userAnswer } }))
    if (!wasAnswered) {
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
    } else {
      // Re-answering: just play sound
      isCorrect ? playCorrectSound() : playWrongSound()
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
    // Record answer history for IRT + Error Pattern Analysis
    const taskAtom = currentQuestion.atoms?.find(a => a.startsWith('task'))
    const taskNumber = taskAtom ? taskAtom.replace('task', '') : ''
    const errorType = !isCorrect ? detectErrorType(taskNumber, currentQuestion.text, currentQuestion.explanation) : undefined
    recordAnswer({
      questionId: currentQuestion.id,
      canonicalWordId: getCanonicalWordId(currentQuestion),
      word: extractWordFromQuestion(currentQuestion.text),
      ruleId: getRuleId(currentQuestion.id),
      taskNumber,
      correct: isCorrect,
      errorType,
      hintsUsed: hintsCount,
      timestamp: new Date().toISOString(),
      timeSpent,
    })
  }, [loseHeart, currentQuestion, recordAtomAttempt, infiniteHearts, recordWrongAnswer, lesson.id, updateTaskStats, questionStartTime, recordAnswer, currentQuestionIdx, answers])

  const handleNext = useCallback(() => {
    if (currentQuestionIdx < questions.length - 1) {
      setDirection(1)
      setCurrentQuestionIdx(prev => prev + 1)
      setQuestionStartTime(Date.now())
    } else {
      setGameOverReason('completed')
    }
  }, [currentQuestionIdx, questions.length])

  const handlePrev = useCallback(() => {
    if (currentQuestionIdx > 0) {
      setDirection(-1)
      setCurrentQuestionIdx(prev => prev - 1)
      setQuestionStartTime(Date.now())
    }
  }, [currentQuestionIdx])

  // Update URL ?q= when question changes (allows sharing direct links)
  useEffect(() => {
    if (currentQuestion && searchParams.get('q') !== currentQuestion.id) {
      const newParams = new URLSearchParams(searchParams)
      newParams.set('q', currentQuestion.id)
      setSearchParams(newParams, { replace: true })
    }
  }, [currentQuestionIdx, currentQuestion?.id]) // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-complete lesson when finished — fixes bug where closing page loses progress
  const [hasAutoCompleted, setHasAutoCompleted] = useState(false)
  useEffect(() => {
    if (gameOverReason === 'completed' && !hasAutoCompleted) {
      setHasAutoCompleted(true)
      const score = Math.round((correctCount / questions.length) * 100)
      const baseXP = Math.round((correctCount / questions.length) * lesson.xpReward)
      let multiplier = 1
      if (combo >= 10) multiplier = 3
      else if (combo >= 7) multiplier = 2.5
      else if (combo >= 5) multiplier = 2
      else if (combo >= 3) multiplier = 1.5
      let totalPenalty = 0
      for (const q of questions) {
        const hintsUsed = hintsUsedPerQuestion[q.id] || 0
        if (q.hints && hintsUsed > 0) {
          for (let i = 0; i < Math.min(hintsUsed, q.hints.length); i++) {
            totalPenalty += q.hints[i].xpPenalty
          }
        }
      }
      const xpEarned = Math.max(1, Math.round(baseXP * multiplier) - totalPenalty)
      playLessonCompleteSound()
      completeLesson(lesson.id, score, xpEarned)
      updateQuestProgress('quest-lessons-1')
      if (score === 100) {
        updateQuestProgress('quest-perfect-1')
      }
    }
  }, [gameOverReason, hasAutoCompleted, correctCount, questions.length, lesson.id, lesson.xpReward, combo, completeLesson, updateQuestProgress, hintsUsedPerQuestion])

  const handleHintUsed = useCallback((level: number, penalty: number) => {
    if (currentQuestion) {
      setHintsUsedPerQuestion(prev => ({
        ...prev,
        [currentQuestion.id]: Math.max(prev[currentQuestion.id] || 0, level)
      }))
    }
  }, [currentQuestion])

  const handleFinish = useCallback(() => {
    // Build the complete ordered list of lesson IDs as they appear in the course map
    const orderedLessonIds: string[] = []
    
    for (const section of course.sections) {
      // Groups come first (main learning path order)
      for (const group of (section.groups || [])) {
        for (const lesson of group.lessons) {
          orderedLessonIds.push(lesson.id)
        }
        for (const subgroup of (group.subgroups || [])) {
          for (const lesson of subgroup.lessons) {
            orderedLessonIds.push(lesson.id)
          }
        }
      }
      // Then flat lessons not already in groups
      for (const lesson of section.lessons) {
        if (!orderedLessonIds.includes(lesson.id)) {
          orderedLessonIds.push(lesson.id)
        }
      }
    }

    const idx = orderedLessonIds.indexOf(lessonId || '')
    const nextId = idx >= 0 && idx + 1 < orderedLessonIds.length ? orderedLessonIds[idx + 1] : null

    if (nextId) {
      navigate(`/lesson/${nextId}`)
    } else {
      navigate('/course')
    }
  }, [navigate, lessonId])

  const handleRetry = useCallback(() => {
    restoreHearts()
    setCurrentQuestionIdx(0)
    setCorrectCount(0)
    setCombo(0)
    setGameOverReason(null)
    setHasAutoCompleted(false)
    setHintsUsedPerQuestion({})
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
        {isTeacherMode && currentQuestion && (
          <button
            onClick={() => setShowEditor(true)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Редактировать задание"
            title="Редактировать задание"
          >
            <Pencil size={20} className="text-duo-blue" />
          </button>
        )}
        <ComboDisplay combo={combo} multiplier={combo >= 10 ? 3 : combo >= 7 ? 2.5 : combo >= 5 ? 2 : combo >= 3 ? 1.5 : 1} />
        <Hearts />
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        {lesson.questions.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duo-green" />
            <span className="ml-3 text-sm text-gray-500">Загрузка вопросов...</span>
          </div>
        ) : (
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              {currentQuestion ? (
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={currentQuestionIdx + 1}
                  totalQuestions={questions.length}
                  onAnswer={handleAnswer}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  previousAnswer={answers[currentQuestionIdx]}
                  heartsLeft={hearts}
                  onHintUsed={handleHintUsed}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duo-green" />
                  <span className="ml-3 text-sm text-gray-500">Загрузка вопроса...</span>
                </div>
              )}
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
                <button onClick={() => navigate('/course')} className="btn-secondary w-full">Вернуться к курсу</button>
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
                xpEarned={(() => {
                  const baseXP = Math.round((correctCount / questions.length) * lesson.xpReward)
                  let multiplier = 1
                  if (combo >= 10) multiplier = 3
                  else if (combo >= 7) multiplier = 2.5
                  else if (combo >= 5) multiplier = 2
                  else if (combo >= 3) multiplier = 1.5
                  let totalPenalty = 0
                  for (const q of questions) {
                    const hintsUsed = hintsUsedPerQuestion[q.id] || 0
                    if (q.hints && hintsUsed > 0) {
                      for (let i = 0; i < Math.min(hintsUsed, q.hints.length); i++) {
                        totalPenalty += q.hints[i].xpPenalty
                      }
                    }
                  }
                  return Math.max(1, Math.round(baseXP * multiplier) - totalPenalty)
                })()}
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
      )}
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

      {/* Inline Question Editor (teacher only) */}
      <AnimatePresence>
        {showEditor && currentQuestion && (
          <InlineQuestionEditor
            question={currentQuestion as any}
            lessonId={lesson.id}
            onClose={() => setShowEditor(false)}
            onSaved={() => setEditorKey(k => k + 1)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
