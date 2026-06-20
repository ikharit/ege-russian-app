import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, X, CheckCheck, Flame, BookOpen, Clock, Target, Repeat, Trophy, PartyPopper } from 'lucide-react'
import { useNotificationStore, type NotificationType, type FCMNotification } from '../stores/notificationStore'

const typeConfig: Record<NotificationType, { icon: typeof Flame; color: string; label: string }> = {
  streak: { icon: Flame, color: 'text-orange-500', label: 'Стрик' },
  homework: { icon: BookOpen, color: 'text-duo-blue', label: 'Домашка' },
  exam: { icon: Clock, color: 'text-duo-purple', label: 'ЕГЭ' },
  daily_quest: { icon: Target, color: 'text-duo-green', label: 'Квесты' },
  srs: { icon: Repeat, color: 'text-teal-500', label: 'Повторение' },
  achievement: { icon: Trophy, color: 'text-duo-yellow', label: 'Достижение' },
  level_up: { icon: PartyPopper, color: 'text-pink-500', label: 'Уровень' },
  deadline: { icon: Clock, color: 'text-red-500', label: 'Дедлайн' },
}

function NotificationItem({
  notification,
  onClick,
}: {
  notification: FCMNotification
  onClick: (n: FCMNotification) => void
}) {
  const config = typeConfig[notification.type] || typeConfig.achievement
  const Icon = config.icon
  const date = new Date(notification.timestamp)
  const timeStr = date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
  const dateStr = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })

  return (
    <button
      onClick={() => onClick(notification)}
      className={`w-full text-left p-3 rounded-xl transition-colors flex gap-3 items-start ${
        notification.read
          ? 'bg-gray-50 dark:bg-gray-800/50 opacity-70'
          : 'bg-white dark:bg-gray-800 hover:bg-duo-green/5'
      }`}
    >
      <div className={`mt-0.5 shrink-0 ${config.color}`}>
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${notification.read ? 'text-gray-600 dark:text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{notification.body}</p>
        <p className="text-[10px] text-gray-400 mt-1">
          {dateStr} · {timeStr}
        </p>
      </div>
      {!notification.read && (
        <div className="w-2 h-2 bg-duo-green rounded-full mt-2 shrink-0" />
      )}
    </button>
  )
}

export function NotificationCenter() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = useNotificationStore((s) => s.getUnreadCount())
  const markRead = useNotificationStore((s) => s.markRead)
  const markAllRead = useNotificationStore((s) => s.markAllRead)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleNotificationClick = (notification: FCMNotification) => {
    markRead(notification.id)
    if (notification.actionUrl) {
      navigate(notification.actionUrl)
    }
    setIsOpen(false)
  }

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation()
    markAllRead()
  }

  return (
    <div className="relative">
      <motion.button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-duo-red text-white text-[10px] font-bold rounded-full flex items-center justify-center"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-[340px] max-w-[calc(100vw-2rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-gray-800 dark:text-gray-200">Уведомления</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs text-duo-green font-bold hover:underline flex items-center gap-1"
                >
                  <CheckCheck size={14} />
                  Прочитать все
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                  <Bell size={40} className="text-gray-300 mb-3" />
                  <p className="text-sm text-gray-500 font-bold">Нет уведомлений</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Здесь будут появляться напоминания о стрике, домашке и квестах
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-1 p-2">
                  {notifications.map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                      onClick={handleNotificationClick}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-800 text-center">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Закрыть
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
