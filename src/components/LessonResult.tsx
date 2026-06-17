import { motion } from 'framer-motion'
import { Star, Zap, ArrowRight, RotateCcw } from 'lucide-react'
import confetti from 'canvas-confetti'
import { useEffect } from 'react'

interface LessonResultProps {
  correctCount: number
  totalQuestions: number
  xpEarned: number
  comboMultiplier: number
  isPerfect: boolean
  onContinue: () => void
  onRetry: () => void
}

export function LessonResult({ correctCount, totalQuestions, xpEarned, comboMultiplier, isPerfect, onContinue, onRetry }: LessonResultProps) {
  const percentage = Math.round((correctCount / totalQuestions) * 100)

  useEffect(() => {
    if (percentage >= 60) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#58cc02', '#ffc800', '#1cb0f6', '#ce82ff']
      })
    }
  }, [percentage])

  return (
    <div className="flex flex-col items-center gap-6 max-w-md mx-auto py-8">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className="relative"
      >
        <div className={`w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold ${
          percentage >= 80 ? 'bg-duo-green text-white' : percentage >= 60 ? 'bg-duo-yellow text-gray-900' : 'bg-duo-red text-white'
        }`}>
          {percentage}%
        </div>
        {isPerfect && (
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute -top-2 -right-2 bg-duo-yellow text-gray-900 rounded-full px-2 py-1 text-xs font-bold shadow-lg"
          >
            Идеально!
          </motion.div>
        )}
      </motion.div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {percentage >= 80 ? 'Отличный результат!' : percentage >= 60 ? 'Хорошая работа!' : 'Попробуй ещё!'}
        </h2>
        <p className="text-gray-500">
          {correctCount} из {totalQuestions} правильных ответов
        </p>
      </div>

      <div className="flex gap-4 w-full">
        <div className="flex-1 card flex flex-col items-center gap-1">
          <Zap size={24} className="text-duo-yellow" />
          <span className="text-2xl font-bold text-gray-800">+{xpEarned}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">XP</span>
          {comboMultiplier > 1 && (
            <span className="text-xs text-duo-green font-bold">x{comboMultiplier} комбо</span>
          )}
        </div>
        <div className="flex-1 card flex flex-col items-center gap-1">
          <Star size={24} className="text-duo-yellow fill-duo-yellow" />
          <span className="text-2xl font-bold text-gray-800">{correctCount}</span>
          <span className="text-xs text-gray-500 uppercase tracking-wide">Правильно</span>
        </div>
      </div>

      <div className="flex gap-3 w-full">
        {percentage < 100 && (
          <button onClick={onRetry} className="btn-secondary flex-1 flex items-center justify-center gap-2">
            <RotateCcw size={18} />
            Повторить
          </button>
        )}
        <button onClick={onContinue} className="btn-primary flex-1 flex items-center justify-center gap-2">
          {percentage >= 60 ? 'Продолжить' : 'Вернуться к курсу'}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  )
}
