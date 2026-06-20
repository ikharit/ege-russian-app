import cron from 'node-cron'
import { Telegraf } from 'telegraf'
import { getDb } from './firebase'
import { getRandomMotivation } from './data'

let reminderJobs: cron.ScheduledTask[] = []

export function startReminders(bot: Telegraf) {
  // Остановим старые задачи, если есть
  reminderJobs.forEach(job => job.stop())
  reminderJobs = []

  // 9:00 — SRS due items
  const srsJob = cron.schedule('0 9 * * *', async () => {
    await sendReminders(bot, 'srs', '🔔 Пора повторить! У тебя есть слова на повторение из SRS.')
  }, { timezone: 'Europe/Moscow' })

  // 10:00 — new daily quests
  const questJob = cron.schedule('0 10 * * *', async () => {
    await sendReminders(bot, 'dailyQuest', '📅 Новые ежедневные задания доступны! Забери свои XP.')
  }, { timezone: 'Europe/Moscow' })

  // 19:00 — streak reminder (if not studied today)
  const streakJob = cron.schedule('0 19 * * *', async () => {
    await sendStreakReminders(bot)
  }, { timezone: 'Europe/Moscow' })

  // 21:00 — homework deadline reminder (1 day before)
  const hwJob = cron.schedule('0 21 * * *', async () => {
    await sendHomeworkReminders(bot)
  }, { timezone: 'Europe/Moscow' })

  reminderJobs.push(srsJob, questJob, streakJob, hwJob)
  console.log('Reminder cron jobs started')
}

async function sendReminders(bot: Telegraf, type: string, message: string) {
  const db = getDb()
  if (!db) return

  try {
    const usersSnapshot = await db.collection('users').get()
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data()
      const settings = (userData.telegramSettings || {}) as Record<string, unknown>
      const chatId = settings.chatId as string | undefined
      const notifications = (settings.notifications || {}) as Record<string, boolean>

      if (!chatId) continue
      if (notifications[type] === false) continue

      await bot.telegram.sendMessage(chatId, `👋 Привет, ${userData.name || 'ученик'}!\n\n${message}`).catch(() => {})
    }
  } catch (error) {
    console.error('Reminder error:', error)
  }
}

async function sendStreakReminders(bot: Telegraf) {
  const db = getDb()
  if (!db) return

  const today = new Date().toISOString().split('T')[0]

  try {
    const usersSnapshot = await db.collection('users').get()
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data()
      const settings = (userData.telegramSettings || {}) as Record<string, unknown>
      const chatId = settings.chatId as string | undefined
      const notifications = (settings.notifications || {}) as Record<string, boolean>

      if (!chatId) continue
      if (notifications.streak === false) continue
      if (userData.lastActivityDate === today) continue

      const motivation = getRandomMotivation({
        lessons: userData.completedLessons?.length || 0,
        level: userData.level || 1,
        streak: userData.streak || 0,
      })

      const text = `🔥 Не забудь про занятия сегодня!\n\nТвой стрик: ${userData.streak || 0} дней.\n\n${motivation}\n\nЖми /task, чтобы быстро порешать!`
      await bot.telegram.sendMessage(chatId, text).catch(() => {})
    }
  } catch (error) {
    console.error('Streak reminder error:', error)
  }
}

async function sendHomeworkReminders(bot: Telegraf) {
  const db = getDb()
  if (!db) return

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  try {
    const usersSnapshot = await db.collection('users').get()
    for (const doc of usersSnapshot.docs) {
      const userData = doc.data()
      const settings = (userData.telegramSettings || {}) as Record<string, unknown>
      const chatId = settings.chatId as string | undefined
      const notifications = (settings.notifications || {}) as Record<string, boolean>

      if (!chatId) continue
      if (notifications.homework === false) continue

      const homework = (userData.homework || []) as Array<{ deadline: string; title: string; completed: boolean }>
      const dueTomorrow = homework.filter(h => h.deadline === tomorrowStr && !h.completed)

      if (dueTomorrow.length > 0) {
        const titles = dueTomorrow.map(h => `• ${h.title}`).join('\n')
        const text = `⏰ Завтра дедлайн!\n\n${titles}\n\nУспей сделать! 📝`
        await bot.telegram.sendMessage(chatId, text).catch(() => {})
      }
    }
  } catch (error) {
    console.error('Homework reminder error:', error)
  }
}

export function stopReminders() {
  reminderJobs.forEach(job => job.stop())
  reminderJobs = []
}
