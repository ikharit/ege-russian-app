import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { Clock, Monitor, BookOpen, Dumbbell, GraduationCap, Trophy, MessageCircle, ShoppingBag, Gamepad2, Swords, Route, BrainCircuit, Bell, Settings, HelpCircle } from 'lucide-react'

interface TimeDistributionProps {
  timeDistribution: Record<string, number>
}

const CATEGORY_CONFIG: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  lesson: { label: 'Уроки', color: '#58cc02', icon: BookOpen },
  trainer: { label: 'Тренажёры', color: '#1cb0f6', icon: Dumbbell },
  theory: { label: 'Теория', color: '#ce82ff', icon: GraduationCap },
  exam: { label: 'Экзамены', color: '#ff9600', icon: Trophy },
  flashcard: { label: 'Карточки', color: '#ff4b4b', icon: BrainCircuit },
  dashboard: { label: 'Дашборд', color: '#ffc800', icon: Monitor },
  profile: { label: 'Профиль', color: '#2b70c9', icon: Settings },
  leaderboard: { label: 'Рейтинг', color: '#ff4b4b', icon: Trophy },
  shop: { label: 'Магазин', color: '#ff9600', icon: ShoppingBag },
  chat: { label: 'Чат', color: '#1cb0f6', icon: MessageCircle },
  game: { label: 'Игры', color: '#ce82ff', icon: Gamepad2 },
  duel: { label: 'Дуэли', color: '#ff4b4b', icon: Swords },
  marathon: { label: 'Марафон', color: '#58cc02', icon: Route },
  adaptive: { label: 'Адаптив', color: '#ffc800', icon: BrainCircuit },
  mistakes: { label: 'Ошибки', color: '#ff9600', icon: HelpCircle },
  notification: { label: 'Уведомления', color: '#1cb0f6', icon: Bell },
  auth: { label: 'Авторизация', color: '#2b70c9', icon: Settings },
  settings: { label: 'Настройки', color: '#2b70c9', icon: Settings },
  other: { label: 'Другое', color: '#888888', icon: HelpCircle },
}

export function TimeDistribution({ timeDistribution }: TimeDistributionProps) {
  const data = useMemo(() => {
    const entries = Object.entries(timeDistribution)
      .filter(([, seconds]) => seconds > 0)
      .map(([category, seconds]) => ({
        category,
        label: CATEGORY_CONFIG[category]?.label || category,
        seconds,
        minutes: Math.round(seconds / 60),
        hours: Math.round((seconds / 3600) * 10) / 10,
        color: CATEGORY_CONFIG[category]?.color || '#888888',
      }))
      .sort((a, b) => b.seconds - a.seconds)

    const totalSeconds = entries.reduce((sum, e) => sum + e.seconds, 0)
    const totalMinutes = Math.round(totalSeconds / 60)
    const totalHours = Math.round((totalSeconds / 3600) * 10) / 10

    return { entries, totalSeconds, totalMinutes, totalHours }
  }, [timeDistribution])

  if (data.entries.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={20} className="text-duo-blue" />
          <h3 className="font-bold text-gray-700">Распределение времени</h3>
        </div>
        <p className="text-sm text-gray-500">Нет данных о времени. Ученики ещё не заходили в приложение.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-duo-blue" />
          <h3 className="font-bold text-gray-700">Распределение времени</h3>
          <span className="text-xs text-gray-400 ml-auto">{data.totalHours}ч всего</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.entries}
                  dataKey="seconds"
                  nameKey="label"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ label, percent }) => `${label} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.entries.map((entry) => (
                    <Cell key={entry.category} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: any, name: any) => {
                    const minutes = Math.round((value as number) / 60)
                    return [`${minutes} мин (${((value / data.totalSeconds) * 100).toFixed(1)}%)`, name]
                  }}
                  contentStyle={{ fontSize: 12, borderRadius: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend / Table */}
          <div className="space-y-2">
            {data.entries.slice(0, 10).map((entry) => {
              const Icon = CATEGORY_CONFIG[entry.category]?.icon || HelpCircle
              const pct = ((entry.seconds / data.totalSeconds) * 100).toFixed(1)
              return (
                <div key={entry.category} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                  <Icon size={14} className="text-gray-400 shrink-0" />
                  <span className="text-xs font-bold text-gray-700 flex-1">{entry.label}</span>
                  <span className="text-xs text-gray-500">{entry.minutes} мин</span>
                  <span className="text-xs font-bold text-gray-600 w-10 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Per-student time */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <h3 className="font-bold text-gray-700 mb-3 text-sm">Время по ученикам</h3>
        <div className="space-y-2">
          {data.entries.slice(0, 5).map((entry) => (
            <div key={entry.category} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-500 w-24">{entry.label}</span>
              <div className="flex-1">
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className="h-2 rounded-full"
                    style={{ width: `${Math.min((entry.seconds / data.totalSeconds) * 100, 100)}%`, backgroundColor: entry.color }}
                  />
                </div>
              </div>
              <span className="text-xs font-bold text-gray-600 w-16 text-right">{entry.hours}ч</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
