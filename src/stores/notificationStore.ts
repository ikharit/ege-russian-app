import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getToken, onMessage, type Messaging } from 'firebase/messaging'
import { messaging } from '../config/firebase'

export type NotificationType =
  | 'streak'
  | 'homework'
  | 'exam'
  | 'daily_quest'
  | 'srs'
  | 'achievement'
  | 'level_up'
  | 'deadline'

export interface NotificationSettings {
  enabled: boolean
  streakReminder: boolean
  homeworkDeadline: boolean
  examReminder: boolean
  dailyQuestReminder: boolean
  srsReminder: boolean
  achievementReminder: boolean
  levelUpReminder: boolean
  reminderTime: string
  homeworkReminderDays: number
}

export interface FCMNotification {
  id: string
  type: NotificationType
  title: string
  body: string
  data?: Record<string, string>
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

export interface NotificationState {
  settings: NotificationSettings
  notifications: FCMNotification[]
  fcmToken: string | null
  permission: NotificationPermission | 'default'
  lastStreakReminder: string
  lastHomeworkCheck: string
  lastExamReminder: string
  lastDailyQuestReminder: string
  lastSRSReminder: string
  fcmSupported: boolean
  fcmInitialized: boolean

  // Actions
  updateSettings: (settings: Partial<NotificationSettings>) => void
  requestPermission: () => Promise<boolean>
  getFCMToken: () => Promise<string | null>
  initFCM: () => Promise<void>
  onForegroundMessage: (callback: (payload: FCMNotification) => void) => () => void
  markRead: (id: string) => void
  markAllRead: () => void
  clearNotifications: () => void
  getUnreadCount: () => number
  checkAndNotify: () => void
  getHomeworkDeadlines: () => HomeworkDeadline[]
  getStreakStatus: () => { active: boolean; days: number; lastActivity: string; needsReminder: boolean }
  getExamDaysLeft: () => number | null
  getDueSRSCount: () => number
  sendLocalNotification: (title: string, body: string, type?: NotificationType, actionUrl?: string) => void
  addNotification: (notification: Omit<FCMNotification, 'id' | 'timestamp' | 'read'>) => void
}

function getDefaultSettings(): NotificationSettings {
  return {
    enabled: true,
    streakReminder: true,
    homeworkDeadline: true,
    examReminder: true,
    dailyQuestReminder: true,
    srsReminder: true,
    achievementReminder: true,
    levelUpReminder: true,
    reminderTime: '19:00',
    homeworkReminderDays: 1,
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function isFCMSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  )
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      settings: getDefaultSettings(),
      notifications: [],
      fcmToken: null,
      permission: 'default',
      lastStreakReminder: '',
      lastHomeworkCheck: '',
      lastExamReminder: '',
      lastDailyQuestReminder: '',
      lastSRSReminder: '',
      fcmSupported: isFCMSupported(),
      fcmInitialized: false,

      updateSettings: (settings) => {
        set((prev) => ({ settings: { ...prev.settings, ...settings } }))
      },

      requestPermission: async () => {
        if (!('Notification' in window)) return false
        const permission = await Notification.requestPermission()
        set({ permission })
        return permission === 'granted'
      },

      getFCMToken: async () => {
        const state = get()
        if (!state.fcmSupported || state.permission !== 'granted') return null
        try {
          const token = await getToken(messaging as Messaging, {
            vapidKey: 'YOUR_VAPID_KEY',
          })
          set({ fcmToken: token })
          return token
        } catch (err) {
          console.warn('[FCM] Failed to get token:', err)
          return null
        }
      },

      initFCM: async () => {
        const state = get()
        if (!state.fcmSupported || state.fcmInitialized) return

        try {
          // Register the FCM service worker
          const registrations = await navigator.serviceWorker.getRegistrations()
          const fcmSw = registrations.find((r) =>
            r.scope.includes('firebase-messaging')
          )

          if (!fcmSw) {
            await navigator.serviceWorker.register('/firebase-messaging-sw.js')
          }

          set({ fcmInitialized: true })

          // Get token if permission granted
          if (state.permission === 'granted') {
            await get().getFCMToken()
          }
        } catch (err) {
          console.warn('[FCM] Init failed:', err)
        }
      },

      onForegroundMessage: (callback) => {
        const unsubscribe = onMessage(messaging as Messaging, (payload) => {
          const notification: FCMNotification = {
            id: payload.messageId || generateId(),
            type: (payload.data?.type as NotificationType) || 'achievement',
            title: payload.notification?.title || payload.data?.title || 'ЕГЭ Русский',
            body: payload.notification?.body || payload.data?.body || '',
            data: payload.data ? { ...payload.data } : undefined,
            timestamp: new Date().toISOString(),
            read: false,
            actionUrl: payload.data?.url || payload.data?.actionUrl,
          }
          set((prev) => ({
            notifications: [notification, ...prev.notifications],
          }))
          callback(notification)
        })
        return unsubscribe
      },

      addNotification: (notification) => {
        const now = new Date()
        const item: FCMNotification = {
          ...notification,
          id: generateId(),
          timestamp: now.toISOString(),
          read: false,
        }
        set((prev) => ({
          notifications: [item, ...prev.notifications].slice(0, 200),
        }))
      },

      markRead: (id) => {
        set((prev) => ({
          notifications: prev.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }))
      },

      markAllRead: () => {
        set((prev) => ({
          notifications: prev.notifications.map((n) => ({ ...n, read: true })),
        }))
      },

      clearNotifications: () => {
        set({ notifications: [] })
      },

      getUnreadCount: () => {
        return get().notifications.filter((n) => !n.read).length
      },

      sendLocalNotification: (title, body, type = 'achievement', actionUrl) => {
        const state = get()
        if (!state.settings.enabled) return
        if (state.permission !== 'granted') return

        // Add to in-app list
        get().addNotification({ title, body, type, actionUrl })

        // Try native notification
        try {
          if (document.hidden) {
            new Notification(title, { body, icon: '/icon-192x192.png' })
          }
        } catch {
          // Ignore if native notification fails
        }
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
          if (streakStatus.needsReminder && currentTime >= state.settings.reminderTime) {
            get().addNotification({
              type: 'streak',
              title: '🔥 Не потеряй стрик!',
              body: `Реши 1 задание за 2 минуты — твой стрик ${streakStatus.days} дней!`,
              actionUrl: '/',
            })
            try {
              new Notification('🔥 Не потеряй стрик!', {
                body: `Реши 1 задание за 2 минуты`,
                icon: '/icon-192x192.png',
              })
            } catch {}
            set({ lastStreakReminder: today })
          }
        }

        // Homework deadlines
        if (state.settings.homeworkDeadline && state.lastHomeworkCheck !== today) {
          const deadlines = get().getHomeworkDeadlines()
          const urgent = deadlines.filter((d) => d.urgent)
          if (urgent.length > 0) {
            const title = urgent.length === 1
              ? `📚 Домашка «${urgent[0].homework}» сдаётся завтра!`
              : `📚 ${urgent.length} домашек с дедлайном завтра!`
            get().addNotification({
              type: 'homework',
              title,
              body: urgent.length === 1
                ? `Осталось ${urgent[0].daysLeft} дн.`
                : `Проверь список заданий`,
              actionUrl: '/my-homework',
            })
            try {
              new Notification(title, {
                body: urgent.length === 1 ? `Осталось ${urgent[0].daysLeft} дн.` : 'Проверь список заданий',
                icon: '/icon-192x192.png',
              })
            } catch {}
            set({ lastHomeworkCheck: today })
          }
        }

        // Exam reminder (every 7 days)
        if (state.settings.examReminder) {
          const examDays = get().getExamDaysLeft()
          if (examDays !== null && state.lastExamReminder !== today) {
            const todayDate = new Date()
            const dayOfWeek = todayDate.getDay()
            if (dayOfWeek === 1 || dayOfWeek === 4) { // Mon or Thu
              const score = getScoreEstimate()
              get().addNotification({
                type: 'exam',
                title: `⏰ До ЕГЭ ${examDays} дней`,
                body: `Текущий прогноз: ${score} баллов. Продолжай готовиться!`,
                actionUrl: '/study-plan',
              })
              try {
                new Notification(`⏰ До ЕГЭ ${examDays} дней`, {
                  body: `Текущий прогноз: ${score} баллов`,
                  icon: '/icon-192x192.png',
                })
              } catch {}
              set({ lastExamReminder: today })
            }
          }
        }

        // Daily quest reminder (10:00)
        if (state.settings.dailyQuestReminder && state.lastDailyQuestReminder !== today) {
          if (currentTime >= '10:00' && currentTime < '10:05') {
            const xp = getDailyQuestXP()
            get().addNotification({
              type: 'daily_quest',
              title: '🎯 Новые квесты на сегодня!',
              body: `Забери ${xp} XP — выполняй ежедневные задания!`,
              actionUrl: '/',
            })
            try {
              new Notification('🎯 Новые квесты на сегодня!', {
                body: `Забери ${xp} XP`,
                icon: '/icon-192x192.png',
              })
            } catch {}
            set({ lastDailyQuestReminder: today })
          }
        }

        // SRS reminder (9:00, if due > 0)
        if (state.settings.srsReminder && state.lastSRSReminder !== today) {
          const dueCount = get().getDueSRSCount()
          if (dueCount > 0 && currentTime >= '09:00' && currentTime < '09:05') {
            get().addNotification({
              type: 'srs',
              title: `🔁 ${dueCount} уроков на повторение`,
              body: '5 минут — и всё! Повтори материал, чтобы не забыть.',
              actionUrl: '/course',
            })
            try {
              new Notification(`🔁 ${dueCount} уроков на повторение`, {
                body: '5 минут — и всё!',
                icon: '/icon-192x192.png',
              })
            } catch {}
            set({ lastSRSReminder: today })
          }
        }
      },

      getHomeworkDeadlines: () => {
        try {
          const hwData = localStorage.getItem('homework-deadlines')
          if (hwData) return JSON.parse(hwData) as HomeworkDeadline[]
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

      getExamDaysLeft: () => {
        try {
          const planData = localStorage.getItem('study-plan-storage')
          if (!planData) return null
          const parsed = JSON.parse(planData)
          const examDate = parsed.state?.examDate
          if (!examDate) return null
          const diff = new Date(examDate).getTime() - new Date().getTime()
          const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
          return days > 0 ? days : 0
        } catch {
          return null
        }
      },

      getDueSRSCount: () => {
        try {
          const progressData = localStorage.getItem('progress-storage')
          if (!progressData) return 0
          const parsed = JSON.parse(progressData)
          const atomProgress = parsed.state?.atomProgress || {}
          let due = 0
          const now = Date.now()
          for (const key of Object.keys(atomProgress)) {
            const atom = atomProgress[key]
            if (atom.nextReview && atom.nextReview < now) {
              due++
            }
          }
          return due
        } catch {
          return 0
        }
      },
    }),
    {
      name: 'notification-store',
      partialize: (state) => ({
        settings: state.settings,
        lastStreakReminder: state.lastStreakReminder,
        lastHomeworkCheck: state.lastHomeworkCheck,
        lastExamReminder: state.lastExamReminder,
        lastDailyQuestReminder: state.lastDailyQuestReminder,
        lastSRSReminder: state.lastSRSReminder,
        permission: state.permission,
        fcmToken: state.fcmToken,
      }),
    }
  )
)

// Helper functions for score estimate and daily quest XP
function getScoreEstimate(): number {
  try {
    const progressData = localStorage.getItem('progress-storage')
    if (!progressData) return 0
    const parsed = JSON.parse(progressData)
    const examResults = parsed.state?.examResults || []
    if (examResults.length === 0) {
      const taskStats = parsed.state?.taskStats || {}
      const scores = Object.values(taskStats).map((t: unknown) => {
        const stat = t as { bestScore?: number }
        return stat.bestScore || 0
      })
      if (scores.length === 0) return 0
      return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    }
    const lastResult = examResults[examResults.length - 1]
    return lastResult.score || lastResult.totalScore || 0
  } catch {
    return 0
  }
}

function getDailyQuestXP(): number {
  try {
    const progressData = localStorage.getItem('progress-storage')
    if (!progressData) return 50
    const parsed = JSON.parse(progressData)
    const quests = parsed.state?.dailyQuestProgress || {}
    const totalXP = Object.values(quests).reduce((sum: number, q: unknown) => {
      const quest = q as { xp?: number }
      return sum + (quest.xp || 0)
    }, 0)
    return (totalXP as number) || 50
  } catch {
    return 50
  }
}
