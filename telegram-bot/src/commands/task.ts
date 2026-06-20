import { Markup, Telegraf } from 'telegraf'
import { getRandomQuestion, getQuestionsByTask } from '../data'
import { TASK_NAMES } from '../types'

// In-memory session storage (per chatId)
const sessions: Record<string, { questions: any[]; index: number; correct: number; total: number }> = {}

export function registerTaskCommand(bot: Telegraf) {
  bot.command('task', async (ctx) => {
    const chatId = ctx.chat.id
    const text = ctx.message.text
    const args = text.split(' ').slice(1)
    const taskArg = args[0]

    let taskNumber: string | undefined
    if (taskArg) {
      const num = parseInt(taskArg, 10)
      if (!isNaN(num) && num >= 1 && num <= 27) {
        taskNumber = `task${num}`
      }
    }

    let questions: ReturnType<typeof getQuestionsByTask>
    if (taskNumber) {
      questions = getQuestionsByTask(taskNumber, 5)
      if (questions.length === 0) {
        await ctx.reply(`❌ Пока нет вопросов для ${TASK_NAMES[taskNumber] || taskNumber}. Попробуй /task без номера.`)
        return
      }
    } else {
      // Random mini-task: 5 questions from random task
      const randomQuestion = getRandomQuestion()
      if (!randomQuestion) {
        await ctx.reply('❌ Пока нет доступных вопросов.')
        return
      }
      questions = getQuestionsByTask(randomQuestion.taskNumber, 5)
      if (questions.length === 0) questions = [randomQuestion]
    }

    sessions[chatId] = {
      questions,
      index: 0,
      correct: 0,
      total: 0,
    }

    await sendQuestion(ctx, chatId)
  })

  // Handle answer callbacks
  bot.action(/answer_(\d+)/, async (ctx) => {
    const chatId = ctx.chat!.id
    const match = ctx.match![1]
    const selectedIndex = parseInt(match, 10)
    const session = sessions[chatId]

    if (!session || session.index >= session.questions.length) {
      await ctx.answerCbQuery('Время вышло! Начни новое задание.')
      return
    }

    const question = session.questions[session.index]
    const isCorrect = selectedIndex === question.correctIndex

    session.total++
    if (isCorrect) session.correct++
    session.index++

    await ctx.answerCbQuery(isCorrect ? '✅ Правильно!' : '❌ Неправильно')

    const resultText = isCorrect
      ? `✅ Правильно!\n\n📖 ${question.explanation}`
      : `❌ Неправильно.\n\n✅ Правильный ответ: ${question.options[question.correctIndex]}\n\n📖 ${question.explanation}`

    const progressText = `\n\n📊 Правильно ${session.correct} из ${session.total}`

    await ctx.editMessageText(resultText + progressText, {
      reply_markup: {
        inline_keyboard: [[{ text: '▶️ Дальше', callback_data: 'next_question' }]],
      },
    })
  })

  bot.action('next_question', async (ctx) => {
    const chatId = ctx.chat!.id
    await ctx.answerCbQuery()
    await sendQuestion(ctx, chatId)
  })

  bot.action('change_topic', async (ctx) => {
    const chatId = ctx.chat!.id
    await ctx.answerCbQuery()
    delete sessions[chatId]
    await ctx.reply('Введи /task для нового случайного задания или /task <номер> для конкретной темы.')
  })
}

async function sendQuestion(ctx: any, chatId: number) {
  const session = sessions[chatId]
  if (!session || session.index >= session.questions.length) {
    const stats = session ? `\n\n🏁 Итого: ${session.correct} правильных из ${session.total}` : ''
    await ctx.reply(
      `Задание завершено!${stats}\n\nХочешь ещё?`,
      Markup.inlineKeyboard([
        [Markup.button.callback('🔄 Ещё задание', 'task')],
        [Markup.button.callback('🎲 Сменить тему', 'change_topic')],
      ])
    )
    return
  }

  const question = session.questions[session.index]
  const taskName = TASK_NAMES[question.taskNumber] || question.taskNumber

  const buttons = question.options.map((opt: string, idx: number) => [
    Markup.button.callback(`${String.fromCharCode(65 + idx)}) ${opt}`, `answer_${idx}`),
  ])

  await ctx.reply(
    `📝 ${taskName}\n\n${question.text}\n\n📊 Правильно ${session.correct} из ${session.total}`,
    Markup.inlineKeyboard(buttons)
  )
}
