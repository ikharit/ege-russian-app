import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Volume2, VolumeX, RotateCcw, Settings, ArrowLeft,
  Star, Trophy, Zap, Heart, ChevronRight, BrainCircuit
} from 'lucide-react'
import { allAccentWords, accentWordsById } from '../data/accentWords'
import { useAccentTrainerStore } from '../stores/accentTrainerStore'
import { useProgressStore } from '../stores/progressStore'

type AnswerState = 'idle' | 'correct' | 'wrong'

export function AccentTrainer() {
  const navigate = useNavigate()
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [showSettings, setShowSettings] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [explanation, setExplanation] = useState('')

  const store = useAccentTrainerStore()
  const { currentWordId, getNextWord, answerWord, startSession, resetProgress, updateSettings, settings, getOverallProgress, hardWordsMode } = store

  const mainProgress = useProgressStore(s => s.userStats)
  const addXP = useProgressStore(s => s.addXP)
  const updateStreak = useProgressStore(s => s.updateStreak)
  const recordQuestionAnswered = useProgressStore(s => s.recordQuestionAnswered)

  const currentWord = currentWordId ? accentWordsById[currentWordId] : null
  const overall = getOverallProgress()

  // Initialize session on mount
  useEffect(() => {
    if (!currentWordId) {
      getNextWord()
    }
  }, [])

  const handleLetterClick = useCallback((index: number) => {
    if (answerState !== 'idle' || !currentWord) return

    setSelectedIndex(index)
    const isCorrect = index === currentWord.stressIndex
    setAnswerState(isCorrect ? 'correct' : 'wrong')
    setExplanation(currentWord.explanation)

    answerWord(currentWord.id, isCorrect)
    recordQuestionAnswered()

    if (isCorrect) {
      addXP(5)
      updateStreak()
    }

    // Auto-advance after delay
    setTimeout(() => {
      const next = getNextWord()
      if (next) {
        setAnswerState('idle')
        setSelectedIndex(null)
        setExplanation('')
      } else {
        setShowCompleted(true)
      }
    }, 1500)
  }, [answerState, currentWord, answerWord, getNextWord, addXP, updateStreak, recordQuestionAnswered])

  const handleRestart = () => {
    setShowCompleted(false)
    setAnswerState('idle')
    setSelectedIndex(null)
    setExplanation('')
    startSession(false)
    getNextWord()
  }

  const handleHardWords = () => {
    setShowCompleted(false)
    setAnswerState('idle')
    setSelectedIndex(null)
    setExplanation('')
    startSession(true)
    getNextWord()
  }

  const handleReset = () => {
    if (confirm('Сбросить весь прогресс тренажёра?')) {
      resetProgress()
      setAnswerState('idle')
      setSelectedIndex(null)
      setExplanation('')
      setShowCompleted(false)
      getNextWord()
    }
  }

  // Background color based on state
  const bgColor = settings.changeBackground
    ? answerState === 'correct' ? 'bg-green-50'
      : answerState === 'wrong' ? 'bg-red-50'
      : 'bg-duo-snow'
    : 'bg-duo-snow'

  if (showCompleted) {
    const stats = store.stats
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
              {overall.mastered === overall.total ? 'Все слова изучены!' : 'Сессия завершена!'}
            </h2>
            <p className="text-gray-500 mt-1">
              {overall.mastered === overall.total
                ? 'Поздравляем! Вы освоили все слова.'
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
              <Heart size={20} className="text-red-400 mx-auto" />
              <p className="text-xl font-bold mt-1">{stats.totalWrong}</p>
              <p className="text-xs text-gray-500">Ошибок</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <Star size={20} className="text-duo-purple mx-auto" />
              <p className="text-xl font-bold mt-1">{stats.bestStreak}</p>
              <p className="text-xs text-gray-500">Рекорд</p>
            </div>
          </div>

          {/* Progress */}
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-bold text-gray-700">Прогресс</span>
              <span className="text-duo-green font-bold">{overall.mastered}/{overall.total}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-duo-green h-3 rounded-full transition-all"
                style={{ width: `${(overall.mastered / overall.total) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Изучено: {overall.mastered}</span>
              <span>В процессе: {overall.learning}</span>
              <span>Новые: {overall.newWords}</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleRestart}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Начать заново
            </button>
            {store.getHardWords().length > 0 && (
              <button
                onClick={handleHardWords}
                className="btn-secondary w-full flex items-center justify-center gap-2"
              >
                <BrainCircuit size={18} />
                Сложные слова ({store.getHardWords().length})
              </button>
            )}
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              Вернуться на главную
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (!currentWord) {
    return (
      <div className="min-h-screen bg-duo-snow flex flex-col items-center justify-center p-6">
        <div className="card max-w-md w-full text-center space-y-4">
          <p className="text-gray-500">Загрузка...</p>
        </div>
      </div>
    )
  }

  const letters = currentWord.normalized.split('')
  const progress = store.getProgressForWord(currentWord.id)
  const levelStars = Math.min(progress.level, 5)

  return (
    <div className={`min-h-screen transition-colors duration-500 ${bgColor} flex flex-col`}>
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>

          <div className="flex items-center gap-4">
            {/* Progress mini */}
            <div className="flex items-center gap-1">
              <Star size={14} className="text-duo-yellow fill-current" />
              <span className="text-sm font-bold text-gray-700">{overall.mastered}/{overall.total}</span>
            </div>
            {/* Streak */}
            <div className="flex items-center gap-1">
              <Zap size={14} className="text-orange-500 fill-current" />
              <span className="text-sm font-bold text-orange-500">{store.stats.streak}</span>
            </div>
            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Settings size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="max-w-md mx-auto px-4 pb-2">
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-duo-green h-1.5 rounded-full transition-all"
              style={{ width: `${(overall.mastered / overall.total) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white border-b border-gray-100"
          >
            <div className="max-w-md mx-auto px-4 py-4 space-y-3">
              <h3 className="font-bold text-gray-700 text-sm uppercase">Настройки</h3>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Звук</span>
                <button
                  onClick={() => updateSettings({ sound: !settings.sound })}
                  className="p-2 rounded-lg hover:bg-gray-100"
                >
                  {settings.sound ? <Volume2 size={18} /> : <VolumeX size={18} />}
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Изменение фона</span>
                <button
                  onClick={() => updateSettings({ changeBackground: !settings.changeBackground })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.changeBackground ? 'bg-duo-green' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.changeBackground ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Показывать пояснение</span>
                <button
                  onClick={() => updateSettings({ showExplanation: !settings.showExplanation })}
                  className={`w-12 h-6 rounded-full transition-colors ${settings.showExplanation ? 'bg-duo-green' : 'bg-gray-300'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.showExplanation ? 'translate-x-6' : 'translate-x-0.5'}`} />
                </button>
              </div>
              <button
                onClick={handleReset}
                className="text-red-400 text-sm hover:text-red-600 transition-colors"
              >
                Сбросить прогресс
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 max-w-md mx-auto w-full">
        {/* Mode badge */}
        {hardWordsMode && (
          <div className="mb-4 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold uppercase tracking-wide">
            Режим сложных слов
          </div>
        )}

        {/* Word level indicator */}
        <div className="mb-4 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < levelStars ? 'text-duo-yellow fill-current' : 'text-gray-200'}
            />
          ))}
        </div>

        {/* The word */}
        <div className="mb-8">
          <p className="text-center text-gray-400 text-sm mb-4 uppercase tracking-wide">
            Выберите ударную букву
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {letters.map((letter, index) => {
              const isSelected = selectedIndex === index
              const isCorrect = answerState === 'correct' && index === currentWord.stressIndex
              const isWrong = answerState === 'wrong' && isSelected && index !== currentWord.stressIndex
              const showCorrect = answerState === 'wrong' && index === currentWord.stressIndex

              let btnClass = 'bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
              if (isCorrect || showCorrect) {
                btnClass = 'bg-duo-green text-white border-2 border-duo-green'
              } else if (isWrong) {
                btnClass = 'bg-red-400 text-white border-2 border-red-400'
              } else if (isSelected) {
                btnClass = 'bg-duo-blue text-white border-2 border-duo-blue'
              }

              return (
                <motion.button
                  key={index}
                  whileHover={answerState === 'idle' ? { scale: 1.08 } : {}}
                  whileTap={answerState === 'idle' ? { scale: 0.95 } : {}}
                  onClick={() => handleLetterClick(index)}
                  disabled={answerState !== 'idle'}
                  className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl font-bold text-xl sm:text-2xl flex items-center justify-center transition-all shadow-sm ${btnClass}`}
                >
                  {letter.toUpperCase()}
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* Explanation */}
        <AnimatePresence>
          {answerState !== 'idle' && settings.showExplanation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`w-full rounded-xl p-4 mb-4 ${answerState === 'correct' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              <p className="font-bold text-sm">
                {answerState === 'correct' ? '✓ Правильно!' : '✗ Неправильно'}
              </p>
              <p className="text-sm mt-1">{explanation}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Next button (shown briefly after answer) */}
        <AnimatePresence>
          {answerState !== 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="w-full"
            >
              <button
                onClick={() => {
                  const next = getNextWord()
                  if (next) {
                    setAnswerState('idle')
                    setSelectedIndex(null)
                    setExplanation('')
                  } else {
                    setShowCompleted(true)
                  }
                }}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                Дальше <ChevronRight size={18} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Hard words quick access */}
        {!hardWordsMode && store.getHardWords().length > 0 && answerState === 'idle' && (
          <button
            onClick={handleHardWords}
            className="mt-6 text-sm text-red-400 hover:text-red-600 flex items-center gap-1 transition-colors"
          >
            <BrainCircuit size={14} />
            Сложные слова: {store.getHardWords().length}
          </button>
        )}
      </div>

      {/* Footer stats */}
      <div className="bg-white border-t border-gray-100 py-3">
        <div className="max-w-md mx-auto px-4 flex justify-around text-center">
          <div>
            <p className="text-xs text-gray-400">Правильно</p>
            <p className="text-sm font-bold text-duo-green">{store.stats.totalCorrect}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Ошибки</p>
            <p className="text-sm font-bold text-red-400">{store.stats.totalWrong}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Изучено</p>
            <p className="text-sm font-bold text-duo-yellow">{overall.mastered}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400">Серия</p>
            <p className="text-sm font-bold text-orange-500">{store.stats.streak}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
