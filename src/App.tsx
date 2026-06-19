import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { Dashboard } from './pages/Dashboard'
import { CourseMap } from './pages/CourseMap'
import { Lesson } from './pages/Lesson'
import { Statistics } from './pages/Statistics'
import { Leaderboard } from './pages/Leaderboard'
import { Teacher } from './pages/Teacher'
import { Profile } from './pages/Profile'
import { AdaptivePractice } from './pages/AdaptivePractice'
import { AccentTrainer } from './pages/AccentTrainer'
import { Task5Trainer } from './pages/Task5Trainer'
import { Task10Trainer } from './pages/Task10Trainer'
import { Task16Trainer } from './pages/Task16Trainer'
import { Task6Trainer } from './pages/Task6Trainer'
import { Task7Trainer } from './pages/Task7Trainer'
import { Task8Trainer } from './pages/Task8Trainer'
import { Task9Trainer } from './pages/Task9Trainer'
import { Task11Trainer } from './pages/Task11Trainer'
import { Task12Trainer } from './pages/Task12Trainer'
import { Task13Trainer } from './pages/Task13Trainer'
import { Task14Trainer } from './pages/Task14Trainer'
import { Task15Trainer } from './pages/Task15Trainer'
import { MistakesReview } from './pages/MistakesReview'
import { MiniGames } from './pages/MiniGames'
import { StudentHomework } from './pages/StudentHomework'
import { MyHomework } from './pages/MyHomework'
import { ChallengesPage } from './pages/ChallengesPage'
import { ParentDashboard } from './pages/ParentDashboard'
import { TrainersPage } from './pages/TrainersPage'
import { AnalyticsPage } from './pages/AnalyticsPage'
import { TeacherClassroom } from './pages/TeacherClassroom'
import { JoinClass } from './pages/JoinClass'
import { ClassDetail } from './pages/ClassDetail'
import { AchievementToast } from './components/AchievementToast'
import { AuthModal } from './components/AuthModal'
import { achievements } from './data/achievements'
import { BookOpen, Map, BarChart3, Trophy, GraduationCap, Gamepad2, BookOpenText } from 'lucide-react'
import { useEffect, useState, useCallback, Suspense, lazy } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProgressStore } from './stores/progressStore'
import { useClassStore, ProgressData } from './stores/classStore'
import { useNotificationStore } from './stores/notificationStore'
import { useStudentStore } from './stores/studentStore'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { cacheProgress, syncProgressIfOnline } from './lib/offlineCache'

import TheoryPage from './pages/TheoryPage'
import TheoryEditorPage from './pages/TheoryEditorPage'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { path: '/', icon: BookOpen, label: 'Учиться' },
    { path: '/course', icon: Map, label: 'Курс' },
    { path: '/theory', icon: BookOpenText, label: 'Теория' },
    { path: '/stats', icon: BarChart3, label: 'Статистика' },
    { path: '/leaderboard', icon: Trophy, label: 'Рейтинг' },
  ]

  return (
    <nav className="bg-white border-t border-gray-100 px-4 py-3 sticky bottom-0 z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'text-duo-green' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={28} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

type SyncStatus = 'idle' | 'syncing' | 'saved' | 'error'

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isLesson = location.pathname.startsWith('/lesson/') || location.pathname === '/accent-trainer' || location.pathname === '/task10-trainer' || location.pathname === '/task5-trainer'
  const lastUnlocked = useProgressStore((s) => s.lastUnlockedAchievement)
  const clearLastAchievement = useProgressStore((s) => s.clearLastAchievement)
  const unlockedAchievement = lastUnlocked ? achievements.find(a => a.id === lastUnlocked) : null

  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle')
  const [userEmail, setUserEmail] = useState<string | null>(null)

  const userId = useProgressStore((s) => s.userId)
  const setUserId = useProgressStore((s) => s.setUserId)
  const loadProgress = useProgressStore((s) => s.loadProgress)
  const setUserName = useProgressStore((s) => s.setUserName)
  const syncProgress = useProgressStore((s) => s.syncProgress)

  // Check initial session on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const init = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session?.user) {
        setUserId(data.session.user.id)
        setUserEmail(data.session.user.email || null)
        if (data.session.user.user_metadata?.name) {
          setUserName(data.session.user.user_metadata.name)
        } else if (data.session.user.email) {
          setUserName(data.session.user.email.split('@')[0])
        }
        await loadProgress()
      }
    }
    init()
  }, [setUserId, loadProgress, setUserName])

  // Handle OAuth callback (Google auth redirect)
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const hash = window.location.hash
    if (hash.includes('auth-code-callback') || hash.includes('access_token')) {
      const handleCallback = async () => {
        const { data, error } = await supabase.auth.getSession()
        if (data?.session?.user) {
          setUserId(data.session.user.id)
          setUserEmail(data.session.user.email || null)
          if (data.session.user.user_metadata?.name) {
            setUserName(data.session.user.user_metadata.name)
          } else if (data.session.user.email) {
            setUserName(data.session.user.email.split('@')[0])
          }
          await loadProgress()
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname)
        }
        if (error) {
          console.error('OAuth callback error:', error)
        }
      }
      handleCallback()
    }
  }, [setUserId, loadProgress, setUserName])

  // Notifications setup
  const permission = useNotificationStore((s) => s.permission)
  const checkAndNotify = useNotificationStore((s) => s.checkAndNotify)
  const requestPermission = useNotificationStore((s) => s.requestPermission)

  useEffect(() => {
    if (permission === 'granted') {
      checkAndNotify()
    } else if (permission === 'default') {
      // Ask once after 10 seconds
      const timer = setTimeout(() => {
        requestPermission()
      }, 10000)
      return () => clearTimeout(timer)
    }
  }, [permission, checkAndNotify, requestPermission])

  // Listen to auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserId(session.user.id)
        setUserEmail(session.user.email || null)
        if (session.user.user_metadata?.name) {
          setUserName(session.user.user_metadata.name)
        } else if (session.user.email) {
          setUserName(session.user.email.split('@')[0])
        }
        await loadProgress()
      }
      if (event === 'SIGNED_OUT') {
        setUserId(null)
        setUserEmail(null)
      }
    })
    return () => {
      subscription.unsubscribe()
    }
  }, [setUserId, loadProgress, setUserName])

  // Auto-sync progress changes with 5s debounce
  useEffect(() => {
    if (!isSupabaseConfigured || !userId) return
    let timeout: ReturnType<typeof setTimeout>
    let isSyncing = false

    const unsubscribe = useProgressStore.subscribe((state) => {
      if (!state.userId || isSyncing) return
      clearTimeout(timeout)
      setSyncStatus('syncing')
      timeout = setTimeout(() => {
        isSyncing = true
        state.syncProgress().then(() => {
          setSyncStatus('saved')
          isSyncing = false
        }).catch(() => {
          setSyncStatus('error')
          isSyncing = false
        })
      }, 5000)
    })

    return () => {
      unsubscribe()
      clearTimeout(timeout)
    }
  }, [userId])

  // Reset saved status after a delay
  useEffect(() => {
    if (syncStatus === 'saved') {
      const t = setTimeout(() => setSyncStatus('idle'), 2000)
      return () => clearTimeout(t)
    }
  }, [syncStatus])

  // Check notifications on mount
  useEffect(() => {
    const checkNotifications = useNotificationStore.getState().checkAndNotify
    checkNotifications()
  }, [])

  // Auto-save progress to student store + IndexedDB
  useEffect(() => {
    const unsubscribe = useProgressStore.subscribe((state) => {
      const activeProfileId = useStudentStore.getState().activeProfileId
      if (!activeProfileId) return
      const progressSnapshot = {
        userStats: state.userStats,
        lessonProgress: state.lessonProgress,
        atomProgress: state.atomProgress,
        wrongAnswers: state.wrongAnswers,
        taskStats: state.taskStats,
        achievements: state.achievements,
        lastUnlockedAchievement: state.lastUnlockedAchievement,
        currentLessonId: state.currentLessonId,
        currentLessonStartTime: state.currentLessonStartTime,
        currentLessonHeartsLost: state.currentLessonHeartsLost,
        heartRestoreCount: state.heartRestoreCount,
        exportCount: state.exportCount,
        dailyQuestProgress: state.dailyQuestProgress,
        leaderboardRanks: state.leaderboardRanks,
        theoryTestsCompleted: state.theoryTestsCompleted,
        isTeacher: state.isTeacher,
        userId: state.userId,
      }
      useStudentStore.getState().updateActiveProfile(progressSnapshot)
      useStudentStore.getState().addHistoryPoint(progressSnapshot)
      // Cache in IndexedDB for offline access
      syncProgressIfOnline(progressSnapshot).catch(() => {})
    })
    return () => unsubscribe()
  }, [])

  // Auto-sync progress to class store (for class leaderboard)
  useEffect(() => {
    const unsubscribe = useProgressStore.subscribe((state) => {
      const activeProfileId = useStudentStore.getState().activeProfileId
      if (!activeProfileId) return
      const classStore = useClassStore.getState()
      const studentClass = classStore.getStudentClass(activeProfileId)
      if (!studentClass) return
      const progressSnapshot: ProgressData = {
        userStats: state.userStats,
        lessonProgress: state.lessonProgress,
        taskStats: state.taskStats,
        achievements: state.achievements,
        atomProgress: state.atomProgress,
        wrongAnswers: state.wrongAnswers,
        theoryTestsCompleted: state.theoryTestsCompleted,
        dailyQuestProgress: state.dailyQuestProgress,
      }
      classStore.updateStudentProgress(studentClass.id, activeProfileId, progressSnapshot)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => console.log('[OfflineCache] Online')
    const handleOffline = () => console.log('[OfflineCache] Offline')
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleLogout = useCallback(async () => {
    if (!isSupabaseConfigured) return
    await supabase.auth.signOut()
    setUserId(null)
    setUserEmail(null)
    setSyncStatus('idle')
  }, [setUserId])

  const syncIndicator = (
    <div className="flex items-center gap-1.5">
      {syncStatus === 'syncing' && (
        <span className="text-xs text-duo-blue font-medium">Синхронизация...</span>
      )}
      {syncStatus === 'saved' && (
        <span className="text-xs text-duo-green font-medium">Сохранено</span>
      )}
      {syncStatus === 'error' && (
        <span className="text-xs text-red-500 font-medium">Ошибка сохранения</span>
      )}
      {userId ? (
        <button
          onClick={handleLogout}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Выйти
        </button>
      ) : (
        <button
          onClick={() => setAuthModalOpen(true)}
          className="text-xs text-duo-green font-bold hover:underline"
        >
          Войти
        </button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-duo-snow flex flex-col">
      {!isLesson && <Header syncIndicator={syncIndicator} />}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <AchievementToast
        achievement={unlockedAchievement || null}
        onClose={clearLastAchievement}
      />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/auth" element={<AuthModal isOpen={true} onClose={() => navigate('/')} />} />
          <Route path="/theory" element={<Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duo-green" /></div>}><TheoryPage /></Suspense>} />
          <Route path="/theory-editor" element={<Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duo-green" /></div>}><TheoryEditorPage /></Suspense>} />
          <Route path="/theory-editor/:taskNumber" element={<Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duo-green" /></div>}><TheoryEditorPage /></Suspense>} />
          <Route path="/course" element={<CourseMap />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/teacher/classroom" element={<TeacherClassroom />} />
          <Route path="/teacher/:studentName" element={<StudentHomework />} />
          <Route path="/join-class" element={<JoinClass />} />
          <Route path="/class/:classId" element={<ClassDetail />} />
          <Route path="/challenges" element={<ChallengesPage />} />
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-homework" element={<MyHomework />} />
          <Route path="/practice" element={<AdaptivePractice />} />
          <Route path="/mistakes" element={<MistakesReview />} />
          <Route path="/trainers" element={<TrainersPage />} />
          <Route path="/games" element={<MiniGames />} />
          <Route path="/accent-trainer" element={<AccentTrainer />} />
          <Route path="/task6-trainer" element={<Task6Trainer />} />
          <Route path="/task7-trainer" element={<Task7Trainer />} />
          <Route path="/task8-trainer" element={<Task8Trainer />} />
          <Route path="/task9-trainer" element={<Task9Trainer />} />
          <Route path="/task5-trainer" element={<Task5Trainer />} />
          <Route path="/task10-trainer" element={<Task10Trainer />} />
          <Route path="/task11-trainer" element={<Task11Trainer />} />
          <Route path="/task12-trainer" element={<Task12Trainer />} />
          <Route path="/task13-trainer" element={<Task13Trainer />} />
          <Route path="/task14-trainer" element={<Task14Trainer />} />
          <Route path="/task15-trainer" element={<Task15Trainer />} />
          <Route path="/task16-trainer" element={<Task16Trainer />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
        </Routes>
      </main>
      {!isLesson && <BottomNav />}
    </div>
  )
}
