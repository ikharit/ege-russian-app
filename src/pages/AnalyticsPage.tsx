import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, BarChart3, TrendingDown, Users, Target,
  ChevronDown, ChevronUp, AlertTriangle, CheckCircle
} from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { useStudentStore } from '../stores/studentStore'
import { useNavigate } from 'react-router-dom'
import { allHomework } from '../data/gsheets/homeworkData'

interface ClassTaskAnalytics {
  taskNumber: string
  totalAttempts: number
  correctCount: number
  accuracy: number
  studentCount: number
  weakStudentCount: number
}

interface StudentTaskBreakdown {
  name: string
  accuracy: number
  weakTasks: string[]
  strongTasks: string[]
}

export function AnalyticsPage() {
  const navigate = useNavigate()
  const students = useProgressStore((s) => s.teacherStudents)
  const taskStats = useProgressStore((s) => s.taskStats)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'tasks' | 'students' | 'homework'>('tasks')

  // Aggregate class-level task analytics using real student data from studentStore
  const classTaskAnalytics: ClassTaskAnalytics[] = (() => {
    const taskMap: Record<string, { total: number; correct: number; students: Set<string>; weakStudents: Set<string> }> = {}

    const profiles = useStudentStore.getState().profiles
    const profileList = profiles.length > 0 ? profiles : students.map((s) => ({ name: s.name, progress: { taskStats } } as any))

    profileList.forEach((profile: any) => {
      const name = profile.name || 'Ученик'
      const pTaskStats = profile.progress?.taskStats || {}
      const allTasks = Object.keys(pTaskStats).length > 0 ? pTaskStats : taskStats

      Object.entries(allTasks).forEach(([taskNum, stats]: [string, any]) => {
        if (!taskMap[taskNum]) {
          taskMap[taskNum] = { total: 0, correct: 0, students: new Set(), weakStudents: new Set() }
        }
        const total = stats.total || 0
        const correct = stats.correct || 0
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

        taskMap[taskNum].total += total
        taskMap[taskNum].correct += correct
        taskMap[taskNum].students.add(name)
        if (accuracy < 70) {
          taskMap[taskNum].weakStudents.add(name)
        }
      })
    })

    // Add current active profile data if no profiles exist yet
    if (profileList.length === 0) {
      Object.entries(taskStats).forEach(([taskNum, stats]: [string, any]) => {
        if (!taskMap[taskNum]) {
          taskMap[taskNum] = { total: 0, correct: 0, students: new Set(), weakStudents: new Set() }
        }
        const total = stats.total || 0
        const correct = stats.correct || 0
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
        taskMap[taskNum].total += total
        taskMap[taskNum].correct += correct
        taskMap[taskNum].students.add('Текущий')
        if (accuracy < 70) {
          taskMap[taskNum].weakStudents.add('Текущий')
        }
      })
    }

    return Object.entries(taskMap)
      .map(([taskNumber, data]) => ({
        taskNumber,
        totalAttempts: data.total,
        correctCount: data.correct,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        studentCount: data.students.size,
        weakStudentCount: data.weakStudents.size,
      }))
      .sort((a, b) => a.accuracy - b.accuracy) // Sort by accuracy ascending (weakest first)
  })()

  // Student breakdown using real data
  const studentBreakdown: StudentTaskBreakdown[] = (() => {
    const profiles = useStudentStore.getState().profiles
    if (profiles.length > 0) {
      return profiles.map((profile: any) => {
        const pTaskStats = profile.progress?.taskStats || {}
        const weak = Object.entries(pTaskStats)
          .filter(([_, s]: [string, any]) => s.total > 0 && (s.correct / s.total) < 0.7)
          .map(([t, _]: [string, any]) => t)
        const strong = Object.entries(pTaskStats)
          .filter(([_, s]: [string, any]) => s.total > 0 && (s.correct / s.total) > 0.8)
          .map(([t, _]: [string, any]) => t)
        const totalAttempts = Number((Object.values(pTaskStats) as any[]).reduce((sum: number, s: any) => sum + (s.total || 0), 0))
        const totalCorrect = (Object.values(pTaskStats) as any[]).reduce((sum: number, s: any) => sum + (s.correct || 0), 0)
        return {
          name: profile.name,
          accuracy: totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0,
          weakTasks: weak.length > 0 ? weak : ['—'],
          strongTasks: strong.length > 0 ? strong : ['—'],
        }
      })
    }
    // Fallback: use current student data
    return students.map((student) => {
      const weak = classTaskAnalytics
        .filter((t) => t.weakStudentCount > 0)
        .slice(0, 3)
        .map((t) => t.taskNumber)
      const strong = classTaskAnalytics
        .filter((t) => t.accuracy > 80)
        .slice(0, 3)
        .map((t) => t.taskNumber)
      return {
        name: student.name,
        accuracy: student.averageScore,
        weakTasks: weak.length > 0 ? weak : ['—'],
        strongTasks: strong.length > 0 ? strong : ['—'],
      }
    })
  })()

  // Homework analytics
  const homeworkAnalytics = (() => {
    const hwEntries = Object.entries(allHomework)
      .filter(([_, hw]) => hw.current !== null)
      .map(([name, hw]) => ({
        name,
        homework: hw.current!.homework,
        date: hw.current!.date,
        status: hw.current!.status,
      }))
    return hwEntries
  })()

  const avgClassAccuracy = Math.round(
    classTaskAnalytics.reduce((sum, t) => sum + t.accuracy, 0) / (classTaskAnalytics.length || 1)
  )
  const criticalTasks = classTaskAnalytics.filter(t => t.accuracy < 60)
  const weakTasks = classTaskAnalytics.filter(t => t.accuracy < 70)

  return (
    <div className="min-h-screen bg-duo-snow">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/teacher')} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">Аналитика класса</h1>
            <p className="text-sm text-gray-500">{students.length} учеников</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card bg-white p-4 text-center">
            <BarChart3 size={24} className="text-duo-green mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-800">{avgClassAccuracy}%</p>
            <p className="text-xs text-gray-500">Средняя точность</p>
          </div>
          <div className="card bg-white p-4 text-center">
            <AlertTriangle size={24} className="text-red-400 mx-auto mb-1" />
            <p className="text-2xl font-bold text-red-500">{criticalTasks.length}</p>
            <p className="text-xs text-gray-500">Критичных заданий</p>
          </div>
          <div className="card bg-white p-4 text-center">
            <Target size={24} className="text-duo-yellow mx-auto mb-1" />
            <p className="text-2xl font-bold text-gray-800">{weakTasks.length}</p>
            <p className="text-xs text-gray-500">Слабых заданий</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'tasks' as const, label: 'Задания', icon: Target },
            { id: 'students' as const, label: 'Ученики', icon: Users },
            { id: 'homework' as const, label: 'Домашка', icon: BarChart3 },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-duo-green text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-gray-700">Слабые задания (по точности)</p>
            </div>
            {classTaskAnalytics.map((task, idx) => {
              const isExpanded = expandedTask === task.taskNumber
              const isCritical = task.accuracy < 60
              const isWeak = task.accuracy < 70

              return (
                <motion.div
                  key={task.taskNumber}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`card ${isCritical ? 'border-red-200 bg-red-50' : isWeak ? 'border-yellow-200 bg-yellow-50' : 'bg-white'}`}
                >
                  <button
                    onClick={() => setExpandedTask(isExpanded ? null : task.taskNumber)}
                    className="w-full flex items-center justify-between p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                        isCritical ? 'bg-red-400 text-white' : isWeak ? 'bg-yellow-400 text-white' : 'bg-duo-green text-white'
                      }`}>
                        {task.taskNumber}
                      </div>
                      <div className="text-left">
                        <p className="font-bold text-gray-800">Задание {task.taskNumber}</p>
                        <p className="text-xs text-gray-500">
                          {task.studentCount} учеников • {task.totalAttempts} попыток
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={`font-bold ${isCritical ? 'text-red-500' : isWeak ? 'text-yellow-600' : 'text-green-500'}`}>
                          {task.accuracy}%
                        </p>
                        <p className="text-xs text-gray-400">точность</p>
                      </div>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-gray-100 pt-2">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Правильно:</span>
                          <span className="font-bold text-green-600">{task.correctCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Ошибок:</span>
                          <span className="font-bold text-red-500">{task.totalAttempts - task.correctCount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Слабых учеников:</span>
                          <span className="font-bold text-orange-500">{task.weakStudentCount} / {task.studentCount}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                          <div
                            className={`h-2 rounded-full transition-all ${isCritical ? 'bg-red-400' : isWeak ? 'bg-yellow-400' : 'bg-green-400'}`}
                            style={{ width: `${task.accuracy}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Students Tab */}
        {activeTab === 'students' && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-700 mb-2">Рекомендации по ученикам</p>
            {studentBreakdown.map((student, idx) => (
              <motion.div
                key={student.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="card bg-white p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-gray-400" />
                    <p className="font-bold text-gray-800">{student.name}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${student.accuracy < 60 ? 'text-red-500' : student.accuracy < 75 ? 'text-yellow-600' : 'text-green-500'}`}>
                      {student.accuracy}%
                    </p>
                    <p className="text-xs text-gray-400">средний балл</p>
                  </div>
                </div>
                <div className="flex gap-2 text-xs">
                  <div className="flex-1 bg-red-50 rounded-lg p-2">
                    <p className="text-red-500 font-bold mb-1">Слабые:</p>
                    <p className="text-gray-600">{student.weakTasks.join(', ')}</p>
                  </div>
                  <div className="flex-1 bg-green-50 rounded-lg p-2">
                    <p className="text-green-600 font-bold mb-1">Сильные:</p>
                    <p className="text-gray-600">{student.strongTasks.join(', ')}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Homework Tab */}
        {activeTab === 'homework' && (
          <div className="space-y-3">
            <p className="text-sm font-bold text-gray-700 mb-2">Актуальные домашние задания</p>
            {homeworkAnalytics.length === 0 ? (
              <div className="card text-center py-8 text-gray-500">
                <p>Нет актуальных домашних заданий</p>
              </div>
            ) : (
              homeworkAnalytics.map((hw, idx) => (
                <motion.div
                  key={`${hw.name}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="card bg-white p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-bold text-gray-800">{hw.name}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      hw.status?.toLowerCase().includes('сделано') || hw.status?.toLowerCase().includes('выполнено')
                        ? 'bg-green-100 text-green-600'
                        : hw.status?.toLowerCase().includes('част')
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {hw.status || 'Неизвестно'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{hw.homework}</p>
                  <p className="text-xs text-gray-400">📅 {hw.date}</p>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
