import { motion } from 'framer-motion'
import { Target, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'

interface SectionScore {
  sectionId: string
  title: string
  maxPoints: number
  accuracy: number
  predictedPoints: number
}

function calculatePredictedScore(accuracy: number, maxPoints: number): number {
  if (accuracy >= 85) return maxPoints
  if (accuracy >= 70) return Math.round(maxPoints * 0.7)
  if (accuracy >= 50) return Math.round(maxPoints * 0.4)
  return 0
}

export function EGEScorePredictor() {
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const atomProgress = useProgressStore((s) => s.atomProgress)

  const sectionScores: SectionScore[] = course.sections.map(section => {
    const lessons = section.lessons
    const totalQuestions = lessons.reduce((sum, l) => sum + l.questions.length, 0)
    const totalCorrect = lessons.reduce((sum, l) => {
      const prog = lessonProgress[l.id]
      if (!prog || prog.status !== 'completed') return sum
      return sum + Math.round((prog.score / 100) * l.questions.length)
    }, 0)
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0
    
    // Map sections to EGE points (simplified)
    const maxPointsMap: Record<string, number> = {
      'section-orth-1': 4,
      'section-orth-2': 3,
      'section-orth-3': 2,
      'section-punct-1': 3,
      'section-punct-2': 3,
      'section-gram-1': 3,
      'section-gram-2': 3,
    }
    const maxPoints = maxPointsMap[section.id] || 2
    const predictedPoints = calculatePredictedScore(accuracy, maxPoints)

    return {
      sectionId: section.id,
      title: section.title,
      maxPoints,
      accuracy,
      predictedPoints
    }
  })

  const totalPredicted = sectionScores.reduce((sum, s) => sum + s.predictedPoints, 0)
  const totalMax = sectionScores.reduce((sum, s) => sum + s.maxPoints, 0)
  const percentage = totalMax > 0 ? Math.round((totalPredicted / totalMax) * 100) : 0

  // Convert to EGE secondary score (approximate)
  // Primary: 0-33 → Secondary: 0-100 (simplified mapping)
  const secondaryScore = Math.round((totalPredicted / totalMax) * 100)

  const getStatus = () => {
    if (percentage >= 80) return { icon: CheckCircle2, color: 'text-duo-green', bg: 'bg-green-50', border: 'border-green-200', text: 'Отличный уровень! Высокий балл гарантирован.' }
    if (percentage >= 60) return { icon: TrendingUp, color: 'text-duo-yellow', bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'Хороший уровень. Есть куда расти!' }
    if (percentage >= 40) return { icon: AlertTriangle, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200', text: 'Средний уровень. Нужно больше практики.' }
    return { icon: AlertTriangle, color: 'text-duo-red', bg: 'bg-red-50', border: 'border-red-200', text: 'Начальный уровень. Упорные занятия помогут!' }
  }

  const status = getStatus()
  const StatusIcon = status.icon

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-4">
        <Target size={20} className="text-duo-purple" />
        <h3 className="font-bold text-gray-700">Прогноз балла ЕГЭ</h3>
      </div>

      {/* Main score */}
      <div className="text-center mb-4">
        <motion.div
          className="text-5xl font-bold text-gray-800"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          {totalPredicted}
          <span className="text-2xl text-gray-400">/{totalMax}</span>
        </motion.div>
        <p className="text-sm text-gray-500 mt-1">первичных баллов</p>
        <p className="text-lg font-bold text-duo-blue mt-1">~{secondaryScore} баллов</p>
      </div>

      {/* Status */}
      <div className={`${status.bg} ${status.border} border rounded-xl p-3 mb-4 flex items-start gap-2`}>
        <StatusIcon size={18} className={status.color + ' shrink-0 mt-0.5'} />
        <p className={`text-sm ${status.color}`}>{status.text}</p>
      </div>

      {/* Section breakdown */}
      <div className="space-y-2">
        <p className="text-xs text-gray-500 uppercase tracking-wide">По разделам:</p>
        {sectionScores.map((section) => (
          <div key={section.sectionId} className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-0.5">
                <span className="text-gray-600">{section.title}</span>
                <span className={`font-bold ${section.accuracy >= 70 ? 'text-duo-green' : section.accuracy >= 50 ? 'text-duo-yellow' : 'text-duo-red'}`}>
                  {section.predictedPoints}/{section.maxPoints}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${
                    section.accuracy >= 70 ? 'bg-duo-green' : section.accuracy >= 50 ? 'bg-duo-yellow' : 'bg-duo-red'
                  }`}
                  style={{ width: `${section.accuracy}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-3 text-center">
        Прогноз основан на вашей статистике. Чем больше занимаетесь — тем точнее!
      </p>
    </div>
  )
}
