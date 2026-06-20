import { Markup, Telegraf } from 'telegraf'
import { getRandomGreeting } from '../data'
import { getDb } from '../firebase'

export function registerStartCommand(bot: Telegraf) {
  bot.command('start', async (ctx) => {
    const greeting = getRandomGreeting()
    const name = ctx.from?.first_name || 'ученик'

    await ctx.reply(
      `👋 ${greeting}\n\nРад тебя видеть, ${name}!\n\nВыбери действие:`,
      Markup.inlineKeyboard([
        [Markup.button.callback('📊 Мой прогресс', 'progress')],
        [Markup.button.callback('📝 Задание', 'task')],
        [Markup.button.callback('🔁 Повторение', 'weak')],
        [Markup.button.callback('⚙️ Настройки', 'settings')],
        [Markup.button.callback('❓ Помощь', 'help')],
      ])
    )

    // Save chatId for reminders
    const db = getDb()
    if (db && ctx.from) {
      const userId = String(ctx.from.id)
      try {
        await db.collection('users').doc(userId).set(
          {
            telegramSettings: {
              chatId: ctx.chat.id,
              username: ctx.from.username,
            },
          },
          { merge: true }
        )
      } catch {
        // ignore
      }
    }
  })

  // Handle inline button callbacks
  bot.action('progress', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.reply('/progress')
    await ctx.reply('Введи команду /progress, чтобы увидеть прогресс')
  })

  bot.action('task', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.reply('Введи /task для случайного задания или /task <номер> для конкретной темы (например, /task 5)')
  })

  bot.action('weak', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.reply('/weak')
  })

  bot.action('settings', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.reply('/settings')
  })

  bot.action('help', async (ctx) => {
    await ctx.answerCbQuery()
    await ctx.reply('/help')
  })
}
