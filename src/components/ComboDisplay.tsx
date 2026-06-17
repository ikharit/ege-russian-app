import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, TrendingUp } from 'lucide-react'

interface ComboDisplayProps {
  combo: number
  multiplier: number
}

export function ComboDisplay({ combo, multiplier }: ComboDisplayProps) {
  const [showBurst, setShowBurst] = useState(false)

  useEffect(() => {
    if (combo >= 3) {
      setShowBurst(true)
      const t = setTimeout(() => setShowBurst(false), 800)
      return () => clearTimeout(t)
    }
  }, [combo])

  if (combo < 2) return null

  const getColor = () => {
    if (combo >= 10) return 'text-purple-500'
    if (combo >= 7) return 'text-duo-purple'
    if (combo >= 5) return 'text-duo-yellow'
    if (combo >= 3) return 'text-duo-green'
    return 'text-gray-400'
  }

  const getLabel = () => {
    if (combo >= 10) return 'НЕВЕРОЯТНО!'
    if (combo >= 7) return 'МАШИНА!'
    if (combo >= 5) return 'ОГОНЬ!'
    if (combo >= 3) return 'Отлично!'
    return ''
  }

  return (
    <AnimatePresence>
      <motion.div
        className="flex items-center gap-2"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
      >
        <div className="relative">
          {showBurst && (
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 2, opacity: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Zap size={20} className={getColor()} />
            </motion.div>
          )}
          <Zap size={18} className={getColor()} fill="currentColor" />
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-bold text-sm ${getColor()}`}>
            {combo}x
          </span>
          <span className={`text-xs ${getColor()}`}>
            {getLabel()}
          </span>
          {multiplier > 1 && (
            <span className="text-xs text-gray-400 ml-1">
              +{(multiplier - 1) * 100}% XP
            </span>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
