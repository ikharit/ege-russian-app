import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BrainCircuit, ChevronRight, TrendingDown, RotateCcw, BookOpen, Flame, GraduationCap, Shuffle, Trophy } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { getSmartRecommendations } from '../utils/adaptiveEngine'
import type { Recommendation, RecommendationReason } from '../utils/adaptiveEngine'

const REASON_CONFIG: Record<
  RecommendationReason,
  { icon: React.ElementType; color: string; label: string }
> = {
  weak_topic: { icon: TrendingDown, color: 'text-duo-red', label: 'Слабое место' },
  review_needed: { icon: RotateCcw, color: 'text-duo-blue', label: 'Повторение' },
  next_in_sequence: { icon: BookOpen, color: 'text-duo-green', label: 'Продолжить' },
  streak_saver: { icon: Flame, color: 'text-duo-yellow', label: 'Сохранить серию' },
  exam_prep: { icon: GraduationCap, color: 'text-duo-purple', label: 'Подготовка к ЕГЭ' },
  variety: { icon: Shuffle, color: 'text-duo-blue', label: 'Разнообразие' },
}

export function WhatToStudyToday() {
  const navigate = useNavigate()
  const userStats = useProgressStore((s) => s.userStats)
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const taskStats = useProgressStore((s) => s.taskStats)
  const srsData = useProgressStore((s) => s.srsData)

  const recommendations = useMemo(() => {
    const analysis = useProgressStore.getState().getErrorAnalysis()
    return getSmartRecommendations(
      { userStats, lessonProgress, taskStats, srsData, course },
      analysis.patterns,
      2
    )
  }, [userStats, lessonProgress, taskStats, srsData])

  const handleNavigate = (lessonId: string) => navigate(`/lesson/${lessonId}`)

  if (recommendations.length === 0) {
    return (
      <motion.div
        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Trophy size={18} className="text-duo-yellow" />
          <h3 className="font-bold text-sm text-gray-700">Отличная работа!</h3>
        </div>
        <p className="text-xs text-gray-500">
          Всё пройдено. Попробуй вариант ЕГЭ или повтори слабые места.
        </p>
      </motion.div>
    )
  }

  return (
    <motion.div
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <BrainCircuit size={18} className="text-duo-purple" />
        <h3 className="font-bold text-sm text-gray-700">Что учить сегодня</h3>
      </div>

      <div className="flex flex-col gap-2">
        {recommendations.map((rec, idx) => {
          const cfg = REASON_CONFIG[rec.reason]
          const Icon = cfg.icon
          return (
            <motion.div
              key={rec.lessonId}
              className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.08 }}
              onClick={() => handleNavigate(rec.lessonId)}
            >
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${cfg.color}`} style={{ backgroundColor: 'rgba(0,0,0,0.04)' }}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-700 truncate">{rec.lessonTitle}</p>
                  <p className="text-[10px] text-gray-400">{rec.sectionTitle} • {cfg.label}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-300 shrink-0" />
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
