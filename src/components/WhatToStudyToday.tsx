import { motion } from 'framer-motion'
import { Target, ChevronRight, BookOpen, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useProgressStore } from '../stores/progressStore'
import { getSectionByTaskNumber } from '../data/theory'

export function WhatToStudyToday() {
  const navigate = useNavigate()
  const getProblematicTasks = useProgressStore((s) => s.getProblematicTasks)
  const taskStats = useProgressStore((s) => s.getTaskStats())

  // Get weak tasks (accuracy < 70% or most wrong answers)
  const weakTasks = getProblematicTasks(5)

  // If no weak tasks, suggest tasks with fewer attempts
  const suggestions = weakTasks.length > 0
    ? weakTasks
    : Object.entries(taskStats)
        .filter(([_, stat]) => stat.total < 5)
        .map(([taskNumber, stat]) => ({
          taskNumber,
          accuracy: stat.total > 0 ? Math.round((stat.correct / stat.total) * 100) : 0,
          total: stat.total,
          wrong: stat.wrong,
        }))
        .slice(0, 5)

  if (suggestions.length === 0) return null

  const getTaskTitle = (num: string) => {
    const section = getSectionByTaskNumber(num)
    if (section) return section.title
    // Fallback titles
    const titles: Record<string, string> = {
      '4': 'Ударения',
      '5': 'Паронимы',
      '6': 'Суффиксы',
      '7': 'Окончания глаголов',
      '8': 'Слитное/раздельное',
      '9': 'Пропущенные буквы',
      '10': 'Приставки',
      '11': 'Суффиксы прилагательных',
      '12': 'Окончания причастий',
      '13': 'НЕ/НИ с причастиями',
      '14': 'Наречия и предлоги',
      '15': 'Пунктуация',
      '16': 'Сложные предложения',
      '17-21': 'Пунктуация в простых',
      '22-26': 'Работа с текстом',
    }
    return titles[num] || `Задание ${num}`
  }

  const getTaskRoute = (num: string) => {
    const routes: Record<string, string> = {
      '4': '/accent-trainer',
      '5': '/task5-trainer',
      '6': '/task6-trainer',
      '7': '/task7-trainer',
      '8': '/task8-trainer',
      '9': '/task9-trainer',
      '10': '/task10-trainer',
      '11': '/task11-trainer',
      '12': '/task12-trainer',
      '13': '/task13-trainer',
      '14': '/task14-trainer',
      '15': '/task15-trainer',
      '16': '/task16-trainer',
    }
    return routes[num] || '/learn'
  }

  return (
    <motion.div
      className="card bg-gradient-to-br from-duo-blue/5 to-duo-blue/10 border-duo-blue/20"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center gap-2 mb-3">
        <Target size={20} className="text-duo-blue" />
        <h3 className="font-bold text-gray-700">Что учить сегодня</h3>
      </div>

      <div className="flex flex-col gap-2">
        {suggestions.map((task, idx) => {
          const isWeak = task.accuracy < 70
          return (
            <motion.div
              key={task.taskNumber}
              className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                isWeak
                  ? 'bg-duo-red/5 hover:bg-duo-red/10 border border-duo-red/10'
                  : 'bg-white hover:bg-gray-50 border border-gray-100'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(getTaskRoute(task.taskNumber))}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                  isWeak ? 'bg-duo-red' : 'bg-duo-blue'
                }`}>
                  <span className="text-sm">{task.taskNumber}</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700">{getTaskTitle(task.taskNumber)}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{task.total} попыток</span>
                    {task.wrong > 0 && (
                      <span className="text-duo-red">{task.wrong} ошибок</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isWeak && (
                  <span className="text-xs font-bold text-duo-red bg-duo-red/10 px-2 py-0.5 rounded-full">
                    {task.accuracy}%
                  </span>
                )}
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </motion.div>
          )
        })}
      </div>

      <p className="text-xs text-gray-400 mt-2 text-center">
        Выбрано на основе ваших слабых мест
      </p>
    </motion.div>
  )
}
