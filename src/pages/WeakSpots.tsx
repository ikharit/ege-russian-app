import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft, AlertTriangle, Target, BookOpen, Trash2, RotateCcw,
  ChevronRight, Dumbbell, Lightbulb
} from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { getAtomById } from '../data/atomization/atoms'
import { course } from '../data/courseData'
import { getRulesByTaskNumber } from '../data/theory'
import { TheoryQuickReference } from '../components/TheoryQuickReference'
import { MistakesPractice } from '../components/MistakesPractice'
import type { WrongAnswer } from '../types'

export function WeakSpots() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'mistakes' | 'tasks' | 'atoms'>('mistakes')
  const [practiceMode, setPracticeMode] = useState(false)
  const [practiceQuestions, setPracticeQuestions] = useState<WrongAnswer[]>([])

  // --- Data: Mistakes ---
  const wrongAnswers = useProgressStore((s) => s.getWrongAnswers())
  const removeWrongAnswer = useProgressStore((s) => s.removeWrongAnswer)
  const unreviewed = useMemo(() => wrongAnswers.filter(w => !w.reviewed), [wrongAnswers])
  const byTask = useMemo(() => {
    const map: Record<string, WrongAnswer[]> = {}
    for (const w of wrongAnswers) {
      const key = w.taskNumber ? `Задание ${w.taskNumber}` : 'Без задания'
      if (!map[key]) map[key] = []
      map[key].push(w)
    }
    return map
  }, [wrongAnswers])

  const startPractice = (questions: WrongAnswer[]) => {
    if (questions.length === 0) return
    setPracticeQuestions(questions)
    setPracticeMode(true)
  }

  // --- Data: Problematic Tasks ---
  const getProblematicTasks = useProgressStore((s) => s.getProblematicTasks)
  const problematicTasks = getProblematicTasks(10)

  const handleTrainTask = (taskNumber: string) => {
    if (taskNumber === '4') navigate('/accent-trainer')
    else if (taskNumber === '10') navigate('/task10')
    else {
      // Find first lesson with this task number in atoms
      for (const section of course.sections) {
        for (const lesson of section.lessons) {
          if (lesson.questions.some(q => q.atoms?.some(a => a === `task${taskNumber}`))) {
            navigate(`/lesson/${lesson.id}`)
            return
          }
        }
      }
      navigate('/')
    }
  }

  // --- Data: Atoms ---
  const atomProgress = useProgressStore((s) => s.atomProgress)
  const weakAtoms = useMemo(() =>
    Object.values(atomProgress)
      .filter(a => a.totalAttempts > 0)
      .sort((a, b) => a.accuracy - b.accuracy),
    [atomProgress]
  )

  // --- Practice mode overlay ---
  if (practiceMode) {
    return (
      <MistakesPractice
        questions={practiceQuestions}
        onClose={() => setPracticeMode(false)}
      />
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Работа над ошибками</h1>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-2">
        <div className={`rounded-xl p-3 text-center border transition-all ${activeTab === 'mistakes' ? 'bg-duo-red/10 border-duo-red/30' : 'bg-white border-gray-100'}`}>
          <p className="text-2xl font-bold text-duo-red">{wrongAnswers.length}</p>
          <p className="text-xs text-gray-500">Ошибок</p>
        </div>
        <div className={`rounded-xl p-3 text-center border transition-all ${activeTab === 'tasks' ? 'bg-duo-yellow/10 border-duo-yellow/30' : 'bg-white border-gray-100'}`}>
          <p className="text-2xl font-bold text-duo-yellow">{problematicTasks.length}</p>
          <p className="text-xs text-gray-500">Слабых заданий</p>
        </div>
        <div className={`rounded-xl p-3 text-center border transition-all ${activeTab === 'atoms' ? 'bg-duo-blue/10 border-duo-blue/30' : 'bg-white border-gray-100'}`}>
          <p className="text-2xl font-bold text-duo-blue">{weakAtoms.length}</p>
          <p className="text-xs text-gray-500">Атомов</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {[
          { key: 'mistakes' as const, label: 'Ошибки' },
          { key: 'tasks' as const, label: 'Задания' },
          { key: 'atoms' as const, label: 'Атомы' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-2 px-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.key
                ? 'bg-gray-800 text-white'
                : 'bg-white text-gray-500 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* === TAB: Mistakes === */}
      {activeTab === 'mistakes' && (
        <div className="flex flex-col gap-3">
          {wrongAnswers.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-bold text-gray-800">Ошибок нет!</p>
              <p className="text-sm text-gray-500">Продолжайте учиться.</p>
            </div>
          ) : (
            <>
              {unreviewed.length > 0 && (
                <button
                  onClick={() => startPractice(unreviewed)}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} /> Повторить все ({unreviewed.length})
                </button>
              )}
              {Object.entries(byTask).map(([taskName, items]) => (
                <div key={taskName} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-sm text-gray-700">{taskName}</span>
                    <span className="text-xs text-gray-500">{items.length} ошибок</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {items.map((item) => (
                      <div key={item.questionId} className="p-4 flex flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm text-gray-800 font-medium flex-1">{item.text}</p>
                          <button
                            onClick={() => removeWrongAnswer(item.questionId)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded-lg font-medium">
                            Вы: {item.userAnswer.join(', ')}
                          </span>
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg font-medium">
                            ✓ {item.correctAnswer.join(', ')}
                          </span>
                        </div>
                        {/* Show relevant theory for this task */}
                        {(() => {
                          const rules = getRulesByTaskNumber(item.taskNumber || '')
                          if (rules.length === 0) return null
                          return (
                            <div className="mt-2 pl-2 border-l-2 border-duo-blue/30">
                              <div className="flex items-center gap-2 mb-1">
                                <Lightbulb size={14} className="text-duo-yellow" />
                                <span className="text-xs font-bold text-gray-600">Правило:</span>
                              </div>
                              <TheoryQuickReference rules={rules.slice(0, 1)} showExamples={false} />
                            </div>
                          )
                        })()}

                        <button
                          onClick={() => startPractice([item])}
                          className="text-sm text-duo-blue font-medium flex items-center gap-1 hover:underline self-start"
                        >
                          Повторить <ChevronRight size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      )}

      {/* === TAB: Tasks === */}
      {activeTab === 'tasks' && (
        <div className="flex flex-col gap-3">
          {problematicTasks.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-bold text-gray-800">Все задания идут хорошо!</p>
            </div>
          ) : (
            <>
              <div className="card bg-duo-yellow/5 border border-duo-yellow/20">
                <p className="text-sm text-gray-600">
                  Эти задания чаще всего решаются неправильно. Потренируй их отдельно.
                </p>
              </div>
              {problematicTasks.map((task) => (
                <motion.div
                  key={task.taskNumber}
                  className="card flex items-center justify-between"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-duo-yellow/20 flex items-center justify-center">
                      <Target size={20} className="text-duo-yellow" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800">Задание {task.taskNumber}</p>
                      <p className="text-xs text-gray-500">{task.wrong} ошибок из {task.total} попыток</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-bold ${task.accuracy < 50 ? 'text-duo-red' : 'text-duo-yellow'}`}>
                      {task.accuracy}%
                    </span>
                    <button
                      onClick={() => handleTrainTask(task.taskNumber)}
                      className="px-3 py-1.5 bg-duo-blue text-white text-xs font-bold rounded-lg hover:bg-duo-blue/90 transition-colors"
                    >
                      Тренировать
                    </button>
                  </div>
                </motion.div>
              ))}
            </>
          )}
        </div>
      )}

      {/* === TAB: Atoms === */}
      {activeTab === 'atoms' && (
        <div className="flex flex-col gap-3">
          {weakAtoms.length === 0 ? (
            <div className="card text-center py-10">
              <div className="text-4xl mb-2">🎉</div>
              <p className="font-bold text-gray-800">Все атомы освоены!</p>
            </div>
          ) : (
            <>
              <div className="card bg-duo-blue/5 border border-duo-blue/20">
                <p className="text-sm text-gray-600">
                  Атомы — микро-навыки (правила, исключения). Чем ниже точность, тем больше внимания нужно уделить.
                </p>
              </div>
              {weakAtoms.map((atom) => {
                const atomInfo = getAtomById(atom.atomId)
                const isWeak = atom.accuracy < 70
                return (
                  <motion.div
                    key={atom.atomId}
                    className={`card ${isWeak ? 'border-duo-red/20' : ''}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-sm text-gray-800">
                          {atomInfo?.name || atom.atomId}
                        </p>
                        <p className="text-xs text-gray-500">
                          {atom.correctCount}/{atom.totalAttempts} правильно
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-xl font-bold ${atom.accuracy >= 80 ? 'text-duo-green' : atom.accuracy >= 60 ? 'text-duo-yellow' : 'text-duo-red'}`}>
                          {atom.accuracy}%
                        </p>
                        <p className="text-xs text-gray-500">{atom.masteryLevel}</p>
                      </div>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${atom.accuracy >= 80 ? 'bg-duo-green' : atom.accuracy >= 60 ? 'bg-duo-yellow' : 'bg-duo-red'}`}
                        style={{ width: `${atom.accuracy}%` }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </>
          )}
        </div>
      )}
    </div>
  )
}
