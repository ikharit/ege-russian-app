import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, BookOpen, TrendingDown, Calendar, Award, ArrowLeft, BarChart3, Mail, AlertTriangle, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { course } from '../data/courseData'
import { useNavigate } from 'react-router-dom'
import { allHomework, nonstandardStudents } from '../data/gsheets/homeworkData'

export function Teacher() {
  const navigate = useNavigate()
  const students = useProgressStore((s) => s.teacherStudents)
  const isTeacher = useProgressStore((s) => s.isTeacher)
  const setTeacherMode = useProgressStore((s) => s.setTeacherMode)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'students' | 'assign'>('overview')

  if (!isTeacher) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="card text-center py-12">
          <div className="text-5xl mb-4">👨‍🏫</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Панель учителя</h2>
          <p className="text-gray-500 mb-6">Войдите в режим учителя, чтобы отслеживать прогресс учеников и назначать домашние задания.</p>
          <button onClick={() => setTeacherMode(true)} className="btn-primary">
            Войти как учитель
          </button>
        </div>
      </div>
    )
  }

  const totalStudents = students.length
  const activeStudents = students.filter(s => {
    const lastDate = new Date(s.lastActive)
    const daysDiff = (Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysDiff <= 7
  }).length
  const avgScore = Math.round(students.reduce((sum, s) => sum + s.averageScore, 0) / totalStudents)

  const student = selectedStudent ? students.find(s => s.id === selectedStudent) : null

  if (student) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <button onClick={() => setSelectedStudent(null)} className="flex items-center gap-2 text-gray-500 mb-4">
          <ArrowLeft size={18} /> Назад к списку
        </button>
        <div className="card mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-full bg-duo-green/20 flex items-center justify-center text-2xl">
              👨‍🎓
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{student.name}</h2>
              <p className="text-sm text-gray-500">Последняя активность: {student.lastActive}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-duo-snow rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-duo-green">{student.lessonsCompleted}</p>
              <p className="text-xs text-gray-500">Уроков</p>
            </div>
            <div className="bg-duo-snow rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-duo-blue">{student.totalAttempts}</p>
              <p className="text-xs text-gray-500">Попыток</p>
            </div>
            <div className="bg-duo-snow rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-duo-yellow">{student.averageScore}%</p>
              <p className="text-xs text-gray-500">Средний балл</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-3">
            <TrendingDown size={20} className="text-duo-red" />
            <h3 className="font-bold text-gray-700">Слабые темы</h3>
          </div>
          {student.weakTopics.length > 0 ? (
            <div className="flex flex-col gap-2">
              {student.weakTopics.map((topic, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-duo-red/10 rounded-lg p-2">
                  <AlertTriangle size={16} className="text-duo-red" />
                  <span className="text-sm text-gray-700">{topic}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Все темы освоены хорошо!</p>
          )}
          <button className="btn-primary w-full mt-4">
            <Mail size={16} className="inline mr-2" />
            Назначить дополнительное задание
          </button>
          <button
            onClick={() => navigate(`/teacher/${student.name}`)}
            className="btn-primary w-full mt-2 bg-duo-blue hover:bg-duo-blue/90"
          >
            <BookOpen size={16} className="inline mr-2" />
            Смотреть ДЗ из Google Sheets
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Users size={28} className="text-duo-blue" />
          <h1 className="text-2xl font-bold text-gray-800">Панель учителя</h1>
        </div>
        <button onClick={() => setTeacherMode(false)} className="text-sm text-gray-500">
          Выйти
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'overview' as const, label: 'Обзор', icon: BarChart3 },
          { key: 'students' as const, label: 'Ученики', icon: Users },
          { key: 'assign' as const, label: 'Домашки', icon: BookOpen },
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

      {activeTab === 'overview' && (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="card bg-duo-blue/10">
              <p className="text-3xl font-bold text-duo-blue">{totalStudents}</p>
              <p className="text-sm text-gray-600">Всего учеников</p>
            </div>
            <div className="card bg-duo-green/10">
              <p className="text-3xl font-bold text-duo-green">{activeStudents}</p>
              <p className="text-sm text-gray-600">Активных за неделю</p>
            </div>
            <div className="card bg-duo-yellow/10">
              <p className="text-3xl font-bold text-duo-yellow">{avgScore}%</p>
              <p className="text-sm text-gray-600">Средний балл</p>
            </div>
            <div className="card bg-duo-purple/10">
              <p className="text-3xl font-bold text-duo-purple">{students.reduce((sum, s) => sum + s.lessonsCompleted, 0)}</p>
              <p className="text-sm text-gray-600">Уроков пройдено</p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">📊 Распределение по успеваемости</h3>
            <div className="flex flex-col gap-2">
              {[
                { label: 'Отлично (90-100%)', count: students.filter(s => s.averageScore >= 90).length, color: 'bg-duo-green' },
                { label: 'Хорошо (70-89%)', count: students.filter(s => s.averageScore >= 70 && s.averageScore < 90).length, color: 'bg-duo-yellow' },
                { label: 'Удовлетворительно (50-69%)', count: students.filter(s => s.averageScore >= 50 && s.averageScore < 70).length, color: 'bg-orange-400' },
                { label: 'Требует внимания (<50%)', count: students.filter(s => s.averageScore < 50).length, color: 'bg-duo-red' },
              ].map((cat, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-700">{cat.label}</span>
                      <span className="font-bold">{cat.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className={`${cat.color} h-2 rounded-full`} style={{ width: `${totalStudents > 0 ? (cat.count / totalStudents) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">⚠️ Требуют внимания</h3>
            <div className="flex flex-col gap-2">
              {students
                .filter(s => s.averageScore < 70 || s.weakTopics.length >= 2)
                .map((s, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-duo-red/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👨‍🎓</span>
                      <span className="text-sm font-bold text-gray-700">{s.name}</span>
                    </div>
                    <span className="text-sm text-duo-red font-bold">{s.averageScore}%</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="flex flex-col gap-3">
          {students.map((student, idx) => (
            <motion.div
              key={student.id}
              className="card cursor-pointer"
              whileHover={{ scale: 1.01 }}
              onClick={() => setSelectedStudent(student.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-duo-blue/20 flex items-center justify-center text-lg">
                  👨‍🎓
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800">{student.name}</p>
                  <p className="text-xs text-gray-500">{student.lessonsCompleted} уроков • {student.averageScore}% средний балл</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400">{student.lastActive}</p>
                  <div className="flex gap-1 mt-1 justify-end">
                    {student.weakTopics.length > 0 && (
                      <span className="inline-block px-2 py-0.5 bg-duo-red/20 text-duo-red text-xs rounded-full font-bold">
                        {student.weakTopics.length} проблемы
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/teacher/${student.name}`)
                      }}
                      className="inline-block px-2 py-0.5 bg-duo-blue/20 text-duo-blue text-xs rounded-full font-bold hover:bg-duo-blue/30 transition-colors"
                    >
                      📋 ДЗ
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'assign' && (
        <div className="flex flex-col gap-4">
          {/* Реальные данные из Google Sheets */}
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">📅 Актуальное домашнее задание (из Google Sheets)</h3>
            <div className="flex flex-col gap-3">
              {Object.entries(allHomework)
                .filter(([_, hw]) => hw.current !== null)
                .map(([name, hw]) => (
                  <div key={name} className="p-3 bg-duo-snow rounded-xl">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-sm text-gray-800">{name}</p>
                        <p className="text-xs text-gray-500 mt-1">📅 {hw.current!.date}</p>
                        <p className="text-sm text-gray-700 mt-1">{hw.current!.homework}</p>
                        {hw.current!.comment && (
                          <p className="text-xs text-gray-500 mt-1">💬 {hw.current!.comment}</p>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        {hw.current!.status === 'да' ? (
                          <span className="px-2 py-1 bg-duo-green/20 text-duo-green text-xs rounded-full font-bold flex items-center gap-1">
                            <CheckCircle size={12} /> Сдано
                          </span>
                        ) : hw.current!.status === 'нет' ? (
                          <span className="px-2 py-1 bg-duo-red/20 text-duo-red text-xs rounded-full font-bold flex items-center gap-1">
                            <XCircle size={12} /> Не сдано
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-duo-yellow/20 text-duo-yellow text-xs rounded-full font-bold flex items-center gap-1">
                            <Clock size={12} /> {hw.current!.status || '—'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {nonstandardStudents.length > 0 && (
            <div className="card">
              <h3 className="font-bold text-gray-700 mb-3">⚠️ Требует внимания</h3>
              <div className="flex flex-col gap-2">
                {nonstandardStudents.map(name => (
                  <div key={name} className="p-2 bg-duo-yellow/10 rounded-lg flex items-center gap-2">
                    <AlertTriangle size={16} className="text-duo-yellow" />
                    <span className="text-sm text-gray-700"><strong>{name}</strong> — другой формат таблицы (нет колонки ДЗ)</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="font-bold text-gray-700 mb-3">📝 Назначить новое задание</h3>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-sm font-bold text-gray-700">Ученики</label>
                <select className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white">
                  <option>Все ученики</option>
                  {students.map(s => <option key={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Урок</label>
                <select className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white">
                  {course.sections.flatMap(s => s.lessons.map(l => (
                    <option key={l.id}>{s.title} — {l.title}</option>
                  )))}
                </select>
              </div>
              <div>
                <label className="text-sm font-bold text-gray-700">Срок сдачи</label>
                <input type="date" className="w-full mt-1 p-3 rounded-xl border border-gray-200 bg-white" />
              </div>
              <button className="btn-primary flex items-center justify-center gap-2">
                <Calendar size={16} />
                Назначить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
