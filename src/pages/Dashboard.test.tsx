import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Dashboard } from './Dashboard'
import { useProgressStore } from '../stores/progressStore'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('../stores/progressStore', () => ({
  useProgressStore: vi.fn((selector: any) => {
    const state = {
      lessonProgress: {
        'lesson-dooshin-9-1': { status: 'completed' },
      },
      userStats: { xp: 100, streak: 5, level: 2, maxStreak: 5, lastActivityDate: '', hearts: 5, maxHearts: 5, achievements: [], name: 'test', lastHeartRestore: '', infiniteHearts: false, totalLessonTimeMinutes: 0, totalQuestionsAnswered: 0, totalHeartsLost: 0, mistakesFixed: 0 },
      currentLessonId: null,
      currentLessonStartTime: null,
      atomProgress: {},
    }
    return selector(state)
  }),
}))

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
}))

describe('Dashboard', () => {
  it('renders without crashing', () => {
    render(<Dashboard />)
    expect(screen.getByText(/Дощинский/i)).toBeTruthy()
  })

  it('shows dooshin section card', () => {
    render(<Dashboard />)
    expect(screen.getByText(/Отработки из Дощинского/i)).toBeTruthy()
  })
})
