import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, Circle, ArrowLeft, Target, BookOpen, Dumbbell, RotateCcw, Award, Clock, ChevronRight, Trash2 } from 'lucide-react'
import { useStudyPlanStore } from '../stores/studyPlanStore'
import { StudyTask } from '../types'

function getNextExamDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const may = new Date(year, 4, 25) // 25 мая
  const june = new Date(year, 5, 16) // 16 июня
  
  if (now > june) {
    // Следующий год
    return `${year + 1}-05-25`
  }
  
  if (now > may) {
    return `2026-06-16`
  }
  
  return `2026-05-25`
}

function getTaskIcon(type: StudyTask['type']) {
  switch (type) {
    case 'lesson': return <BookOpen size={18} className="text-duo-green" />
    case 'trainer': return <Dumbbell size={18} className="text-duo-blue" />
    case 'review': return <RotateCcw size={18} className="text-orange-500" />
    case 'mock': return <Award size={18} className="text-duo-purple" />
    case 'rest': return <Clock size={18} className="text-gray-400" />
  }
}

function getTaskBg(type: StudyTask['type']) {
  switch (type) {
    case 'lesson': return 'bg-duo-green/5 border-duo-green/20'
    case 'trainer': return 'bg-duo-blue/5 border-duo-blue/20'
    case 'review': return 'bg-orange-50 border-orange-200'
    case 'mock': return 'bg-duo-purple/5 border-duo-purple/20'
    case 'rest': return 'bg-gray-50 border-gray-100'
  }
}

export function StudyPlanPage() {
  const navigate = useNavigate()
  const examDate = useStudyPlanStore((s) => s.examDate)
  const plan = useStudyPlanStore((s) => s.plan)
  const setExamDate = useStudyPlanStore((s) => s.setExamDate)
  const completeTask = useStudyPlanStore((s) => s.completeTask)
  const clearPlan = useStudyPlanStore((s) => s.clearPlan)
  const getProgress = useStudyPlanStore((s) => s.getProgress)
  const getTodayTasks = useStudyPlanStore((s) => s.getTodayTasks)

  const targetScore = useStudyPlanStore((s) => s.targetScore)
  const setTargetScore = useStudyPlanStore((s) => s.setTargetScore)
  const getAssessment = useStudyPlanStore((s) => s.getAssessment)

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })

  const todayTasks = getTodayTasks()
  const progress = getProgress()
  const assessment = getAssessment()

  const daysToExam = examDate
    ? Math.ceil((new Date(examDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  // Генерируем 7 дней вокруг selectedDate
  const weekDays: string[] = []
  const base = new Date(selectedDate)
  for (let i = -3; i <= 3; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() + i)
    weekDays.push(d.toISOString().split('T')[0])
  }

  const getTasksForDay = useStudyPlanStore((s) => s.getTasksForDay)

  if (!examDate || !plan) {
    const defaultDate = getNextExamDate()
    return (
      <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 self-start"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-medium">Назад</span>
        </button>

        <div className="text-center">
          <Target size={48} className="text-duo-green mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">План подготовки</h1>
          <p className="text-gray-500 mt-2">Укажи дату экзамена — и мы построим персональный план</p>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Дата экзамена</label>
            <input
              type="date"
              defaultValue={defaultDate}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-duo-green focus:ring-1 focus:ring-duo-green outline-none text-lg"
              onChange={(e) => {
                if (e.target.value) setExamDate(e.target.value)
              }}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Цель — балл на ЕГЭ</label>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="60"
                max="100"
                step="5"
                value={targetScore}
                className="flex-1 accent-duo-green"
                onChange={(e) => setTargetScore(Number(e.target.value))}
              />
              <span className="text-lg font-bold text-duo-green w-12 text-right">{targetScore}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {targetScore >= 90 ? 'Максимум — все задания + 5 пробников' :
               targetScore >= 80 ? 'Высокий — 95% материала + 4 пробника' :
               targetScore >= 70 ? 'Средний — 85% материала + 3 пробника' :
               'Минимум — 70% материала + 2 пробника'}
            </p>
          </div>
          <button
            onClick={() => setExamDate(defaultDate)}
            className="w-full py-3 bg-duo-green text-white font-bold rounded-xl hover:bg-duo-green/90 transition-colors"
          >
            Составить план →
          </button>
          <p className="text-xs text-gray-400 text-center">Можно изменить в любой момент</p>
        </div>

        <div className="bg-duo-yellow/10 rounded-xl p-4 text-sm text-gray-600">
          <p className="font-bold text-gray-800 mb-1">📅 Как работает план?</p>
          <ul className="space-y-1.5">
            <li>• Фаза 1: уроки по теории (50% времени)</li>
            <li>• Фаза 2: тренажёры по заданиям (30%)</li>
            <li>• Фаза 3: пробники + повтор ошибок (20%)</li>
            <li>• День отдыха каждую неделю</li>
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Назад"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div className="text-right">
          <h1 className="text-lg font-bold text-gray-800">План подготовки</h1>
          {daysToExam !== null && (
            <p className={`text-sm font-bold ${daysToExam <= 7 ? 'text-duo-red' : daysToExam <= 30 ? 'text-duo-yellow' : 'text-duo-green'}`}>
              {daysToExam > 0 ? `До экзамена: ${daysToExam} дн.` : daysToExam === 0 ? 'Экзамен сегодня!' : 'Экзамен прошёл'}
            </p>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-700">Прогресс плана</span>
          <span className="text-sm font-bold text-duo-green">{progress.completed}/{progress.total}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-duo-green h-3 rounded-full transition-all"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{progress.percent}% выполнено</p>
      </div>

      {/* Assessment card */}
      <div className={`card border-l-4 ${assessment.status === 'ahead' ? 'border-l-duo-green bg-duo-green/5' : assessment.status === 'ontrack' ? 'border-l-blue-400 bg-blue-50' : assessment.status === 'behind' ? 'border-l-duo-yellow bg-duo-yellow/5' : 'border-l-duo-red bg-duo-red/5'}`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm font-bold ${assessment.color}`}>{assessment.label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{assessment.message}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Цель</p>
            <p className="text-lg font-bold text-duo-green">{plan.targetScore}</p>
          </div>
        </div>
      </div>

      {/* Today's tasks */}
      <div className="space-y-3">
        <h2 className="font-bold text-gray-700 flex items-center gap-2">
          <Calendar size={18} className="text-duo-green" />
          Сегодня, {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
        </h2>
        {todayTasks.length === 0 ? (
          <p className="text-sm text-gray-400">На сегодня нет задач</p>
        ) : (
          todayTasks.map((task) => (
            <TaskCard key={task.id} task={task} onComplete={() => completeTask(task.id)} />
          ))
        )}
      </div>

      {/* Week calendar */}
      <div className="space-y-3">
        <h2 className="font-bold text-gray-700">Неделя</h2>
        <div className="flex gap-1 overflow-x-auto pb-2">
          {weekDays.map((date) => {
            const dayTasks = getTasksForDay(date)
            const completed = dayTasks.every((t) => t.completed)
            const hasTasks = dayTasks.length > 0
            const isSelected = date === selectedDate
            const isToday = date === new Date().toISOString().split('T')[0]
            const d = new Date(date)
            const dayNum = d.getDate()
            const dayName = d.toLocaleDateString('ru-RU', { weekday: 'short' })

            return (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`flex flex-col items-center gap-1 px-2 py-2 rounded-xl min-w-[52px] transition-colors ${
                  isSelected
                    ? 'bg-duo-green text-white'
                    : isToday
                    ? 'bg-duo-green/10 text-duo-green font-bold'
                    : hasTasks && completed
                    ? 'bg-duo-green/10 text-gray-700'
                    : 'bg-gray-50 text-gray-500'
                }`}
              >
                <span className="text-[10px] uppercase">{dayName}</span>
                <span className="text-lg font-bold">{dayNum}</span>
                {hasTasks && completed && !isSelected && (
                  <CheckCircle size={12} className="text-duo-green" />
                )}
              </button>
            )
          })}
        </div>

        {/* Selected day tasks */}
        <div className="space-y-2">
          {getTasksForDay(selectedDate).map((task) => (
            <TaskCard key={task.id} task={task} onComplete={() => completeTask(task.id)} />
          ))}
          {getTasksForDay(selectedDate).length === 0 && (
            <p className="text-sm text-gray-400 text-center py-4">Нет задач на этот день</p>
          )}
        </div>
      </div>

      {/* Reset */}
      <button
        onClick={() => {
          if (confirm('Сбросить план и выбрать новую дату экзамена?')) clearPlan()
        }}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-duo-red transition-colors self-center"
      >
        <Trash2 size={14} />
        Сбросить план
      </button>
    </div>
  )
}

function TaskCard({ task, onComplete }: { task: StudyTask; onComplete: () => void }) {
  const navigate = useNavigate()

  const handleClick = () => {
    if (task.completed) return
    if (task.targetId) {
      navigate(task.targetId)
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleClick()
    }
  }

  return (
    <motion.div
      className={`card ${getTaskBg(task.type)} ${task.completed ? 'opacity-50' : 'cursor-pointer hover:scale-[1.01]'}`}
      onClick={handleClick}
      onKeyDown={handleKey}
      role={task.completed ? undefined : 'button'}
      tabIndex={task.completed ? -1 : 0}
      aria-label={task.title}
    >
      <div className="flex items-center gap-3">
        {getTaskIcon(task.type)}
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
            {task.title}
          </p>
          <p className="text-xs text-gray-500">{task.description}</p>
          <p className="text-xs text-gray-400 mt-0.5">⏱ {task.duration} мин</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onComplete()
          }}
          className={`shrink-0 transition-colors ${task.completed ? 'text-duo-green' : 'text-gray-300 hover:text-duo-green'}`}
          aria-label={task.completed ? 'Выполнено' : 'Отметить выполненным'}
        >
          {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
        </button>
      </div>
    </motion.div>
  )
}
