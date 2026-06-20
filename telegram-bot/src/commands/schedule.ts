import { Markup, Telegraf } from 'telegraf'
import { getUserProgress } from '../firebase'

export function registerScheduleCommand(bot: Telegraf) {
  bot.command('schedule', async (ctx) => {
    const userId = String(ctx.from.id)
    const progress = await getUserProgress(userId)
    const completedLessons = (progress?.completedLessons as string[]) || []
    const streak = (progress?.streak as number) || 0
    const today = new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })

    const nextLessonNum = completedLessons.length + 1
    const reviewTopics = ['Паронимы (Задание 4)', 'Ударения (Задание 5)', 'Пунктуация (Задание 10)']
    const todayReview = reviewTopics[new Date().getDay() % reviewTopics.length]

    const text = `
📅 Расписание на ${today}:

1️⃣ Повторить: ${todayReview}
2️⃣ Новый урок: Урок ${nextLessonNum}
3️⃣ Мини-вариант ЕГЭ: 10 вопросов
4️⃣ SRS: повторение слов

🔥 Стрик: ${streak} дней
    `.trim()

    await ctx.reply(
      text,
      Markup.inlineKeyboard([
        [Markup.button.callback('✅ Выполнено!', 'mark_done')],
        [Markup.button.callback('📝 Начать задание', 'task')],
      ])
    )
  })

  bot.action('mark_done', async (ctx) => {
    await ctx.answerCbQuery('✅ Отлично!')
    await ctx.editMessageText('✅ Отлично! Сегодняшний план выполнен. Продолжай в том же духе! 🔥')
  })
}
