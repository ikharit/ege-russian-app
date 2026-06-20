import { BaseTrainer } from '../components/BaseTrainer'
import { task3Questions } from '../data/task3Questions'

export function Task3Trainer() {
  return (
    <BaseTrainer
      title="Задание 3. Ударения"
      taskNumber="3"
      questions={task3Questions}
      getQuestionId={(q) => q.id}
      getQuestionText={(q) => q.text}
      getOptions={(q) => q.options}
      getCorrectAnswer={(q) => q.correctAnswer}
      getExplanation={(q) => q.explanation}
      getAtoms={() => ['task3']}
      xpPerCorrect={5}
      renderPrompt={() => (
        <p className="text-gray-700 text-sm leading-relaxed">
          Укажите варианты ответов, в которых в обоих словах ряда пропущена одна и та же буква.
        </p>
      )}
      renderQuestion={({
        question,
        selectedAnswer,
        answerState,
        onSelect,
        disabled,
      }) => {
        const toggleOption = (opt: string) => {
          if (disabled) return
          onSelect(
            selectedAnswer.includes(opt)
              ? selectedAnswer.filter((r) => r !== opt)
              : [...selectedAnswer, opt]
          )
        }

        return (
          <div className="w-full space-y-4">
            <p className="text-sm font-medium text-gray-800">{question.question}</p>
            <div className="grid grid-cols-1 gap-2">
              {question.options.map((opt) => {
                const isSelected = selectedAnswer.includes(opt)
                const isCorrect = question.correctAnswer.includes(opt)
                const showCorrect = answerState !== 'idle' && isCorrect
                const showWrong = answerState !== 'idle' && isSelected && !isCorrect
                return (
                  <button
                    key={opt}
                    onClick={() => toggleOption(opt)}
                    disabled={disabled}
                    className={`p-3 rounded-xl text-sm font-medium transition-all border-2 text-left ${
                      showCorrect
                        ? 'bg-green-100 border-green-400 text-green-700'
                        : showWrong
                        ? 'bg-red-100 border-red-400 text-red-700'
                        : isSelected
                        ? 'bg-duo-blue/10 border-duo-blue text-duo-blue'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-duo-blue/50'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        )
      }}
    />
  )
}
