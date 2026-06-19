import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, RotateCcw, ChevronRight, CheckCircle, XCircle, AlertCircle, Trophy, Clock, BookOpen } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { getVariantById, getScoreLabel, convertPrimaryToSecondary } from '../data/fipiVariants'

export function ExamResultsPage() {
  const navigate = useNavigate()
  const { variantId } = useParams<{ variantId: string }>()
  const examResults = useProgressStore((s) => s.getExamResults())
  const getBestExamResult = useProgressStore((s) => s.getBestExamResult)

  const variant = getVariantById(variantId || '')
  const result = examResults.find((r) => r.variantId === variantId)
  const bestResult = getBestExamResult(variantId || '')

  if (!variant || !result) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 text-center">
        <p className="text-gray-500">Результаты не найдены</p>
        <button onClick={() => navigate('/exam')} className="btn-primary mt-4">
          К вариантам
        </button>
      </div>
    )
  }

  const scoreInfo = getScoreLabel(result.secondaryScore)
  const isNewBest = bestResult === result

  const passed = result.secondaryScore >= 36
  const good = result.secondaryScore >= 60
  const excellent = result.secondaryScore >= 80

  const weakTasks = variant.tasks.filter((task) => {
    const score = result.taskScores[task.taskNumber] ?? 0
    return score < task.maxScore && task.type !== 'essay'
  })

  const nextVariant = (() => {
    const allVariants = [
      'variant-demo-1',
      'variant-base-2',
      'variant-advanced-3',
      'variant-hard-4',
      'variant-expert-5',
    ]
    const idx = allVariants.indexOf(variant.id)
    if (idx >= 0 && idx < allVariants.length - 1) {
      return allVariants[idx + 1]
    }
    return null
  })()

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/exam')}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Назад к вариантам"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Результаты</h1>
          <p className="text-sm text-gray-500">{variant.name}</p>
        </div>
      </div>

      {/* Score Card */}
      <motion.div
        className="card text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <div className="w-16 h-16 bg-duo-green rounded-full flex items-center justify-center mx-auto mb-3">
          <Trophy size={32} className="text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {result.secondaryScore} тестовых баллов
        </h2>
        <p className={`text-sm font-bold mt-1 ${scoreInfo.color}`}>{scoreInfo.label}</p>
        {isNewBest && (
          <p className="text-xs text-duo-yellow font-bold mt-1">🏆 Новый лучший результат!</p>
        )}
        <div className="mt-3 text-sm text-gray-600">
          {result.primaryScore} первичных баллов из {variant.primaryScore}
        </div>
        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-gray-500">
          <Clock size={12} />
          <span>Потрачено {Math.floor(result.timeSpent / 60)}:{String(result.timeSpent % 60).padStart(2, '0')}</span>
        </div>
      </motion.div>

      {/* Thresholds */}
      <div className="card">
        <h3 className="font-bold text-gray-700 mb-3">Пороги</h3>
        <div className="flex flex-col gap-2">
          <div className={`flex items-center justify-between p-2 rounded-lg ${excellent ? 'bg-duo-green/10' : 'bg-gray-50'}`}>
            <span className="text-sm text-gray-700">Отлично (80+)</span>
            {excellent ? <CheckCircle size={16} className="text-duo-green" /> : <span className="text-xs text-gray-400">—</span>}
          </div>
          <div className={`flex items-center justify-between p-2 rounded-lg ${good ? 'bg-duo-blue/10' : 'bg-gray-50'}`}>
            <span className="text-sm text-gray-700">Хорошо (60+)</span>
            {good ? <CheckCircle size={16} className="text-duo-blue" /> : <span className="text-xs text-gray-400">—</span>}
          </div>
          <div className={`flex items-center justify-between p-2 rounded-lg ${passed ? 'bg-duo-yellow/10' : 'bg-gray-50'}`}>
            <span className="text-sm text-gray-700">Проходной (36+)</span>
            {passed ? <CheckCircle size={16} className="text-duo-yellow" /> : <span className="text-xs text-gray-400">—</span>}
          </div>
          {!passed && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-duo-red/10">
              <span className="text-sm text-gray-700">Ниже порога</span>
              <XCircle size={16} className="text-duo-red" />
            </div>
          )}
        </div>
      </div>

      {/* Task Breakdown */}
      <div className="card">
        <h3 className="font-bold text-gray-700 mb-3">Разбор по заданиям</h3>
        <div className="flex flex-col gap-2">
          {variant.tasks.map((task) => {
            const score = result.taskScores[task.taskNumber] ?? 0
            const isCorrect = score >= task.maxScore
            return (
              <div
                key={task.taskNumber}
                className="flex items-center justify-between p-2 rounded-lg bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">Задание {task.taskNumber}</span>
                  <span className="text-xs text-gray-500">{task.title}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-700">
                    {score}/{task.maxScore}
                  </span>
                  {isCorrect ? (
                    <CheckCircle size={16} className="text-duo-green" />
                  ) : (
                    <XCircle size={16} className="text-duo-red" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Weak Topics */}
      {weakTasks.length > 0 && (
        <div className="card bg-duo-red/5 border border-duo-red/20">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={18} className="text-duo-red" />
            <h3 className="font-bold text-gray-700">Стоит подтянуть</h3>
          </div>
          <div className="flex flex-col gap-2">
            {weakTasks.map((task) => (
              <button
                key={task.taskNumber}
                onClick={() => {
                  const trainerMap: Record<string, string> = {
                    task4: '/accent-trainer',
                    task5: '/task5-trainer',
                    task6: '/task6-trainer',
                    task7: '/task7-trainer',
                    task8: '/task8-trainer',
                    task9: '/task9-trainer',
                    task10: '/task10-trainer',
                    task11: '/task11-trainer',
                    task12: '/task12-trainer',
                    task13: '/task13-trainer',
                    task14: '/task14-trainer',
                    task15: '/task15-trainer',
                    task16: '/task16-trainer',
                  }
                  const path = trainerMap[task.dataSource]
                  if (path) navigate(path)
                }}
                className="flex items-center justify-between p-2 bg-white rounded-lg hover:shadow-sm transition-shadow text-left"
              >
                <div className="flex items-center gap-2">
                  <BookOpen size={14} className="text-duo-blue" />
                  <span className="text-sm text-gray-700">
                    Задание {task.taskNumber}: {task.title}
                  </span>
                </div>
                <ChevronRight size={16} className="text-gray-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={() => navigate(`/exam/${variant.id}`)}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Пройти ещё раз
        </button>
        {nextVariant && (
          <button
            onClick={() => navigate(`/exam/${nextVariant}`)}
            className="btn-secondary w-full flex items-center justify-center gap-2"
          >
            Следующий вариант
            <ChevronRight size={18} />
          </button>
        )}
        <button
          onClick={() => navigate('/exam')}
          className="text-gray-400 hover:text-gray-600 text-sm text-center"
        >
          К списку вариантов
        </button>
      </div>
    </div>
  )
}
