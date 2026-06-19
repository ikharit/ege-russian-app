import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, Check, X, Zap, Clock, Trophy, RotateCcw, Pause, Play } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { playCorrectSound, playWrongSound, playLessonCompleteSound } from '../lib/sounds'

export function MarathonPage() {
  const navigate = useNavigate()
  const addXP = useProgressStore((s) => s.addXP)
  const updateStreak = useProgressStore((s) => s.updateStreak)
  const recordWrongAnswer = useProgressStore((s) => s.recordWrongAnswer)
  const updateTaskStats = useProgressStore((s) => s.updateTaskStats)
  const recordQuestionAnswered = useProgressStore((s) => s.recordQuestionAnswered)
  const checkAchievements = useProgressStore((s) => s.checkAchievements)

  const QUESTION_COUNT = 20

  const questions = useMemo(() => {
    const all = course.sections.flatMap(s => s.lessons.flatMap(l => l.questions))
    const shuffled = [...all].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, QUESTION_COUNT).map(q => ({
      ...q,
      options: q.options ? [...q.options].sort(() => Math.random() - 0.5) : undefined,
    }))
  }, [])

  const [currentIdx, setCurrentIdx] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [isChecked, setIsChecked] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [answers, setAnswers] = useState<{ correct: boolean; timeMs: number }[]>([])
  const [startTime, setStartTime] = useState(Date.now())
  const [elapsedMs, setElapsedMs] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isFinished, setIsFinished] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      if (!isPaused && !isFinished) {
        setElapsedMs(Date.now() - startTime)
      }
    }, 100)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isPaused, isFinished, startTime])

  const current = questions[currentIdx]

  const handleSelect = useCallback((option: string) => {
    if (isChecked || isPaused) return
    if (current.type === 'single') {
      setSelected([option])
    } else {
      setSelected(prev => prev.includes(option) ? prev.filter(o => o !== option) : [...prev, option])
    }
  }, [isChecked, isPaused, current])

  const handleCheck = useCallback(() => {
    if (selected.length === 0 || isChecked) return
    const timeMs = Date.now() - startTime
    const correct = current.type === 'single'
      ? selected[0] === current.correctAnswer[0]
      : selected.length === current.correctAnswer.length && selected.every(s => current.correctAnswer.includes(s))
    setIsCorrect(correct)
    setIsChecked(true)
    recordQuestionAnswered()

    if (correct) {
      setCorrectCount(prev => prev + 1)
      playCorrectSound()
      const taskNumber = current.atoms?.find(a => a.startsWith('task'))?.replace('task', '') || '1'
      updateTaskStats(taskNumber, true)
    } else {
      playWrongSound()
      const taskNumber = current.atoms?.find(a => a.startsWith('task'))?.replace('task', '') || '1'
      updateTaskStats(taskNumber, false)
      recordWrongAnswer({
        id: current.id,
        text: current.text,
        options: current.options,
        correctAnswer: current.correctAnswer,
        explanation: current.explanation,
        atoms: current.atoms,
      }, selected)
    }
    setAnswers(prev => [...prev, { correct, timeMs }])
  }, [selected, isChecked, current, startTime, recordQuestionAnswered, updateTaskStats, recordWrongAnswer])

  const handleNext = useCallback(() => {
    if (currentIdx >= questions.length - 1) {
      // Finish
      const totalCorrect = answers.filter(a => a.correct).length + (isCorrect ? 1 : 0)
      const totalTime = elapsedMs + (Date.now() - startTime)
      const xp = totalCorrect * 10 + Math.max(0, Math.round((questions.length - totalTime / 60000) * 5))
      addXP(Math.max(xp, totalCorrect * 10))
      updateStreak()
      checkAchievements()
      setIsFinished(true)
      playLessonCompleteSound()
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    setCurrentIdx(prev => prev + 1)
    setSelected([])
    setIsChecked(false)
    setIsCorrect(false)
    setStartTime(Date.now())
  }, [currentIdx, questions.length, answers, isCorrect, elapsedMs, startTime, addXP, updateStreak, checkAchievements])

  const formatTime = (ms: number) => {
    const s = Math.floor(ms / 1000)
    const m = Math.floor(s / 60)
    return `${m}:${String(s % 60).padStart(2, '0')}`
  }

  if (isFinished) {
    const totalCorrect = answers.filter(a => a.correct).length
    const accuracy = Math.round((totalCorrect / questions.length) * 100)
    const avgTime = answers.length > 0 ? Math.round(answers.reduce((s, a) => s + a.timeMs, 0) / answers.length / 1000) : 0

    return (
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🏁</div>
          <h1 className="text-2xl font-bold text-gray-800">Марафон завершён!</h1>
          <p className="text-gray-500">20 вопросов, без остановки</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card bg-green-50 text-center">
            <p className="text-3xl font-bold text-green-600">{totalCorrect}/{questions.length}</p>
            <p className="text-xs text-gray-500">Правильно</p>
          </div>
          <div className="card bg-blue-50 text-center">
            <p className="text-3xl font-bold text-blue-600">{accuracy}%</p>
            <p className="text-xs text-gray-500">Точность</p>
          </div>
          <div className="card bg-amber-50 text-center">
            <p className="text-3xl font-bold text-amber-600">{formatTime(elapsedMs)}</p>
            <p className="text-xs text-gray-500">Время</p>
          </div>
          <div className="card bg-purple-50 text-center">
            <p className="text-3xl font-bold text-purple-600">{avgTime}s</p>
            <p className="text-xs text-gray-500">Среднее/вопрос</p>
          </div>
        </div>

        <div className="card">
          <h3 className="font-bold text-gray-700 mb-3">📊 Разбор</h3>
          <div className="flex flex-col gap-2">
            {questions.map((q, idx) => {
              const ans = answers[idx]
              return (
                <div key={q.id} className={`flex items-center gap-3 p-2 rounded-lg ${ans?.correct ? 'bg-green-50' : 'bg-red-50'}`}>
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${ans?.correct ? 'bg-green-500' : 'bg-red-500'}`}>
                    {ans?.correct ? '✓' : '✗'}
                  </span>
                  <span className="text-sm text-gray-700 flex-1 truncate">{q.text}</span>
                  <span className="text-xs text-gray-400">Задание {q.atoms?.find(a => a.startsWith('task'))?.replace('task', '') || '1'}</span>
                </div>
              )
            })}
          </div>
        </div>

        <button onClick={() => navigate('/')} className="btn-primary">
          <Trophy size={18} className="inline mr-2" />
          На главную
        </button>
      </div>
    )
  }

  if (!current) return null

  const taskNumber = current.atoms?.find(a => a.startsWith('task'))?.replace('task', '') || '1'

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-gray-700">{currentIdx + 1}/{questions.length}</span>
          <button onClick={() => setIsPaused(!isPaused)} className="p-2 hover:bg-gray-100 rounded-lg">
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock size={16} />
          <span className="font-mono">{formatTime(elapsedMs)}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-duo-green h-2 rounded-full transition-all" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }} />
      </div>

      {isPaused ? (
        <div className="card text-center py-12">
          <Pause size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 mb-2">Пауза</h3>
          <p className="text-gray-500 text-sm">Нажмите ▶, чтобы продолжить</p>
          <button onClick={() => setIsPaused(false)} className="btn-primary mt-4">
            <Play size={18} className="inline mr-2" /> Продолжить
          </button>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Задание {taskNumber}</span>
            <span className="text-xs text-duo-green font-bold">{correctCount} ✓</span>
          </div>

          <h2 className="text-xl font-bold text-gray-800">{current.text}</h2>

          {current.options && (
            <div className="flex flex-col gap-2">
              {current.options.map((option) => {
                const isSelected = selected.includes(option)
                const isCorrectOption = current.correctAnswer.includes(option)
                let btnClass = 'border-2 rounded-xl p-4 text-left font-medium transition-all '

                if (!isChecked) {
                  btnClass += isSelected ? 'border-duo-blue bg-blue-50 text-duo-blue' : 'border-gray-200 bg-white hover:bg-gray-50'
                } else {
                  if (isCorrectOption) btnClass += 'border-duo-green bg-green-50 text-duo-green'
                  else if (isSelected && !isCorrectOption) btnClass += 'border-duo-red bg-red-50 text-duo-red'
                  else btnClass += 'border-gray-200 bg-white opacity-60'
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
                      {isChecked && isCorrectOption && <Check size={20} className="text-duo-green" />}
                      {isChecked && isSelected && !isCorrectOption && <X size={20} className="text-duo-red" />}
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          <AnimatePresence>
            {isChecked && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {isCorrect ? (
                    <><Zap size={16} className="text-green-600" /><span className="font-bold text-green-700 text-sm">Правильно!</span></>
                  ) : (
                    <><X size={16} className="text-red-600" /><span className="font-bold text-red-700 text-sm">Неправильно</span></>
                  )}
                </div>
                <p className="text-sm text-gray-600">{current.explanation}</p>
                <p className="text-xs text-gray-500 mt-1">Правильный ответ: {current.correctAnswer.join(', ')}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={isChecked ? handleNext : handleCheck}
            disabled={selected.length === 0}
            className={`btn-primary w-full ${isChecked ? (isCorrect ? '' : 'bg-duo-red shadow-[0_4px_0_#d32f2f]') : ''}`}
          >
            {isChecked ? (currentIdx === questions.length - 1 ? 'Завершить марафон ➜' : 'Далее ➜') : 'Проверить'}
          </button>
        </>
      )}
    </div>
  )
}
