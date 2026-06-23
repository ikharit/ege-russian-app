import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Bot, RefreshCw, Send, CheckCircle, AlertTriangle, BookOpen, Target } from 'lucide-react'
import { useClassStore } from '../stores/classStore'
import { course } from '../data/courseData'
import type { Question } from '../types'

interface HomeworkItem {
  taskNumber: string
  question: Question
  reason: string
  classAccuracy: number
}

export function AutoHomeworkPage() {
  const navigate = useNavigate()
  const classes = useClassStore((s) => s.classes)
  const activeClassId = useClassStore((s) => s.activeClassId)
  const assignHomework = useClassStore((s) => s.assignHomework)
  const activeClass = classes.find((c) => c.id === activeClassId)

  const [generatedHomework, setGeneratedHomework] = useState<HomeworkItem[] | null>(null)
  const [sent, setSent] = useState(false)

  // Find weak tasks across all students
  const weakTasks = useMemo(() => {
    if (!activeClass?.students || activeClass.students.length === 0) return []

    const taskMap: Record<string, { total: number; correct: number; studentCount: number }> = {}

    for (const student of activeClass.students) {
      if (!student.taskStats) continue
      for (const [task, stats] of Object.entries(student.taskStats)) {
        if (!taskMap[task]) {
          taskMap[task] = { total: 0, correct: 0, studentCount: 0 }
        }
        taskMap[task].total += stats.total || 0
        taskMap[task].correct += stats.correct || 0
        taskMap[task].studentCount++
      }
    }

    return Object.entries(taskMap)
      .map(([task, data]) => ({
        taskNumber: task,
        accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
        studentCount: data.studentCount,
      }))
      .filter((t) => t.accuracy < 70 && t.studentCount > 0)
      .sort((a, b) => a.accuracy - b.accuracy)
  }, [activeClass])

  const generateHomework = () => {
    if (weakTasks.length === 0) return

    const items: HomeworkItem[] = []
    const allQuestions = course.sections.flatMap(s => s.lessons.flatMap(l => l.questions))

    // Take top 3 weak tasks, 3-4 questions each = ~10 questions
    const selectedTasks = weakTasks.slice(0, 3)

    for (const task of selectedTasks) {
      const taskQuestions = allQuestions.filter(q => {
        const taskAtom = q.atoms?.find((a: string) => a.startsWith('task'))
        return taskAtom?.replace('task', '') === task.taskNumber
      })

      if (taskQuestions.length === 0) continue

      // Pick 3-4 random questions from this task
      const shuffled = [...taskQuestions].sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(4, shuffled.length))

      for (const q of selected) {
        items.push({
          taskNumber: task.taskNumber,
          question: q,
          reason: `Средняя точность класса: ${task.accuracy}%`,
          classAccuracy: task.accuracy,
        })
      }
    }

    setGeneratedHomework(items.slice(0, 10))
    setSent(false)
  }

  const handleSend = () => {
    if (!generatedHomework || !activeClass) return

    const homework = {
      id: `hw-${Date.now()}`,
      title: `Авто-ДЗ: ${generatedHomework.length} заданий по слабым местам`,
      questions: generatedHomework.map(h => h.question.id),
      assignedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completedBy: [],
    }

    assignHomework(activeClass.id, homework)
    setSent(true)
  }

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
    <div className="max-w-md mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/teacher')} className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Авто-ДЗ</h1>
          <p className="text-xs text-gray-500">{activeClass.name}</p>
        </div>
      </div>

      {/* Weak tasks summary */}
      <div className="mb-4">
        <h3 className="font-bold text-sm text-gray-700 mb-2">Проблемные задания:</h3>
        {weakTasks.length === 0 ? (
          <p className="text-sm text-gray-500">Нет данных для анализа</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {weakTasks.slice(0, 5).map((task) => (
              <span
                key={task.taskNumber}
                className="text-xs font-bold px-2 py-1 rounded-full"
                style={{
                  backgroundColor: task.accuracy < 50 ? '#ff4b4b20' : '#ff960020',
                  color: task.accuracy < 50 ? '#ff4b4b' : '#ff9600',
                }}
              >
                Задание {task.taskNumber}: {task.accuracy}%
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Generate button */}
      {!generatedHomework && (
        <motion.button
          onClick={generateHomework}
          className="w-full btn-primary flex items-center justify-center gap-2 mb-4"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Bot size={20} />
          Сгенерировать ДЗ
        </motion.button>
      )}

      {/* Generated homework */}
      {generatedHomework && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold text-gray-700">
              Сгенерировано: {generatedHomework.length} заданий
            </h3>
            {!sent && (
              <button
                onClick={generateHomework}
                className="text-xs text-duo-blue flex items-center gap-1 hover:underline"
              >
                <RefreshCw size={12} /> Перегенерировать
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 mb-4">
            {generatedHomework.map((item, i) => (
              <div
                key={item.question.id}
                className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold bg-duo-blue/10 text-duo-blue px-1.5 py-0.5 rounded">
                    {i + 1}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">Задание {item.taskNumber}</span>
                  <span
                    className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: item.classAccuracy < 50 ? '#ff4b4b20' : '#ff960020',
                      color: item.classAccuracy < 50 ? '#ff4b4b' : '#ff9600',
                    }}
                  >
                    {item.classAccuracy}%
                  </span>
                </div>
                <p className="text-xs text-gray-700 line-clamp-2">{item.question.text}</p>
              </div>
            ))}
          </div>

          {!sent ? (
            <div className="flex gap-3">
              <button
                onClick={() => setGeneratedHomework(null)}
                className="btn-secondary flex-1"
              >
                Отменить
              </button>
              <button
                onClick={handleSend}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Send size={16} />
                Отправить классу
              </button>
            </div>
          ) : (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-green-50 rounded-xl p-4 text-center"
            >
              <CheckCircle size={32} className="text-duo-green mx-auto mb-2" />
              <p className="font-bold text-duo-green-dark">ДЗ отправлено!</p>
              <p className="text-xs text-gray-500 mt-1">Ученики увидят его в своих домашних заданиях</p>
              <button
                onClick={() => navigate('/teacher')}
                className="mt-3 text-xs text-duo-blue font-bold hover:underline"
              >
                Вернуться к панели
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  )
}
