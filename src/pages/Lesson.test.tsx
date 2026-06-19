import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Lesson } from './Lesson'

// Mock heavy dependencies
vi.mock('framer-motion', () => ({
  motion: { div: ({ children, ...props }: any) => <div {...props}>{children}</div> },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

vi.mock('../lib/sounds', () => ({
  playCorrectSound: vi.fn(),
  playWrongSound: vi.fn(),
  playLessonCompleteSound: vi.fn(),
  playComboSound: vi.fn(),
}))

vi.mock('../components/ComboToast', () => ({
  useComboToasts: () => ({ showComboToast: vi.fn(), ToastOverlay: () => null }),
}))

vi.mock('../components/Hearts', () => ({
  Hearts: () => <div data-testid="hearts">Hearts</div>,
}))

vi.mock('../components/ComboDisplay', () => ({
  ComboDisplay: ({ combo }: any) => <div data-testid="combo">Combo: {combo}</div>,
}))

vi.mock('../components/QuestionCard', () => ({
  QuestionCard: ({ question, onAnswer, onNext, questionNumber, totalQuestions }: any) => (
    <div data-testid="question-card">
      <p>{question.text}</p>
      <button onClick={() => onAnswer(true)}>Correct</button>
      <button onClick={() => onAnswer(false)}>Wrong</button>
      <button onClick={onNext}>Next</button>
      <span>{questionNumber}/{totalQuestions}</span>
    </div>
  ),
}))

vi.mock('../components/LessonResult', () => ({
  LessonResult: ({ onContinue, onRetry, correctCount, totalQuestions }: any) => (
    <div data-testid="lesson-result">
      <p>Result: {correctCount}/{totalQuestions}</p>
      <button onClick={onContinue}>Continue</button>
      <button onClick={onRetry}>Retry</button>
    </div>
  ),
}))

vi.mock('../components/TheoryModal', () => ({
  TheoryModal: ({ onClose }: any) => (
    <div data-testid="theory-modal">
      <button onClick={onClose}>Close</button>
    </div>
  ),
}))

vi.mock('../lib/theoryMapper', () => ({
  getTheoryForLesson: vi.fn(() => undefined),
}))

const mockLesson = {
  id: 'lesson-test-1',
  sectionId: 'section-test',
  title: 'Тестовый урок',
  type: 'practice',
  description: 'Описание',
  xpReward: 60,
  prerequisites: [],
  questions: [
    { id: 'q1', type: 'text', text: 'Вопрос 1', correctAnswer: ['а'], explanation: 'Потому что', difficulty: 'easy', xpReward: 10, atoms: ['task9'] },
    { id: 'q2', type: 'text', text: 'Вопрос 2', correctAnswer: ['о'], explanation: 'Потому что', difficulty: 'easy', xpReward: 10, atoms: ['task9'] },
  ],
}

const mockSection = {
  id: 'section-test',
  courseId: 'test',
  title: 'Тестовый раздел',
  subtitle: '',
  order: 1,
  icon: 'BookOpen',
  color: '#58cc02',
  lessons: [mockLesson],
}

vi.mock('../data/courseData', () => ({
  course: {
    id: 'test-course',
    title: 'Test',
    description: '',
    sections: [mockSection],
  },
}))

const mockStoreState = {
  userStats: { hearts: 5, maxHearts: 5, infiniteHearts: false, streak: 0, xp: 0, level: 1, maxStreak: 0, lastActivityDate: '', achievements: [], name: 'test', lastHeartRestore: '', totalLessonTimeMinutes: 0, totalQuestionsAnswered: 0, totalHeartsLost: 0, mistakesFixed: 0 },
  lessonProgress: {},
  startLesson: vi.fn(),
  completeLesson: vi.fn(),
  loseHeart: vi.fn(() => true), // returns true = still has hearts
  restoreHearts: vi.fn(),
  recordAtomAttempt: vi.fn(),
  recordWrongAnswer: vi.fn(),
  updateTaskStats: vi.fn(),
  recordQuestionAnswered: vi.fn(),
  updateQuestProgress: vi.fn(),
  currentLessonHeartsLost: 0,
  currentLessonStartTime: null,
}

vi.mock('../stores/progressStore', () => ({
  useProgressStore: vi.fn((selector: any) => {
    if (typeof selector === 'function') {
      return selector(mockStoreState)
    }
    return mockStoreState
  }),
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual as any,
    useParams: () => ({ lessonId: 'lesson-test-1' }),
    useNavigate: () => vi.fn(),
  }
})

describe('Lesson', () => {
  it('renders lesson not found for invalid lessonId', () => {
    vi.doMock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom')
      return {
        ...actual as any,
        useParams: () => ({ lessonId: 'non-existent' }),
        useNavigate: () => vi.fn(),
      }
    })
    const { Lesson: LessonInvalid } = require('./Lesson')
    render(<LessonInvalid />)
    expect(screen.getByText('Урок не найден')).toBeTruthy()
  })

  it('renders question card for valid lesson', () => {
    render(<Lesson />)
    expect(screen.getByTestId('question-card')).toBeTruthy()
    expect(screen.getByText('Вопрос 1')).toBeTruthy()
  })

  it('handles correct answer', () => {
    render(<Lesson />)
    const correctBtn = screen.getByText('Correct')
    fireEvent.click(correctBtn)
    expect(mockStoreState.recordQuestionAnswered).toHaveBeenCalled()
    expect(mockStoreState.updateQuestProgress).toHaveBeenCalledWith('quest-questions-5')
  })

  it('handles wrong answer and loses heart', () => {
    render(<Lesson />)
    const wrongBtn = screen.getByText('Wrong')
    fireEvent.click(wrongBtn)
    expect(mockStoreState.recordWrongAnswer).toHaveBeenCalled()
    expect(mockStoreState.loseHeart).toHaveBeenCalled()
  })

  it('shows lesson result after completing all questions', () => {
    render(<Lesson />)
    // Answer both questions correctly and click next
    fireEvent.click(screen.getByText('Correct'))
    fireEvent.click(screen.getByText('Next'))
    fireEvent.click(screen.getByText('Correct'))
    fireEvent.click(screen.getByText('Next'))
    expect(screen.getByTestId('lesson-result')).toBeTruthy()
  })
})
