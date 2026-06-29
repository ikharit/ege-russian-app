// ⚠️ AGENT NOTICE: All wrong answers go to progressStore.wrongAnswers (unified bank)
// UPDATED V4 — refactored to BaseTrainer
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { task10QuestionsById } from '../data/questions/task10'
import { BaseTrainer } from '../components/BaseTrainer'

export function Task10Trainer() {
  const questions = Object.values(task10QuestionsById)

  return (
    <BaseTrainer
      title="ПРЕ/ПРИ, Ъ/Ь, Ы/И"
      taskNumber="10"
      questions={questions}
      getQuestionId={(q) => q.id}
      getQuestionText={(q) =>
        q.rows.map((r) => r.words.join(', ')).join(' / ')
      }
      getOptions={(q) => q.rows.map((r) => r.words.join(', '))}
      getCorrectAnswer={(q) => q.correctAnswers.map((id) => 'ряд ' + id)}
      getExplanation={(q) => q.explanation}
      getAtoms={() => ['task10']}
      xpPerCorrect={5}
      renderPrompt={() => (
        <p className="text-gray-700 text-sm leading-relaxed">
          Укажите варианты ответов, в которых{' '}
          <strong>во всех словах одного ряда</strong> пропущена{' '}
          <strong>одна и та же буква</strong>. Запишите номера ответов.
        </p>
      )}
      renderQuestion={({
        question,
        selectedAnswer,
        answerState,
        onSelect,
        disabled,
      }) => {
        const handleRowToggle = (rowId: number) => {
          if (disabled) return
          const idStr = String(rowId)
          onSelect(
            selectedAnswer.includes(idStr)
              ? selectedAnswer.filter((r) => r !== idStr)
              : [...selectedAnswer, idStr]
          )
        }

        return (
          <div className="w-full space-y-3">
            {question.rows.map((row) => {
              const isSelected = selectedAnswer.includes(String(row.id))
              const isCorrectRow = question.correctAnswers.includes(row.id)
              const showCorrect =
                answerState !== 'idle' && isCorrectRow
              const showWrong =
                answerState !== 'idle' && isSelected && !isCorrectRow
              const showMissed =
                answerState !== 'idle' && !isSelected && isCorrectRow

              return (
                <motion.button
                  key={row.id}
                  onClick={() => handleRowToggle(row.id)}
                  disabled={disabled}
                  whileHover={disabled ? {} : { scale: 1.01 }}
                  whileTap={disabled ? {} : { scale: 0.99 }}
                  className={`w-full bg-white rounded-2xl p-4 shadow-sm border-2 transition-all text-left ${
                    showCorrect
                      ? 'border-green-400 bg-green-50'
                      : showWrong
                      ? 'border-red-400 bg-red-50'
                      : showMissed
                      ? 'border-green-300 bg-green-50/50'
                      : isSelected
                      ? 'border-duo-blue bg-blue-50'
                      : 'border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                        showCorrect
                          ? 'bg-green-400 text-white'
                          : showWrong
                          ? 'bg-red-400 text-white'
                          : showMissed
                          ? 'bg-green-200 text-green-700'
                          : isSelected
                          ? 'bg-duo-blue text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {showCorrect || showMissed ? (
                        <Check size={16} />
                      ) : showWrong ? (
                        <X size={16} />
                      ) : (
                        row.id
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {row.words.map((word, idx) => (
                          <span key={idx} className="text-lg text-gray-800">
                            {word.split('___').map((part, pIdx) => (
                              <span key={pIdx}>
                                {part}
                                {pIdx < word.split('___').length - 1 && (
                                  <span className="text-gray-400 mx-0.5">
                                    ___
                                  </span>
                                )}
                              </span>
                            ))}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        )
      }}
    />
  )
}
