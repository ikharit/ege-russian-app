import { Markup, Telegraf } from 'telegraf'

export function registerHelpCommand(bot: Telegraf) {
  bot.command('help', async (ctx) => {
    const text = `
❓ Справка по командам:

📊 /progress — твой прогресс (XP, уровень, стрик)
📝 /task — мини-задание (5 вопросов)
📝 /task [номер] — задание по теме (например, /task 5 — ударения)
🔴 /weak — слабые места и тренировка
📅 /schedule — расписание на сегодня
🌟 /motivate — мотивация
⚙️ /settings — настройки уведомлений
❓ /help — эта справка

💡 Советы:
• Используй inline-кнопки под сообщениями
• Решай хотя бы по одному заданию в день, чтобы поддерживать стрик
• Проверяй /weak, чтобы работать над ошибками

Удачи на ЕГЭ! 🎓
    `.trim()

    await ctx.reply(
      text,
      Markup.inlineKeyboard([
        [Markup.button.callback('📝 Начать задание', 'task')],
        [Markup.button.callback('📊 Мой прогресс', 'progress')],
      ])
    )
  })
}
