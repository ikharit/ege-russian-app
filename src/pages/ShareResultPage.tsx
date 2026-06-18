import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Trophy, Zap, Star, Flame, ArrowLeft, Download, Share2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

interface ShareData {
  correctCount: number
  totalQuestions: number
  xpEarned: number
  comboMultiplier: number
  isPerfect: boolean
  lessonTitle?: string
  streak?: number
}

export function ShareResultPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const cardRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  const data = (location.state as ShareData | null) || {
    correctCount: 0,
    totalQuestions: 10,
    xpEarned: 0,
    comboMultiplier: 1,
    isPerfect: false,
    lessonTitle: 'Урок',
    streak: 0,
  }

  const percentage = Math.round((data.correctCount / data.totalQuestions) * 100)
  const grade = percentage >= 80 ? 'A' : percentage >= 60 ? 'B' : percentage >= 40 ? 'C' : 'D'
  const gradeColor = percentage >= 80 ? '#58cc02' : percentage >= 60 ? '#ffc800' : percentage >= 40 ? '#ff9600' : '#ff4b4b'
  const gradeBg = percentage >= 80 ? '#e6f7d9' : percentage >= 60 ? '#fff8d9' : percentage >= 40 ? '#fff0d9' : '#ffe6e6'

  useEffect(() => {
    if (!location.state) {
      navigate('/')
    }
  }, [location.state, navigate])

  const handleCopyLink = () => {
    const url = window.location.origin + '/share'
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleDownload = () => {
    // Future: html2canvas integration
    alert('Скриншот этой страницы — сохрани через Ctrl+S или сделай скрин!')
  }

  if (!location.state) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-100 via-blue-50 to-emerald-50 flex flex-col items-center justify-center p-4">
      {/* Back */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-4 left-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 bg-white/80 backdrop-blur px-3 py-2 rounded-xl shadow-sm"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-bold">Назад</span>
      </button>

      {/* Share Card */}
      <motion.div
        ref={cardRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-duo-green to-emerald-400 p-6 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-2 left-4 text-4xl">🎓</div>
            <div className="absolute top-8 right-6 text-3xl">📚</div>
            <div className="absolute bottom-2 left-8 text-2xl">✨</div>
          </div>
          <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">ЕГЭ Русский язык</p>
          <h1 className="text-2xl font-black">Результат урока</h1>
          {data.lessonTitle && (
            <p className="text-sm opacity-90 mt-1">{data.lessonTitle}</p>
          )}
        </div>

        {/* Grade Circle */}
        <div className="flex justify-center -mt-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-black shadow-lg border-4 border-white"
            style={{ backgroundColor: gradeBg, color: gradeColor }}
          >
            {grade}
          </motion.div>
        </div>

        {/* Stats */}
        <div className="p-6 pt-4 text-center">
          <p className="text-4xl font-black text-gray-800 mb-1">
            {percentage}%
          </p>
          <p className="text-gray-500 text-sm mb-4">
            {data.correctCount} из {data.totalQuestions} правильных ответов
          </p>

          {data.isPerfect && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-1 bg-duo-yellow text-gray-900 px-3 py-1 rounded-full text-xs font-bold mb-4"
            >
              <Star size={14} className="fill-gray-900" />
              ИДЕАЛЬНО!
            </motion.div>
          )}

          <div className="grid grid-cols-3 gap-3 mt-2">
            <div className="bg-gray-50 rounded-2xl p-3">
              <Zap size={20} className="text-duo-yellow mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800">+{data.xpEarned}</p>
              <p className="text-xs text-gray-400">XP</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3">
              <Flame size={20} className="text-orange-500 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800">
                {data.comboMultiplier > 1 ? `x${data.comboMultiplier}` : '—'}
              </p>
              <p className="text-xs text-gray-400">Комбо</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-3">
              <Trophy size={20} className="text-duo-purple mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-800">{data.streak || 0}</p>
              <p className="text-xs text-gray-400">Страйк</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-xs text-gray-400 font-medium">
            🚀 Готовься к ЕГЭ вместе со мной!
          </p>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleCopyLink}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm shadow-lg transition-all ${
            copied
              ? 'bg-duo-green text-white'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          }`}
        >
          {copied ? <Download size={18} /> : <Share2 size={18} />}
          {copied ? 'Ссылка скопирована!' : 'Копировать ссылку'}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white text-gray-700 shadow-lg hover:bg-gray-50 transition-all"
        >
          <Download size={18} />
          Сохранить как скрин
        </button>
      </div>
    </div>
  )
}
