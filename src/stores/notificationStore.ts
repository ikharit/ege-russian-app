import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface NotificationSettings {
  streakReminder: boolean        // Ежедневное напоминание о streak
  homeworkDeadline: boolean        // Напоминание о дедлайне домашки
  homeworkReminderDays: number   // За сколько дней напоминать о дедлайне
  streakReminderTime: string      // Время напоминания (HH:MM)
  enabled: boolean                // Глобальный toggle уведомлений
}

export interface NotificationRecord {
  id: string
  type: 'streak' | 'homework' | 'deadline' | 'achievement'
  title: string
  body: string
  timestamp: string
  read: boolean
  actionUrl?: string
}

export interface HomeworkDeadline {
  studentName: string
  homework: string
  date: string
  daysLeft: number
  urgent: boolean
}

interface NotificationState {
  settings: NotificationSettings
  notifications: NotificationRecord[]
  lastStreakReminder: string
  lastHomeworkCheck: string
  permission: NotificationPermission | 'default'

  // Actions
  updateSettings: (settings: Partial<NotificationSettings>) => void
  requestPermission: () => Promise<boolean>
  checkAndNotify: () => void
  markRead: (id: string) => void
  markAllRead: () => void
  clearNotifications: () => void
  getUnreadCount: () => number
  getHomeworkDeadlines: () => HomeworkDeadline[]
  getStreakStatus: () => { active: boolean; days: number; lastActivity: string; needsReminder: boolean }
}

function getDefaultSettings(): NotificationSettings {
  return {
    streakReminder: true,
    homeworkDeadline: true,
    homeworkReminderDays: 1,
    streakReminderTime: '19:00',
    enabled: true,
  }
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      settings: getDefaultSettings(),
      notifications: [],
      lastStreakReminder: '',
      lastHomeworkCheck: '',
      permission: 'default',

      updateSettings: (settings) => {
        set(prev => ({ settings: { ...prev.settings, ...settings } }))
      },

      requestPermission: async () => {
        if (!('Notification' in window)) return false
        const permission = await Notification.requestPermission()
        set({ permission })
        return permission === 'granted'
      },

      checkAndNotify: () => {
        const state = get()
        if (!state.settings.enabled) return
        if (state.permission !== 'granted') return

        const today = new Date().toISOString().split('T')[0]
        const now = new Date()
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

        // Streak reminder
        if (state.settings.streakReminder && state.lastStreakReminder !== today) {
          const streakStatus = get().getStreakStatus()
          if (streakStatus.needsReminder && currentTime >= state.settings.streakReminderTime) {
            const notification: NotificationRecord = {
              id: `streak-${today}`,
              type: 'streak',
              title: '🔥 Не забудь про streak!',
              body: `Твой streak: ${streakStatus.days} дней. Зайди сегодня, чтобы не потерять его!`,
              timestamp: now.toISOString(),
              read: false,
              actionUrl: '/',
            }
            set(prev => ({
              notifications: [notification, ...prev.notifications],
              lastStreakReminder: today,
            }))
            try {
              new Notification(notification.title, { body: notification.body, icon: '/icon.svg' })
            } catch {}
          }
        }

        // Homework deadlines
        if (state.settings.homeworkDeadline && state.lastHomeworkCheck !== today) {
          const deadlines = get().getHomeworkDeadlines()
          const urgent = deadlines.filter(d => d.urgent)
          if (urgent.length > 0) {
            const notification: NotificationRecord = {
              id: `hw-${today}`,
              type: 'homework',
              title: '⏰ Дедлайн домашки!',
              body: urgent.length === 1
                ? `Дедлайн: ${urgent[0].homework} (${urgent[0].daysLeft} дн.)`
                : `${urgent.length} домашних заданий с дедлайном менее ${state.settings.homeworkReminderDays} дней!`,
              timestamp: now.toISOString(),
              read: false,
              actionUrl: '/my-homework',
            }
            set(prev => ({
              notifications: [notification, ...prev.notifications],
              lastHomeworkCheck: today,
            }))
            try {
              new Notification(notification.title, { body: notification.body, icon: '/icon.svg' })
            } catch {}
          }
        }
      },

      markRead: (id) => {
        set(prev => ({
          notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n),
        }))
      },

      markAllRead: () => {
        set(prev => ({
          notifications: prev.notifications.map(n => ({ ...n, read: true })),
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      getUnreadCount: () => {
        return get().notifications.filter(n => !n.read).length
      },

      getHomeworkDeadlines: () => {
        // Try to read homework data from localStorage (set by homework page)
        try {
          const hwData = localStorage.getItem('homework-deadlines')
          if (hwData) return JSON.parse(hwData)
        } catch {}
        return []
      },

      getStreakStatus: () => {
        try {
          const progressData = localStorage.getItem('progress-storage')
          if (!progressData) return { active: false, days: 0, lastActivity: '', needsReminder: false }
          const parsed = JSON.parse(progressData)
          const stats = parsed.state?.userStats || {}
          const lastActivity = stats.lastActivityDate || ''
          const days = stats.streak || 0
          const today = new Date().toISOString().split('T')[0]
          const needsReminder = days > 0 && lastActivity !== today
          return { active: days > 0, days, lastActivity, needsReminder }
        } catch {
          return { active: false, days: 0, lastActivity: '', needsReminder: false }
        }
      },
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        settings: state.settings,
        lastStreakReminder: state.lastStreakReminder,
        lastHomeworkCheck: state.lastHomeworkCheck,
        permission: state.permission,
      }),
    }
  )
)
