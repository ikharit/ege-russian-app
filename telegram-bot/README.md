# Telegram Бот для подготовки к ЕГЭ по русскому языку

Отдельный Node.js + TypeScript проект, работающий с теми же данными, что и React-приложение.

## 🚀 Быстрый старт

```bash
cd telegram-bot
npm install
npm run dev
```

## 🤖 Команды бота

| Команда | Описание |
|---------|----------|
| `/start` | Приветствие + главное меню |
| `/progress` | Прогресс (XP, уровень, стрик) |
| `/task [номер]` | Мини-задание (случайный вопрос) |
| `/weak` | Слабые места |
| `/schedule` | Расписание на сегодня |
| `/motivate` | Мотивация |
| `/settings` | Настройки уведомлений |
| `/help` | Справка по командам |

## ⚙️ Настройка

1. Создайте бота у [@BotFather](https://t.me/BotFather) → получите токен
2. Скопируйте `.env.example` в `.env` и заполните:
   ```env
   BOT_TOKEN=your_telegram_bot_token
   FIREBASE_PROJECT_ID=your-project-id
   ```
3. Для Firebase: создайте сервисный аккаунт и сохраните JSON-ключ как `firebase-service-account.json` (или используйте переменные окружения)

## 🔧 Скрипты

- `npm run dev` — разработка с ts-node
- `npm run build` — компиляция TypeScript
- `npm start` — запуск скомпилированного бота

## 📁 Структура

```
telegram-bot/
├── src/
│   ├── bot.ts              # Главный файл, инициализация
│   ├── commands/           # Обработчики команд
│   ├── data.ts             # Данные (вопросы, мотивация)
│   ├── reminders.ts        # Напоминания (cron)
│   ├── types.ts            # TypeScript-типы
│   └── firebase.ts         # Подключение к Firebase
├── .env.example
├── tsconfig.json
└── package.json
```

## 📄 Лицензия

MIT
