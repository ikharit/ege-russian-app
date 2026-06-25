import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BaseTrainer } from '../components/BaseTrainer'
import { task12Questions } from '../data/task12Questions'

function TextInputQuestion({
  question,
  selectedAnswer,
  answerState,
  onSelect,
  disabled,
  correctAnswer,
}: {
  question: any
  selectedAnswer: string[]
  answerState: 'idle' | 'correct' | 'wrong'
  onSelect: (answer: string[]) => void
  disabled: boolean
  correctAnswer: string[]
}) {
  const [inputValue, setInputValue] = useState('')

  // Очищаем input при смене вопроса (когда selectedAnswer пустой)
  useEffect(() => {
    if (selectedAnswer.length === 0) {
      setInputValue('')
    }
  }, [selectedAnswer])

  const handleSubmit = () => {
    if (!inputValue.trim()) return
    onSelect([inputValue.trim()])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="w-full space-y-4">
      <p className="text-gray-800 text-lg font-medium mb-4 whitespace-pre-line text-center">
        {question.text}
      </p>
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder="Впишите окончание..."
          className={`flex-1 rounded-xl border-2 p-4 text-center text-lg font-medium transition-all outline-none ${
            answerState === 'correct'
              ? 'border-green-400 bg-green-50 text-green-700'
              : answerState === 'wrong'
              ? 'border-red-400 bg-red-50 text-red-700'
              : 'border-gray-200 bg-white focus:border-duo-blue focus:ring-2 focus:ring-blue-100'
          }`}
          autoFocus
        />
      </div>
      {answerState === 'idle' && (
        <motion.button
          onClick={handleSubmit}
          disabled={!inputValue.trim()}
          whileHover={!inputValue.trim() ? {} : { scale: 1.02 }}
          whileTap={!inputValue.trim() ? {} : { scale: 0.98 }}
          className="w-full rounded-xl bg-duo-green text-white font-bold py-3 px-4 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow transition-all"
        >
          Проверить
        </motion.button>
      )}
      {answerState !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-center font-medium ${
            answerState === 'correct'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {answerState === 'correct'
            ? '✓ Правильно!'
            : `✗ Правильный ответ: ${correctAnswer[0]}`}
        </motion.div>
      )}
    </div>
  )
}

export function Task12Trainer() {
  return (
    <BaseTrainer
      title="Окончания причастий и деепричастий"
      taskNumber="12"
      questions={task12Questions}
      getQuestionId={(q) => q.id}
      getQuestionText={(q) => q.text}
      getOptions={(q) => q.options}
      getCorrectAnswer={(q) => q.correctAnswer}
      getExplanation={(q) => q.explanation}
      getAtoms={() => ['task12']}
      xpPerCorrect={5}
      renderPrompt={() => (
        <p className="text-gray-700 text-sm leading-relaxed text-center">
          Впишите пропущенное окончание причастия или деепричастия
        </p>
      )}
      renderQuestion={({
        question,
        selectedAnswer,
        answerState,
        onSelect,
        disabled,
      }) => (
        <TextInputQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          answerState={answerState}
          onSelect={onSelect}
          disabled={disabled}
          correctAnswer={question.correctAnswer}
        />
      )}
    />
  )
}
