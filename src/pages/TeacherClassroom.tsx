import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, UserPlus, Copy, Trophy, BookOpen, Calendar, Trash2, ChevronRight,
  GraduationCap, X, CheckCircle, AlertCircle, ArrowLeft, School, FileText, BrainCircuit,
  BarChart3, Bot, Edit3
} from 'lucide-react'
import { useClassStore, ClassRoom, ClassHomework } from '../stores/classStore'
import { useStudentStore } from '../stores/studentStore'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'

function getTaskTitle(taskNumber: string): string {
  const allLessons = course.sections.flatMap(s => s.lessons)
  const lesson = allLessons.find(l => l.id.includes(taskNumber) || l.title.includes(taskNumber))
  if (lesson) return lesson.title
  // Fallback: try to find a section with this task
  const section = course.sections.find(s => s.title.includes(taskNumber))
  if (section) return section.title
  return `Задание ${taskNumber}`
}

export function TeacherClassroom() {
  const navigate = useNavigate()
  const classes = useClassStore((s) => s.classes)
  const createClass = useClassStore((s) => s.createClass)
  const deleteClass = useClassStore((s) => s.deleteClass)
  const assignHomework = useClassStore((s) => s.assignHomework)
  const removeHomework = useClassStore((s) => s.removeHomework)
  const getLeaderboard = useClassStore((s) => s.getLeaderboard)
  const isTeacher = useProgressStore((s) => s.isTeacher)
  const setTeacherMode = useProgressStore((s) => s.setTeacherMode)

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [teacherName, setTeacherName] = useState('')
  const [className, setClassName] = useState('')
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [showAssignForm, setShowAssignForm] = useState(false)
  const [homeworkTask, setHomeworkTask] = useState('')
  const [homeworkDeadline, setHomeworkDeadline] = useState('')
  const [activeTab, setActiveTab] = useState<'students' | 'homework' | 'leaderboard'>('students')

  const classList = Object.values(classes)
  const selectedClass = selectedClassId ? classes[selectedClassId] : null

  const setActiveClassId = useClassStore((s) => s.setActiveClassId)

  const handleCreateClass = () => {
    if (!teacherName.trim() || !className.trim()) return
    const result = createClass(teacherName.trim(), className.trim())
    setShowCreateForm(false)
    setClassName('')
    setSelectedClassId(result.classId)
    setActiveClassId(result.classId)
  }

  const handleSelectClass = (classId: string) => {
    setSelectedClassId(classId)
    setActiveClassId(classId)
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    }).catch(() => {})
  }

  const handleAssignHomework = () => {
    if (!selectedClassId || !homeworkTask || !homeworkDeadline) return
    assignHomework(selectedClassId, {
      taskNumber: homeworkTask,
      taskTitle: getTaskTitle(homeworkTask),
      deadline: homeworkDeadline,
    })
    setShowAssignForm(false)
    setHomeworkTask('')
    setHomeworkDeadline('')
  }

  const getStudentStats = (student: { progress?: { userStats?: { xp?: number }; lessonProgress?: Record<string, { status?: string }>; taskStats?: Record<string, { total?: number; correct?: number }> } }) => {
    const progress = student.progress
    const lessonsCompleted = progress
      ? Object.values(progress.lessonProgress || {}).filter((l) => l.status === 'completed').length
      : 0
    const totalAttempts = Object.values(progress?.taskStats || {}).reduce((sum: number, t) => sum + (t.total || 0), 0)
    const totalCorrect = Object.values(progress?.taskStats || {}).reduce((sum: number, t) => sum + (t.correct || 0), 0)
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0
    const xp = progress?.userStats?.xp || 0
    return { lessonsCompleted, accuracy, totalAttempts, xp }
  }

  if (!isTeacher) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">👨‍🏫</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Классы</h2>
          <p className="text-gray-500 mb-6">Войдите в режим учителя, чтобы создавать классы и управлять ими.</p>
          <button onClick={() => setTeacherMode(true)} className="btn-primary">
            Войти как учитель
          </button>
        </div>
      </div>
    )
  }

  if (selectedClass) {
    const leaderboard = getLeaderboard(selectedClass.id)

    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <button
          onClick={() => {
            setSelectedClassId(null)
            setActiveClassId(null)
          }}
          className="flex items-center gap-2 text-gray-500 mb-4"
        >
          <ArrowLeft size={18} /> Назад к классам
        </button>

        <div className="card mb-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-duo-blue flex items-center justify-center text-white">
                <School size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{selectedClass.name}</h2>
                <p className="text-sm text-gray-500">{selectedClass.teacherName}</p>
              </div>
              <button
                onClick={() => {
                  import('../utils/pdfGenerator').then(({ generateTeacherReportHTML, openReportInNewTab }) => {
                    const html = generateTeacherReportHTML(selectedClass.id)
                    openReportInNewTab(html)
                  })
                }}
                className="ml-auto flex items-center gap-2 px-4 py-2 bg-duo-green text-white rounded-xl font-bold text-sm hover:bg-duo-green-dark transition-colors shadow-md"
              >
                <FileText size={16} />
                Отчёт PDF
              </button>
              <button
                onClick={() => navigate('/teacher/analytics')}
                className="flex items-center gap-2 px-4 py-2 bg-duo-purple text-white rounded-xl font-bold text-sm hover:bg-duo-purple/90 transition-colors shadow-md"
              >
                <BrainCircuit size={16} />
                Аналитика
              </button>
              <button
                onClick={() => navigate('/teacher/editor')}
                className="flex items-center gap-2 px-4 py-2 bg-duo-blue text-white rounded-xl font-bold text-sm hover:bg-duo-blue/90 transition-colors shadow-md"
              >
                <Edit3 size={16} />
                Редактор
              </button>
              <button
                onClick={() => navigate('/teacher/heatmap')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-xl font-bold text-sm hover:bg-orange-600 transition-colors shadow-md"
              >
                <BarChart3 size={16} />
                Heatmap
              </button>
              <button
                onClick={() => navigate('/teacher/auto-homework')}
                className="flex items-center gap-2 px-4 py-2 bg-duo-green text-white rounded-xl font-bold text-sm hover:bg-duo-green-dark transition-colors shadow-md"
              >
                <Bot size={16} />
                Авто-ДЗ
              </button>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Удалить этот класс? Все данные будут потеряны.')) {
                  deleteClass(selectedClass.id)
                  setSelectedClassId(null)
                }
              }}
              className="p-2 text-gray-400 hover:text-duo-red transition-colors"
              title="Удалить класс"
            >
              <Trash2 size={18} />
            </button>
          </div>

          <div className="flex items-center gap-2 p-3 bg-duo-yellow/10 rounded-xl border border-duo-yellow/20">
            <span className="text-sm font-bold text-gray-700">Код приглашения:</span>
            <span className="text-lg font-mono font-bold text-duo-yellow tracking-wider">{selectedClass.inviteCode}</span>
            <button
              onClick={() => handleCopyCode(selectedClass.inviteCode)}
              className="ml-auto p-1.5 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              {copiedCode === selectedClass.inviteCode ? (
                <CheckCircle size={16} className="text-duo-green" />
              ) : (
                <Copy size={16} className="text-gray-500" />
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3">
            <div className="bg-duo-snow rounded-xl p-2 text-center">
              <p className="text-xl font-bold text-duo-green">{selectedClass.students.length}</p>
              <p className="text-xs text-gray-500">Учеников</p>
            </div>
            <div className="bg-duo-snow rounded-xl p-2 text-center">
              <p className="text-xl font-bold text-duo-blue">{selectedClass.homework.length}</p>
              <p className="text-xs text-gray-500">ДЗ</p>
            </div>
            <div className="bg-duo-snow rounded-xl p-2 text-center">
              <p className="text-xl font-bold text-duo-purple">{leaderboard.length > 0 ? leaderboard[0].xp : 0}</p>
              <p className="text-xs text-gray-500">Лидер XP</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: 'students' as const, label: 'Ученики', icon: Users },
            { key: 'homework' as const, label: 'ДЗ', icon: BookOpen },
            { key: 'leaderboard' as const, label: 'Лидерборд', icon: Trophy },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 px-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-1 ${
                activeTab === tab.key
                  ? 'bg-duo-blue text-white'
                  : 'bg-white text-gray-500 border border-gray-200'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'students' && (
          <div className="flex flex-col gap-3">
            {selectedClass.students.length === 0 ? (
              <div className="card text-center py-8">
                <UserPlus size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Пока нет учеников</p>
                <p className="text-xs text-gray-400 mt-1">Поделитесь кодом приглашения</p>
              </div>
            ) : (
              selectedClass.students.map((student, idx) => {
                const stats = getStudentStats(student)
                return (
                  <motion.div
                    key={student.id}
                    className="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{student.emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800">{student.name}</p>
                        <p className="text-xs text-gray-500">
                          {stats.lessonsCompleted} уроков • {stats.accuracy}% точность
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-duo-yellow">{stats.xp} XP</p>
                        <p className="text-xs text-gray-400">{stats.totalAttempts} попыток</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        )}

        {activeTab === 'homework' && (
          <div className="flex flex-col gap-4">
            <button
              onClick={() => setShowAssignForm(!showAssignForm)}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {showAssignForm ? <X size={16} /> : <BookOpen size={16} />}
              {showAssignForm ? 'Отмена' : 'Назначить ДЗ'}
            </button>

            <AnimatePresence>
              {showAssignForm && (
                <motion.div
                  className="card bg-duo-snow"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="text-sm font-bold text-gray-700">Задание</label>
                      <select
                        className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white text-sm"
                        value={homeworkTask}
                        onChange={(e) => setHomeworkTask(e.target.value)}
                      >
                        <option value="">Выберите задание</option>
                        {course.sections.flatMap(s =>
                          s.lessons.map(l => (
                            <option key={l.id} value={l.id}>
                              {s.title} — {l.title}
                            </option>
                          ))
                        )}
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-bold text-gray-700">Дедлайн</label>
                      <input
                        type="date"
                        className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white text-sm"
                        value={homeworkDeadline}
                        onChange={(e) => setHomeworkDeadline(e.target.value)}
                      />
                    </div>
                    <button
                      onClick={handleAssignHomework}
                      disabled={!homeworkTask || !homeworkDeadline}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Calendar size={16} className="inline mr-2" />
                      Назначить
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {selectedClass.homework.length === 0 ? (
              <div className="card text-center py-8">
                <BookOpen size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Нет домашних заданий</p>
              </div>
            ) : (
              selectedClass.homework.map((hw) => (
                <motion.div
                  key={hw.id}
                  className="card"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-800 text-sm">{hw.taskTitle}</p>
                      <p className="text-xs text-gray-500">Дедлайн: {new Date(hw.deadline).toLocaleDateString('ru-RU')}</p>
                    </div>
                    <button
                      onClick={() => removeHomework(selectedClass.id, hw.id)}
                      className="p-2 text-gray-400 hover:text-duo-red transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {activeTab === 'leaderboard' && (
          <div className="flex flex-col gap-3">
            {leaderboard.length === 0 ? (
              <div className="card text-center py-8">
                <Trophy size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">Пока нет данных</p>
              </div>
            ) : (
              leaderboard.map((entry, idx) => (
                <motion.div
                  key={entry.profileId}
                  className={`card flex items-center gap-3 ${idx === 0 ? 'bg-yellow-50 border-yellow-200' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    idx === 0 ? 'bg-yellow-400 text-white' :
                    idx === 1 ? 'bg-gray-300 text-white' :
                    idx === 2 ? 'bg-amber-600 text-white' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <span className="text-2xl">{entry.emoji}</span>
                  <div className="flex-1">
                    <p className="font-bold text-gray-800 text-sm">{entry.name}</p>
                    <p className="text-xs text-gray-500">{entry.lessonsCompleted} уроков • {entry.accuracy}% точность</p>
                  </div>
                  <span className="text-sm font-bold text-duo-yellow">{entry.xp} XP</span>
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <GraduationCap size={28} className="text-duo-blue" />
          <h1 className="text-2xl font-bold text-gray-800">Мои классы</h1>
        </div>
        <button onClick={() => navigate('/teacher')} className="text-sm text-gray-500">
          Назад
        </button>
      </div>

      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="btn-primary flex items-center justify-center gap-2 mb-4 w-full"
      >
        {showCreateForm ? <X size={16} /> : <UserPlus size={16} />}
        {showCreateForm ? 'Отмена' : 'Создать класс'}
      </button>

      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            className="card bg-duo-snow mb-4"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-bold text-gray-700">Ваше имя</label>
                <input
                  type="text"
                  placeholder="Иван Петров"
                  className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white text-sm"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                />
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Название класса</label>
                <input
                  type="text"
                  placeholder="10-А, подготовка к ЕГЭ"
                  className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white text-sm"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                />
              </div>
              <button
                onClick={handleCreateClass}
                disabled={!teacherName.trim() || !className.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <School size={16} className="inline mr-2" />
                Создать
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {classList.length === 0 ? (
        <div className="card text-center py-12">
          <School size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-700 mb-2">Пока нет классов</h3>
          <p className="text-sm text-gray-500">Создайте первый класс, чтобы ученики могли присоединиться</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {classList.map((classRoom, idx) => (
            <motion.div
              key={classRoom.id}
              className="card cursor-pointer hover:shadow-md transition-all"
              whileHover={{ scale: 1.01 }}
              onClick={() => handleSelectClass(classRoom.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-duo-blue/10 flex items-center justify-center text-duo-blue">
                    <School size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">{classRoom.name}</p>
                    <p className="text-xs text-gray-500">{classRoom.students.length} учеников • {classRoom.homework.length} заданий</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1 px-2 py-1 bg-duo-yellow/10 rounded-lg border border-duo-yellow/20"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleCopyCode(classRoom.inviteCode)
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <span className="text-xs font-mono font-bold text-duo-yellow">{classRoom.inviteCode}</span>
                    {copiedCode === classRoom.inviteCode ? (
                      <CheckCircle size={14} className="text-duo-green" />
                    ) : (
                      <Copy size={14} className="text-gray-400" />
                    )}
                  </div>
                  <ChevronRight size={20} className="text-gray-400" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
