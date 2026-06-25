import { Routes, Route } from 'react-router-dom'
import { Header } from './components/Header'
import { ClassHeatmapPage } from './pages/ClassHeatmapPage'
import { AutoHomeworkPage } from './pages/AutoHomeworkPage'
import { FriendsPage } from './pages/FriendsPage'
import { FlashcardsPage } from './pages/FlashcardsPage'
import { TodayPage } from './pages/TodayPage'
import { Dashboard } from './pages/Dashboard'
import { CourseMap } from './pages/CourseMap'
import { Lesson } from './pages/Lesson'
import { Statistics } from './pages/Statistics'
import { AchievementToast } from './components/AchievementToast'
import { AuthModal } from './components/AuthModal'
import { SyncStatus } from './components/SyncStatus'
import { achievements } from './data/achievements'
import { BookOpen, Map, BarChart3, GraduationCap, Gamepad2, BookOpenText, LayoutGrid } from 'lucide-react'
import { useEffect, useState, useCallback, Suspense, lazy } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProgressStore } from './stores/progressStore'
import { useClassStore, ProgressData } from './stores/classStore'
import { useNotificationStore } from './stores/notificationStore'
import { useSettingsStore } from './stores/settingsStore'
import { useAnalyticsStore } from './stores/analyticsStore'
import { supabase, isSupabaseConfigured } from './lib/supabase'
import { cacheProgress, syncProgressIfOnline } from './lib/offlineCache'
import { usePageAnalytics } from './hooks/usePageAnalytics'
import type { EventCategory } from './stores/analyticsStore'

import { FeedbackDashboard } from './components/FeedbackDashboard'
import TheoryPage from './pages/TheoryPage'

// Map routes to analytics categories
function getPageCategory(path: string): EventCategory {
  if (path === '/' || path === '/dashboard') return 'dashboard'
  if (path.startsWith('/lesson')) return 'lesson'
  if (path.includes('trainer') || path.includes('task') || path.includes('accent')) return 'trainer'
  if (path.includes('theory')) return 'theory'
  if (path.includes('exam') || path.includes('variant')) return 'exam'
  if (path.includes('flashcard')) return 'flashcard'
  if (path.includes('profile')) return 'profile'
  if (path.includes('leaderboard')) return 'leaderboard'
  if (path.includes('chat')) return 'chat'
  if (path.includes('game') || path.includes('mini')) return 'game'
  if (path.includes('duel')) return 'duel'
  if (path.includes('marathon')) return 'marathon'
  if (path.includes('adaptive') || path.includes('practice')) return 'adaptive'
  if (path.includes('mistake') || path.includes('error') || path.includes('weak')) return 'mistakes'
  if (path.includes('stats') || path.includes('growth') || path.includes('comparison')) return 'dashboard'
  if (path.includes('teacher') || path.includes('classroom')) return 'other'
  return 'other'
}

// Lazy-loaded pages (rarely used, heavy bundles) — all use named exports, wrap with default
const Task3SwipeTrainer = lazy(() => import('./pages/Task3SwipeTrainer').then(m => ({ default: m.Task3SwipeTrainer })))
const Task25SwipeTrainer = lazy(() => import('./pages/Task25SwipeTrainer').then(m => ({ default: m.Task25SwipeTrainer })))
const ShareResultPage = lazy(() => import('./pages/ShareResultPage').then(m => ({ default: m.ShareResultPage })))
const Leaderboard = lazy(() => import('./pages/Leaderboard').then(m => ({ default: m.Leaderboard })))
const TeacherAnalytics = lazy(() => import('./pages/TeacherAnalytics').then(m => ({ default: m.TeacherAnalytics })))
const Teacher = lazy(() => import('./pages/Teacher').then(m => ({ default: m.Teacher })))
const Profile = lazy(() => import('./pages/Profile').then(m => ({ default: m.Profile })))
const AdaptivePractice = lazy(() => import('./pages/AdaptivePractice').then(m => ({ default: m.AdaptivePractice })))
const AccentTrainer = lazy(() => import('./pages/AccentTrainer').then(m => ({ default: m.AccentTrainer })))
const Task5Trainer = lazy(() => import('./pages/Task5Trainer').then(m => ({ default: m.Task5Trainer })))
const Task6Trainer = lazy(() => import('./pages/Task6Trainer').then(m => ({ default: m.Task6Trainer })))
const Task7Trainer = lazy(() => import('./pages/Task7Trainer').then(m => ({ default: m.Task7Trainer })))
const Task8Trainer = lazy(() => import('./pages/Task8Trainer').then(m => ({ default: m.Task8Trainer })))
const Task9Trainer = lazy(() => import('./pages/Task9Trainer').then(m => ({ default: m.Task9Trainer })))
const Task10Trainer = lazy(() => import('./pages/Task10Trainer').then(m => ({ default: m.Task10Trainer })))
const Task11Trainer = lazy(() => import('./pages/Task11Trainer').then(m => ({ default: m.Task11Trainer })))
const Task12Trainer = lazy(() => import('./pages/Task12Trainer').then(m => ({ default: m.Task12Trainer })))
const Task13Trainer = lazy(() => import('./pages/Task13Trainer').then(m => ({ default: m.Task13Trainer })))
const Task14Trainer = lazy(() => import('./pages/Task14Trainer').then(m => ({ default: m.Task14Trainer })))
const Task15Trainer = lazy(() => import('./pages/Task15Trainer').then(m => ({ default: m.Task15Trainer })))
const Task16Trainer = lazy(() => import('./pages/Task16Trainer').then(m => ({ default: m.Task16Trainer })))
const MiniGames = lazy(() => import('./pages/MiniGames').then(m => ({ default: m.MiniGames })))
const StudentHomework = lazy(() => import('./pages/StudentHomework').then(m => ({ default: m.StudentHomework })))
const MyHomework = lazy(() => import('./pages/MyHomework').then(m => ({ default: m.MyHomework })))
const ChallengesPage = lazy(() => import('./pages/ChallengesPage').then(m => ({ default: m.ChallengesPage })))
const ParentDashboard = lazy(() => import('./pages/ParentDashboard').then(m => ({ default: m.ParentDashboard })))
const TrainersPage = lazy(() => import('./pages/TrainersPage').then(m => ({ default: m.TrainersPage })))
const ExamVariantsList = lazy(() => import('./pages/ExamVariantsList').then(m => ({ default: m.ExamVariantsList })))
const EssayTopicsList = lazy(() => import('./pages/EssayTopicsList').then(m => ({ default: m.EssayTopicsList })))
const JoinClass = lazy(() => import('./pages/JoinClass').then(m => ({ default: m.JoinClass })))
const ClassDetail = lazy(() => import('./pages/ClassDetail').then(m => ({ default: m.ClassDetail })))
const TheoryEditorPage = lazy(() => import('./pages/TheoryEditorPage'))
const MistakesReview = lazy(() => import('./pages/MistakesReview').then(m => ({ default: m.MistakesReview })))
const ErrorAnalysisPage = lazy(() => import('./pages/ErrorAnalysisPage').then(m => ({ default: m.ErrorAnalysisPage })))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage').then(m => ({ default: m.AnalyticsPage })))
const TeacherClassroom = lazy(() => import('./pages/TeacherClassroom').then(m => ({ default: m.TeacherClassroom })))
const StudyPlanPage = lazy(() => import('./pages/StudyPlanPage').then(m => ({ default: m.StudyPlanPage })))
const AdaptiveTrainerPage = lazy(() => import('./pages/AdaptiveTrainerPage').then(m => ({ default: m.AdaptiveTrainerPage })))
const ExamVariantPage = lazy(() => import('./pages/ExamVariantPage').then(m => ({ default: m.ExamVariantPage })))
const ExamResultsPage = lazy(() => import('./pages/ExamResultsPage').then(m => ({ default: m.ExamResultsPage })))
const EssayPage = lazy(() => import('./pages/EssayPage').then(m => ({ default: m.EssayPage })))
const DuelPage = lazy(() => import('./pages/DuelPage').then(m => ({ default: m.DuelPage })))
const MarathonPage = lazy(() => import('./pages/MarathonPage').then(m => ({ default: m.MarathonPage })))
const WeeklySchedulePage = lazy(() => import('./pages/WeeklySchedulePage').then(m => ({ default: m.WeeklySchedulePage })))
const ChatPage = lazy(() => import('./pages/ChatPage').then(m => ({ default: m.ChatPage })))
const ComparisonPage = lazy(() => import('./pages/ComparisonPage').then(m => ({ default: m.ComparisonPage })))
const KnowledgeMap = lazy(() => import('./pages/KnowledgeMap').then(m => ({ default: m.KnowledgeMap })))
const GrowthPage = lazy(() => import('./pages/GrowthPage').then(m => ({ default: m.GrowthPage })))
const Task1Trainer = lazy(() => import('./pages/Task1Trainer').then(m => ({ default: m.Task1Trainer })))
const Task2Trainer = lazy(() => import('./pages/Task2Trainer').then(m => ({ default: m.Task2Trainer })))
const Task3Trainer = lazy(() => import('./pages/Task3Trainer').then(m => ({ default: m.Task3Trainer })))
const Task18Trainer = lazy(() => import('./pages/Task18Trainer').then(m => ({ default: m.Task18Trainer })))
const Task22Trainer = lazy(() => import('./pages/Task22Trainer').then(m => ({ default: m.Task22Trainer })))
const Task24Trainer = lazy(() => import('./pages/Task24Trainer').then(m => ({ default: m.Task24Trainer })))
const Task25Trainer = lazy(() => import('./pages/Task25Trainer').then(m => ({ default: m.Task25Trainer })))

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { path: '/', icon: BookOpen, label: 'Сегодня' },
    { path: '/course', icon: Map, label: 'Курс' },
    { path: '/theory', icon: BookOpenText, label: 'Теория' },
    { path: '/stats', icon: BarChart3, label: 'Статистика' },
    { path: '/dashboard', icon: LayoutGrid, label: 'Обзор' },
  ]

  return (
    <nav className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3 sticky bottom-0 z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1.5 px-3 py-2 rounded-xl transition-colors ${
                isActive ? 'text-duo-green' : 'text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300'
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
  const location = useLocation()
  
  // Track page analytics
  const pageCategory = getPageCategory(location.pathname)
  usePageAnalytics(pageCategory)
  
  const navigate = useNavigate()
  const isLesson = location.pathname.startsWith('/lesson/') || location.pathname === '/accent-trainer' || location.pathname === '/task10-trainer' || location.pathname === '/task5-trainer' || location.pathname.startsWith('/exam/') || location.pathname.startsWith('/essay/')
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

  // Handle OAuth callback (Google auth redirect)
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const hash = window.location.hash
    if (hash.includes('auth-code-callback') || hash.includes('access_token')) {
      const handleCallback = async () => {
        const { data, error } = await supabase.auth.getSession()
        if (data?.session?.user) {
          setUserId(data.session.user.id)
          useAnalyticsStore.getState().setUserId(data.session.user.id)
          setUserEmail(data.session.user.email || null)
          if (data.session.user.user_metadata?.name) {
            setUserName(data.session.user.user_metadata.name)
          } else if (data.session.user.email) {
            setUserName(data.session.user.email.split('@')[0])
          }
          await loadProgress()
          await useAnalyticsStore.getState().loadAnalytics()
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname)
        }
        if (error) {
          if (import.meta.env.DEV) console.error('OAuth callback error:', error)
        }
      }
      handleCallback()
    }
  }, [setUserId, loadProgress, setUserName])

  // Notifications setup
  const permission = useNotificationStore((s) => s.permission)
  const checkAndNotify = useNotificationStore((s) => s.checkAndNotify)
  const requestPermission = useNotificationStore((s) => s.requestPermission)
  const initFCM = useNotificationStore((s) => s.initFCM)
  const onForegroundMessage = useNotificationStore((s) => s.onForegroundMessage)
  const addNotification = useNotificationStore((s) => s.addNotification)
  const sendLocalNotification = useNotificationStore((s) => s.sendLocalNotification)
  const [fcmToast, setFcmToast] = useState<{title: string; body: string; type: string} | null>(null)

  useEffect(() => {
    // Initialize FCM (registers service worker)
    initFCM().catch(() => {})
  }, [initFCM])

  useEffect(() => {
    // Initialize mobile features (haptics, status bar, push, etc.)
    // initMobile is not available in this build
    // initMobile().catch(() => {})
  }, [])

  useEffect(() => {
    // Listen for foreground FCM messages
    const unsub = onForegroundMessage((payload) => {
      setFcmToast({ title: payload.title, body: payload.body, type: payload.type })
      // Auto-hide after 5s
      setTimeout(() => setFcmToast(null), 5000)
    })
    return unsub
  }, [onForegroundMessage])

  useEffect(() => {
    if (permission === 'granted') {
      checkAndNotify()
    } else if (permission === 'default') {
      // Ask once after 15 seconds with context
      const timer = setTimeout(() => {
        // Show a custom toast first explaining why we need notifications
        if ('Notification' in window) {
          requestPermission().then((granted) => {
            if (granted) {
              addNotification({
                type: 'achievement',
                title: '🔔 Уведомления включены!',
                body: 'Теперь ты не пропустишь стрик и дедлайны.',
              })
            }
          })
        }
      }, 15000)
      return () => clearTimeout(timer)
    }
  }, [permission, checkAndNotify, requestPermission, addNotification])

  // Listen to auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        setUserId(session.user.id)
        useAnalyticsStore.getState().setUserId(session.user.id)
        setUserEmail(session.user.email || null)
        if (session.user.user_metadata?.name) {
          setUserName(session.user.user_metadata.name)
        } else if (session.user.email) {
          setUserName(session.user.email.split('@')[0])
        }
        await loadProgress()
        await useAnalyticsStore.getState().loadAnalytics()
      }
      if (event === 'SIGNED_OUT') {
        setUserId(null)
        useAnalyticsStore.getState().setUserId(null)
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

  // Auto-sync progress to class store (for class leaderboard)
  useEffect(() => {
    const unsubscribe = useProgressStore.subscribe((state) => {
      const userId = state.userId
      if (!userId) return
      const classStore = useClassStore.getState()
      const studentClass = classStore.getStudentClass(userId)
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
        behaviorProfile: (() => {
          const bp = useAnalyticsStore.getState().getBehaviorProfile()
          return {
            mostActiveCategory: bp.mostActiveCategory,
            leastActiveCategory: bp.leastActiveCategory,
            preferredLearningTime: bp.preferredLearningTime,
            sessionFrequency: bp.sessionFrequency,
            avgSessionDuration: bp.avgSessionDuration,
            totalClicks: bp.totalClicks,
            totalSessions: bp.totalSessions,
            topClickedElements: bp.topClickedElements,
            timeDistribution: bp.timeDistribution,
            clickDistribution: bp.clickDistribution,
            motivationSignals: bp.motivationSignals,
          }
        })(),
      }
      classStore.updateStudentProgress(studentClass.id, activeProfileId, progressSnapshot)
    })
    return () => unsubscribe()
  }, [])

  // Take daily analytics snapshot + sync
  useEffect(() => {
    const takeSnapshot = useAnalyticsStore.getState().takeSnapshot
    const syncAnalytics = useAnalyticsStore.getState().syncAnalytics
    const interval = setInterval(() => {
      takeSnapshot()
      syncAnalytics().catch(() => {})
    }, 5 * 60 * 1000) // every 5 minutes
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  // Firebase init
  useEffect(() => {
    let cleanup: (() => void) | undefined
    const init = async () => {
      const { useFirebaseStore } = await import('./stores/firebaseStore')
      await useFirebaseStore.getState().initFirebase()
      cleanup = useFirebaseStore.getState().setupOfflineListener()
    }
    init()
    return () => {
      if (cleanup) cleanup()
    }
  }, [])

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => {
      import('./stores/firebaseStore').then(({ useFirebaseStore }) => {
        useFirebaseStore.getState().processOfflineQueue().catch(() => {})
      })
    }
    const handleOffline = () => {}
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

  const syncIndicator = isSupabaseConfigured ? (
    <div className="flex items-center gap-1.5">
      <SyncStatus />
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
  ) : null

  // Theme effect
  const theme = useSettingsStore((s) => s.theme)
  useEffect(() => {
    const effective = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : theme
    if (effective === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen bg-duo-snow dark:bg-gray-900 flex flex-col">
      {!isLesson && <Header syncIndicator={syncIndicator} />}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      {/* FCM Foreground Toast */}
      <AnimatePresence>
        {fcmToast && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-4 left-1/2 z-[60] max-w-sm w-[90%] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 p-4 flex items-start gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-duo-green/10 flex items-center justify-center shrink-0">
              <span className="text-lg">
                {fcmToast.type === 'streak' ? '🔥' :
                 fcmToast.type === 'homework' ? '📚' :
                 fcmToast.type === 'exam' ? '⏰' :
                 fcmToast.type === 'daily_quest' ? '🎯' :
                 fcmToast.type === 'srs' ? '🔁' :
                 fcmToast.type === 'achievement' ? '🏆' :
                 fcmToast.type === 'level_up' ? '🎉' : '🔔'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{fcmToast.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{fcmToast.body}</p>
            </div>
            <button
              onClick={() => setFcmToast(null)}
              className="text-gray-400 hover:text-gray-600 shrink-0"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <AchievementToast
        achievement={unlockedAchievement || null}
        onClose={clearLastAchievement}
      />
      <main className="flex-1 overflow-auto">
        <Suspense fallback={
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duo-green" />
          </div>
        }>
          <Routes>
            <Route path="/" element={<TodayPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/auth" element={<AuthModal isOpen={true} onClose={() => navigate('/')} />} />
            <Route path="/theory" element={<TheoryPage />} />
            <Route path="/theory-editor" element={<TheoryEditorPage />} />
            <Route path="/theory-editor/:taskNumber" element={<TheoryEditorPage />} />
            <Route path="/course" element={<CourseMap />} />
            <Route path="/lesson/:lessonId" element={<Lesson />} />
            <Route path="/stats" element={<Statistics />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/teacher/heatmap" element={<ClassHeatmapPage />} />
            <Route path="/teacher/auto-homework" element={<AutoHomeworkPage />} />
            <Route path="/teacher" element={<Teacher />} />
            <Route path="/teacher/classroom" element={<TeacherClassroom />} />
            <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
            <Route path="/teacher/:studentName" element={<StudentHomework />} />
            <Route path="/join-class" element={<JoinClass />} />
            <Route path="/class/:classId" element={<ClassDetail />} />
            <Route path="/challenges" element={<ChallengesPage />} />
            <Route path="/parent" element={<ParentDashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-homework" element={<MyHomework />} />
            <Route path="/practice" element={<AdaptivePractice />} />
            <Route path="/mistakes" element={<MistakesReview />} />
            <Route path="/error-analysis" element={<ErrorAnalysisPage />} />
            <Route path="/adaptive-trainer" element={<AdaptiveTrainerPage />} />
            <Route path="/trainers" element={<TrainersPage />} />
            <Route path="/study-plan" element={<StudyPlanPage />} />
            <Route path="/flashcards" element={<FlashcardsPage />} />
            <Route path="/friends" element={<FriendsPage />} />
            <Route path="/games" element={<MiniGames />} />
            <Route path="/exam" element={<ExamVariantsList />} />
            <Route path="/exam/:variantId" element={<ExamVariantPage />} />
            <Route path="/exam/:variantId/results" element={<ExamResultsPage />} />
            <Route path="/essay" element={<EssayTopicsList />} />
            <Route path="/essay/:topicId" element={<EssayPage />} />
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
            <Route path="/task1-trainer" element={<Task1Trainer />} />
            <Route path="/task2-trainer" element={<Task2Trainer />} />
            <Route path="/task3-trainer" element={<Task3Trainer />} />
            <Route path="/task18-trainer" element={<Task18Trainer />} />
            <Route path="/task22-trainer" element={<Task22Trainer />} />
            <Route path="/task24-trainer" element={<Task24Trainer />} />
            <Route path="/task25-trainer" element={<Task25Trainer />} />
            <Route path="/task3-swipe" element={<Task3SwipeTrainer />} />
            <Route path="/task25-swipe" element={<Task25SwipeTrainer />} />
            <Route path="/task16-trainer" element={<Task16Trainer />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/duel" element={<DuelPage />} />
            <Route path="/marathon" element={<MarathonPage />} />
            <Route path="/weekly-schedule" element={<WeeklySchedulePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/comparison" element={<ComparisonPage />} />
            <Route path="/knowledge-map" element={<KnowledgeMap />} />
            <Route path="/growth" element={<GrowthPage />} />
            <Route path="/share" element={<ShareResultPage />} />
            <Route path="/feedback-dashboard" element={<FeedbackDashboard />} />
          </Routes>
        </Suspense>
      </main>
      {!isLesson && <BottomNav />}
    </div>
  )
}
