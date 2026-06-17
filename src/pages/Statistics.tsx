import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { getAtomById } from '../data/atomization/atoms'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { Dumbbell } from 'lucide-react'
import { EGEScorePredictor } from '../components/EGEScorePredictor'

export function Statistics() {
  const navigate = useNavigate()
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const stats = useProgressStore((s) => s.userStats)
  const [activeTab, setActiveTab] = useState<'progress' | 'topics' | 'mistakes' | 'atoms'>('progress')
  const atomProgress = useProgressStore((s) => s.atomProgress)

  const completedLessons = Object.values(lessonProgress).filter(l => l.status === 'completed')
  const totalLessons = course.sections.reduce((sum, s) => sum + s.lessons.length, 0)

  // Calculate per-section stats
  const sectionStats = course.sections.map(section => {
    const sectionLessons = section.lessons
    const completed = sectionLessons.filter(l => lessonProgress[l.id]?.status === 'completed').length
    const totalScore = sectionLessons.reduce((sum, l) => sum + (lessonProgress[l.id]?.bestScore || 0), 0)
    const avgScore = completed > 0 ? Math.round(totalScore / completed) : 0
    return {
      name: section.title,
      completed,
      total: sectionLessons.length,
      score: avgScore,
      fill: section.color
    }
  })

  const radarData = sectionStats.map(s => ({
    subject: s.name.replace('Орфография: ', '').replace('Пунктуация: ', '').slice(0, 15),
    A: s.score,
    fullMark: 100
  }))

  // Weekly activity (mock data for now, can be made real)
  const weeklyData = [
    { day: 'Пн', xp: 30, lessons: 1 },
    { day: 'Вт', xp: 45, lessons: 2 },
    { day: 'Ср', xp: 0, lessons: 0 },
    { day: 'Чт', xp: 60, lessons: 2 },
    { day: 'Пт', xp: 20, lessons: 1 },
    { day: 'Сб', xp: 80, lessons: 3 },
    { day: 'Вс', xp: 50, lessons: 2 },
  ]

  // Weak topics based on low scores
  const weakTopics = sectionStats
    .filter(s => s.score > 0 && s.score < 70)
    .sort((a, b) => a.score - b.score)

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Статистика</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="card bg-duo-green/10">
          <p className="text-3xl font-bold text-duo-green">{completedLessons.length}/{totalLessons}</p>
          <p className="text-sm text-gray-600">Уроков пройдено</p>
        </div>
        <div className="card bg-duo-blue/10">
          <p className="text-3xl font-bold text-duo-blue">{stats.xp}</p>
          <p className="text-sm text-gray-600">Всего XP</p>
        </div>
        <div className="card bg-duo-yellow/10">
          <p className="text-3xl font-bold text-duo-yellow">{stats.level}</p>
          <p className="text-sm text-gray-600">Уровень</p>
        </div>
        <div className="card bg-duo-red/10">
          <p className="text-3xl font-bold text-duo-red">{stats.streak}</p>
          <p className="text-sm text-gray-600">Дней подряд</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'progress' as const, label: 'Прогресс' },
          { key: 'topics' as const, label: 'Темы' },
          { key: 'mistakes' as const, label: 'Слабые' },
          { key: 'atoms' as const, label: 'Атомы' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-duo-green text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'progress' && (
        <div className="flex flex-col gap-4">
          <EGEScorePredictor />

          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">Активность за неделю</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                  <XAxis dataKey="day" tick={{fontSize: 12}} />
                  <YAxis tick={{fontSize: 12}} />
                  <Tooltip />
                  <Bar dataKey="xp" fill="#58cc02" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">Прогресс по разделам</h3>
            <div className="flex flex-col gap-3">
              {sectionStats.map((section, idx) => (
                <div key={idx}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">{section.name}</span>
                    <span className="text-gray-500">{section.completed}/{section.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      className="h-2.5 rounded-full"
                      style={{ backgroundColor: section.fill }}
                      initial={{ width: 0 }}
                      animate={{ width: `${section.total > 0 ? (section.completed / section.total) * 100 : 0}%` }}
                      transition={{ duration: 0.8, delay: idx * 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'topics' && (
        <div className="card">
          <h3 className="font-bold text-gray-700 mb-3">Сильные и слабые стороны</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 11}} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Прогресс" dataKey="A" stroke="#58cc02" fill="#58cc02" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col gap-2 mt-4">
            {sectionStats.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.fill }} />
                  <span className="text-sm text-gray-700">{s.name}</span>
                </div>
                <span className={`text-sm font-bold ${s.score >= 80 ? 'text-duo-green' : s.score >= 60 ? 'text-duo-yellow' : 'text-duo-red'}`}>
                  {s.score > 0 ? `${s.score}%` : '—'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'mistakes' && (
        <div className="flex flex-col gap-4">
          {weakTopics.length > 0 ? (
            <>
              <button
                onClick={() => navigate('/practice')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Dumbbell size={18} />
                Потренировать слабые места
              </button>
              <div className="card bg-duo-red/10 border-duo-red/20">
                <h3 className="font-bold text-duo-red mb-2">⚠️ Нужно подтянуть</h3>
                <p className="text-sm text-gray-600">
                  По этим темам средний балл ниже 70%. Рекомендуем повторить уроки.
                </p>
              </div>
              {weakTopics.map((topic, idx) => (
                <motion.div
                  key={idx}
                  className="card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold text-gray-800">{topic.name}</p>
                      <p className="text-sm text-gray-500">Пройдено {topic.completed}/{topic.total} уроков</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-duo-red">{topic.score}%</p>
                      <p className="text-xs text-gray-500">средний балл</p>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-duo-red h-2 rounded-full" style={{ width: `${topic.score}%` }} />
                  </div>
                </motion.div>
              ))}
            </>
          ) : (
            <div className="card text-center py-8">
              <p className="text-4xl mb-2">🎉</p>
              <p className="font-bold text-gray-800">Отлично!</p>
              <p className="text-sm text-gray-500">У вас нет слабых тем. Продолжайте в том же духе!</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'atoms' && (
        <div className="flex flex-col gap-3">
          {Object.values(atomProgress).filter(a => a.totalAttempts > 0).length > 0 && (
            <button
              onClick={() => navigate('/practice')}
              className="btn-primary flex items-center justify-center gap-2"
            >
              <Dumbbell size={18} />
              Потренировать слабые атомы
            </button>
          )}
          {Object.values(atomProgress).length > 0 ? (
            Object.values(atomProgress)
              .filter(a => a.totalAttempts > 0)
              .sort((a, b) => a.accuracy - b.accuracy)
              .map((atom, idx) => {
                const atomInfo = getAtomById(atom.atomId)
                return (
                  <motion.div
                    key={atom.atomId}
                    className="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <p className="font-bold text-gray-800">{atomInfo?.name || atom.atomId}</p>
                        <p className="text-xs text-gray-500">{atomInfo?.description || ''}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${
                          atom.accuracy >= 80 ? 'text-duo-green' :
                          atom.accuracy >= 60 ? 'text-duo-yellow' : 'text-duo-red'
                        }`}>
                          {atom.accuracy}%
                        </p>
                        <p className="text-xs text-gray-400">{atom.correctCount}/{atom.totalAttempts}</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          atom.accuracy >= 80 ? 'bg-duo-green' :
                          atom.accuracy >= 60 ? 'bg-duo-yellow' : 'bg-duo-red'
                        }`}
                        style={{ width: `${atom.accuracy}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      {atom.masteryLevel === 'mastered' ? '⭐ Освоено' :
                       atom.masteryLevel === 'review' ? '🔁 На повторении' :
                       atom.masteryLevel === 'learning' ? '📚 Изучается' : '🆕 Новое'}
                    </p>
                  </motion.div>
                )
              })
          ) : (
            <div className="card text-center py-8">
              <p className="text-4xl mb-2">🔬</p>
              <p className="font-bold text-gray-800">Атомизация</p>
              <p className="text-sm text-gray-500">Пройдите уроки, чтобы увидеть детальный анализ ошибок по атомарным категориям.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
