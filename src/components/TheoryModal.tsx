import { motion } from 'framer-motion'
import { BookOpen, X, ArrowRight } from 'lucide-react'
import { TheoryLesson } from '../data/theoryData'

interface TheoryModalProps {
  theory: TheoryLesson
  onClose: () => void
  onStart?: () => void
  actionLabel?: string
}

/**
 * Simple heuristic formatter for raw theory text.
 * Splits text into blocks and applies basic styling based on line patterns.
 */
function formatTheoryText(text: string): JSX.Element[] {
  const lines = text.split('\n')
  const blocks: JSX.Element[] = []
  let currentList: string[] = []
  let key = 0

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push(
        <ul key={`list-${key++}`} className="list-disc list-inside space-y-1 my-3 text-gray-700">
          {currentList.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed">{item}</li>
          ))}
        </ul>
      )
      currentList = []
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) {
      flushList()
      continue
    }

    // Detect headers by patterns
    const isHeader =
      line.length < 80 &&
      (
        line.startsWith('О чём') ||
        line.startsWith('Как задание') ||
        line.startsWith('Как выглядит') ||
        line.startsWith('Теория') ||
        line.startsWith('Правило') ||
        line.startsWith('Применение') ||
        line.startsWith('Резюме') ||
        line.startsWith('Закрепи') ||
        line.startsWith('Нюансы') ||
        line.startsWith('Разделы') ||
        line.startsWith('In summa') ||
        line.startsWith('Page') ||
        line.startsWith('LESSON') ||
        line.startsWith('0/') ||
        line.startsWith('CORRECT') ||
        line.startsWith('Sign in') ||
        /^\d+\)\.?\s/.test(line) ||
        /^[IVX]+\./.test(line) ||
        /^№\d/.test(line)
      )

    const isListItem = line.startsWith('- ') || line.startsWith('• ')
    const isTableRow = line.includes('\t')

    if (isHeader) {
      flushList()
      blocks.push(
        <h3 key={`h-${key++}`} className="font-bold text-gray-800 mt-4 mb-2 text-sm uppercase tracking-wide">
          {line}
        </h3>
      )
    } else if (isListItem) {
      currentList.push(line.slice(2))
    } else if (isTableRow) {
      flushList()
      const cells = line.split('\t').map(c => c.trim()).filter(Boolean)
      blocks.push(
        <div key={`tr-${key++}`} className="grid gap-2 my-2 text-sm text-gray-700">
          {cells.map((cell, ci) => (
            <div key={ci} className="bg-gray-50 rounded-lg px-3 py-2">{cell}</div>
          ))}
        </div>
      )
    } else {
      // Regular paragraph
      if (currentList.length > 0) {
        // If previous line was list, check if this is a continuation
        if (!line.match(/^\d+\./) && !line.match(/^[a-z]\)/i)) {
          flushList()
        }
      }
      if (!currentList.length) {
        blocks.push(
          <p key={`p-${key++}`} className="text-sm text-gray-700 leading-relaxed my-2">
            {line}
          </p>
        )
      }
    }
  }

  flushList()
  return blocks
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
          {formatTheoryText(theory.theoryText)}
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
