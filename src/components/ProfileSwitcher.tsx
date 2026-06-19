import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, UserPlus, SwitchCamera, Trash2 } from 'lucide-react'
import { useStudentStore } from '../stores/studentStore'
import { useProgressStore } from '../stores/progressStore'

interface ProfileSwitcherProps {
  onAddStudent: () => void
}

export function ProfileSwitcher({ onAddStudent }: ProfileSwitcherProps) {
  const [open, setOpen] = useState(false)
  const profiles = useStudentStore((s) => s.profiles)
  const activeProfileId = useStudentStore((s) => s.activeProfileId)
  const switchProfile = useStudentStore((s) => s.switchProfile)
  const deleteProfile = useStudentStore((s) => s.deleteProfile)
  const activeProfile = useStudentStore((s) => s.getActiveProfile())

  if (profiles.length === 0) {
    return (
      <button
        onClick={onAddStudent}
        className="flex items-center gap-2 px-3 py-1.5 bg-duo-green text-white rounded-full text-sm font-bold hover:bg-duo-green/90 transition-colors"
      >
        <UserPlus size={14} />
        Добавить ученика
      </button>
    )
  }

  const handleSwitch = (id: string) => {
    if (id === activeProfileId) {
      setOpen(false)
      return
    }
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
    switchProfile(id, progressSnapshot)
    const newProfile = useStudentStore.getState().getProfileById(id)
    if (newProfile) {
      useProgressStore.setState((state) => ({
        ...state,
        ...newProfile.progress,
        userStats: {
          ...newProfile.progress.userStats,
          name: newProfile.name,
        }
      }))
    }
    setOpen(false)
  }

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    if (confirm('Удалить ученика? Прогресс будет безвозвратно потерян.')) {
      deleteProfile(id)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm font-bold hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">{activeProfile?.emoji || '🎓'}</span>
        <span className="text-gray-800 max-w-[80px] truncate">{activeProfile?.name || 'ученик'}</span>
        <ChevronDown size={14} className="text-gray-400" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2"
            >
              <p className="px-3 py-1 text-xs text-gray-400 font-bold uppercase tracking-wide">Ученики</p>
              {profiles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSwitch(p.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    p.id === activeProfileId ? 'bg-duo-green/5 text-duo-green font-bold' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{p.emoji}</span>
                    <div className="text-left">
                      <p className="text-sm">{p.name}</p>
                      {p.className && <p className="text-[10px] text-gray-400">{p.className}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {p.id === activeProfileId && <SwitchCamera size={12} className="text-duo-green" />}
                    <button
                      onClick={(e) => handleDelete(e, p.id)}
                      className="p-1 hover:bg-red-50 rounded text-gray-300 hover:text-red-400 transition-colors"
                      title="Удалить"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </button>
              ))}
              <div className="border-t border-gray-100 mt-1 pt-1">
                <button
                  onClick={() => { setOpen(false); onAddStudent() }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-duo-green font-bold hover:bg-duo-green/5 transition-colors"
                >
                  <UserPlus size={14} />
                  Добавить ученика
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
