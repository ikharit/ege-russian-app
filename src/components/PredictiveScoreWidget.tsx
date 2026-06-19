import { motion } from 'framer-motion'
import { Target, TrendingUp, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../stores/progressStore'
import { getPredictiveScore, getWeakTasks } from '../utils/predictiveScore'

import { useStudyPlanStore } from '../stores/studyPlanStore'

export function PredictiveScoreWidget() {
  const navigate = useNavigate()
  const state = useProgressStore((s) => ({
    taskStats: s.taskStats,
    examResults: s.examResults,
    userStats: s.userStats,
    lessonProgress: s.lessonProgress,
    wrongAnswers: s.wrongAnswers,
  }))

  const examDate = useStudyPlanStore((s) => s.examDate)
  const daysToExam = examDate
    ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 180

  const score = getPredictiveScore(state, daysToExam)
  const weakTasks = getWeakTasks(score.breakdown, 3)
  const label = score.predictedSecondary >= 80 ? 'Отлично' : score.predictedSecondary >= 60 ? 'Хорошо' : score.predictedSecondary >= 36 ? 'Проходной' : 'Ниже порога'
  const labelColor = score.predictedSecondary >= 80 ? 'text-green-600' : score.predictedSecondary >= 60 ? 'text-blue-600' : score.predictedSecondary >= 36 ? 'text-yellow-600' : 'text-red-600'

  return (
    <motion.div
      className="card bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Target size={20} className="text-purple-600" />
        <h3 className="font-bold text-gray-700">Прогноз на ЕГЭ</h3>
      </div>

      <div className="text-center mb-3">
        <div className="text-4xl font-bold text-gray-800">
          {score.predictedSecondary}
          <span className="text-lg text-gray-400">/100</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Уверенность: {Math.round(score.confidence * 100)}% · {label}
        </p>
      </div>

      {/* Progress bar with markers */}
      <div className="relative mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <motion.div
            className="h-3 rounded-full bg-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, score.predictedSecondary)}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
        {/* Markers */}
        <div className="flex justify-between mt-1 text-[10px] text-gray-400">
          <span className="relative">
            <span className="absolute -top-4 left-0 w-px h-2 bg-yellow-400" />
            36
          </span>
          <span className="relative">
            <span className="absolute -top-4 left-0 w-px h-2 bg-blue-400" />
            60
          </span>
          <span className="relative">
            <span className="absolute -top-4 left-0 w-px h-2 bg-green-400" />
            80
          </span>
        </div>
      </div>

      {/* Weak tasks hint */}
      {weakTasks.length > 0 && (
        <div className="mb-3 text-sm text-gray-600">
          <span className="font-bold">Для 80+ нужно:</span>{' '}
          {weakTasks.map(t => `задание ${t.taskNumber}`).join(', ')}
          {weakTasks.some(t => t.taskNumber === 26) && ' и сочинение'}
        </div>
      )}

      {/* Daily recommendation */}
      <div className="flex items-center gap-2 text-sm text-purple-700 mb-3">
        <TrendingUp size={16} />
        <span>Рекомендуемое время: <strong>{score.recommendedDaily} мин/день</strong></span>
      </div>

      <button
        onClick={() => navigate('/stats')}
        className="w-full py-2 text-sm font-bold text-purple-600 bg-purple-100 rounded-xl hover:bg-purple-200 transition-colors flex items-center justify-center gap-1"
      >
        Подробнее <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}
