import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Target, AlertTriangle, CheckCircle, RotateCcw, Zap, ChevronRight } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { WrongAnswer } from '../types'

interface AdaptiveQuestion {
  id: string
  text: string
  options?: string[]
  correctAnswer: string[]
  userAnswer: string[]
  explanation: string
  source: 'error' | 'weak'
  taskNumber?: string
}

export function AdaptiveTrainerPage() {
  const navigate = useNavigate()
  const wrongAnswers = useProgressStore((s) => s.getWrongAnswers())
  const problematicTasks = useProgressStore((s) => s.getProblematicTasks(5))
  const removeWrongAnswer = useProgressStore((s) => s.removeWrongAnswer)
  const updateTaskStats = useProgressStore((s) => s.updateTaskStats)
  const recordWrongAnswer = useProgressStore((s) => s.recordWrongAnswer)

  const [session, setSession] = useState<AdaptiveQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [checked, setChecked] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, wrong: 0 })
  const [finished, setFinished] = useState(false)

  // Generate session
  useEffect(() => {
    generateSession()
  }, [])

  function generateSession() {
    const questions: AdaptiveQuestion[] = []
    
    // 60% from errors (most recent first)
    const errors = wrongAnswers
      .filter((w) => !w.reviewed)
      .slice(0, 6)
      .map((w) => ({
        id: w.questionId,
        text: w.text,
        options: w.options,
        correctAnswer: w.correctAnswer,
        userAnswer: [] as string[],
        explanation: w.explanation,
        source: 'error' as const,
        taskNumber: w.taskNumber,
      }))

    // 40% from weak topics (we generate placeholder questions from task stats)
    const weakTasks = problematicTasks.slice(0, 4)
    const weakQuestions: AdaptiveQuestion[] = weakTasks.flatMap((task) => {
      // Create a review question for weak task
      return [{
        id: `weak-${task.taskNumber}-${Date.now()}`,
        text: `Повтори задание №${task.taskNumber} — точность ${task.accuracy}%`,
        options: ['Перейти к тренажёру', 'Отложить'],
        correctAnswer: ['Перейти к тренажёру'],
        userAnswer: [] as string[],
        explanation: `Ты допустил ${task.wrong} ошибок из ${task.total} попыток. Стоит прорешать ещё раз!`,
        source: 'weak' as const,
        taskNumber: task.taskNumber,
      }]
    })

    questions.push(...errors, ...weakQuestions)
    // Shuffle
    questions.sort(() => Math.random() - 0.5)
    
    setSession(questions.slice(0, 10))
    setCurrentIndex(0)
    setSelected([])
    setChecked(false)
    setCorrect(false)
    setSessionStats({ correct: 0, wrong: 0 })
    setFinished(false)
  }

  const current = session[currentIndex]

  if (!current) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 text-center">
        <Target size={48} className="text-duo-green mx-auto mb-4" />
        <h1 className="text-xl font-bold text-gray-800">Мой тренажёр</h1>
        <p className="text-gray-500 mt-2">Нет данных для адаптивной тренировки</p>
        <p className="text-sm text-gray-400 mt-1">Реши несколько заданий — и мы подберём персональную тренировку</p>
        <button
          onClick={() => navigate('/trainers')}
          className="mt-4 px-4 py-2 bg-duo-green text-white rounded-xl font-bold"
        >
          К тренажёрам →
        </button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-6xl"
        >
          {sessionStats.correct === session.length ? '🏆' : sessionStats.correct > session.length / 2 ? '👍' : '💪'}
        </motion.div>
        <h1 className="text-2xl font-bold text-gray-800">Тренировка завершена!</h1>
        <p className="text-gray-500">
          {sessionStats.correct} / {session.length} правильно
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={generateSession}
            className="card flex flex-col items-center gap-2 py-4 cursor-pointer hover:scale-[1.02]"
          >
            <RotateCcw size={24} className="text-duo-blue" />
            <span className="font-bold text-sm">Ещё раз</span>
          </button>
          <button
            onClick={() => navigate('/mistakes')}
            className="card flex flex-col items-center gap-2 py-4 cursor-pointer hover:scale-[1.02]"
          >
            <AlertTriangle size={24} className="text-duo-red" />
            <span className="font-bold text-sm">Ошибки</span>
          </button>
        </div>
      </div>
    )
  }

  const handleCheck = () => {
    if (selected.length === 0) return
    const isCorrect = current.correctAnswer.length === selected.length &&
      current.correctAnswer.every((a) => selected.includes(a))
    setCorrect(isCorrect)
    setChecked(true)
    
    if (isCorrect) {
      setSessionStats((s) => ({ ...s, correct: s.correct + 1 }))
      if (current.source === 'error') {
        removeWrongAnswer(current.id)
      }
    } else {
      setSessionStats((s) => ({ ...s, wrong: s.wrong + 1 }))
      if (current.taskNumber) {
        updateTaskStats(current.taskNumber, false)
        recordWrongAnswer(
          {
            id: current.id,
            text: current.text,
            options: current.options,
            correctAnswer: current.correctAnswer,
            explanation: current.explanation,
          },
          selected
        )
      }
    }
  }

  const handleNext = () => {
    if (currentIndex < session.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelected([])
      setChecked(false)
    } else {
      setFinished(true)
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="text-center">
          <h1 className="text-lg font-bold text-gray-800">Мой тренажёр</h1>
          <p className="text-xs text-gray-400">
            {currentIndex + 1} / {session.length} • {sessionStats.correct}✓ {sessionStats.wrong}✗
          </p>
        </div>
        <div className="w-10" />
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-duo-green h-2 rounded-full transition-all"
          style={{ width: `${((currentIndex + (checked ? 1 : 0)) / session.length) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="card">
        <div className="flex items-center gap-2 mb-3">
          {current.source === 'error' ? (
            <AlertTriangle size={16} className="text-duo-red" />
          ) : (
            <Zap size={16} className="text-duo-yellow" />
          )}
          <span className="text-xs font-bold text-gray-400 uppercase">
            {current.source === 'error' ? 'Ты ошибался раньше' : 'Слабая тема'}
          </span>
          {current.taskNumber && (
            <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-500">
              Задание {current.taskNumber}
            </span>
          )}
        </div>

        <p className="text-lg font-bold text-gray-800 mb-4">{current.text}</p>

        {current.options && current.options.length > 0 && (
          <div className="space-y-2">
            {current.options.map((opt) => {
              const isSelected = selected.includes(opt)
              const isCorrect = current.correctAnswer.includes(opt)
              let bgClass = 'bg-white border-gray-200 hover:bg-gray-50'
              if (checked) {
                if (isCorrect) bgClass = 'bg-duo-green/10 border-duo-green'
                else if (isSelected && !isCorrect) bgClass = 'bg-duo-red/10 border-duo-red'
                else bgClass = 'bg-gray-50 border-gray-100'
              } else if (isSelected) {
                bgClass = 'bg-duo-blue/10 border-duo-blue'
              }

              return (
                <button
                  key={opt}
                  onClick={() => {
                    if (checked) return
                    setSelected((prev) =>
                      prev.includes(opt) ? prev.filter((s) => s !== opt) : [...prev, opt]
                    )
                  }}
                  className={`w-full text-left p-3 rounded-xl border-2 transition-all font-medium text-sm ${bgClass}`}
                  disabled={checked}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {checked && isCorrect && <CheckCircle size={18} className="text-duo-green" />}
                    {checked && isSelected && !isCorrect && <AlertTriangle size={18} className="text-duo-red" />}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {!current.options && (
          <div className="space-y-2">
            <input
              type="text"
              value={selected[0] || ''}
              onChange={(e) => setSelected([e.target.value])}
              disabled={checked}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-duo-green outline-none"
              placeholder="Введи ответ..."
            />
          </div>
        )}

        {checked && (
          <div className={`mt-4 p-3 rounded-xl text-sm ${correct ? 'bg-duo-green/5 text-gray-700' : 'bg-duo-red/5 text-gray-700'}`}>
            <p className="font-bold mb-1">{correct ? '✅ Правильно!' : '❌ Неправильно'}</p>
            <p>{current.explanation}</p>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex gap-3">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={selected.length === 0}
            className="flex-1 py-3 bg-duo-green text-white font-bold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-duo-green/90 transition-colors"
          >
            Проверить
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex-1 py-3 bg-duo-green text-white font-bold rounded-xl hover:bg-duo-green/90 transition-colors"
          >
            {currentIndex < session.length - 1 ? 'Дальше →' : 'Завершить 🏆'}
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="card flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Target size={16} className="text-duo-green" />
          <span className="text-gray-600">Слабые темы:</span>
        </div>
        <div className="flex gap-2">
          {problematicTasks.slice(0, 3).map((t) => (
            <span key={t.taskNumber} className="text-xs bg-duo-red/10 text-duo-red px-2 py-0.5 rounded-full">
              №{t.taskNumber} ({t.accuracy}%)
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
