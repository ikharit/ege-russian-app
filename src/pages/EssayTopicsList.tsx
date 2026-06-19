import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PenTool, ChevronRight, CheckCircle, Circle, Clock, BookOpen } from 'lucide-react'
import { essayTopics, getEssayStats } from '../data/essayData'
import { useProgressStore } from '../stores/progressStore'

export function EssayTopicsList() {
  const navigate = useNavigate()
  const stats = getEssayStats()
  const lessonProgress = useProgressStore((s) => s.lessonProgress)

  const handleKeyNav = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  const difficultyConfig = {
    easy: {
      label: 'Лёгкий',
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-green-200',
      badge: 'bg-green-500',
    },
    medium: {
      label: 'Средний',
      color: 'bg-amber-100 text-amber-700',
      borderColor: 'border-amber-200',
      badge: 'bg-amber-500',
    },
    hard: {
      label: 'Сложный',
      color: 'bg-red-100 text-red-700',
      borderColor: 'border-red-200',
      badge: 'bg-red-500',
    },
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Назад на главную"
        >
          <ChevronRight size={20} className="text-gray-600 rotate-180" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Сочинения</h1>
          <p className="text-sm text-gray-500">15 тем для подготовки к ЕГЭ</p>
        </div>
      </div>

      {/* Stats Card */}
      <motion.div
        className="card bg-gradient-to-br from-duo-green/10 to-duo-green/5 border-duo-green/20"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-duo-green flex items-center justify-center text-white">
            <PenTool size={24} />
          </div>
          <div>
            <p className="text-xs text-duo-green uppercase tracking-wide font-bold">Прогресс</p>
            <p className="font-bold text-gray-800">
              {stats.completed}/{stats.total} написано
            </p>
            <p className="text-xs text-gray-500">
              {stats.drafts > 0 && `${stats.drafts} черновиков • `}
              {stats.total - stats.completed - stats.drafts} не начато
            </p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <div
            className="bg-duo-green h-2 rounded-full transition-all"
            style={{ width: `${stats.total > 0 ? (stats.completed / stats.total) * 100 : 0}%` }}
          />
        </div>
      </motion.div>

      {/* Topics Grid */}
      <div className="flex flex-col gap-3">
        {essayTopics.map((topic, idx) => {
          const diff = difficultyConfig[topic.difficulty]
          return (
            <motion.div
              key={topic.id}
              className={`card border-l-4 ${diff.borderColor} cursor-pointer hover:shadow-md transition-all`}
              style={{ borderLeftColor: diff.badge.replace('bg-', '') }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate(`/essay/${topic.id}`)}
              onKeyDown={(e) => handleKeyNav(e, () => navigate(`/essay/${topic.id}`))}
              role="button"
              tabIndex={0}
              aria-label={`Тема ${topic.number}: ${topic.author}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg ${diff.badge} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {topic.number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${diff.color}`}>
                      {diff.label}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <BookOpen size={12} />
                      {topic.author}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 leading-snug line-clamp-2">
                    {topic.text}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <Clock size={12} />
                      <span>2.5 ч</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <CheckCircle size={12} />
                      <span>{topic.hints.length} подсказки</span>
                    </div>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300 shrink-0 mt-1" />
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
