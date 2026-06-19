// ⚠️ AGENT NOTICE: All wrong answers go to progressStore.wrongAnswers (unified bank)
// Do NOT add local error storage. Use: recordWrongAnswer() + updateTaskStats('4', false)
// UPDATED V4 — refactored to BaseTrainer
import { motion } from 'framer-motion'
import { allAccentWords, accentWordsById } from '../data/accentWords'
import { BaseTrainer } from '../components/BaseTrainer'
import { VoiceInputButton } from '../components/VoiceInputButton'

export function AccentTrainer() {
  return (
    <BaseTrainer
      title="Ударения"
      taskNumber="4"
      questions={allAccentWords}
      getQuestionId={(q) => q.id}
      getQuestionText={(q) => q.word}
      getOptions={(q) => q.normalized.split('')}
      getCorrectAnswer={(q) => [q.normalized[q.stressIndex]]}
      getExplanation={(q) => q.explanation}
      getAtoms={() => ['task4']}
      xpPerCorrect={5}
      renderPrompt={() => (
        <p className="text-gray-700 text-sm leading-relaxed text-center">
          Выберите <strong>ударную букву</strong> в слове
        </p>
      )}
      renderQuestion={({ question, selectedAnswer, answerState, onSelect, disabled }) => {
        const letters = question.normalized.split('')
        const selectedIndex = selectedAnswer.length > 0 ? question.normalized.indexOf(selectedAnswer[0]) : -1

        return (
          <div className="flex flex-col items-center gap-6">
            <div className="flex flex-wrap justify-center gap-2">
              {letters.map((letter, index) => {
                const isSelected = selectedIndex === index
                const isCorrect = answerState === 'correct' && index === question.stressIndex
                const isWrong = answerState === 'wrong' && isSelected && index !== question.stressIndex
                const showCorrect = answerState === 'wrong' && index === question.stressIndex

                let btnClass = 'bg-white text-gray-800 border-2 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                if (isCorrect || showCorrect) {
                  btnClass = 'bg-duo-green text-white border-2 border-duo-green'
                } else if (isWrong) {
                  btnClass = 'bg-red-400 text-white border-2 border-red-400'
                } else if (isSelected) {
                  btnClass = 'bg-duo-blue text-white border-2 border-duo-blue'
                }

                return (
                  <motion.button
                    key={`${question.id}-${index}`}
                    whileHover={disabled ? {} : { scale: 1.08 }}
                    whileTap={disabled ? {} : { scale: 0.95 }}
                    onClick={() => onSelect([letter])}
                    disabled={disabled}
                    className={`w-12 h-14 sm:w-14 sm:h-16 rounded-xl font-bold text-xl sm:text-2xl flex items-center justify-center transition-all shadow-sm ${btnClass}`}
                  >
                    {letter.toUpperCase()}
                  </motion.button>
                )
              })}
            </div>
            <VoiceInputButton
              onSelect={onSelect}
              correctAnswer={[question.normalized[question.stressIndex]]}
              disabled={disabled}
            />
          </div>
        )
      }}
    />
  )
}
