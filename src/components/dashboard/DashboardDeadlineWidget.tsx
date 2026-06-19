import { motion } from 'framer-motion'
import { Clock, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { allHomework } from '../../data/gsheets/homeworkData'

export function DashboardDeadlineWidget() {
  const navigate = useNavigate()

  const deadlines = Object.entries(allHomework)
    .filter(([_, hw]: [string, any]) => hw.current !== null)
    .map(([name, hw]: [string, any]) => {
      const hwDate = hw.current!.date
      const daysLeft = Math.ceil((new Date(hwDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      return {
        name,
        homework: hw.current!.homework,
        date: hwDate,
        daysLeft,
        urgent: daysLeft <= 2 && daysLeft >= 0,
      }
    })
    .filter(d => d.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft)

  const urgentCount = deadlines.filter(d => d.urgent).length

  if (deadlines.length === 0) return null

  return (
    <motion.div
      className={`card ${urgentCount > 0 ? 'bg-gradient-to-br from-red-50 to-orange-50 border-red-200' : 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={() => navigate('/my-homework')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${urgentCount > 0 ? 'bg-red-400' : 'bg-blue-500'}`}>
            <Clock size={20} />
          </div>
          <div>
            <p className="font-bold text-gray-800">Дедлайны домашки</p>
            <p className="text-xs text-gray-500">
              {urgentCount > 0 ? `${urgentCount} срочных` : `${deadlines.length} активных`}
            </p>
          </div>
        </div>
        <ChevronRight size={20} className={urgentCount > 0 ? 'text-red-400' : 'text-blue-400'} />
      </div>
      <div className="mt-2 flex flex-col gap-1">
        {deadlines.slice(0, 3).map((d) => (
          <div key={d.name} className="flex items-center justify-between text-xs">
            <span className="text-gray-700">{d.name}</span>
            <span className={d.daysLeft <= 1 ? 'text-red-500 font-bold' : 'text-gray-500'}>
              {d.daysLeft === 0 ? 'Сегодня!' : `${d.daysLeft} дн.`}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
