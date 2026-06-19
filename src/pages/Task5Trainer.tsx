// ⚠️ AGENT NOTICE: All wrong answers go to progressStore.wrongAnswers (unified bank)
// Do NOT add local error storage. Use: recordWrongAnswer() + updateTaskStats('5', false)
// See AGENTS.md / memory/agent-registry.md for context
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Trophy, Zap, ArrowLeft, RotateCcw, Settings,
  ChevronRight, Check, X, Volume2, VolumeX
} from 'lucide-react'
import { task5QuestionsById } from '../data/task5Questions'
import { useTask5Store } from '../stores/task5Store'
import { useProgressStore } from '../stores/progressStore'

type AnswerState = 'idle' | 'answered'

const QUESTIONS_PER_STAGE = 4

function getStageQuestions(stage: number) {
  const start = stage * QUESTIONS_PER_STAGE
  const end = start + QUESTIONS_PER_STAGE
  return Object.values(task5QuestionsById).slice(start, end)
}

export function Task5Trainer() {
  const navigate = useNavigate()
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [selectedSentence, setSelectedSentence] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [questionId, setQuestionId] = useState<string | null>(null)

  const currentQuestionId = useTask5Store((s) => s.currentQuestionId)
  const stats = useTask5Store((s) => s.stats)
  const settings = useTask5Store((s) => s.settings)
  const questionProgress = useTask5Store((s) => s.questionProgress)
  const hasAnswered = useTask5Store((s) => s.hasAnswered)
  const storeSelectedSentence = useTask5Store((s) => s.selectedSentence)

  const addXP = useProgressStore((s) => s.addXP)
  const updateStreak = useProgressStore((s) => s.updateStreak)
  const recordQuestionAnswered = useProgressStore((s) => s.recordQuestionAnswered)
  const recordWrongAnswer = useProgressStore((s) => s.recordWrongAnswer)
  const updateTaskStats = useProgressStore((s) => s.updateTaskStats)

  const currentQuestion = currentQuestionId ? task5QuestionsById[currentQuestionId] : null
  const overall = useTask5Store.getState().getOverallProgress()
  const currentStage = stats.currentStage ?? 0

  useEffect(() => {
    const store = useTask5Store.getState()
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
    setSelectedSentence(storeSelectedSentence)
  }, [currentQuestionId, hasAnswered, storeSelectedSentence])

  const handleSentenceSelect = (sentenceId: number) => {
    if (answerState !== 'idle') return
    setSelectedSentence(sentenceId)
  }

  const handleCheck = () => {
    if (!currentQuestion || selectedSentence === null) return

    const store = useTask5Store.getState()
    const result = store.answerQuestion(currentQuestion.id, selectedSentence)
    setIsCorrect(result.correct)
    setAnswerState('answered')
    recordQuestionAnswered()

    if (result.correct) {
      addXP(5)
      updateStreak()
    } else {
      const selected = currentQuestion.sentences[selectedSentence]
      const correct = currentQuestion.sentences[currentQuestion.correctAnswer - 1]
      recordWrongAnswer(
        {
          id: currentQuestion.id,
          text: currentQuestion.sentences.map(s => s.text).join(' / '),
          options: currentQuestion.sentences.map(s => s.text),
          correctAnswer: [correct.text],
          explanation: currentQuestion.explanation,
          atoms: ['task5'],
        },
        [selected.text],
      )
      updateTaskStats('5', false)
    }
  }

  const handleNext = () => {
    const store = useTask5Store.getState()
    const next = store.getNextQuestion()
    if (next) {
      setAnswerState('idle')
      setSelectedSentence(null)
      setIsCorrect(false)
      setQuestionId(next.id)
      store.clearAnswer()
    } else {
      setShowCompleted(true)
    }
  }

  const handleRestart = () => {
    const store = useTask5Store.getState()
    setShowCompleted(false)
    setAnswerState('idle')
    setSelectedSentence(null)
    setIsCorrect(false)
    store.startSession()
  }

  const handleReset = () => {
    if (confirm('Сбросить весь прогресс тренажёра?')) {
      const store = useTask5Store.getState()
      store.resetProgress()
      setAnswerState('idle')
      setSelectedSentence(null)
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
    ? Math.floor(Object.values(task5QuestionsById).findIndex(q => q.id === currentQuestion.id) / QUESTIONS_PER_STAGE)
    : -1
  const isLeakingQuestion = currentQuestion && wordStage !== currentStage && wordStage >= 0

  // Render sentence text with highlighted word in bold
  const renderSentenceText = (text: string) => {
    const parts = text.split(/\*\*(.+?)\*\*/g)
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="text-gray-900">{part}</strong>
      }
      return <span key={i}>{part}</span>
    })
  }

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
                ? 'Поздравляем! Ты готов к заданию №5 ЕГЭ.'
                : 'Отличная работа! Продолжай тренироваться.'}
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
                  <button onClick={() => useTask5Store.getState().updateSettings({ sound: !settings.sound })} className="p-2 rounded-lg hover:bg-gray-100">
                    {settings.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Показывать объяснение</span>
                  <button
                    onClick={() => useTask5Store.getState().updateSettings({ showExplanation: !settings.showExplanation })}
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
      <div className="flex-1 flex flex-col items-center p-4 max-w-2xl mx-auto w-full">
        {/* Status badge */}
        <div className="flex flex-col items-center gap-2 mb-4">
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
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-4 w-full">
          <p className="text-gray-700 text-sm leading-relaxed">
            В одном из приведённых ниже предложений <strong>неверно</strong> употреблено выделенное слово. Найдите это предложение.
          </p>
        </div>

        {/* Sentences */}
        <div className="w-full space-y-2 mb-4">
          {currentQuestion.sentences.map((sentence) => {
            const isSelected = selectedSentence === sentence.id
            const isErrorSentence = sentence.isError
            const showCorrect = answerState === 'answered' && isErrorSentence
            const showWrong = answerState === 'answered' && isSelected && !isErrorSentence
            const showMissed = answerState === 'answered' && !isSelected && isErrorSentence
            const showCorrectChoice = answerState === 'answered' && isSelected && isErrorSentence

            return (
              <motion.button
                key={sentence.id}
                onClick={() => handleSentenceSelect(sentence.id)}
                disabled={answerState !== 'idle'}
                whileHover={answerState === 'idle' ? { scale: 1.01 } : {}}
                whileTap={answerState === 'idle' ? { scale: 0.99 } : {}}
                className={`w-full bg-white rounded-xl p-4 shadow-sm border-2 transition-all text-left ${
                  showCorrect || showCorrectChoice
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
                      showCorrect || showCorrectChoice || showMissed
                        ? 'bg-green-400 text-white'
                        : showWrong
                        ? 'bg-red-400 text-white'
                        : isSelected
                        ? 'bg-duo-blue text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {showCorrect || showMissed || showCorrectChoice ? <Check size={16} /> : showWrong ? <X size={16} /> : String.fromCharCode(64 + sentence.id)}
                  </div>
                  <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                    {renderSentenceText(sentence.text)}
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
              {isCorrect
                ? `Верно! Ошибка в предложении ${String.fromCharCode(64 + currentQuestion.correctAnswer)}.`
                : `Правильный ответ: предложение ${String.fromCharCode(64 + currentQuestion.correctAnswer)}.`}
            </p>
            {settings.showExplanation && (
              <p className="text-sm text-gray-500 mt-2">{currentQuestion.explanation}</p>
            )}
          </motion.div>
        )}

        {/* Action button */}
        <div className="w-full max-w-md">
          {answerState === 'idle' ? (
            <button
              onClick={handleCheck}
              disabled={selectedSentence === null}
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
