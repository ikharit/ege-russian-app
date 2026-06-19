import { motion } from 'framer-motion'
import { AlertCircle, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../../stores/progressStore'

export function MistakesCard() {
  const navigate = useNavigate()
  const wrongAnswers = useProgressStore((s) => s.getUnreviewedWrongAnswers())
  const count = wrongAnswers.length

  if (count === 0) return null

  return (
    <motion.div
      className="card bg-gradient-to-br from-red-50 to-orange-50 border-red-200"
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate('/mistakes')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500 flex items-center justify-center text-white relative">
            <AlertCircle size={24} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-duo-yellow text-gray-900 text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {count}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs text-red-500 uppercase tracking-wide font-bold">Работа над ошибками</p>
            <p className="font-bold text-gray-800">{count} {count === 1 ? 'ошибка' : count < 5 ? 'ошибки' : 'ошибок'} для повторения</p>
            <p className="text-xs text-gray-500">Повтори, чтобы закрепить материал</p>
          </div>
        </div>
        <ChevronRight size={24} className="text-red-400" />
      </div>
    </motion.div>
  )
}
