import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, RotateCcw, Check } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { calculateQuizProfile, QUIZ_QUESTIONS, getPlayerTypeLabel, getPlayerTypeDescription, getPlayerTypeIcon, getPlayerTypeColor } from '../utils/personalityEngine'
import type { PlayerType } from '../utils/personalityEngine'

export function PersonalityQuiz() {
  const navigate = useNavigate()
  const setPlayerProfile = useProgressStore((s) => s.setPlayerProfile)
  const existingProfile = useProgressStore((s) => s.getPlayerProfile())

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<{ question: number; choice: number }[]>([])
  const [result, setResult] = useState<PlayerType | null>(null)
  const [scores, setScores] = useState<Record<PlayerType, number> | null>(null)

  const isOnboarding = !existingProfile

  const handleSelect = (choiceIndex: number) => {
    const newAnswers = [...answers, { question: step, choice: choiceIndex }]
    setAnswers(newAnswers)

    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1)
    } else {
      const profile = calculateQuizProfile(newAnswers)
      setResult(profile.type)
      setScores(profile.scores)
      setPlayerProfile(profile)
    }
  }

  const handleRestart = () => {
    setStep(0)
    setAnswers([])
    setResult(null)
    setScores(null)
  }

  const handleFinish = () => {
    if (isOnboarding) {
      navigate('/')
    } else {
      navigate('/profile')
    }
  }

  if (result && scores) {
    return (
      <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6 min-h-screen justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div
            className="w-24 h-24 mx-auto rounded-3xl flex items-center justify-center text-5xl mb-4 shadow-lg"
            style={{ backgroundColor: getPlayerTypeColor(result) + '20' }}
          >
            {getPlayerTypeIcon(result)}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            Ты — {getPlayerTypeLabel(result)}!
          </h1>
          <p className="text-gray-500 mt-2 px-4">
            {getPlayerTypeDescription(result)}
          </p>
        </motion.div>

        <div className="card space-y-3">
          <h3 className="font-bold text-gray-700 text-sm">Распределение:</h3>
          {(Object.entries(scores) as [PlayerType, number][]).sort((a, b) => b[1] - a[1]).map(([type, score]) => (
            <div key={type} className="flex items-center gap-3">
              <span className="text-lg shrink-0">{getPlayerTypeIcon(type)}</span>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-gray-700">{getPlayerTypeLabel(type)}</span>
                  <span className="text-gray-500">{score}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{ width: `${score}%`, backgroundColor: getPlayerTypeColor(type) }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleFinish}
            className="w-full py-3 rounded-xl bg-duo-green text-white font-bold hover:bg-duo-green/90 transition-colors flex items-center justify-center gap-2"
          >
            <Check size={20} />
            {isOnboarding ? 'Начать учиться!' : 'Сохранить'}
          </button>
          {!isOnboarding && (
            <button
              onClick={handleRestart}
              className="w-full py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} />
              Пройти заново
            </button>
          )}
        </div>
      </div>
    )
  }

  const question = QUIZ_QUESTIONS[step]
  const progress = ((step + 1) / QUIZ_QUESTIONS.length) * 100

  return (
    <div className="max-w-md mx-auto px-4 py-8 flex flex-col gap-6 min-h-screen justify-center">
      <div className="text-center">
        <p className="text-xs text-gray-400 uppercase tracking-wide font-bold mb-2">
          {isOnboarding ? 'Первый запуск' : 'Тип личности'}
        </p>
        <h1 className="text-xl font-bold text-gray-800">
          Вопрос {step + 1} из {QUIZ_QUESTIONS.length}
        </h1>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <motion.div
          className="bg-duo-green h-2 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="card"
        >
          <p className="text-lg font-bold text-gray-800 mb-4">{question.text}</p>
          <div className="flex flex-col gap-2">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className="w-full text-left p-4 rounded-xl border border-gray-200 hover:border-duo-green hover:bg-duo-green/5 transition-all flex items-center justify-between group"
              >
                <span className="font-medium text-gray-700 group-hover:text-duo-green-dark">{opt.label}</span>
                <ChevronRight size={16} className="text-gray-300 group-hover:text-duo-green" />
              </button>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {!isOnboarding && (
        <button
          onClick={() => navigate('/profile')}
          className="text-sm text-gray-400 hover:text-gray-600 text-center"
        >
          Отмена
        </button>
      )}
    </div>
  )
}
