import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, Search, ChevronRight, CheckCircle, Clock, XCircle, BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { allHomework } from '../data/gsheets/homeworkData'

export function MyHomework() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const students = Object.entries(allHomework)
    .filter(([_, hw]) => hw.current !== null)
    .sort(([a], [b]) => a.localeCompare(b))

  const filtered = search.trim()
    ? students.filter(([name]) => name.toLowerCase().includes(search.toLowerCase()))
    : students

  const statusBadge = (status: string) => {
    if (status === 'да') {
      return (
        <span className="px-2 py-0.5 bg-duo-green/20 text-duo-green text-xs rounded-full font-bold flex items-center gap-1">
          <CheckCircle size={12} /> Сдано
        </span>
      )
    }
    if (status === 'нет') {
      return (
        <span className="px-2 py-0.5 bg-duo-red/20 text-duo-red text-xs rounded-full font-bold flex items-center gap-1">
          <XCircle size={12} /> Не сдано
        </span>
      )
    }
    return (
      <span className="px-2 py-0.5 bg-duo-yellow/20 text-duo-yellow text-xs rounded-full font-bold flex items-center gap-1">
        <Clock size={12} /> {status || '—'}
      </span>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/profile')}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Мои домашки</h1>
          <p className="text-xs text-gray-500">Выберите себя из списка учеников</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по имени..."
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-duo-blue/30"
        />
      </div>

      {/* Students list */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="card text-center py-8">
            <p className="text-gray-400 text-sm">Не найдено учеников по запросу «{search}»</p>
          </div>
        ) : (
          filtered.map(([name, hw], idx) => (
            <motion.div
              key={name}
              className="card cursor-pointer"
              whileHover={{ scale: 1.01 }}
              onClick={() => navigate(`/teacher/${name}`)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-duo-blue/20 flex items-center justify-center text-lg">
                  👨‍🎓
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800">{name}</p>
                  <p className="text-xs text-gray-500">
                    {hw.history.length} записей в журнале
                  </p>
                  {hw.current && (
                    <p className="text-xs text-gray-600 truncate mt-0.5">
                      <BookOpen size={12} className="inline mr-1 text-gray-400" />
                      {hw.current.homework}
                    </p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-1">
                  {hw.current && statusBadge(hw.current.status || '')}
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Hint */}
      <p className="text-xs text-gray-400 text-center mt-6">
        💡 После выбора вы увидите все свои домашние задания и статистику
      </p>
    </div>
  )
}
