import { Markup, Telegraf } from 'telegraf'
import { getUserProgress, updateUserProgress } from '../firebase'

export function registerSettingsCommand(bot: Telegraf) {
  bot.command('settings', async (ctx) => {
    const userId = String(ctx.from.id)
    const progress = await getUserProgress(userId)
    const settings = (progress?.telegramSettings as any) || {
      reminderTime: '19:00',
      notifications: { streak: true, homework: true, srs: true, dailyQuest: true },
    }

    const text = `
⚙️ Настройки:

🕐 Время напоминаний: ${settings.reminderTime || '19:00'}
📢 Уведомления:
  • Стрик: ${settings.notifications?.streak ? '✅' : '❌'}
  • Домашка: ${settings.notifications?.homework ? '✅' : '❌'}
  • SRS: ${settings.notifications?.srs ? '✅' : '❌'}
  • Ежедневные задания: ${settings.notifications?.dailyQuest ? '✅' : '❌'}

🔗 Связь с приложением: ${settings.linkedAppUserId ? '✅ Подключено' : '❌ Не подключено'}
    `.trim()

    await ctx.reply(
      text,
      Markup.inlineKeyboard([
        [Markup.button.callback('🕐 Изменить время', 'set_time')],
        [Markup.button.callback('🔔 Настроить уведомления', 'set_notifs')],
        [Markup.button.callback('🔗 Связать с приложением', 'link_app')],
      ])
    )
  })

  // Time selection
  bot.action('set_time', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.reply(
      'Выбери время напоминаний:',
      Markup.inlineKeyboard([
        [Markup.button.callback('9:00', 'time_09:00'), Markup.button.callback('12:00', 'time_12:00')],
        [Markup.button.callback('18:00', 'time_18:00'), Markup.button.callback('21:00', 'time_21:00')],
      ])
    )
  })

  const timeRegex = /time_(\d{2}:\d{2})/
  bot.action(timeRegex, async (ctx) => {
    const time = ctx.match![1]
    const userId = String(ctx.from!.id)
    await updateUserProgress(userId, { 'telegramSettings.reminderTime': time })
    await ctx.answerCbQuery(`✅ Установлено: ${time}`)
    await ctx.editMessageText(`✅ Время напоминаний изменено на ${time}`)
  })

  // Notifications toggle
  bot.action('set_notifs', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.reply(
      'Настрой уведомления:',
      Markup.inlineKeyboard([
        [Markup.button.callback('🔔 Стрик', 'toggle_streak')],
        [Markup.button.callback('🔔 Домашка', 'toggle_homework')],
        [Markup.button.callback('🔔 SRS', 'toggle_srs')],
        [Markup.button.callback('🔔 Ежедневные задания', 'toggle_dailyQuest')],
      ])
    )
  })

  const toggleRegex = /toggle_(\w+)/
  bot.action(toggleRegex, async (ctx) => {
    const type = ctx.match![1]
    const userId = String(ctx.from!.id)
    const progress = await getUserProgress(userId)
    const notifs = ((progress as any)?.telegramSettings?.notifications as any) || {}
    const newValue = !notifs[type]

    await updateUserProgress(userId, {
      [`telegramSettings.notifications.${type}`]: newValue,
    })

    await ctx.answerCbQuery(`${newValue ? '✅ Включено' : '❌ Выключено'}`)
    await ctx.editMessageText(`Уведомление «${type}» ${newValue ? 'включено ✅' : 'выключено ❌'}`)
  })

  // Link app
  bot.action('link_app', async (ctx) => {
    await ctx.answerCbQuery()
    const userId = ctx.from!.id
    await ctx.reply(
      `🔗 Чтобы связать с приложением:\n\n1. Открой приложение ЕГЭ Русский\n2. Перейди в Профиль → Настройки\n3. Введи код: <code>${userId}</code>\n\nПосле этого твой прогресс будет синхронизироваться!`,
      { parse_mode: 'HTML' }
    )
  })
}
