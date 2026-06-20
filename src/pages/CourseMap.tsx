import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Check, Star, BookOpen, Pencil, Trophy, Zap, TrendingUp, ChevronDown, ChevronUp } from 'lucide-react'

const iconMap: Record<string, any> = {
  BookOpen, Pencil, Trophy, Zap,
  Volume2: BookOpen, SpellCheck: BookOpen, GraduationCap: BookOpen,
}

function SectionIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  const Icon = iconMap[icon] || BookOpen
  return <Icon size={size} />
}

import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { Popover } from '../components/Popover'
import type { Lesson } from '../types'

export function CourseMap() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const isLessonAvailable = useProgressStore((s) => s.isLessonAvailable)

  const [focusedSection, setFocusedSection] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(new Set())
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})
  const containerRef = useRef<HTMLDivElement>(null)

  // Read section from URL on mount + scroll to it
  useEffect(() => {
    const sectionId = searchParams.get('section')
    if (sectionId && course.sections.some(s => s.id === sectionId)) {
      setFocusedSection(sectionId)
      // Scroll to section after full layout settle
      const scrollTimer = setTimeout(() => {
        const el = sectionRefs.current[sectionId]
        if (el) {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              el.scrollIntoView({ behavior: 'smooth', block: 'center' })
            })
          })
        }
      }, 500)
      return () => clearTimeout(scrollTimer)
    }
  }, [searchParams])

  // Click outside to reset focus
  useEffect(() => {
    if (!focusedSection) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Check if click is inside any section
      const clickedSection = course.sections.find(s => {
        const el = sectionRefs.current[s.id]
        return el && el.contains(target)
      })
      // If clicked on a different section or outside all sections, reset focus
      if (!clickedSection || clickedSection.id !== focusedSection) {
        setFocusedSection(null)
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [focusedSection])

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => {
      const next = new Set(prev)
      if (next.has(sectionId)) next.delete(sectionId)
      else next.add(sectionId)
      return next
    })
  }

  const getNodeStatus = (lesson: Lesson) => {
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

  const getGroupProgress = (group: any) => {
    const completed = group.lessons.filter((l: any) => lessonProgress[l.id]?.status === 'completed').length
    const total = group.lessons.length
    return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const BoardPath = ({ lessons, sectionColor }: { lessons: Lesson[]; sectionColor: string }) => {
    const nodeSize = 52
    const gap = 20
    const pathWidth = 280

    return (
      <div className="relative mx-auto" style={{ width: pathWidth, minHeight: lessons.length * (nodeSize + gap) + 40 }}>
        {/* SVG тропинка */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${pathWidth} ${lessons.length * (nodeSize + gap) + 40}`}
          preserveAspectRatio="none"
        >
          {lessons.map((lesson, i) => {
            if (i === 0) return null
            const status = getNodeStatus(lesson)
            const prevStatus = getNodeStatus(lessons[i - 1])
            const y1 = 20 + (i - 1) * (nodeSize + gap) + nodeSize / 2
            const y2 = 20 + i * (nodeSize + gap) + nodeSize / 2
            const x = pathWidth / 2
            const isPathCompleted = prevStatus === 'completed'
            
            return (
              <line
                key={`path-${i}`}
                x1={x}
                y1={y1}
                x2={x}
                y2={y2}
                stroke={isPathCompleted ? sectionColor : '#e5e7eb'}
                strokeWidth={isPathCompleted ? 4 : 2}
                strokeDasharray={isPathCompleted ? 'none' : '6 4'}
                opacity={isPathCompleted ? 0.6 : 0.4}
              />
            )
          })}
        </svg>

        {/* Ноды */}
        <div className="relative flex flex-col items-center" style={{ gap: `${gap}px`, paddingTop: 20, paddingBottom: 20 }}>
          {lessons.map((lesson, i) => {
            const status = getNodeStatus(lesson)
            const prog = lessonProgress[lesson.id]

            const popoverContent = (
              <div className="space-y-2">
                <p className="font-bold text-white">{lesson.title}</p>
                <p className="text-gray-300 text-xs">{lesson.description}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 text-xs text-duo-yellow">
                    <Zap size={12} /><span>{lesson.xpReward} XP</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <TrendingUp size={12} /><span>{lesson.questions.length} вопр.</span>
                  </div>
                </div>
                {prog?.bestScore > 0 && (
                  <div className="flex items-center gap-1 text-xs text-duo-green mt-1">
                    <Trophy size={12} /><span>Лучший: {prog.bestScore}%</span>
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

            const isCurrent = status === 'current'
            const isCompleted = status === 'completed'
            const isLocked = status === 'locked'

            return (
              <Popover key={lesson.id} position="bottom" content={popoverContent}>
                <motion.div
                  className="relative flex flex-col items-center cursor-pointer"
                  whileHover={!isLocked ? { scale: 1.05 } : {}}
                  whileTap={!isLocked ? { scale: 0.95 } : {}}
                  onClick={() => { if (!isLocked) navigate(`/lesson/${lesson.id}`) }}
                >
                  {/* Glow for current */}
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-duo-yellow/30 animate-pulse" style={{ width: nodeSize + 12, height: nodeSize + 12, top: -6, left: -6 }} />
                  )}
                  
                  {/* Node */}
                  <div
                    className={`rounded-full flex items-center justify-center text-white font-bold shadow-lg transition-all ${
                      isLocked ? 'bg-gray-300 shadow-gray-200' : isCompleted ? 'bg-duo-green shadow-green-200' : isCurrent ? 'bg-duo-yellow shadow-yellow-200' : ''
                    }`}
                    style={{
                      width: isCurrent ? nodeSize + 4 : nodeSize,
                      height: isCurrent ? nodeSize + 4 : nodeSize,
                      backgroundColor: !isLocked && !isCompleted && !isCurrent ? sectionColor : undefined,
                      boxShadow: isCurrent ? '0 0 20px rgba(255, 200, 0, 0.4)' : undefined,
                    }}
                  >
                    {isLocked && <Lock size={22} />}
                    {isCompleted && <Check size={22} />}
                    {isCurrent && <Star size={22} />}
                    {!isLocked && !isCompleted && !isCurrent && <span className="text-sm">{i + 1}</span>}
                  </div>

                  {/* Stars for completed */}
                  {isCompleted && prog && (
                    <div className="flex gap-0.5 mt-1.5">
                      {[1, 2, 3].map((star) => (
                        <Star key={star} size={12} className={prog.bestScore >= star * 33 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  )}

                  {/* Label */}
                  <p className={`text-xs text-center mt-1.5 max-w-[140px] leading-tight ${isLocked ? 'text-gray-400' : 'text-gray-700'}`}>
                    {lesson.title}
                  </p>

                  {/* Score badge */}
                  {isCompleted && prog?.bestScore && (
                    <span className="text-[10px] font-bold text-duo-green mt-0.5">{prog.bestScore}%</span>
                  )}
                </motion.div>
              </Popover>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Карта курса</h1>

      {focusedSection && (
        <motion.div
          className="mb-4 bg-duo-green/10 border border-duo-green/30 rounded-xl p-3 text-center"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm text-gray-700">
            🔍 Показан раздел <span className="font-bold">{course.sections.find(s => s.id === focusedSection)?.title}</span>
          </p>
          <button
            onClick={() => setFocusedSection(null)}
            className="text-xs text-duo-green font-bold mt-1 hover:underline"
          >
            Показать все разделы
          </button>
        </motion.div>
      )}

      <div className="flex flex-col gap-8">
        {course.sections.map((section) => {
          const prog = getSectionProgress(section)
          const isCollapsed = collapsedSections.has(section.id)
          const isFocused = focusedSection === section.id
          const isOtherFocused = focusedSection !== null && !isFocused

          return (
            <motion.div
              key={section.id}
              ref={el => { sectionRefs.current[section.id] = el }}
              className={`flex flex-col gap-4 transition-all duration-300 ${
                isOtherFocused ? 'opacity-15 pointer-events-none' : ''
              } ${isFocused ? 'scale-[1.02]' : ''}`}
              layout
            >
              {/* Section header */}
              <div className="flex items-center gap-3">
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
                      </div>
                    </div>
                  }
                >
                  <div
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity flex-1"
                    onClick={() => {
                      if (isOtherFocused) {
                        setFocusedSection(null) // Click on dimmed section resets focus
                      } else {
                        setFocusedSection(isFocused ? null : section.id)
                      }
                    }}
                  >
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

                {/* Collapse button */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isCollapsed
                    ? <ChevronDown size={18} className="text-gray-400" />
                    : <ChevronUp size={18} className="text-gray-400" />
                  }
                </button>
              </div>

              {/* Content */}
              {!isCollapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  {section.groups && section.groups.length > 0 ? (
                    <div className="flex flex-col gap-2">
                      {section.groups.map((group) => {
                        const isExpanded = expandedGroups[group.id] ?? false
                        const gProg = getGroupProgress(group)
                        return (
                          <div key={group.id} className="border border-gray-200 rounded-xl overflow-hidden">
                            <button
                              onClick={() => toggleGroup(group.id)}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                                {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </div>
                              <div className="flex-1 text-left">
                                <p className="font-bold text-sm text-gray-800">{group.title}</p>
                                <p className="text-xs text-gray-500">{group.subtitle}</p>
                              </div>
                              <div className="text-right">
                                <span className="text-xs font-bold text-duo-green">{gProg.pct}%</span>
                                <span className="text-xs text-gray-400 ml-1">({gProg.completed}/{gProg.total})</span>
                              </div>
                            </button>
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-4 pb-4 pt-2">
                                    <BoardPath lessons={group.lessons} sectionColor={section.color} />
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="py-2">
                      <BoardPath lessons={section.lessons} sectionColor={section.color} />
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
