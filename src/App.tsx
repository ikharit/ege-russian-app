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
import { MistakesReview } from './pages/MistakesReview'
import { MiniGames } from './pages/MiniGames'
import { StudentHomework } from './pages/StudentHomework'
import { MyHomework } from './pages/MyHomework'
import { ShareResultPage } from './pages/ShareResultPage'
import { WeakSpots } from './pages/WeakSpots'
import { AchievementToast } from './components/AchievementToast'
import { achievements } from './data/achievements'
import { BookOpen, Map, BarChart3, Trophy, GraduationCap, Gamepad2, BookOpenText } from 'lucide-react'
import { useEffect, Suspense, lazy } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProgressStore } from './stores/progressStore'

import TheoryPage from './pages/TheoryPage'
import TheoryEditorPage from './pages/TheoryEditorPage'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { path: '/', icon: BookOpen, label: 'Учиться' },
    { path: '/course', icon: Map, label: 'Курс' },
    { path: '/theory', icon: BookOpenText, label: 'Теория' },
    { path: '/games', icon: Gamepad2, label: 'Игры' },
    { path: '/stats', icon: BarChart3, label: 'Статистика' },
    { path: '/leaderboard', icon: Trophy, label: 'Рейтинг' },
    { path: '/teacher', icon: GraduationCap, label: 'Учитель' },
  ]

  return (
    <nav className="bg-white border-t border-gray-100 px-4 py-2 sticky bottom-0 z-50">
      <div className="max-w-md mx-auto flex justify-around">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                isActive ? 'text-duo-green' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default function App() {
  const location = useLocation()
  const isLesson = location.pathname.startsWith('/lesson/') || location.pathname === '/accent-trainer' || location.pathname === '/task10-trainer' || location.pathname === '/task5-trainer' || location.pathname === '/task16-trainer'
  const lastUnlocked = useProgressStore((s) => s.lastUnlockedAchievement)
  const clearLastAchievement = useProgressStore((s) => s.clearLastAchievement)
  const unlockedAchievement = lastUnlocked ? achievements.find(a => a.id === lastUnlocked) : null

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-duo-snow flex flex-col">
      {!isLesson && <Header />}
      <AchievementToast
        achievement={unlockedAchievement || null}
        onClose={clearLastAchievement}
      />
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/theory" element={<Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duo-green" /></div>}><TheoryPage /></Suspense>} />
          <Route path="/theory-editor" element={<Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duo-green" /></div>}><TheoryEditorPage /></Suspense>} />
          <Route path="/theory-editor/:taskNumber" element={<Suspense fallback={<div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-duo-green" /></div>}><TheoryEditorPage /></Suspense>} />
          <Route path="/course" element={<CourseMap />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/teacher/:studentName" element={<StudentHomework />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-homework" element={<MyHomework />} />
          <Route path="/practice" element={<AdaptivePractice />} />
          <Route path="/mistakes" element={<WeakSpots />} />
          <Route path="/games" element={<MiniGames />} />
          <Route path="/accent-trainer" element={<AccentTrainer />} />
          <Route path="/task5-trainer" element={<Task5Trainer />} />
          <Route path="/task16-trainer" element={<Task16Trainer />} />
          <Route path="/task10-trainer" element={<Task10Trainer />} />
          <Route path="/share" element={<ShareResultPage />} />
        </Routes>
      </main>
      {!isLesson && <BottomNav />}
    </div>
  )
}
