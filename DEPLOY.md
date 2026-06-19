# 🚀 Деплой: инструкция

## Что я уже настроил (автоматически)

### 1. GitHub Actions workflow
`.github/workflows/deploy.yml` — при каждом `git push` в ветку `master`:
- Устанавливает Node.js 20
- Ставит зависимости (`npm ci`)
- Собирает production build (`npm run build`)
- Деплоит на Vercel автоматически

### 2. Vercel config
`vercel.json` — настройки:
- SPA routing (все пути → `index.html`)
- Кэширование ассетов (1 год)
- Build Command и Output Directory

### 3. Deploy script
`deploy.sh` — локальный скрипт:
```bash
# Просто запусти:
./deploy.sh
```

## Что нужно сделать вручную (1 раз)

### Шаг 1: Создать репозиторий на GitHub
1. Зайди на [github.com/new](https://github.com/new)
2. Название: `ege-russian-app`
3. Создай репозиторий (public или private)

### Шаг 2: Запушить код
```bash
cd ege-russian-app
git remote add origin https://github.com/ТВОЙ_ЮЗЕРНЕЙМ/ege-russian-app.git
git push -u origin master
```

### Шаг 3: Подключить Vercel
1. Зайди на [vercel.com/new](https://vercel.com/new)
2. Import Git Repository → выбери `ege-russian-app`
3. Framework: **Vite**
4. Build Command: `cd ege-russian-app && npm run build`
5. Output Directory: `ege-russian-app/dist`
6. Environment Variables (обязательно!):
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
7. Нажми **Deploy**

### Шаг 4: Настроить GitHub Secrets (для авто-деплоя)
1. В репозитории GitHub → Settings → Secrets and variables → Actions
2. Добавь 5 secrets:
   - `VITE_SUPABASE_URL` — из Supabase Dashboard
   - `VITE_SUPABASE_ANON_KEY` — из Supabase Dashboard
   - `VERCEL_TOKEN` — из [vercel.com/settings/tokens](https://vercel.com/settings/tokens)
   - `VERCEL_ORG_ID` — из Project Settings → General → Org ID
   - `VERCEL_PROJECT_ID` — из Project Settings → General → Project ID

## Что будет происходить дальше

| Действие | Результат |
|----------|-----------|
| Ты пушишь код в `master` | GitHub Actions автоматически собирает и деплоит на Vercel (~1 минута) |
| Ученик проходит урок | Данные пишутся в Supabase (автоматически) |
| Ты меняешь вопросы тестов | Git push → автодеплой → новые вопросы на сайте через 1 минуту |
| Ты меняешь структуру базы | Ручное обновление в Supabase Dashboard (редко) |

## Где взять Supabase credentials

1. [supabase.com](https://supabase.com) → Dashboard → выбери проект
2. Settings → API → Project URL (`VITE_SUPABASE_URL`)
3. Settings → API → anon/public (`VITE_SUPABASE_ANON_KEY`)

## Проверка

После деплоя открой URL от Vercel (например, `https://ege-russian-app.vercel.app`):
- Должна загрузиться страница входа
- Auth (email/Google) должен работать
- Тесты по теории должны открываться
- Прохождение уроков → данные в Supabase
