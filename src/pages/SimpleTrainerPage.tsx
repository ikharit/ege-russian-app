import { motion } from 'framer-motion'
import { BaseTrainer } from '../components/BaseTrainer'

export interface SimpleQuestion {
  id: string
  text: string
  options: string[]
  correctAnswer: string[]
  explanation: string
}

interface SimpleTrainerPageProps {
  title: string
  taskNumber: string
  questions: SimpleQuestion[]
  promptText?: string
}

export function SimpleTrainerPage({ title, taskNumber, questions, promptText }: SimpleTrainerPageProps) {
  return (
    <BaseTrainer
      title={title}
      taskNumber={taskNumber}
      questions={questions}
      getQuestionId={(q) => q.id}
      getQuestionText={(q) => q.text}
      getOptions={(q) => q.options}
      getCorrectAnswer={(q) => q.correctAnswer}
      getExplanation={(q) => q.explanation}
      getAtoms={() => [`task${taskNumber}`]}
      xpPerCorrect={5}
      renderPrompt={promptText ? () => (
        <p className="text-gray-700 text-sm leading-relaxed text-center">{promptText}</p>
      ) : undefined}
      renderQuestion={({ question, selectedAnswer, answerState, onSelect, disabled }) => {
        return (
          <div className="w-full space-y-3">
            <p className="text-gray-800 text-base font-medium mb-4 whitespace-pre-line">{question.text}</p>
            <div className="grid grid-cols-1 gap-2">
              {question.options.map((option) => {
                const isSelected = selectedAnswer[0] === option
                const isCorrect = answerState !== 'idle' && question.correctAnswer.includes(option)
                const isWrong = answerState !== 'idle' && isSelected && !question.correctAnswer.includes(option)
                const showMissed = answerState !== 'idle' && !isSelected && question.correctAnswer.includes(option)

                return (
                  <motion.button
                    key={option}
                    onClick={() => onSelect([option])}
                    disabled={disabled}
                    whileHover={disabled ? {} : { scale: 1.01 }}
                    whileTap={disabled ? {} : { scale: 0.99 }}
                    className={`w-full rounded-xl p-4 border-2 transition-all text-left ${
                      isCorrect
                        ? 'border-green-400 bg-green-50'
                        : isWrong
                        ? 'border-red-400 bg-red-50'
                        : showMissed
                        ? 'border-green-300 bg-green-50/50'
                        : isSelected
                        ? 'border-duo-blue bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-sm font-medium ${
                      isCorrect ? 'text-green-700' : isWrong ? 'text-red-700' : 'text-gray-700'
                    }`}>
                      {option}
                    </span>
                  </motion.button>
                )
              })}
            </div>
          </div>
        )
      }}
    />
  )
}
