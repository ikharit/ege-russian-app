import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RefreshCw, X } from 'lucide-react'

export function PWAUpdateToast() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const handleUpdate = () => setShow(true)
    window.addEventListener('pwa-update-available', handleUpdate)
    return () => window.removeEventListener('pwa-update-available', handleUpdate)
  }, [])

  const handleUpdate = async () => {
    const sw = window.__updateServiceWorker
    if (sw) {
      await sw()
    } else {
      window.location.reload()
    }
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-[200] flex justify-center p-4"
        >
          <div className="bg-duo-green text-white rounded-2xl px-4 py-3 shadow-lg flex items-center gap-3 max-w-sm">
            <RefreshCw size={18} className="shrink-0" />
            <div className="flex-1 text-sm font-bold">
              Доступно обновление!
            </div>
            <button
              onClick={handleUpdate}
              className="px-3 py-1.5 bg-white text-duo-green rounded-lg text-xs font-bold hover:bg-white/90 transition-colors"
            >
              Обновить
            </button>
            <button
              onClick={() => setShow(false)}
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
