import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, RotateCcw, Zap, Brain, TrendingUp, Flame } from 'lucide-react'
import { useFlashcardStore } from '../stores/flashcardStore'
import type { Flashcard } from '../stores/flashcardStore'

export function FlashcardsPage() {
  const navigate = useNavigate()
  const dueCards = useFlashcardStore((s) => s.getDueCards(20))
  const stats = useFlashcardStore((s) => s.getStats())
  const streak = useFlashcardStore((s) => s.streak)
  const reviewCard = useFlashcardStore((s) => s.reviewCard)
  const resetProgress = useFlashcardStore((s) => s.resetProgress)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showResult, setShowResult] = useState(false)
  const [sessionStats, setSessionStats] = useState({ correct: 0, total: 0 })
  const [finished, setFinished] = useState(false)

  const currentCard: Flashcard | undefined = dueCards[currentIndex]

  const handleFlip = useCallback(() => {
    if (!isFlipped) setIsFlipped(true)
  }, [isFlipped])

  const handleAnswer = useCallback((quality: 0 | 1 | 2 | 3 | 4 | 5) => {
    if (!currentCard) return
    reviewCard(currentCard.id, quality)
    setSessionStats((prev) => ({
      correct: prev.correct + (quality >= 3 ? 1 : 0),
      total: prev.total + 1,
    }))

    if (currentIndex + 1 >= dueCards.length) {
      setFinished(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false)
      setShowResult(false)
    }
  }, [currentCard, currentIndex, dueCards.length, reviewCard])

  const handleRestart = useCallback(() => {
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowResult(false)
    setSessionStats({ correct: 0, total: 0 })
    setFinished(false)
  }, [])

  if (finished) {
    const accuracy = sessionStats.total > 0 ? Math.round((sessionStats.correct / sessionStats.total) * 100) : 0
    return (
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col items-center gap-6 min-h-[80vh]">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-duo-green flex items-center justify-center mx-auto mb-4">
            <Brain size={40} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Сессия завершена!</h1>
          <p className="text-gray-500 mt-2">
            {sessionStats.correct} / {sessionStats.total} правильно ({accuracy}%)
          </p>
        </motion.div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <div className="card text-center p-4">
            <p className="text-2xl font-bold text-duo-green">{stats.studiedToday}</p>
            <p className="text-xs text-gray-500">Сегодня изучено</p>
          </div>
          <div className="card text-center p-4">
            <p className="text-2xl font-bold text-orange-500">{streak}</p>
            <p className="text-xs text-gray-500">Дней подряд</p>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button
            onClick={handleRestart}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Ещё раз
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex-1"
          >
            На главную
          </button>
        </div>
      </div>
    )
  }

  if (!currentCard) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col items-center gap-6 min-h-[80vh]">
        <Brain size={48} className="text-gray-300" />
        <h1 className="text-xl font-bold text-gray-800">Все карточки на сегодня изучены!</h1>
        <p className="text-gray-500 text-center">
          Новые карточки появятся завтра. Можешь повторить пройденные.
        </p>
        <div className="flex gap-3 w-full">
          <button onClick={resetProgress} className="btn-secondary flex-1">
            Сбросить прогресс
          </button>
          <button onClick={() => navigate('/')} className="btn-primary flex-1">
            На главную
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-4 flex flex-col gap-4 min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Zap size={16} className="text-duo-yellow" />
          <span>{currentIndex + 1} / {dueCards.length}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Flame size={16} className="text-orange-500" />
          <span>{streak}</span>
        </div>
      </div>

      {/* Stats bar */}
      <div className="flex gap-2 text-xs text-gray-400">
        <span className="bg-gray-100 px-2 py-1 rounded-lg">Новых: {stats.new}</span>
        <span className="bg-gray-100 px-2 py-1 rounded-lg">Повтор: {stats.due}</span>
        <span className="bg-gray-100 px-2 py-1 rounded-lg">Всего: {stats.total}</span>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center" style={{ perspective: 1000 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentCard.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full relative cursor-pointer"
            onClick={handleFlip}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <motion.div
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="relative w-full"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front */}
              <div
                className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 min-h-[240px] flex flex-col items-center justify-center gap-4"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <span className="text-xs text-gray-400 uppercase tracking-wide">Задание {currentCard.taskNumber}</span>
                <p className="text-lg text-gray-700 text-center leading-relaxed">{currentCard.front}</p>
                <p className="text-xs text-gray-400">Нажми, чтобы перевернуть</p>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 bg-duo-green rounded-2xl shadow-lg p-8 flex flex-col items-center justify-center gap-3"
                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <span className="text-xs text-white/70 uppercase tracking-wide">Правильный ответ</span>
                <p className="text-2xl font-bold text-white text-center">{currentCard.back}</p>
                {currentCard.explanation && (
                  <p className="text-sm text-white/80 text-center">{currentCard.explanation}</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Answer buttons */}
      {isFlipped ? (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-gray-500 text-center mb-1">Насколько хорошо помнишь?</p>
          <div className="grid grid-cols-4 gap-2">
            <button
              onClick={() => handleAnswer(0)}
              className="py-3 rounded-xl bg-red-100 text-red-700 font-bold text-sm hover:bg-red-200 transition-colors"
            >
              Снова
            </button>
            <button
              onClick={() => handleAnswer(2)}
              className="py-3 rounded-xl bg-orange-100 text-orange-700 font-bold text-sm hover:bg-orange-200 transition-colors"
            >
              Трудно
            </button>
            <button
              onClick={() => handleAnswer(3)}
              className="py-3 rounded-xl bg-duo-green/20 text-duo-green-dark font-bold text-sm hover:bg-duo-green/30 transition-colors"
            >
              Хорошо
            </button>
            <button
              onClick={() => handleAnswer(5)}
              className="py-3 rounded-xl bg-duo-blue/10 text-duo-blue font-bold text-sm hover:bg-duo-blue/20 transition-colors"
            >
              Легко
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={handleFlip}
          className="btn-primary w-full"
        >
          Показать ответ
        </button>
      )}
    </div>
  )
}
