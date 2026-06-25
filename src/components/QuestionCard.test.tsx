import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { QuestionCard } from './QuestionCard'
import { Question } from '../types'

vi.mock('../data/theory', () => ({
  getRelevantRules: vi.fn(() => []),
}))

vi.mock('./TheoryQuickReference', () => ({
  TheoryQuickReference: () => null,
}))

const baseQuestion = (overrides: Partial<Question>): Question => ({
  id: 'test-q',
  type: 'single',
  text: 'Как правильно?',
  options: ['правильно', 'неправильно'],
  correctAnswer: ['правильно'],
  explanation: 'Потому что так',
  difficulty: 'easy',
  xpReward: 10,
  ...overrides,
})

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>)

describe('QuestionCard', () => {
  it('renders question text and options', () => {
    renderWithRouter(
      <QuestionCard
        question={baseQuestion({})}
        questionNumber={1}
        totalQuestions={5}
        onAnswer={vi.fn()}
        onNext={vi.fn()}
        heartsLeft={5}
      />
    )
    expect(screen.getByText('Как правильно?')).toBeDefined()
    expect(screen.getByText('правильно')).toBeDefined()
    expect(screen.getByText('неправильно')).toBeDefined()
  })

  it('allows selecting an option and checking answer', () => {
    const onAnswer = vi.fn()
    renderWithRouter(
      <QuestionCard
        question={baseQuestion({})}
        questionNumber={1}
        totalQuestions={5}
        onAnswer={onAnswer}
        onNext={vi.fn()}
        heartsLeft={5}
      />
    )
    fireEvent.click(screen.getByText('правильно'))
    fireEvent.click(screen.getByText('Проверить'))
    expect(onAnswer).toHaveBeenCalledWith(true, ['правильно'], 0)
  })

  it('shows correct answer styling after check', () => {
    renderWithRouter(
      <QuestionCard
        question={baseQuestion({})}
        questionNumber={1}
        totalQuestions={5}
        onAnswer={vi.fn()}
        onNext={vi.fn()}
        heartsLeft={5}
      />
    )
    fireEvent.click(screen.getByText('неправильно'))
    fireEvent.click(screen.getByText('Проверить'))
    expect(screen.getByText('Неправильно')).toBeDefined()
    expect(screen.getByText(/Правильный ответ/)).toBeDefined()
  })

  it('handles text input type', () => {
    const onAnswer = vi.fn()
    renderWithRouter(
      <QuestionCard
        question={baseQuestion({
          type: 'text',
          options: undefined,
          correctAnswer: ['ОТВЕТ'],
        })}
        questionNumber={1}
        totalQuestions={5}
        onAnswer={onAnswer}
        onNext={vi.fn()}
        heartsLeft={5}
      />
    )
    const input = screen.getByPlaceholderText('Впишите ответ...')
    fireEvent.change(input, { target: { value: 'ответ' } })
    fireEvent.click(screen.getByText('Проверить'))
    expect(onAnswer).toHaveBeenCalledWith(true, ['ответ'], 0)
  })

  it('handles multiple correct answers (multiple type)', () => {
    const onAnswer = vi.fn()
    renderWithRouter(
      <QuestionCard
        question={baseQuestion({
          type: 'multiple',
          options: ['а', 'б', 'в', 'г'],
          correctAnswer: ['а', 'б'],
        })}
        questionNumber={1}
        totalQuestions={5}
        onAnswer={onAnswer}
        onNext={vi.fn()}
        heartsLeft={5}
      />
    )
    fireEvent.click(screen.getByText('а'))
    fireEvent.click(screen.getByText('б'))
    fireEvent.click(screen.getByText('Проверить'))
    expect(onAnswer).toHaveBeenCalledWith(true, ['а', 'б'], 0)
  })

  it('disables options after check', () => {
    renderWithRouter(
      <QuestionCard
        question={baseQuestion({})}
        questionNumber={1}
        totalQuestions={5}
        onAnswer={vi.fn()}
        onNext={vi.fn()}
        heartsLeft={5}
      />
    )
    fireEvent.click(screen.getByText('правильно'))
    fireEvent.click(screen.getByText('Проверить'))
    expect(screen.getByText('Понятно, дальше →')).toBeDefined()
  })

  it('calls onNext when clicking Далее', () => {
    const onNext = vi.fn()
    renderWithRouter(
      <QuestionCard
        question={baseQuestion({})}
        questionNumber={1}
        totalQuestions={5}
        onAnswer={vi.fn()}
        onNext={onNext}
        heartsLeft={5}
      />
    )
    fireEvent.click(screen.getByText('правильно'))
    fireEvent.click(screen.getByText('Проверить'))
    fireEvent.click(screen.getByText('Понятно, дальше →'))
    expect(onNext).toHaveBeenCalled()
  })

  it('shows Завершить on last question', () => {
    renderWithRouter(
      <QuestionCard
        question={baseQuestion({})}
        questionNumber={5}
        totalQuestions={5}
        onAnswer={vi.fn()}
        onNext={vi.fn()}
        heartsLeft={5}
      />
    )
    fireEvent.click(screen.getByText('правильно'))
    fireEvent.click(screen.getByText('Проверить'))
    expect(screen.getByText('Завершить')).toBeDefined()
  })
})
