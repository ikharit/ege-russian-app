import { motion } from 'framer-motion'
import { BookOpen, CheckCircle, XCircle, Lightbulb, Tag } from 'lucide-react'
import type { TheoryRule } from '../data/theory'

interface Props {
  rules: TheoryRule[]
  title?: string
  showExamples?: boolean
}

export function TheoryQuickReference({ rules, title, showExamples = true }: Props) {
  if (rules.length === 0) return null

  return (
    <div className="space-y-3">
      {title && (
        <div className="flex items-center gap-2 text-duo-blue mb-2">
          <BookOpen size={18} />
          <h3 className="font-bold text-sm">{title}</h3>
        </div>
      )}
      {rules.map((rule, idx) => (
        <motion.div
          key={rule.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05 }}
          className="bg-white border border-duo-blue/20 rounded-xl p-3"
        >
          <div className="flex items-start gap-2 mb-1">
            <Lightbulb size={16} className="text-duo-yellow shrink-0 mt-0.5" />
            <p className="font-bold text-sm text-gray-800">{rule.title}</p>
          </div>
          <p className="text-xs text-gray-600 mb-2 leading-relaxed">{rule.content}</p>
          {showExamples && rule.examples.length > 0 && (
            <div className="space-y-1">
              {rule.examples.slice(0, 4).map((ex, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <CheckCircle size={12} className="text-duo-green shrink-0" />
                  <span className="font-medium text-gray-800">{ex.correct}</span>
                  {ex.incorrect && (
                    <>
                      <XCircle size={12} className="text-duo-red shrink-0" />
                      <span className="text-gray-400 line-through">{ex.incorrect}</span>
                    </>
                  )}
                  {ex.note && (
                    <span className="text-gray-400 ml-1">({ex.note})</span>
                  )}
                </div>
              ))}
              {rule.examples.length > 4 && (
                <p className="text-xs text-gray-400 italic">
                  +{rule.examples.length - 4} примеров
                </p>
              )}
            </div>
          )}
          {rule.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {rule.tags.map(tag => (
                <span key={tag} className="flex items-center gap-0.5 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                  <Tag size={8} />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
