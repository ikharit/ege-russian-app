import { motion } from 'framer-motion'
import { BaseTrainer } from '../components/BaseTrainer'
import { task13AtomQuestions } from '../data/questions/task13_atom'

function TwoButtonQuestion({
  question,
  selectedAnswer,
  answerState,
  onSelect,
  disabled,
}: {
  question: any
  selectedAnswer: string[]
  answerState: 'idle' | 'correct' | 'wrong'
  onSelect: (answer: string[]) => void
  disabled: boolean
}) {
  const options = ['слитно', 'раздельно']

  return (
    <div className="w-full space-y-6">
      <p className="text-gray-800 text-lg font-medium mb-4 whitespace-pre-line text-center">
        {question.text}
      </p>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => {
          const isSelected = selectedAnswer[0] === option
          const isCorrect = answerState === 'correct' && isSelected
          const isWrong = answerState === 'wrong' && isSelected

          return (
            <motion.button
              key={option}
              onClick={() => !disabled && onSelect([option])}
              disabled={disabled}
              whileHover={disabled ? {} : { scale: 1.02 }}
              whileTap={disabled ? {} : { scale: 0.98 }}
              className={`relative rounded-xl border-2 p-4 text-center font-medium text-lg transition-all ${
                isCorrect
                  ? 'border-green-400 bg-green-50 text-green-700'
                  : isWrong
                  ? 'border-red-400 bg-red-50 text-red-700'
                  : isSelected
                  ? 'border-duo-blue bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white hover:border-gray-300 text-gray-700'
              }`}
            >
              {option === 'слитно' ? 'Слитно' : 'Раздельно'}
            </motion.button>
          )
        })}
      </div>
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
            : `✗ Правильный ответ: ${question.correctAnswer[0]}`}
        </motion.div>
      )}
    </div>
  )
}

export function Task13Trainer() {
  return (
    <BaseTrainer
      title="НЕ / НИ с частями речи"
      taskNumber="13"
      questions={task13AtomQuestions}
      getQuestionId={(q) => q.id}
      getQuestionText={(q) => q.text}
      getOptions={(q) => ['слитно', 'раздельно']}
      getCorrectAnswer={(q) => q.correctAnswer}
      getExplanation={(q) => q.explanation}
      getAtoms={() => ['task13', 'ne_ni']}
      xpPerCorrect={5}
      renderPrompt={() => (
        <p className="text-gray-700 text-sm leading-relaxed text-center">
          Выберите, как пишется слово с НЕ/НИ: <strong>слитно</strong> или <strong>раздельно</strong>
        </p>
      )}
      renderQuestion={({
        question,
        selectedAnswer,
        answerState,
        onSelect,
        disabled,
      }) => (
        <TwoButtonQuestion
          question={question}
          selectedAnswer={selectedAnswer}
          answerState={answerState}
          onSelect={onSelect}
          disabled={disabled}
        />
      )}
    />
  )
}
