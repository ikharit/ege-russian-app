import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, RefreshCw, Settings, Download, ArrowLeft, Clock } from 'lucide-react'
import { useProgressStore } from '../stores/progressStore'
import { generateWeeklySchedule, exportScheduleToText, exportScheduleToICS } from '../utils/weeklySchedule'
import type { ScheduleDay, WeeklySchedulePreferences } from '../types'

const dayNames: Record<ScheduleDay['day'], string> = {
  mon: 'Пн', tue: 'Вт', wed: 'Ср', thu: 'Чт', fri: 'Пт', sat: 'Сб', sun: 'Вс',
}

const fullDayNames: Record<ScheduleDay['day'], string> = {
  mon: 'Понедельник', tue: 'Вторник', wed: 'Среда', thu: 'Четверг', fri: 'Пятница', sat: 'Суббота', sun: 'Воскресенье',
}

const defaultTimes: Record<ScheduleDay['day'], number> = {
  mon: 30, tue: 30, wed: 30, thu: 30, fri: 30, sat: 60, sun: 45,
}

export function WeeklySchedulePage() {
  const navigate = useNavigate()
  const schedule = useProgressStore((s) => s.weeklySchedule)
  const generateSchedule = useProgressStore((s) => s.generateWeeklySchedule)
  const markDone = useProgressStore((s) => s.markScheduleItemDone)

  const [showSettings, setShowSettings] = useState(false)
  const [preferences, setPreferences] = useState<WeeklySchedulePreferences>({
    availableTimePerDay: { ...defaultTimes },
    activeDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    focus: 'weak',
  })

  const regenerate = useCallback(() => {
    generateSchedule(preferences)
  }, [generateSchedule, preferences])

  const exportText = useCallback(() => {
    if (!schedule) return
    const text = exportScheduleToText(schedule)
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'raspisanie.txt'
    a.click()
    URL.revokeObjectURL(url)
  }, [schedule])

  const exportICS = useCallback(() => {
    if (!schedule) return
    const ics = exportScheduleToICS(schedule)
    const blob = new Blob([ics], { type: 'text/calendar' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'raspisanie.ics'
    a.click()
    URL.revokeObjectURL(url)
  }, [schedule])

  const completedCount = schedule?.reduce((sum, day) => sum + day.items.filter(i => i.type === 'break' && i.title.startsWith('✅')).length, 0) || 0
  const totalItems = schedule?.reduce((sum, day) => sum + day.items.filter(i => i.type !== 'break').length, 0) || 0

  return (
    <div className="max-w-md mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate('/')} className="p-2 rounded-xl hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Расписание на неделю</h1>
      </div>

      {/* Summary */}
      <div className="card mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Эта неделя</p>
            <p className="text-lg font-bold text-gray-800">
              {schedule ? `${schedule.filter(d => d.items.length > 0).length}/7 дней запланировано` : 'Нет расписания'}
            </p>
            <p className="text-sm text-gray-500">
              {completedCount}/{totalItems} выполнено
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowSettings(s => !s)}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
              title="Настройки"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={regenerate}
              className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-600"
              title="Перегенерировать"
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Settings panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mb-4"
          >
            <div className="card bg-gray-50">
              <h3 className="font-bold text-gray-700 mb-3">Настройки</h3>
              <div className="space-y-3">
                {(['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const).map((day) => (
                  <div key={day} className="flex items-center justify-between">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={preferences.activeDays?.includes(day) ?? true}
                        onChange={(e) => {
                          const current = preferences.activeDays || ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
                          const next = e.target.checked
                            ? [...current, day]
                            : current.filter(d => d !== day)
                          setPreferences({ ...preferences, activeDays: next })
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-purple-600"
                      />
                      <span className="text-sm text-gray-700">{fullDayNames[day]}</span>
                    </label>
                    <div className="flex items-center gap-1">
                      <Clock size={14} className="text-gray-400" />
                      <input
                        type="number"
                        value={preferences.availableTimePerDay?.[day] ?? defaultTimes[day]}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0
                          setPreferences({
                            ...preferences,
                            availableTimePerDay: {
                              ...(preferences.availableTimePerDay || {}),
                              [day]: val,
                            },
                          })
                        }}
                        className="w-16 text-sm border rounded-lg px-2 py-1 text-right"
                        min={0}
                        max={240}
                      />
                      <span className="text-xs text-gray-400">мин</span>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <span className="text-sm text-gray-600">Фокус:</span>
                  <select
                    value={preferences.focus || 'weak'}
                    onChange={(e) => setPreferences({ ...preferences, focus: e.target.value as 'weak' | 'all' | 'exam' })}
                    className="text-sm border rounded-lg px-2 py-1"
                  >
                    <option value="weak">Слабые темы</option>
                    <option value="all">Всё подряд</option>
                    <option value="exam">Экзамен</option>
                  </select>
                </div>
                <button
                  onClick={regenerate}
                  className="w-full py-2 bg-purple-600 text-white rounded-xl font-bold text-sm hover:bg-purple-700 transition-colors"
                >
                  Сгенерировать с новыми настройками
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export buttons */}
      {schedule && schedule.some(d => d.items.length > 0) && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={exportText}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
          >
            <Download size={14} /> Текст
          </button>
          <button
            onClick={exportICS}
            className="flex-1 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
          >
            <Download size={14} /> .ics
          </button>
        </div>
      )}

      {/* Schedule grid */}
      <div className="flex flex-col gap-3">
        {schedule?.map((day) => (
          <motion.div
            key={day.day}
            className="card"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-800">{fullDayNames[day.day]}</span>
                <span className="text-xs text-gray-400">{day.totalTime} мин</span>
              </div>
              {day.items.length === 0 && (
                <span className="text-xs text-gray-400">Выходной</span>
              )}
            </div>
            <div className="flex flex-col gap-2">
              {day.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-2 rounded-lg ${item.type === 'break' && item.title.startsWith('✅') ? 'bg-green-50' : 'bg-gray-50'}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${item.type === 'break' && item.title.startsWith('✅') ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{item.reason}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-xs text-gray-400">{item.duration} мин</span>
                    {item.type !== 'break' && (
                      <button
                        onClick={() => markDone(day.day, idx)}
                        className="p-1.5 rounded-lg bg-white border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors"
                        title="Выполнено"
                      >
                        <Check size={14} className="text-gray-400 hover:text-green-600" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
        {(!schedule || schedule.length === 0) && (
          <div className="text-center py-12 text-gray-400">
            <p className="mb-4">Расписание ещё не создано</p>
            <button
              onClick={regenerate}
              className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
            >
              Сгенерировать расписание
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
