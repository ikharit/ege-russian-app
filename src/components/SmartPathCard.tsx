import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Compass, ChevronRight, ArrowRight } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { getFocusArea } from '../utils/adaptiveEngine'

export function SmartPathCard() {
  const navigate = useNavigate()
  const userStats = useProgressStore((s) => s.userStats)
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const taskStats = useProgressStore((s) => s.taskStats)

  const focusArea = useMemo(() => {
    return getFocusArea({
      userStats,
      lessonProgress,
      taskStats,
      course,
    })
  }, [userStats, lessonProgress, taskStats])

  const progressPercent =
    focusArea.total > 0
      ? Math.round((focusArea.completed / focusArea.total) * 100)
      : 0

  const handleContinue = () => {
    if (focusArea.topLessonId) {
      navigate(`/lesson/${focusArea.topLessonId}`)
    } else {
      navigate('/practice')
    }
  }

  return (
    <motion.div
      className="card bg-gradient-to-br from-duo-purple/5 to-duo-blue/5 border-duo-purple/20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Compass size={20} className="text-duo-purple" />
        <h3 className="font-bold text-gray-700">Smart Path</h3>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
          style={{ backgroundColor: focusArea.sectionColor }}
        >
          {focusArea.sectionTitle.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-800 truncate">
            {focusArea.sectionTitle}
          </p>
          <p className="text-xs text-gray-500">
            {focusArea.completed} / {focusArea.total} уроков
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
        <motion.div
          className="h-2.5 rounded-full"
          style={{ backgroundColor: focusArea.sectionColor }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>

      {focusArea.topLessonTitle && (
        <p className="text-xs text-gray-600 mb-3">
          Следующий: <span className="font-medium">{focusArea.topLessonTitle}</span>
        </p>
      )}

      <button
        onClick={handleContinue}
        className="w-full py-2.5 rounded-xl bg-duo-purple text-white font-bold hover:bg-duo-purple/90 transition-colors flex items-center justify-center gap-2"
      >
        Учить дальше
        <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}
