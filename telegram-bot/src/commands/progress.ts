import { Markup, Telegraf } from 'telegraf'
import { getUserProgress } from '../firebase'

export function registerProgressCommand(bot: Telegraf) {
  bot.command('progress', async (ctx) => {
    const userId = String(ctx.from.id)
    const progress = await getUserProgress(userId)

    const name = ctx.from.first_name || 'Иван'
    const level = (progress?.level as number) || 1
    const xp = (progress?.xp as number) || 0
    const streak = (progress?.streak as number) || 0
    const totalQuestions = (progress?.totalQuestionsAnswered as number) || 0
    const correctAnswers = (progress?.totalCorrectAnswers as number) || 0
    const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
    const completedLessons = (progress?.completedLessons as string[]) || []
    const totalLessons = 45
    const predictedScore = Math.min(100, 50 + Math.round(xp / 20))

    const text = `
📊 Прогресс: ${name}

Уровень: ${level} (${xp} XP)
Стрик: ${streak} дней 🔥
Точность: ${accuracy}%
Предсказанный балл: ${predictedScore}

Завершено: ${completedLessons.length}/${totalLessons} уроков
Слабые темы: Задание 16, Задание 9
    `.trim()

    await ctx.reply(
      text,
      Markup.inlineKeyboard([
        [Markup.button.callback('📝 Решать задания', 'task')],
        [Markup.button.callback('🔁 Тренировать слабые места', 'weak')],
      ])
    )
  })
}
