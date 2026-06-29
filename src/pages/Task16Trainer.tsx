// ⚠️ AGENT NOTICE: All wrong answers go to progressStore.wrongAnswers (unified bank)
// UPDATED V4 — refactored to BaseTrainer
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { task16QuestionsById } from '../data/questions/task16'
import { BaseTrainer } from '../components/BaseTrainer'

export function Task16Trainer() {
  const questions = Object.values(task16QuestionsById)

  return (
    <BaseTrainer
      title="Пунктуация"
      taskNumber="16"
      questions={questions}
      getQuestionId={(q) => q.id}
      getQuestionText={(q) => q.instruction}
      getOptions={(q) => q.sentences.map((s) => s.text)}
      getCorrectAnswer={(q) => {
        const correct = q.sentences.find((s) => s.id === q.correctAnswer)
        return correct ? [correct.text] : []
      }}
      getExplanation={(q) => q.explanation}
      getAtoms={() => ['task16']}
      xpPerCorrect={5}
      renderPrompt={(q) => (
        <>
          <p className="text-gray-700 text-sm leading-relaxed">{q.instruction}</p>
          <p className="text-xs text-gray-400 mt-2">{q.topic}</p>
        </>
      )}
      renderQuestion={({
        question,
        selectedAnswer,
        answerState,
        onSelect,
        disabled,
      }) => {
        return (
          <div className="w-full space-y-2">
            {question.sentences.map((sentence) => {
              const isSelected = selectedAnswer[0] === String(sentence.id)
              const isCorrectSentence = sentence.id === question.correctAnswer
              const showCorrect =
                answerState !== 'idle' && isCorrectSentence
              const showWrong =
                answerState !== 'idle' && isSelected && !isCorrectSentence
              const showMissed =
                answerState !== 'idle' &&
                !isSelected &&
                isCorrectSentence
              const showCorrectChoice =
                answerState !== 'idle' && isSelected && isCorrectSentence

              return (
                <motion.button
                  key={sentence.id}
                  onClick={() => onSelect([String(sentence.id)])}
                  disabled={disabled}
                  whileHover={disabled ? {} : { scale: 1.01 }}
                  whileTap={disabled ? {} : { scale: 0.99 }}
                  className={`w-full bg-white rounded-xl p-4 shadow-sm border-2 transition-all text-left ${
                    showCorrect || showCorrectChoice
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
                        showCorrect || showCorrectChoice || showMissed
                          ? 'bg-green-400 text-white'
                          : showWrong
                          ? 'bg-red-400 text-white'
                          : isSelected
                          ? 'bg-duo-blue text-white'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {showCorrect || showMissed || showCorrectChoice ? (
                        <Check size={16} />
                      ) : showWrong ? (
                        <X size={16} />
                      ) : (
                        String.fromCharCode(64 + sentence.id)
                      )}
                    </div>
                    <div className="flex-1 text-sm text-gray-700 leading-relaxed">
                      {sentence.text}
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
