import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Check, Star, BookOpen, Pencil, Trophy, Zap, TrendingUp, ChevronDown, ChevronUp, Play, RotateCcw, Wrench } from 'lucide-react'

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

// ── Lesson Card ─────────────────────────────────────────────
function LessonCard({
  lesson,
  index,
  total,
  sectionColor,
  onClick,
}: {
  lesson: Lesson
  index: number
  total: number
  sectionColor: string
  onClick: () => void
}) {
  const lessonProgress = useProgressStore((s) => s.lessonProgress)
  const isLessonAvailable = useProgressStore((s) => s.isLessonAvailable)
  const prog = lessonProgress[lesson.id]

  const status = (() => {
    if (lesson.isComingSoon) return 'coming_soon'
    if (prog?.status === 'completed') return 'completed'
    if (prog?.status === 'started') return 'current'
    if (isLessonAvailable(lesson.id, lesson.prerequisites)) return 'available'
    return 'locked'
  })()

  const isLast = index === total - 1

  const statusConfig = {
    completed: {
      bg: 'bg-white',
      border: 'border-duo-green',
      iconBg: 'bg-duo-green',
      icon: <Check size={18} />,
      text: 'text-gray-800',
      sub: 'text-duo-green',
      subText: `✅ Пройдено · ${prog?.bestScore || 0}%`,
      action: 'Повторить',
      ActionIcon: RotateCcw,
    },
    current: {
      bg: 'bg-white',
      border: 'border-duo-yellow',
      iconBg: 'bg-duo-yellow',
      icon: <Star size={18} />,
      text: 'text-gray-800',
      sub: 'text-duo-yellow',
      subText: 'Продолжить урок',
      action: 'Продолжить',
      ActionIcon: Play,
    },
    available: {
      bg: 'bg-white',
      border: 'border-gray-200',
      iconBg: '',
      icon: <span className="text-sm font-bold">{index + 1}</span>,
      text: 'text-gray-800',
      sub: 'text-gray-500',
      subText: `${lesson.questions.length} вопросов · ${lesson.xpReward} XP`,
      action: 'Начать',
      ActionIcon: Play,
    },
    locked: {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      iconBg: 'bg-gray-300',
      icon: <Lock size={18} />,
      text: 'text-gray-400',
      sub: 'text-gray-400',
      subText: 'Заблокировано',
      action: '',
      ActionIcon: Lock,
    },
    coming_soon: {
      bg: 'bg-gray-50',
      border: 'border-dashed border-gray-300',
      iconBg: 'bg-gray-300',
      icon: <Wrench size={18} />,
      text: 'text-gray-400',
      sub: 'text-gray-400',
      subText: 'В разработке',
      action: '',
      ActionIcon: Lock,
    },
  }

  const cfg = statusConfig[status]
  const availableStyle = status === 'available' ? { backgroundColor: sectionColor } : {}

  return (
    <div className="relative">
      {/* Connector line to next */}
      {!isLast && (
        <div className="absolute left-6 top-14 h-[calc(100%+12px)] w-0.5 z-0">
          <div
            className={`w-full h-full ${status === 'completed' ? 'bg-duo-green/40' : 'bg-gray-200'}`}
            style={status === 'completed' ? { backgroundColor: `${sectionColor}60` } : {}}
          />
        </div>
      )}

      <motion.div
        className={`relative z-10 flex items-start gap-3 p-3 rounded-2xl border-2 cursor-pointer transition-all hover:shadow-md ${cfg.bg} ${cfg.border}`}
        whileHover={status !== 'locked' && status !== 'coming_soon' ? { scale: 1.01, x: 4 } : {}}
        whileTap={status !== 'locked' && status !== 'coming_soon' ? { scale: 0.99 } : {}}
        onClick={status !== 'coming_soon' ? onClick : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        {/* Status icon */}
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 ${cfg.iconBg}`}
          style={availableStyle}
        >
          {cfg.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm truncate ${cfg.text}`}>{lesson.title}</p>
          <p className={`text-xs ${cfg.sub}`}>{cfg.subText}</p>

          {/* Progress bar for completed */}
          {status === 'completed' && prog?.bestScore && (
            <div className="mt-1.5 w-24 bg-gray-100 rounded-full h-1.5">
              <div
                className="h-full rounded-full"
                style={{ width: `${prog.bestScore}%`, backgroundColor: sectionColor }}
              />
            </div>
          )}

          {/* Stars */}
          {status === 'completed' && prog && (
            <div className="flex gap-0.5 mt-1">
              {[1, 2, 3].map((star) => (
                <Star
                  key={star}
                  size={10}
                  className={prog.bestScore >= star * 33 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}
                />
              ))}
            </div>
          )}
        </div>

        {/* Action arrow */}
        {status !== 'locked' && status !== 'coming_soon' && (
          <div className="flex items-center gap-1 shrink-0 self-center">
            <span className="text-xs font-bold text-gray-400 hidden sm:inline">{cfg.action}</span>
            <cfg.ActionIcon size={16} className="text-gray-400" />
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ── Main Component ──────────────────────────────────────────
export function CourseMap() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const lessonProgress = useProgressStore((s) => s.lessonProgress)

  const [focusedSection, setFocusedSection] = useState<string | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set(course.sections.map((s) => s.id))
  )
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({})
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  useEffect(() => {
    const sectionId = searchParams.get('section')
    if (sectionId && course.sections.some((s) => s.id === sectionId)) {
      setFocusedSection(sectionId)
      const timer = setTimeout(() => {
        sectionRefs.current[sectionId]?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  useEffect(() => {
    if (!focusedSection) return
    const handleClick = (e: MouseEvent) => {
      const clicked = course.sections.find((s) => {
        const el = sectionRefs.current[s.id]
        return el && el.contains(e.target as Node)
      })
      if (!clicked || clicked.id !== focusedSection) setFocusedSection(null)
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [focusedSection])

  const toggleGroup = (id: string) =>
    setExpandedGroups((p) => ({ ...p, [id]: !p[id] }))
  const toggleSection = (id: string) =>
    setCollapsedSections((p) => {
      const n = new Set(p)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })

  const getSectionProgress = (section: any) => {
    const completed = section.lessons.filter((l: any) => lessonProgress[l.id]?.status === 'completed').length
    const total = section.lessons.length
    return {
      completed,
      total,
      pct: total > 0 ? Math.round((completed / total) * 100) : 0,
    }
  }

  const getGroupProgress = (group: any) => {
    const completed = group.lessons.filter((l: any) => lessonProgress[l.id]?.status === 'completed').length
    const total = group.lessons.length
    return { completed, total, pct: total > 0 ? Math.round((completed / total) * 100) : 0 }
  }

  const isSectionAllComingSoon = (section: any) => {
    const allLessons = [
      ...(section.lessons || []),
      ...(section.groups?.flatMap((g: any) => g.lessons) || [])
    ]
    return allLessons.length > 0 && allLessons.every((l: any) => l.isComingSoon)
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
            🔍 Показан раздел{' '}
            <span className="font-bold">
              {course.sections.find((s) => s.id === focusedSection)?.title}
            </span>
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
              ref={(el) => { sectionRefs.current[section.id] = el }}
              className={`flex flex-col gap-4 transition-all duration-300 ${
                isOtherFocused ? 'opacity-15 pointer-events-none' : ''
              } ${isFocused ? 'scale-[1.02]' : ''}`}
              layout="position"
            >
              {/* Section Header */}
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
                    className={`flex items-center gap-3 flex-1 ${isSectionAllComingSoon(section) ? '' : 'cursor-pointer hover:opacity-80 transition-opacity'}`}
                    onClick={() => {
                      if (isSectionAllComingSoon(section)) return
                      if (isOtherFocused) setFocusedSection(null)
                      else setFocusedSection(isFocused ? null : section.id)
                    }}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${isSectionAllComingSoon(section) ? 'grayscale opacity-50' : ''}`}
                      style={{ backgroundColor: isSectionAllComingSoon(section) ? '#9ca3af' : section.color }}
                    >
                      <SectionIcon icon={section.icon} size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className={`font-bold ${isSectionAllComingSoon(section) ? 'text-gray-400' : 'text-gray-800'}`}>{section.title}</h2>
                        {isSectionAllComingSoon(section) && (
                          <span className="text-[10px] font-bold uppercase tracking-wide bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">В разработке</span>
                        )}
                      </div>
                      <p className={`text-xs ${isSectionAllComingSoon(section) ? 'text-gray-400' : 'text-gray-500'}`}>{section.subtitle}</p>
                    </div>
                    <div className="text-right">
                      {isSectionAllComingSoon(section) ? (
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">🔒</span>
                      ) : (
                        <span className="text-xs font-bold text-duo-green">{prog.pct}%</span>
                      )}
                    </div>
                  </div>
                </Popover>

                <button
                  onClick={() => toggleSection(section.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {isCollapsed ? (
                    <ChevronDown size={18} className="text-gray-400" />
                  ) : (
                    <ChevronUp size={18} className="text-gray-400" />
                  )}
                </button>
              </div>

              {/* Content */}
              <AnimatePresence initial={false}>
                {!isCollapsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
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
                                <span className="text-xs text-gray-400 ml-1">
                                  ({gProg.completed}/{gProg.total})
                                </span>
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
                                  <div className="px-4 pb-4 pt-2 flex flex-col gap-3">
                                    {group.lessons.map((lesson: any, lIdx: number) => (
                                      <LessonCard
                                        key={lesson.id}
                                        lesson={lesson}
                                        index={lIdx}
                                        total={group.lessons.length}
                                        sectionColor={section.color}
                                        onClick={() => {
                                        if (lesson.isComingSoon) return
                                        const status = (() => {
                                          const p = lessonProgress[lesson.id]
                                          if (p?.status === 'completed') return 'completed'
                                          if (p?.status === 'started') return 'current'
                                          const available = useProgressStore.getState().isLessonAvailable(lesson.id, lesson.prerequisites)
                                          if (available) return 'available'
                                          return 'locked'
                                        })()
                                        if (status !== 'locked') navigate(`/lesson/${lesson.id}`)
                                      }}
                                      />
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {section.lessons.map((lesson, lIdx) => (
                        <LessonCard
                          key={lesson.id}
                          lesson={lesson}
                          index={lIdx}
                          total={section.lessons.length}
                          sectionColor={section.color}
                          onClick={() => {
                            if (lesson.isComingSoon) return
                            const status = (() => {
                              const p = lessonProgress[lesson.id]
                              if (p?.status === 'completed') return 'completed'
                              if (p?.status === 'started') return 'current'
                              const available = useProgressStore.getState().isLessonAvailable(lesson.id, lesson.prerequisites)
                              if (available) return 'available'
                              return 'locked'
                            })()
                            if (status !== 'locked') navigate(`/lesson/${lesson.id}`)
                          }}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
