import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Check, Star, BookOpen } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'

export function CourseMap() {
  const navigate = useNavigate()
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const isLessonAvailable = useProgressStore((s) => s.isLessonAvailable)

  const getNodeStatus = (lesson: any) => {
    const prog = lessonProgress[lesson.id]
    if (prog?.status === 'completed') return 'completed'
    if (prog?.status === 'started') return 'current'
    const available = isLessonAvailable(lesson.id, lesson.prerequisites)
    if (available) return 'available'
    return 'locked'
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Карта курса</h1>

      <div className="flex flex-col gap-8">
        {course.sections.map((section, sIdx) => (
          <div key={section.id} className="flex flex-col gap-4">
            {/* Section header */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
                style={{ backgroundColor: section.color }}
              >
                <BookOpen size={20} />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">{section.title}</h2>
                <p className="text-xs text-gray-500">{section.subtitle}</p>
              </div>
            </div>

            {/* Lesson nodes */}
            <div className="flex flex-col gap-3">
              {section.lessons.map((lesson, lIdx) => {
                const status = getNodeStatus(lesson)
                const isLast = lIdx === section.lessons.length - 1

                return (
                  <div key={lesson.id} className="flex items-center gap-4 relative">
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

                    <div className="flex-1">
                      <p className={`font-bold ${status === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>
                        {lesson.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {status === 'locked' ? 'Заблокировано' : status === 'completed' ? 'Пройдено' : `${lesson.questions.length} вопросов`}
                      </p>
                    </div>

                    {!isLast && (
                      <div className="absolute left-6 top-14 w-0.5 h-6 bg-gray-200" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
