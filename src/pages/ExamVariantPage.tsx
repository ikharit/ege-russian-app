import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Timer, ArrowLeft, SkipForward, Flag, AlertCircle } from 'lucide-react'
import { getVariantById, convertPrimaryToSecondary } from '../data/fipiVariants'
import { loadQuestionsForTask } from '../data/examQuestionLoader'
import { useProgressStore } from '../stores/progressStore'
import { Question } from '../types'
import { QuestionCard } from '../components/QuestionCard'
import { useAdaptiveEngine } from '../hooks/useAdaptiveEngine'

export function ExamVariantPage() {
  const { variantId } = useParams<{ variantId: string }>()
  const navigate = useNavigate()
  const variant = useMemo(() => getVariantById(variantId || ''), [variantId])

  const [currentTaskIndex, setCurrentTaskIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const timeLeftRef = useRef(timeLeft)
  useEffect(() => { timeLeftRef.current = timeLeft }, [timeLeft])
  const [isFinished, setIsFinished] = useState(false)
  const [taskScores, setTaskScores] = useState<Record<number, number>>({})
  const taskScoresRef = useRef(taskScores)
  useEffect(() => { taskScoresRef.current = taskScores }, [taskScores])
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [isStarted, setIsStarted] = useState(false)

  const saveExamResult = useProgressStore((s) => s.saveExamResult)

  const finishExam = useCallback(() => {
    if (!variant || isFinished) return
    setIsFinished(true)
    const scores = taskScoresRef.current
    const primaryScore = Object.values(scores).reduce((a, b) => a + b, 0)
    const secondaryScore = convertPrimaryToSecondary(primaryScore, variant.primaryScore)
    const timeSpent = (variant.timeLimit * 60) - timeLeftRef.current

    const result = {
      variantId: variant.id,
      date: new Date().toISOString(),
      primaryScore,
      secondaryScore,
      taskScores: scores,
      timeSpent,
    }

    saveExamResult(result)
    navigate(`/exam/${variant.id}/results`)
  }, [variant, isFinished, saveExamResult, navigate])

  // Initialize timer
  useEffect(() => {
    if (variant && !isStarted) {
      setTimeLeft(variant.timeLimit * 60)
      setIsStarted(true)
    }
  }, [variant, isStarted])

  // Timer countdown
  useEffect(() => {
    if (!isStarted || isFinished) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [isStarted, isFinished])

  // Auto-finish when time runs out
  useEffect(() => {
    if (timeLeft === 0 && isStarted && !isFinished) {
      finishExam()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, isStarted, isFinished])

  // Load question for current task
  useEffect(() => {
    if (!variant || !isStarted) return
    const task = variant.tasks[currentTaskIndex]
    if (!task) return
    const loaded = loadQuestionsForTask(
      variant.id,
      task.taskNumber,
      task.dataSource,
      task.questionCount
    )
    setCurrentQuestion(loaded[0] || null)
    setQuestions(loaded)
  }, [variant, currentTaskIndex, isStarted])

  const { observeAnswer } = useAdaptiveEngine(
    questions,
    String(variant?.tasks[currentTaskIndex]?.taskNumber || '')
  )

  const handleAnswer = useCallback(
    (correct: boolean) => {
      const task = variant?.tasks[currentTaskIndex]
      if (!task) return
      observeAnswer(currentQuestion?.id || '', correct, currentQuestion?.atoms)
      setTaskScores((prev) => ({
        ...prev,
        [task.taskNumber]: correct ? task.maxScore : 0,
      }))
    },
    [variant, currentTaskIndex, observeAnswer, currentQuestion]
  )

  const handleNext = useCallback(() => {
    if (!variant) return
    if (currentTaskIndex < variant.tasks.length - 1) {
      setCurrentTaskIndex((prev) => prev + 1)
    } else {
      finishExam()
    }
  }, [variant, currentTaskIndex, finishExam])

  const handleSkip = useCallback(() => {
    const task = variant?.tasks[currentTaskIndex]
    if (!task) return
    setTaskScores((prev) => ({
      ...prev,
      [task.taskNumber]: 0,
    }))
    handleNext()
  }, [variant, currentTaskIndex, handleNext])

  const handleFinishEarly = useCallback(() => {
    if (confirm('Завершить вариант досрочно?')) {
      finishExam()
    }
  }, [finishExam])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (!variant) {
    return (
      <div className="min-h-screen bg-duo-snow flex items-center justify-center">
        <p className="text-gray-500">Вариант не найден</p>
      </div>
    )
  }

  const task = variant.tasks[currentTaskIndex]
  const progress =
    variant.tasks.length > 0
      ? (currentTaskIndex / variant.tasks.length) * 100
      : 0

  return (
    <div className="min-h-screen bg-duo-snow flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/exam')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Назад к вариантам"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <Timer
              size={18}
              className={timeLeft < 300 ? 'text-duo-red' : 'text-gray-600'}
            />
            <span
              className={`font-bold font-mono ${
                timeLeft < 300 ? 'text-duo-red' : 'text-gray-700'
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>
              Задание {currentTaskIndex + 1} из {variant.tasks.length}
            </span>
            <span>{task?.title}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-duo-green h-2 rounded-full"
              style={{ width: `${progress}%` }}
              layout
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col p-4 max-w-2xl mx-auto w-full">
        {currentQuestion && (
          <QuestionCard
            key={currentTaskIndex}
            question={currentQuestion}
            questionNumber={currentTaskIndex + 1}
            totalQuestions={variant.tasks.length}
            onAnswer={handleAnswer}
            onNext={handleNext}
            heartsLeft={99}
          />
        )}

        {!currentQuestion && task && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <AlertCircle size={48} className="text-gray-300" />
            <p className="text-gray-500 text-center">
              Задание {task.taskNumber}: {task.title}
            </p>
            <p className="text-gray-400 text-sm text-center">
              Вопросы для этого задания загружаются из внешних источников.
            </p>
            <button onClick={handleSkip} className="btn-primary">
              Пропустить
            </button>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3 mt-4">
          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 btn-secondary flex items-center justify-center gap-2"
              disabled={!currentQuestion}
            >
              <SkipForward size={16} />
              Пропустить
            </button>
            <button
              onClick={handleFinishEarly}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-duo-red text-duo-red font-bold hover:bg-duo-red/5 transition-colors"
              disabled={!currentQuestion}
            >
              <Flag size={16} />
              Завершить досрочно
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
