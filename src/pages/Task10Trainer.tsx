// Task 10 Trainer — Prefixes (ПРЕ/ПРИ, Ъ/Ь, Ы/И)
import { task10Questions } from '../data/questions/task10'
import { BaseTrainer } from '../components/BaseTrainer'

export function Task10Trainer() {
  return (
    <BaseTrainer
      title="ПРЕ/ПРИ, Ъ/Ь, Ы/И"
      taskNumber="10"
      questions={task10Questions}
      getQuestionId={(q) => q.id}
      getQuestionText={(q) => q.text}
      getOptions={(q) => q.options || []}
      getCorrectAnswer={(q) => q.correctAnswer}
      getExplanation={(q) => q.explanation}
      getAtoms={() => ['task10']}
      xpPerCorrect={5}
      renderPrompt={() => (
        <p className="text-gray-700 text-sm leading-relaxed">
          Впишите пропущенную букву.
        </p>
      )}
      renderQuestion={({
        question,
        selectedAnswer,
        answerState,
        onSelect,
        disabled,
      }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          if (disabled) return
          onSelect([e.target.value.toLowerCase().trim()])
        }

        const correct = question.correctAnswer[0] || ''
        const showCorrect = answerState !== 'idle'
        const isCorrect = selectedAnswer[0]?.toLowerCase() === correct.toLowerCase()
        const showWrong = answerState === 'wrong'

        return (
          <div className="w-full space-y-4">
            <p className="text-gray-800 text-lg font-medium whitespace-pre-line">
              {question.text}
            </p>
            <input
              type="text"
              value={selectedAnswer[0] || ''}
              onChange={handleChange}
              disabled={disabled}
              maxLength={1}
              className={`w-24 h-16 text-center text-2xl font-bold rounded-2xl border-2 outline-none transition-all mx-auto block
                ${showCorrect
                  ? isCorrect
                    ? 'border-green-400 bg-green-50 text-green-700'
                    : 'border-red-400 bg-red-50 text-red-700'
                  : 'border-gray-200 bg-white text-gray-800 focus:border-duo-blue focus:bg-blue-50'
                }
              `}
              placeholder="?"
            />
            {showWrong && (
              <p className="text-sm text-red-500 text-center">
                Правильный ответ: <strong>{correct}</strong>
              </p>
            )}
          </div>
        )
      }}
    />
  )
}
