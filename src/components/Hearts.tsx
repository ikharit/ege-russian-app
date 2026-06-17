import { Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgressStore } from '../stores/progressStore'

export function Hearts() {
  const hearts = useProgressStore((s) => s.userStats.hearts)
  const maxHearts = useProgressStore((s) => s.userStats.maxHearts)

  return (
    <div className="flex items-center gap-1">
      <AnimatePresence>
        {Array.from({ length: maxHearts }).map((_, i) => (
          <motion.div
            key={i}
            initial={i >= hearts ? { scale: 1 } : { scale: 1 }}
            animate={i < hearts ? { scale: 1 } : { scale: 0.8, opacity: 0.3 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Heart
              size={28}
              className={i < hearts ? 'text-duo-red fill-duo-red' : 'text-gray-300'}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
