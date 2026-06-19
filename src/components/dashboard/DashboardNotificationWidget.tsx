import { motion } from 'framer-motion'
import { Bell } from 'lucide-react'
import { useState } from 'react'
import { useNotificationStore } from '../../stores/notificationStore'

export function DashboardNotificationWidget() {
  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = notifications.filter(n => !n.read).length
  const markRead = useNotificationStore((s) => s.markRead)
  const settings = useNotificationStore((s) => s.settings)
  const requestPermission = useNotificationStore((s) => s.requestPermission)
  const [expanded, setExpanded] = useState(false)

  if (!settings.enabled) return null
  if (unreadCount === 0) return null

  return (
    <motion.div
      className="card bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-400 flex items-center justify-center text-white relative">
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                {unreadCount}
              </span>
            )}
          </div>
          <div>
            <p className="font-bold text-gray-800">Уведомления</p>
            <p className="text-xs text-gray-500">{unreadCount} новых</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-orange-500 font-bold"
        >
          {expanded ? 'Скрыть' : 'Показать'}
        </button>
      </div>
      {expanded && (
        <div className="mt-3 flex flex-col gap-2">
          {notifications.filter(n => !n.read).slice(0, 5).map((n) => (
            <div key={n.id} className="p-2 bg-white rounded-lg flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-700">{n.title}</p>
                <p className="text-xs text-gray-500">{n.body}</p>
              </div>
              <button
                onClick={() => markRead(n.id)}
                className="text-xs text-orange-500 font-bold"
              >
                Прочитано
              </button>
            </div>
          ))}
          <button
            onClick={() => requestPermission()}
            className="text-xs text-orange-500 font-bold mt-1"
          >
            🔕 Включить push-уведомления
          </button>
        </div>
      )}
    </motion.div>
  )
}
