import { Telegraf } from 'telegraf'
import dotenv from 'dotenv'
import { initFirebase } from './firebase'
import { startReminders } from './reminders'
import { registerStartCommand } from './commands/start'
import { registerProgressCommand } from './commands/progress'
import { registerTaskCommand } from './commands/task'
import { registerWeakCommand } from './commands/weak'
import { registerScheduleCommand } from './commands/schedule'
import { registerMotivateCommand } from './commands/motivate'
import { registerSettingsCommand } from './commands/settings'
import { registerHelpCommand } from './commands/help'

// Load environment variables
dotenv.config()

const BOT_TOKEN = process.env.BOT_TOKEN

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN не найден! Создай файл .env и добавь BOT_TOKEN=your_token')
  process.exit(1)
}

// Initialize Firebase
initFirebase()

// Create bot
const bot = new Telegraf(BOT_TOKEN)

// Register all commands
registerStartCommand(bot)
registerProgressCommand(bot)
registerTaskCommand(bot)
registerWeakCommand(bot)
registerScheduleCommand(bot)
registerMotivateCommand(bot)
registerSettingsCommand(bot)
registerHelpCommand(bot)

// Error handling
bot.catch((err, ctx) => {
  console.error('Telegraf error:', err)
  ctx.reply('😅 Упс, что-то пошло не так. Попробуй ещё раз!').catch(() => {})
})

// Launch
bot.launch()
  .then(() => {
    console.log('🤖 Бот запущен!')
    console.log('📍 Бот слушает сообщения...')

    // Start cron reminders
    startReminders(bot)
  })
  .catch((err) => {
    console.error('Launch error:', err)
    process.exit(1)
  })

// Graceful shutdown
process.once('SIGINT', () => {
  bot.stop('SIGINT')
  console.log('👋 Бот остановлен (SIGINT)')
})
process.once('SIGTERM', () => {
  bot.stop('SIGTERM')
  console.log('👋 Бот остановлен (SIGTERM)')
})
