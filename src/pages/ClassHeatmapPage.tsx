import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, BarChart3, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { useClassStore } from '../stores/classStore'

interface StudentHeatmapData {
  id: string
  name: string
  taskStats: Record<string, { correct: number; total: number; accuracy: number }>
}

export function ClassHeatmapPage() {
  const navigate = useNavigate()
  const classes = useClassStore((s) => s.classes)
  const activeClassId = useClassStore((s) => s.activeClassId)
  const activeClass = classes.find((c) => c.id === activeClassId)

  const [hoveredCell, setHoveredCell] = useState<{ student: string; task: string; accuracy: number } | null>(null)

  const tasks = useMemo(() => {
    const allTasks = new Set<string>()
    if (activeClass?.students) {
      for (const student of activeClass.students) {
        if (student.taskStats) {
          Object.keys(student.taskStats).forEach((t) => allTasks.add(t))
        }
      }
    }
    return Array.from(allTasks).sort((a, b) => parseInt(a) - parseInt(b))
  }, [activeClass])

  const students = useMemo(() => {
    if (!activeClass?.students) return []
    return activeClass.students.map((s) => ({
      id: s.id,
      name: s.name || 'Без имени',
      taskStats: s.taskStats || {},
    }))
  }, [activeClass])

  const getAccuracy = (student: StudentHeatmapData, task: string): number => {
    const stat = student.taskStats[task]
    if (!stat || stat.total === 0) return -1 // No data
    return Math.round((stat.correct / stat.total) * 100)
  }

  const getColor = (accuracy: number): string => {
    if (accuracy < 0) return '#e5e7eb' // No data — gray
    if (accuracy >= 90) return '#58cc02' // Green
    if (accuracy >= 70) return '#ffc800' // Yellow
    if (accuracy >= 50) return '#ff9600' // Orange
    return '#ff4b4b' // Red
  }

  const getClassAverage = (task: string): number => {
    let total = 0
    let count = 0
    for (const student of students) {
      const acc = getAccuracy(student, task)
      if (acc >= 0) {
        total += acc
        count++
      }
    }
    return count > 0 ? Math.round(total / count) : -1
  }

  const problematicTasks = useMemo(() => {
    return tasks
      .map((task) => ({ task, avg: getClassAverage(task) }))
      .filter((t) => t.avg >= 0 && t.avg < 70)
      .sort((a, b) => a.avg - b.avg)
  }, [tasks, students])

  if (!activeClass) {
    return (
      <div className="max-w-md mx-auto px-4 py-6 text-center">
        <p className="text-gray-500">Выберите класс в учительской панели</p>
        <button onClick={() => navigate('/teacher')} className="btn-primary mt-4">
          К учительской панели
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/teacher')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Аналитика класса</h1>
          <p className="text-xs text-gray-500">{activeClass.name} · {students.length} учеников</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mb-4 text-xs">
        <span className="font-bold text-gray-600">Легенда:</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#58cc02' }} /> 90%+</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#ffc800' }} /> 70-89%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#ff9600' }} /> 50-69%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded" style={{ background: '#ff4b4b' }} /> &lt;50%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200" /> Нет данных</span>
      </div>

      {/* Heatmap */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header row */}
          <div className="flex border-b border-gray-100">
            <div className="w-32 p-2 text-xs font-bold text-gray-500 sticky left-0 bg-white z-10">Ученик</div>
            {tasks.map((task) => (
              <div key={task} className="w-10 p-2 text-xs font-bold text-gray-500 text-center">
                {task}
              </div>
            ))}
            <div className="w-16 p-2 text-xs font-bold text-gray-500 text-center">Средн.</div>
          </div>

          {/* Student rows */}
          {students.map((student) => {
            const studentAvg = tasks.length > 0
              ? Math.round(
                  tasks.reduce((sum, task) => {
                    const acc = getAccuracy(student, task)
                    return acc >= 0 ? sum + acc : sum
                  }, 0) /
                  tasks.filter((t) => getAccuracy(student, t) >= 0).length
                )
              : -1

            return (
              <div key={student.id} className="flex border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <div className="w-32 p-2 text-xs font-medium text-gray-700 truncate sticky left-0 bg-white z-10">
                  {student.name}
                </div>
                {tasks.map((task) => {
                  const acc = getAccuracy(student, task)
                  const color = getColor(acc)
                  return (
                    <div
                      key={task}
                      className="w-10 p-1 flex items-center justify-center cursor-pointer"
                      onMouseEnter={() => setHoveredCell({ student: student.name, task, accuracy: acc })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold transition-transform hover:scale-110"
                        style={{ backgroundColor: color, color: acc >= 70 || acc < 0 ? '#666' : '#fff' }}
                      >
                        {acc >= 0 ? acc : '—'}
                      </div>
                    </div>
                  )
                })}
                <div className="w-16 p-2 flex items-center justify-center">
                  <span className="text-xs font-bold" style={{ color: getColor(studentAvg) }}>
                    {studentAvg >= 0 ? studentAvg : '—'}
                  </span>
                </div>
              </div>
            )
          })}

          {/* Class average row */}
          <div className="flex bg-gray-50 border-t-2 border-gray-200">
            <div className="w-32 p-2 text-xs font-bold text-gray-600 sticky left-0 bg-gray-50 z-10">Класс</div>
            {tasks.map((task) => {
              const avg = getClassAverage(task)
              return (
                <div key={task} className="w-10 p-1 flex items-center justify-center">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold"
                    style={{ backgroundColor: getColor(avg), color: avg >= 70 || avg < 0 ? '#666' : '#fff' }}
                  >
                    {avg >= 0 ? avg : '—'}
                  </div>
                </div>
              )
            })}
            <div className="w-16 p-2" />
          </div>
        </div>
      </div>

      {/* Hover tooltip */}
      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-gray-800 rounded-xl text-white text-sm"
        >
          <p className="font-bold">{hoveredCell.student}</p>
          <p className="text-xs text-gray-300">Задание {hoveredCell.task}</p>
          <p className="text-xs mt-1">
            {hoveredCell.accuracy >= 0
              ? `Точность: ${hoveredCell.accuracy}%`
              : 'Нет данных'}
          </p>
        </motion.div>
      )}

      {/* Problematic tasks summary */}
      {problematicTasks.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold text-gray-700 mb-2 flex items-center gap-2">
            <AlertTriangle size={18} className="text-orange-500" />
            Проблемные задания
          </h3>
          <div className="flex flex-col gap-2">
            {problematicTasks.slice(0, 5).map(({ task, avg }) => (
              <div key={task} className="flex items-center justify-between bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div>
                  <p className="font-bold text-sm text-gray-800">Задание {task}</p>
                  <p className="text-xs text-gray-500">Средняя точность класса</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold" style={{ color: getColor(avg) }}>{avg}%</span>
                  {avg < 50 && <XCircle size={16} className="text-red-500" />}
                  {avg >= 50 && avg < 70 && <AlertTriangle size={16} className="text-orange-500" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {problematicTasks.length === 0 && tasks.length > 0 && (
        <div className="mt-4 p-4 bg-green-50 rounded-xl text-center">
          <CheckCircle size={24} className="text-duo-green mx-auto mb-2" />
          <p className="text-sm font-bold text-duo-green-dark">Отлично! Все задания выполняются на высоком уровне</p>
        </div>
      )}
    </div>
  )
}
