import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Send, Check } from 'lucide-react'
import { QuestionFeedback as QuestionFeedbackType } from '../types'
import { useProgressStore } from '../stores/progressStore'

interface QuestionFeedbackProps {
  questionId: string
  userAnswer?: string
}

const feedbackTypes = [
  { value: 'wrong_answer' as const, label: 'Неправильный ответ' },
  { value: 'unclear' as const, label: 'Непонятное объяснение' },
  { value: 'typo' as const, label: 'Опечатка' },
  { value: 'other' as const, label: 'Другое' },
]

export function QuestionFeedback({ questionId, userAnswer }: QuestionFeedbackProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedType, setSelectedType] = useState<QuestionFeedbackType['type'] | null>(null)
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const submitFeedback = useProgressStore((s) => s.submitFeedback)

  const handleSubmit = () => {
    if (!selectedType) return
    const feedback: QuestionFeedbackType = {
      questionId,
      type: selectedType,
      message: message.trim(),
      userAnswer,
      timestamp: new Date().toISOString(),
    }
    submitFeedback(feedback)
    setSubmitted(true)
    setTimeout(() => {
      setIsOpen(false)
      setSubmitted(false)
      setSelectedType(null)
      setMessage('')
    }, 2000)
  }

  return (
    <div className="mt-2">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
        >
          <AlertTriangle size={12} />
          Сообщить об ошибке
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-xl p-3 border border-gray-100"
          >
            {submitted ? (
              <div className="flex items-center gap-2 text-duo-green text-sm py-2">
                <Check size={16} />
                <span>Спасибо! Мы проверим.</span>
              </div>
            ) : (
              <>
                <p className="text-xs font-medium text-gray-600 mb-2">Что не так с этим вопросом?</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {feedbackTypes.map((ft) => (
                    <button
                      key={ft.value}
                      onClick={() => setSelectedType(ft.value)}
                      className={`text-xs px-2.5 py-1 rounded-lg border transition-colors ${
                        selectedType === ft.value
                          ? 'border-duo-blue bg-blue-50 text-duo-blue font-medium'
                          : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {ft.label}
                    </button>
                  ))}
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Опишите проблему (опционально)..."
                  className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none focus:outline-none focus:border-duo-blue mb-2"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedType}
                    className="text-xs px-3 py-1.5 rounded-lg bg-duo-blue text-white font-medium disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <Send size={12} />
                    Отправить
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false)
                      setSelectedType(null)
                      setMessage('')
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
                  >
                    Отмена
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
