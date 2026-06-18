import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronLeft, ChevronRight, Calendar, BookOpen, CheckCircle, XCircle, Clock, MessageSquare, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { allHomework } from '../data/gsheets/homeworkData'

export function StudentHomework() {
  const { studentName } = useParams<{ studentName: string }>()
  const navigate = useNavigate()
  const student = studentName ? allHomework[studentName] : null

  if (!student || !studentName) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Ученик не найден</h2>
          <p className="text-gray-500 mb-6">Нет данных для «{studentName}»</p>
          <button onClick={() => navigate(-1)} className="btn-primary">
            <ArrowLeft size={16} className="inline mr-2" />
            Назад к учителю
          </button>
        </div>
      </div>
    )
  }

  const history = [...student.history].reverse() // от новых к старым
  const [currentIndex, setCurrentIndex] = useState(0)
  const currentEntry = history[currentIndex] || null

  // Статистика
  const total = history.length
  const done = history.filter(e => e.status === 'да').length
  const notDone = history.filter(e => e.status === 'нет').length
  const partial = history.filter(e => e.status === 'отчасти' || (!e.status && e.status !== 'да' && e.status !== 'нет')).length
  const completionRate = total > 0 ? Math.round((done / total) * 100) : 0

  const goPrev = () => setCurrentIndex(i => Math.min(i + 1, history.length - 1))
  const goNext = () => setCurrentIndex(i => Math.max(i - 1, 0))
  const goLatest = () => setCurrentIndex(0)

  const statusBadge = (status: string) => {
    if (status === 'да') {
      return (
        <span className="px-3 py-1 bg-duo-green/20 text-duo-green text-sm rounded-full font-bold flex items-center gap-1">
          <CheckCircle size={14} /> Сдано
        </span>
      )
    }
    if (status === 'нет') {
      return (
        <span className="px-3 py-1 bg-duo-red/20 text-duo-red text-sm rounded-full font-bold flex items-center gap-1">
          <XCircle size={14} /> Не сдано
        </span>
      )
    }
    return (
      <span className="px-3 py-1 bg-duo-yellow/20 text-duo-yellow text-sm rounded-full font-bold flex items-center gap-1">
        <Clock size={14} /> {status || '—'}
      </span>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-duo-blue/20 flex items-center justify-center text-xl">
            👨‍🎓
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">{studentName}</h1>
            <p className="text-xs text-gray-500">{history.length} записей в журнале</p>
          </div>
        </div>
      </div>

      {/* Statistics cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card bg-duo-green/10 border-0 p-3">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle size={16} className="text-duo-green" />
            <span className="text-xs font-bold text-gray-600 uppercase">Сдано</span>
          </div>
          <p className="text-2xl font-bold text-duo-green">{done}</p>
          <p className="text-xs text-gray-500">{total > 0 ? Math.round((done / total) * 100) : 0}% от всех</p>
        </div>
        <div className="card bg-duo-red/10 border-0 p-3">
          <div className="flex items-center gap-2 mb-1">
            <XCircle size={16} className="text-duo-red" />
            <span className="text-xs font-bold text-gray-600 uppercase">Не сдано</span>
          </div>
          <p className="text-2xl font-bold text-duo-red">{notDone}</p>
          <p className="text-xs text-gray-500">{total > 0 ? Math.round((notDone / total) * 100) : 0}% от всех</p>
        </div>
        <div className="card bg-duo-yellow/10 border-0 p-3">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle size={16} className="text-duo-yellow" />
            <span className="text-xs font-bold text-gray-600 uppercase">В работе</span>
          </div>
          <p className="text-2xl font-bold text-duo-yellow">{partial}</p>
          <p className="text-xs text-gray-500">{total > 0 ? Math.round((partial / total) * 100) : 0}% от всех</p>
        </div>
        <div className="card bg-duo-blue/10 border-0 p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={16} className="text-duo-blue" />
            <span className="text-xs font-bold text-gray-600 uppercase">Выполнение</span>
          </div>
          <p className="text-2xl font-bold text-duo-blue">{completionRate}%</p>
          <p className="text-xs text-gray-500">{done} из {total} заданий</p>
        </div>
      </div>

      {/* Navigation: current / history position */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goPrev}
          disabled={currentIndex >= history.length - 1}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          <ChevronLeft size={16} /> Старше
        </button>

        <div className="text-center">
          <span className="text-sm font-bold text-gray-700">
            {currentIndex === 0 ? 'Актуальное' : `−${currentIndex} от актуального`}
          </span>
          <p className="text-xs text-gray-400">
            {currentIndex + 1} / {history.length}
          </p>
        </div>

        <button
          onClick={goNext}
          disabled={currentIndex <= 0}
          className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm font-bold text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Новее <ChevronRight size={16} />
        </button>
      </div>

      {/* Main card */}
      <AnimatePresence mode="wait">
        {currentEntry && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="card mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-duo-blue" />
                <span className="text-lg font-bold text-gray-800">{currentEntry.date}</span>
              </div>
              {statusBadge(currentEntry.status || '')}
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen size={16} className="text-gray-400" />
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Домашнее задание</span>
              </div>
              <p className="text-base text-gray-800 leading-relaxed bg-duo-snow rounded-xl p-3">
                {currentEntry.homework}
              </p>
            </div>

            {currentEntry.comment && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare size={16} className="text-gray-400" />
                  <span className="text-sm font-bold text-gray-500 uppercase tracking-wide">Комментарий</span>
                </div>
                <p className="text-sm text-gray-600 bg-duo-blue/10 rounded-xl p-3">
                  {currentEntry.comment}
                </p>
              </div>
            )}

            {/* Variants summary (if any filled) */}
            {currentEntry.variants && currentEntry.variants.some(v => v.actual_points) && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-bold text-gray-500 mb-2">Результаты вариантов:</p>
                <div className="grid grid-cols-5 gap-2">
                  {currentEntry.variants
                    .filter(v => v.actual_points && v.actual_points.trim())
                    .slice(0, 10)
                    .map((v, i) => (
                      <div key={i} className="text-center bg-duo-snow rounded-lg p-2">
                        <p className="text-xs text-gray-400">{v.name.replace('variant-', 'В')}</p>
                        <p className="text-sm font-bold text-duo-green">{v.actual_points}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick jump to latest */}
      {currentIndex > 0 && (
        <button
          onClick={goLatest}
          className="w-full mb-6 py-3 rounded-xl bg-duo-green text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-duo-green/90 transition-colors"
        >
          <ChevronRight size={16} /> Вернуться к актуальному
        </button>
      )}

      {/* History list (scrollable) */}
      <div className="card">
        <h3 className="font-bold text-gray-700 mb-3">📜 История всех записей</h3>
        <div className="max-h-64 overflow-y-auto flex flex-col gap-2 pr-1">
          {history.map((entry, idx) => {
            const isActive = idx === currentIndex
            const isDone = entry.status === 'да'
            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`text-left p-3 rounded-xl transition-all flex items-center gap-3 ${
                  isActive
                    ? 'bg-duo-blue/10 border-2 border-duo-blue'
                    : 'bg-duo-snow border-2 border-transparent hover:bg-gray-100'
                }`}
              >
                <div className={`w-2 h-2 rounded-full shrink-0 ${isDone ? 'bg-duo-green' : 'bg-duo-yellow'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${isActive ? 'text-duo-blue' : 'text-gray-700'}`}>
                    {entry.date}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{entry.homework}</p>
                </div>
                {isActive && <ChevronRight size={16} className="text-duo-blue shrink-0" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
