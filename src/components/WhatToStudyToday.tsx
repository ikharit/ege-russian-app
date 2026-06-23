import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BrainCircuit,
  ChevronRight,
  ArrowRight,
  TrendingDown,
  RotateCcw,
  BookOpen,
  Flame,
  GraduationCap,
  Shuffle,
  HelpCircle,
  X,
  Trophy,
  Target,
} from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import {
  getSmartRecommendations,
  Recommendation,
  RecommendationReason,
} from '../utils/adaptiveEngine'
import { formatNextReview, formatInterval, getDueReviews, getOverdueCount } from '../utils/spacedRepetition'
import type { SRSItem } from '../utils/spacedRepetition'

const REASON_CONFIG: Record<
  RecommendationReason,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  weak_topic: {
    icon: TrendingDown,
    color: 'text-duo-red',
    bg: 'bg-duo-red/10',
    label: 'Слабое место',
  },
  review_needed: {
    icon: RotateCcw,
    color: 'text-duo-blue',
    bg: 'bg-duo-blue/10',
    label: 'Повторение',
  },
  next_in_sequence: {
    icon: BookOpen,
    color: 'text-duo-green',
    bg: 'bg-duo-green/10',
    label: 'Продолжить',
  },
  streak_saver: {
    icon: Flame,
    color: 'text-duo-yellow',
    bg: 'bg-duo-yellow/10',
    label: 'Сохранить серию',
  },
  exam_prep: {
    icon: GraduationCap,
    color: 'text-duo-purple',
    bg: 'bg-duo-purple/10',
    label: 'Подготовка к ЕГЭ',
  },
  variety: {
    icon: Shuffle,
    color: 'text-duo-blue',
    bg: 'bg-duo-blue/10',
    label: 'Разнообразие',
  },
}

function RecommendationItem({
  rec,
  index,
  onNavigate,
}: {
  rec: Recommendation
  index: number
  onNavigate: (lessonId: string) => void
}) {
  const [showWhy, setShowWhy] = useState(false)
  const config = REASON_CONFIG[rec.reason]
  const Icon = config.icon

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div
        className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all border ${
          rec.reason === 'weak_topic' || rec.reason === 'exam_prep'
            ? 'bg-duo-red/5 hover:bg-duo-red/10 border-duo-red/10'
            : 'bg-white hover:bg-gray-50 border-gray-100'
        }`}
        onClick={() => onNavigate(rec.lessonId)}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bg}`}
          >
            <Icon size={20} className={config.color} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">{rec.lessonTitle}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{rec.sectionTitle}</span>
              <span className="text-gray-300">•</span>
              <span>~{rec.estimatedTime} мин</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowWhy(!showWhy)
            }}
            className="text-xs text-duo-blue hover:underline px-2 py-1 rounded-lg hover:bg-duo-blue/5 transition-colors"
          >
            Почему это?
          </button>
          <ChevronRight size={16} className="text-gray-400" />
        </div>
      </div>

      <AnimatePresence>
        {showWhy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mx-2 mt-1 p-3 bg-duo-snow rounded-lg border border-gray-100 text-sm text-gray-600 flex items-start gap-2">
              <HelpCircle size={16} className="text-duo-blue mt-0.5 shrink-0" />
              <div>
                <p className="font-medium text-gray-700">{config.label}</p>
                <p>{rec.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Приоритет: {rec.priority}/100
                </p>
              </div>
              <button
                onClick={() => setShowWhy(false)}
                className="ml-auto shrink-0 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function getLessonInfo(lessonId: string): { title: string; sectionTitle: string; sectionColor: string } | undefined {
  for (const section of course.sections) {
    const lesson = section.lessons.find((l) => l.id === lessonId)
    if (lesson) {
      return { title: lesson.title, sectionTitle: section.title, sectionColor: section.color }
    }
  }
  return undefined
}

function SRSReviewItem({
  item,
  onNavigate,
}: {
  item: SRSItem
  onNavigate: (lessonId: string) => void
}) {
  const lessonInfo = getLessonInfo(item.lessonId)
  const dateLabel = formatNextReview(item)
  const intervalLabel = formatInterval(item)

  return (
    <div
      className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 cursor-pointer hover:bg-gray-50 transition-all"
      onClick={() => onNavigate(item.lessonId)}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-duo-blue/10">
          <RotateCcw size={20} className="text-duo-blue" />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-700">
            {lessonInfo?.title ?? item.lessonId}
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>{lessonInfo?.sectionTitle ?? '—'}</span>
            <span className="text-gray-300">•</span>
            <span>{intervalLabel}</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <span
          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            dateLabel.includes('Просрочено')
              ? 'bg-duo-red/10 text-duo-red'
              : dateLabel === 'Сегодня'
              ? 'bg-duo-blue/10 text-duo-blue'
              : 'bg-gray-100 text-gray-500'
          }`}
        >
          {dateLabel}
        </span>
      </div>
    </div>
  )
}

export function WhatToStudyToday() {
  const navigate = useNavigate()
  const userStats = useProgressStore((s) => s.userStats)
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const taskStats = useProgressStore((s) => s.taskStats)
  const srsData = useProgressStore((s) => s.srsData)
  const playerProfile = useProgressStore((s) => s.getPlayerProfile())
  const playerType: PlayerType = playerProfile?.type || 'achiever'

  const recommendations = useMemo(() => {
    const analysis = useProgressStore.getState().getErrorAnalysis()
    return getSmartRecommendations(
      {
        userStats,
        lessonProgress,
        taskStats,
        srsData,
        course,
      },
      analysis.patterns,
      3
    )
  }, [userStats, lessonProgress, taskStats, srsData])

  const dueReviews = useMemo(() => {
    return getDueReviews(srsData)
  }, [srsData])

  const overdueCount = useMemo(() => {
    return getOverdueCount(srsData)
  }, [srsData])

  const handleNavigate = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`)
  }

  const getPersonalityCTA = (rec: Recommendation): string => {
    switch (playerType) {
      case 'achiever':
        return `Пройди этот урок и получишь ${rec.estimatedTime * 5} XP!`
      case 'explorer':
        return `Новая тема: "${rec.lessonTitle}" — ты ещё не изучал!`
      case 'socializer':
        return `Твой класс проходит это задание — присоединяйся!`
      case 'killer':
        return `Только 30% учеников справляются с этим заданием. Сможешь?`
    }
  }

  if (recommendations.length === 0) {
    return (
      <motion.div
        className="card bg-gradient-to-br from-duo-green/5 to-duo-yellow/5 border-duo-green/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={20} className="text-duo-yellow" />
          <h3 className="font-bold text-gray-700">Отличная работа!</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Ты прошёл все уроки, и нет тем, которые требуют срочного повторения.
          Попробуй пройти вариант ЕГЭ, чтобы проверить свои знания в боевых
          условиях!
        </p>
        <button
          onClick={() => navigate('/practice')}
          className="w-full py-3 rounded-xl bg-duo-green text-white font-bold hover:bg-duo-green-dark transition-colors flex items-center justify-center gap-2"
        >
          <Target size={20} />
          Пройти вариант ЕГЭ
          <ArrowRight size={16} />
        </button>
      </motion.div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* SRS Due Reviews Section */}
      {dueReviews.length > 0 && (
        <motion.div
          className="card bg-gradient-to-br from-duo-blue/5 to-white border-duo-blue/20"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RotateCcw size={20} className="text-duo-blue" />
              <h3 className="font-bold text-gray-700">🔁 Повторение по расписанию</h3>
            </div>
            {overdueCount > 0 && (
              <span className="text-xs font-bold bg-duo-red/10 text-duo-red px-2 py-0.5 rounded-full">
                Просрочено: {overdueCount}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {dueReviews.map((item) => (
              <SRSReviewItem
                key={item.lessonId}
                item={item}
                onNavigate={handleNavigate}
              />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div
        className="card bg-gradient-to-br from-duo-blue/5 to-duo-purple/5 border-duo-blue/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <BrainCircuit size={20} className="text-duo-purple" />
          <h3 className="font-bold text-gray-700">Что учить сегодня</h3>
        </div>

        <div className="flex flex-col gap-2">
          {recommendations.map((rec, idx) => (
            <RecommendationItem
              key={rec.lessonId}
              rec={rec}
              index={idx}
              onNavigate={handleNavigate}
              personalityCTA={getPersonalityCTA(rec)}
            />
          ))}
        </div>

        <p className="text-xs text-gray-400 mt-2 text-center">
          Рекомендации основаны на твоём прогрессе и адаптированы под тебя
        </p>
      </motion.div>
    </div>
  )
}
