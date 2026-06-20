import { Markup, Telegraf } from 'telegraf'
import { getRandomMotivation } from '../data'
import { getUserProgress } from '../firebase'

export function registerMotivateCommand(bot: Telegraf) {
  bot.command('motivate', async (ctx) => {
    const userId = String(ctx.from.id)
    const progress = await getUserProgress(userId)

    const lessons = (progress?.completedLessons as string[])?.length || 12
    const level = (progress?.level as number) || 5
    const streak = (progress?.streak as number) || 5

    const motivation = getRandomMotivation({ lessons, level, streak })

    const text = `
🌟 Мотивация на сегодня:

${motivation}

📊 Твоя статистика:
• Уроков пройдено: ${lessons}
• Уровень: ${level}
• Стрик: ${streak} дней

Продолжай учиться! 🚀
    `.trim()

    await ctx.reply(
      text,
      Markup.inlineKeyboard([
        [Markup.button.callback('📝 Решать задание', 'task')],
        [Markup.button.callback('📊 Прогресс', 'progress')],
      ])
    )
  })
}
