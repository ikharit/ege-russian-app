import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { Statistics } from './Statistics'
import { useProgressStore } from '../stores/progressStore'

// Mock recharts to avoid SVG rendering issues in jsdom
vi.mock('recharts', () => ({
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  RadarChart: ({ children }: any) => <div data-testid="radar-chart">{children}</div>,
  PolarGrid: () => null,
  PolarAngleAxis: () => null,
  PolarRadiusAxis: () => null,
  Radar: () => null,
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('../components/EGEScorePredictor', () => ({
  EGEScorePredictor: () => <div data-testid="ege-predictor">Predictor</div>,
}))

vi.mock('../stores/progressStore', () => ({
  useProgressStore: vi.fn((selector: any) => {
    const state = {
      lessonProgress: {
        'lesson-dooshin-9-1': { status: 'completed', bestScore: 80 },
        'lesson-dooshin-16-1': { status: 'completed', bestScore: 90 },
      },
      userStats: { xp: 100, streak: 5, level: 2, maxStreak: 5, lastActivityDate: '', hearts: 5, maxHearts: 5, achievements: [], name: 'test', lastHeartRestore: '', infiniteHearts: false, totalLessonTimeMinutes: 0, totalQuestionsAnswered: 0, totalHeartsLost: 0, mistakesFixed: 0 },
      taskStats: {},
      examResults: [],
      wrongAnswers: [],
      examDate: null,
      predictiveScoreHistory: [],
    }
    return selector(state)
  }),
}))

describe('Statistics', () => {
  it('renders without crashing', () => {
    render(<MemoryRouter><Statistics /></MemoryRouter>)
    expect(screen.getByText('Статистика')).toBeTruthy()
  })

  it('shows dooshin progress merged into base sections', () => {
    render(<MemoryRouter><Statistics /></MemoryRouter>)
    // Dooshin lessons should not appear as a separate section bar
    expect(screen.queryByText('Дощинский')).toBeNull()
    // Should show chart containers
    expect(screen.getAllByTestId('bar-chart').length).toBeGreaterThan(0)
  })
})
