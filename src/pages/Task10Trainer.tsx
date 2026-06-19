import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Zap, ArrowLeft, RotateCcw, Settings,
  ChevronRight, Check, X, Volume2, VolumeX
} from 'lucide-react'
import { task10QuestionsById } from '../data/task10Questions'
import { useTask10Store } from '../stores/task10Store'
import { useProgressStore } from '../stores/progressStore'

type AnswerState = 'idle' | 'answered'

const QUESTIONS_PER_STAGE = 4

function getStageQuestions(stage: number) {
  const start = stage * QUESTIONS_PER_STAGE
  const end = start + QUESTIONS_PER_STAGE
  return Object.values(task10QuestionsById).slice(start, end)
}

export function Task10Trainer() {
  const navigate = useNavigate()
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [questionId, setQuestionId] = useState<string | null>(null)

  const currentQuestionId = useTask10Store((s) => s.currentQuestionId)
  const stats = useTask10Store((s) => s.stats)
  const settings = useTask10Store((s) => s.settings)
  const questionProgress = useTask10Store((s) => s.questionProgress)
  const hasAnswered = useTask10Store((s) => s.hasAnswered)
  const storeSelectedRows = useTask10Store((s) => s.selectedRows)

  const addXP = useProgressStore((s) => s.addXP)
  const updateStreak = useProgressStore((s) => s.updateStreak)
  const recordQuestionAnswered = useProgressStore((s) => s.recordQuestionAnswered)
  const recordWrongAnswer = useProgressStore((s) => s.recordWrongAnswer)
  const updateTaskStats = useProgressStore((s) => s.updateTaskStats)

  const currentQuestion = currentQuestionId ? task10QuestionsById[currentQuestionId] : null
  const overall = useTask10Store.getState().getOverallProgress()
  const currentStage = stats.currentStage ?? 0

  useEffect(() => {
    const store = useTask10Store.getState()
    const overall = store.getOverallProgress()
    if (overall.passed === overall.total) {
      setShowCompleted(true)
      return
    }
    if (!store.currentQuestionId) {
      store.startSession()
    }
  }, [])

  useEffect(() => {
    setQuestionId(currentQuestionId)
    setAnswerState(hasAnswered ? 'answered' : 'idle')
    setSelectedRows(storeSelectedRows)
  }, [currentQuestionId, hasAnswered, storeSelectedRows])

  const handleRowToggle = (rowId: number) => {
    if (answerState !== 'idle') return
    setSelectedRows(prev =>
      prev.includes(rowId) ? prev.filter(r => r !== rowId) : [...prev, rowId]
    )
  }

  const handleCheck = () => {
    if (!currentQuestion || selectedRows.length === 0) return

    const store = useTask10Store.getState()
    const result = store.answerQuestion(currentQuestion.id, selectedRows)
    setIsCorrect(result.correct)
    setAnswerState('answered')
    recordQuestionAnswered()

    if (result.correct) {
      addXP(5)
      updateStreak()
    } else {
      recordWrongAnswer(
        {
          id: currentQuestion.id,
          text: currentQuestion.rows.map(r => r.words.join(', ')).join(' / '),
          options: currentQuestion.rows.map(r => r.words.join(', ')),
          correctAnswer: currentQuestion.correctAnswers.map(id => 'ряд ' + id),
          explanation: currentQuestion.explanation,
          atoms: ['task10'],
        },
        selectedRows.map(id => 'ряд ' + id),
      )
      updateTaskStats('10', false)
    }
  }

  const handleNext = () => {
    const store = useTask10Store.getState()
    const next = store.getNextQuestion()
    if (next) {
      setAnswerState('idle')
      setSelectedRows([])
      setIsCorrect(false)
      setQuestionId(next.id)
      store.clearAnswer()
    } else {
      setShowCompleted(true)
    }
  }

  const handleRestart = () => {
    const store = useTask10Store.getState()
    setShowCompleted(false)
    setAnswerState('idle')
    setSelectedRows([])
    setIsCorrect(false)
    store.startSession()
  }

  const handleReset = () => {
    if (confirm('Сбросить весь прогресс тренажёра?')) {
      const store = useTask10Store.getState()
      store.resetProgress()
      setAnswerState('idle')
      setSelectedRows([])
      setIsCorrect(false)
      setShowCompleted(false)
      store.startSession()
    }
  }

  const bgColor = answerState === 'answered'
    ? isCorrect ? 'bg-green-50' : 'bg-red-50'
    : 'bg-duo-snow'

  const stageQuestions = getStageQuestions(currentStage)
  const stageQuestionIds = stageQuestions.map(q => q.id)
  const stagePassed = stageQuestionIds.filter(
    id => (questionProgress[id]?.status || 'new') === 'passed'
  ).length
  const stageTotal = stageQuestions.length

  const wordStage = currentQuestion
    ? Math.floor(Object.values(task10QuestionsById).findIndex(q => q.id === currentQuestion.id) / QUESTIONS_PER_STAGE)
    : -1
  const isLeakingQuestion = currentQuestion && wordStage !== currentStage && wordStage >= 0

  if (showCompleted) {
    return (
      <div className="min-h-screen bg-duo-snow flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card max-w-md w-full text-center space-y-6"
        >
          <div className="w-20 h-20 bg-duo-green rounded-full flex items-center justify-center mx-auto">
            <Trophy size={40} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {overall.passed === overall.total ? 'Все задания пройдены!' : 'Сессия завершена!'}
            </h2>
            <p className="text-gray-500 mt-1">
              {overall.passed === overall.total
                ? 'Поздравляем! Ты готов к заданию №10 ЕГЭ.'
                : 'Отличная работа! Продолжайте тренироваться.'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <Zap size={20} className="text-duo-yellow mx-auto" />
              <p className="text-xl font-bold mt-1">{stats.totalCorrect}</p>
              <p className="text-xs text-gray-500">Правильно</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <X size={20} className="text-red-400 mx-auto" />
              <p className="text-xl font-bold mt-1">{stats.totalWrong}</p>
              <p className="text-xs text-gray-500">Ошибки</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <Zap size={20} className="text-duo-purple mx-auto" />
              <p className="text-xl font-bold mt-1">{stats.bestStreak}</p>
              <p className="text-xs text-gray-500">Рекорд</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-gray-700">Прогресс</span>
              <span className="text-duo-green font-bold">{overall.passed}/{overall.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-duo-green h-3 rounded-full transition-all"
                style={{ width: `${(overall.passed / overall.total) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button onClick={handleRestart} className="btn-primary w-full flex items-center justify-center gap-2">
              <RotateCcw size={18} />
              Начать заново
            </button>
            <button onClick={() => navigate('/')} className="text-gray-400 hover:text-gray-600 text-sm">
              Вернуться на главную
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-duo-snow flex flex-col items-center justify-center p-6">
        <div className="card max-w-md w-full text-center space-y-4">
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-500 ${bgColor} flex flex-col`}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-duo-purple">Ур. {currentStage + 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gray-700">{overall.passed}/{overall.total}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-orange-500 fill-current" />
              <span className="text-sm font-bold text-orange-500">{stats.streak}</span>
            </div>
            <button onClick={() => setShowSettings(!showSettings)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 pb-2">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Уровень {currentStage + 1}</span>
            <span>{stagePassed}/{stageTotal}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-duo-green h-1.5 rounded-full transition-all"
              style={{ width: `${stageTotal > 0 ? (stagePassed / stageTotal) * 100 : 0}%` }}
            />
          </div>
        </div>
      </div>

      {/* Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="bg-white border-b border-gray-100">
              <div className="max-w-2xl mx-auto px-4 py-4 space-y-3">
                <h3 className="font-bold text-gray-700 text-sm uppercase">Настройки</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Звук</span>
                  <button onClick={() => useTask10Store.getState().updateSettings({ sound: !settings.sound })} className="p-2 rounded-lg hover:bg-gray-100">
                    {settings.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Показывать объяснение</span>
                  <button
                    onClick={() => useTask10Store.getState().updateSettings({ showExplanation: !settings.showExplanation })}
                    className={`w-12 h-6 rounded-full transition-colors ${settings.showExplanation ? 'bg-duo-green' : 'bg-gray-300'}`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.showExplanation ? 'translate-x-6' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                <button onClick={handleReset} className="text-red-400 text-sm hover:text-red-600 transition-colors">
                  Сбросить прогресс
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full">
        {/* Stars + leaking badge */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="flex items-center gap-1">
            {currentQuestion && (
              <span className={`text-xs px-2 py-1 rounded-full ${(questionProgress[currentQuestion.id]?.status || 'new') === 'passed' ? 'bg-green-100 text-green-600' : (questionProgress[currentQuestion.id]?.status || 'new') === 'deferred' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
                {(questionProgress[currentQuestion.id]?.status || 'new') === 'passed' ? 'Пройдено' : (questionProgress[currentQuestion.id]?.status || 'new') === 'deferred' ? 'Повторение' : 'Новое'}
              </span>
            )}
          </div>
          {isLeakingQuestion && (
            <span className="text-xs bg-duo-yellow/20 text-duo-yellow-dark px-2 py-1 rounded-full">
              Повторение из уровня {wordStage + 1}
            </span>
          )}
        </div>

        {/* Question prompt */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-6 w-full">
          <p className="text-gray-700 text-sm leading-relaxed">
            Укажите варианты ответов, в которых <strong>во всех словах одного ряда</strong> пропущена <strong>одна и та же буква</strong>. Запишите номера ответов.
          </p>
        </div>

        {/* Rows */}
        <div className="w-full space-y-3 mb-6">
          {currentQuestion.rows.map((row) => {
            const isSelected = selectedRows.includes(row.id)
            const isCorrectRow = currentQuestion.correctAnswers.includes(row.id)
            const showCorrect = answerState === 'answered' && isCorrectRow
            const showWrong = answerState === 'answered' && isSelected && !isCorrectRow
            const showMissed = answerState === 'answered' && !isSelected && isCorrectRow

            return (
              <motion.button
                key={row.id}
                onClick={() => handleRowToggle(row.id)}
                disabled={answerState !== 'idle'}
                whileHover={answerState === 'idle' ? { scale: 1.01 } : {}}
                whileTap={answerState === 'idle' ? { scale: 0.99 } : {}}
                className={`w-full bg-white rounded-2xl p-4 shadow-sm border-2 transition-all text-left ${
                  showCorrect
                    ? 'border-green-400 bg-green-50'
                    : showWrong
                    ? 'border-red-400 bg-red-50'
                    : showMissed
                    ? 'border-green-300 bg-green-50/50'
                    : isSelected
                    ? 'border-duo-blue bg-blue-50'
                    : 'border-transparent hover:border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                      showCorrect
                        ? 'bg-green-400 text-white'
                        : showWrong
                        ? 'bg-red-400 text-white'
                        : showMissed
                        ? 'bg-green-200 text-green-700'
                        : isSelected
                        ? 'bg-duo-blue text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {showCorrect || showMissed ? <Check size={16} /> : showWrong ? <X size={16} /> : row.id}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {row.words.map((word, idx) => (
                        <span key={idx} className="text-lg text-gray-800">
                          {word.split('___').map((part, pIdx) => (
                            <span key={pIdx}>
                              {part}
                              {pIdx < word.split('___').length - 1 && (
                                <span className="text-gray-400 mx-0.5">___</span>
                              )}
                            </span>
                          ))}
                        </span>
                      ))}
                    </div>
                    {answerState === 'answered' && settings.showExplanation && (
                      <p className={`text-xs mt-2 ${showCorrect || showMissed ? 'text-green-600' : showWrong ? 'text-red-500' : 'text-gray-400'}`}>
                        {row.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </motion.button>
            )
          })}
        </div>

        {/* Answer feedback */}
        {answerState === 'answered' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full rounded-2xl p-4 mb-4 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
          >
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <Check size={20} className="text-green-600" />
                  <span className="font-bold text-green-700">Правильно!</span>
                </>
              ) : (
                <>
                  <X size={20} className="text-red-600" />
                  <span className="font-bold text-red-700">Неправильно</span>
                </>
              )}
            </div>
            <p className="text-sm text-gray-600">
              Правильные ответы: <strong>{currentQuestion.correctAnswers.join(', ')}</strong>
            </p>
            {settings.showExplanation && (
              <p className="text-sm text-gray-500 mt-1">{currentQuestion.explanation}</p>
            )}
          </motion.div>
        )}

        {/* Action button */}
        <div className="w-full max-w-md">
          {answerState === 'idle' ? (
            <button
              onClick={handleCheck}
              disabled={selectedRows.length === 0}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Проверить
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary w-full flex items-center justify-center gap-2">
              Дальше <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Footer stats */}
      <div className="bg-white border-t border-gray-100 py-3">
        <div className="max-w-2xl mx-auto px-4 flex justify-center gap-8 text-sm">
          <div className="text-center">
            <p className="text-gray-400 text-xs">Правильно</p>
            <p className="font-bold text-green-500">{stats.totalCorrect}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Ошибки</p>
            <p className="font-bold text-red-400">{stats.totalWrong}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Пройдено</p>
            <p className="font-bold text-duo-yellow">{overall.passed}</p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs">Серия</p>
            <p className="font-bold text-orange-500">{stats.streak}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
