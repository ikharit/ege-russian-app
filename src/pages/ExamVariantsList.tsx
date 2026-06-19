import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock, Play, CheckCircle, Trophy, AlertCircle } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { getAllVariants, getScoreLabel } from '../data/fipiVariants'

export function ExamVariantsList() {
  const navigate = useNavigate()
  const examResults = useProgressStore((s) => s.getExamResults())
  const getBestExamResult = useProgressStore((s) => s.getBestExamResult)

  const variants = getAllVariants()
  const completedCount = variants.filter((v) =>
    examResults.some((r) => r.variantId === v.id)
  ).length

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Назад на главную"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Варианты ЕГЭ</h1>
          <p className="text-sm text-gray-500">
            Пройдено {completedCount} из {variants.length}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700">Общий прогресс</span>
          <span className="text-sm text-duo-green font-bold">
            {completedCount}/{variants.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-duo-green h-3 rounded-full transition-all"
            style={{
              width: `${variants.length > 0 ? (completedCount / variants.length) * 100 : 0}%`,
            }}
          />
        </div>
      </div>

      {/* Variants */}
      <div className="flex flex-col gap-4">
        {variants.map((variant, index) => {
          const bestResult = getBestExamResult(variant.id)
          const isCompleted = !!bestResult
          const scoreInfo = bestResult ? getScoreLabel(bestResult.secondaryScore) : null

          return (
            <motion.div
              key={variant.id}
              className={`card ${isCompleted ? 'border-duo-green/30' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-800">{variant.name}</h3>
                    {isCompleted && (
                      <CheckCircle size={16} className="text-duo-green" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{variant.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {variant.timeLimit} мин
                    </span>
                    <span>{variant.tasks.length} заданий</span>
                    <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                      {variant.year}
                    </span>
                  </div>
                  {bestResult && scoreInfo && (
                    <div className="mt-2 flex items-center gap-2">
                      <Trophy size={14} className="text-yellow-500" />
                      <span className="text-sm font-bold text-gray-700">
                        {bestResult.secondaryScore} баллов
                      </span>
                      <span className={`text-xs font-bold ${scoreInfo.color}`}>
                        {scoreInfo.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({bestResult.primaryScore} первичных)
                      </span>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/exam/${variant.id}`)}
                  className="btn-primary flex items-center gap-2 text-sm py-2 px-4 ml-3"
                  aria-label={isCompleted ? 'Пройти ещё раз' : 'Начать вариант'}
                >
                  <Play size={16} />
                  {isCompleted ? 'Ещё раз' : 'Начать'}
                </button>
              </div>
            </motion.div>
          )
        })}
      </div>

      {completedCount === 0 && (
        <div className="card text-center py-8">
          <AlertCircle size={32} className="text-duo-blue mx-auto mb-3" />
          <p className="text-gray-600 text-sm">
            Начни с демо-варианта, чтобы познакомиться с форматом ЕГЭ.
          </p>
        </div>
      )}
    </div>
  )
}
