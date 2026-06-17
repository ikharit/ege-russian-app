import { useState, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PopoverProps {
  children: ReactNode
  content: ReactNode
  position?: 'top' | 'bottom' | 'left' | 'right'
}

export function Popover({ children, content, position = 'bottom' }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false)

  const posClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }

  return (
    <div className="relative inline-block">
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {children}
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`absolute z-50 ${posClasses[position]} min-w-[200px] max-w-xs`}
            >
              <div className="bg-gray-900 text-white text-sm rounded-xl px-4 py-3 shadow-xl">
                {content}
                <div className="absolute w-2 h-2 bg-gray-900 rotate-45" style={{
                  ...(position === 'bottom' ? { top: '-4px', left: '50%', marginLeft: '-4px' } :
                     position === 'top' ? { bottom: '-4px', left: '50%', marginLeft: '-4px' } :
                     position === 'left' ? { right: '-4px', top: '50%', marginTop: '-4px' } :
                     { left: '-4px', top: '50%', marginTop: '-4px' })
                }} />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
