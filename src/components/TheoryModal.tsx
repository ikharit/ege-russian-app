import { motion } from 'framer-motion'
import { BookOpen, X, ArrowRight } from 'lucide-react'
import { TheoryLesson } from '../data/theoryData'
import { TheoryViewer } from './TheoryViewer'

interface TheoryModalProps {
  theory: TheoryLesson
  onClose: () => void
  onStart?: () => void
  actionLabel?: string
}

export function TheoryModal({ theory, onClose, onStart, actionLabel }: TheoryModalProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="relative mt-auto bg-white rounded-t-2xl max-h-[90vh] flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-duo-blue/10 flex items-center justify-center">
            <BookOpen size={20} className="text-duo-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium">{theory.category}</p>
            <p className="font-bold text-gray-800 text-sm truncate">
              Задание {theory.taskNumber === 'Сочинение' ? '27 (Сочинение)' : theory.taskNumber}. {theory.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto px-5 py-4 flex-1">
          <TheoryViewer text={theory.theoryText} />
        </div>

        {/* Footer action */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0">
          {onStart ? (
            <button
              onClick={onStart}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {actionLabel || 'Начать практику'}
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={onClose}
              className="btn-primary w-full"
            >
              Закрыть
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
