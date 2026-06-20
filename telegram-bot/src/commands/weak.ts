import { Markup, Telegraf } from 'telegraf'
import { getUserProgress } from '../firebase'
import { TASK_NAMES } from '../types'

export function registerWeakCommand(bot: Telegraf) {
  bot.command('weak', async (ctx) => {
    const userId = String(ctx.from.id)
    const progress = await getUserProgress(userId)
    const mistakes = (progress?.mistakes as any[]) || []

    // Default weak topics if no data
    const weakTopics = mistakes.length > 0
      ? mistakes.sort((a, b) => b.count - a.count).slice(0, 3)
      : [
          { taskNumber: 'task16', topic: 'Задание 16. Стилистика', count: 5 },
          { taskNumber: 'task9', topic: 'Задание 9. Слитное/раздельное/дефисное', count: 4 },
          { taskNumber: 'task5', topic: 'Задание 5. Ударения', count: 3 },
        ]

    let text = '🔴 Твои слабые места:\n\n'
    const buttons: any[] = []

    weakTopics.forEach((topic, idx) => {
      const taskName = TASK_NAMES[topic.taskNumber] || topic.topic
      text += `${idx + 1}. ${taskName}\n   Ошибок: ${topic.count}\n\n`
      buttons.push([Markup.button.callback(`💪 Тренировать ${taskName.split('.')[0]}`, `train_${topic.taskNumber}`)])
    })

    text += 'Нажми на кнопку, чтобы потренировать тему!'

    await ctx.reply(text, Markup.inlineKeyboard(buttons))
  })

  // Handle training callbacks
  bot.action(/train_(task\d+)/, async (ctx) => {
    const taskNumber = ctx.match![1]
    await ctx.answerCbQuery()
    await ctx.reply(`Введи /task ${taskNumber.replace('task', '')} для тренировки!`)
  })
}
