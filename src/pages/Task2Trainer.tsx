import { BaseTrainer } from '../components/BaseTrainer'
import { task2Questions } from '../data/task2Questions'

export function Task2Trainer() {
  return (
    <BaseTrainer
      title="Задание 2. Текст"
      taskNumber="2"
      questions={task2Questions}
      getQuestionId={(q) => q.id}
      getQuestionText={(q) => q.text}
      getOptions={(q) => q.options}
      getCorrectAnswer={(q) => q.correctAnswer}
      getExplanation={(q) => q.explanation}
      getAtoms={() => ['task2']}
      xpPerCorrect={5}
      renderPrompt={() => (
        <p className="text-gray-700 text-sm leading-relaxed">
          Прочитайте текст. Выполните задание.
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
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed max-h-48 overflow-y-auto">
              {question.text.split('\n').map((p, i) => (
                <p key={i} className="mb-2">{p}</p>
              ))}
            </div>
            <p className="text-sm font-medium text-gray-800">{question.question}</p>
            <div className="grid grid-cols-4 gap-2">
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
                    className={`p-3 rounded-xl text-sm font-medium transition-all border-2 ${
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
