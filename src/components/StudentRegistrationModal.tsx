import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UserPlus, X, GraduationCap, Loader2, CheckCircle2 } from 'lucide-react'
import { useStudentStore } from '../stores/studentStore'
import { useProgressStore } from '../stores/progressStore'

interface StudentRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
}

const EMOJIS = ['🎓', '👩‍🎓', '👨‍🎓', '🧑‍🔬', '🦁', '🐱', '🐶', '🦊', '🐼', '🐨', '🌟', '🔥', '🚀', '🎨', '🎭', '🎪']

export function StudentRegistrationModal({ isOpen, onClose }: StudentRegistrationModalProps) {
  const [name, setName] = useState('')
  const [className, setClassName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('🎓')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProfile = useStudentStore((s) => s.createProfile)
  const switchProfile = useStudentStore((s) => s.switchProfile)

  const resetForm = () => {
    setName('')
    setClassName('')
    setSelectedEmoji('🎓')
    setLoading(false)
    setSuccess(false)
    setError(null)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!name.trim()) {
      setError('Введите имя ученика')
      return
    }
    if (name.trim().length < 2) {
      setError('Имя слишком короткое')
      return
    }

    setLoading(true)

    // Get current progress snapshot before switching
    const currentProgress = useProgressStore.getState()
    const progressSnapshot = {
      userStats: currentProgress.userStats,
      lessonProgress: currentProgress.lessonProgress,
      atomProgress: currentProgress.atomProgress,
      wrongAnswers: currentProgress.wrongAnswers,
      taskStats: currentProgress.taskStats,
      achievements: currentProgress.achievements,
      lastUnlockedAchievement: currentProgress.lastUnlockedAchievement,
      currentLessonId: currentProgress.currentLessonId,
      currentLessonStartTime: currentProgress.currentLessonStartTime,
      currentLessonHeartsLost: currentProgress.currentLessonHeartsLost,
      heartRestoreCount: currentProgress.heartRestoreCount,
      exportCount: currentProgress.exportCount,
      dailyQuestProgress: currentProgress.dailyQuestProgress,
      leaderboardRanks: currentProgress.leaderboardRanks,
      theoryTestsCompleted: currentProgress.theoryTestsCompleted,
      isTeacher: currentProgress.isTeacher,
      userId: currentProgress.userId,
    }

    const id = createProfile(name.trim(), className.trim() || undefined, selectedEmoji)

    // Switch to new profile (saves current progress to old profile, loads new empty)
    switchProfile(id, progressSnapshot)

    // Reset progress store for new student
    useProgressStore.setState({
      userStats: {
        xp: 0, level: 1, streak: 0, maxStreak: 0, lastActivityDate: '',
        hearts: 5, maxHearts: 5, achievements: [], name: name.trim(),
        lastHeartRestore: '', infiniteHearts: false,
        totalLessonTimeMinutes: 0, totalQuestionsAnswered: 0,
        totalHeartsLost: 0, mistakesFixed: 0,
      },
      lessonProgress: {},
      atomProgress: {},
      wrongAnswers: [],
      taskStats: {},
      achievements: [],
      lastUnlockedAchievement: null,
      currentLessonId: null,
      currentLessonStartTime: null,
      currentLessonHeartsLost: 0,
      heartRestoreCount: 0,
      exportCount: 0,
      dailyQuestProgress: {},
      leaderboardRanks: [],
      theoryTestsCompleted: {},
    })

    setLoading(false)
    setSuccess(true)
    setTimeout(() => {
      handleClose()
    }, 1200)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-duo-green/10 flex items-center justify-center">
                  <UserPlus size={20} className="text-duo-green" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">Новый ученик</h2>
                  <p className="text-xs text-gray-500">Добавьте профиль для отслеживания прогресса</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 text-red-700 bg-red-50 rounded-xl p-3 mb-4 text-sm"
                >
                  <span>{error}</span>
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 text-green-700 bg-green-50 rounded-xl p-3 mb-4 text-sm"
                >
                  <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
                  <span>Ученик добавлен! Переключаемся...</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Имя ученика</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например, Анна М."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-duo-green/30 focus:border-duo-green transition-all text-sm"
                  disabled={loading || success}
                  autoFocus
                />
              </div>

              {/* Class */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Класс / группа</label>
                <div className="relative">
                  <GraduationCap size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="10А, подготовка к ЕГЭ..."
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-duo-green/30 focus:border-duo-green transition-all text-sm"
                    disabled={loading || success}
                  />
                </div>
              </div>

              {/* Emoji selector */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Аватарка</label>
                <div className="grid grid-cols-8 gap-2">
                  {EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${
                        selectedEmoji === emoji
                          ? 'bg-duo-green text-white ring-2 ring-duo-green/30'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                      disabled={loading || success}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || success}
                className="w-full py-2.5 bg-duo-green text-white font-bold rounded-xl hover:bg-duo-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <span>Добавить ученика</span>
                )}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
