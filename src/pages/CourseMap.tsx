import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Check, Star, BookOpen, Pencil, Trophy, Zap, TrendingUp, ChevronRight, Sparkles } from 'lucide-react'

const iconMap: Record<string, any> = {
  BookOpen,
  Pencil,
  Trophy,
  Zap,
  Sparkles,
}

function SectionIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const Icon = iconMap[icon] || BookOpen
  return <Icon size={size} />
}
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { Popover } from '../components/Popover'

export function CourseMap() {
  const navigate = useNavigate()
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const isLessonAvailable = useProgressStore((s) => s.isLessonAvailable)
  const userStats = useProgressStore((s) => s.userStats)

  const getNodeStatus = (lesson: any) => {
    const prog = lessonProgress[lesson.id]
    if (prog?.status === 'completed') return 'completed'
    if (prog?.status === 'started') return 'current'
    const available = isLessonAvailable(lesson.id, lesson.prerequisites)
    if (available) return 'available'
    return 'locked'
  }

  const getSectionProgress = (section: any) => {
    const completed = section.lessons.filter((l: any) => lessonProgress[l.id]?.status === 'completed').length
    const total = section.lessons.length
    const avgScore = total > 0
      ? Math.round(section.lessons.reduce((sum: number, l: any) => sum + (lessonProgress[l.id]?.bestScore || 0), 0) / total)
      : 0
    return { completed, total, avgScore, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Карта курса</h1>

      <div className="flex flex-col gap-8">
        {course.sections.map((section) => {
          const prog = getSectionProgress(section)
          return (
            <div key={section.id} className="flex flex-col gap-4">
              {/* Section header with popover */}
              <Popover
                position="right"
                content={
                  <div className="space-y-2">
                    <p className="font-bold text-white">{section.title}</p>
                    <p className="text-gray-300 text-xs">{section.subtitle}</p>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Пройдено</span>
                        <span className="text-duo-green font-bold">{prog.completed}/{prog.total}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div className="bg-duo-green h-1.5 rounded-full" style={{ width: `${prog.pct}%` }} />
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-400">Средний балл</span>
                        <span className="text-duo-yellow font-bold">{prog.avgScore > 0 ? `${prog.avgScore}%` : '—'}</span>
                      </div>
                    </div>
                  </div>
                }
              >
                <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                    style={{ backgroundColor: section.color }}
                  >
                    <SectionIcon icon={section.icon} size={20} />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-gray-800">{section.title}</h2>
                    <p className="text-xs text-gray-500">{section.subtitle}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-duo-green">{prog.pct}%</span>
                  </div>
                </div>
              </Popover>

              {/* Lesson nodes */}
              <div className="flex flex-col gap-3">
                {section.lessons.map((lesson, lIdx) => {
                  const status = getNodeStatus(lesson)
                  const isLast = lIdx === section.lessons.length - 1
                  const prog = lessonProgress[lesson.id]

                  const popoverContent = (
                    <div className="space-y-2">
                      <p className="font-bold text-white">{lesson.title}</p>
                      <p className="text-gray-300 text-xs">{lesson.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-duo-yellow">
                          <Zap size={12} />
                          <span>{lesson.xpReward} XP</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                          <TrendingUp size={12} />
                          <span>{lesson.questions.length} вопр.</span>
                        </div>
                      </div>
                      {prog?.bestScore > 0 && (
                        <div className="flex items-center gap-1 text-xs text-duo-green mt-1">
                          <Trophy size={12} />
                          <span>Лучший: {prog.bestScore}%</span>
                        </div>
                      )}
                      {lesson.prerequisites.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          Требует: {lesson.prerequisites.map(prId => {
                            const allLessons = course.sections.flatMap(s => s.lessons)
                            const pr = allLessons.find(l => l.id === prId)
                            return pr?.title || prId
                          }).join(', ')}
                        </p>
                      )}
                      {status === 'locked' && (
                        <p className="text-xs text-red-400 mt-1">🔒 Нужно пройти предыдущие уроки</p>
                      )}
                    </div>
                  )

                  return (
                    <div key={lesson.id} className="flex items-center gap-4 relative">
                      <Popover position="right" content={popoverContent}>
                        <motion.button
                          whileHover={status !== 'locked' ? { scale: 1.1 } : {}}
                          whileTap={status !== 'locked' ? { scale: 0.95 } : {}}
                          onClick={() => {
                            if (status !== 'locked') {
                              navigate(`/lesson/${lesson.id}`)
                            }
                          }}
                          className={`lesson-node ${status}`}
                          style={status === 'available' ? { backgroundColor: section.color } : {}}
                        >
                          {status === 'locked' && <Lock size={20} />}
                          {status === 'completed' && <Check size={20} />}
                          {status === 'current' && <Star size={20} />}
                          {status === 'available' && <span>{lIdx + 1}</span>}
                        </motion.button>
                      </Popover>

                      <Popover position="right" content={popoverContent}>
                        <div className="flex-1 cursor-pointer hover:opacity-80 transition-opacity">
                          <p className={`font-bold ${status === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>
                            {lesson.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {status === 'locked' ? 'Заблокировано' : status === 'completed' ? `✅ Пройдено · ${prog?.bestScore || 0}%` : `${lesson.questions.length} вопросов · ${lesson.xpReward} XP`}
                          </p>
                        </div>
                      </Popover>

                      {!isLast && (
                        <div className="absolute left-6 top-14 w-0.5 h-6 bg-gray-200" />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
