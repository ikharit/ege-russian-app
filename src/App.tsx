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
import { AchievementToast } from './components/AchievementToast'
import { achievements } from './data/achievements'
import { BookOpen, Map, BarChart3, Trophy, GraduationCap } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useProgressStore } from './stores/progressStore'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = [
    { path: '/', icon: BookOpen, label: 'Учиться' },
    { path: '/course', icon: Map, label: 'Курс' },
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
  const isLesson = location.pathname.startsWith('/lesson/') || location.pathname === '/accent-trainer'
  const lastUnlocked = useProgressStore((s) => s.lastUnlockedAchievement)
  const clearLastAchievement = useProgressStore((s) => s.clearLastAchievement)
  const unlockedAchievement = lastUnlocked ? achievements.find(a => a.id === lastUnlocked) : null

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
          <Route path="/course" element={<CourseMap />} />
          <Route path="/lesson/:lessonId" element={<Lesson />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/teacher" element={<Teacher />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/practice" element={<AdaptivePractice />} />
          <Route path="/accent-trainer" element={<AccentTrainer />} />
        </Routes>
      </main>
      {!isLesson && <BottomNav />}
    </div>
  )
}
