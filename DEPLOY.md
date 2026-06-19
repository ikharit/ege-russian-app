# 🚀 Детальная инструкция по деплою (шаг за шагом)

---

## Что уже сделано автоматически

В проекте уже есть:
- `.github/workflows/deploy.yml` — GitHub Actions (автодеплой при git push)
- `vercel.json` — настройки Vercel
- `deploy.sh` — скрипт для ручного деплоя
- Весь код приложения готов к production

**Тебе нужно сделать только 3 вещи вручную:**
1. Создать репозиторий на GitHub и запушить код
2. Создать проект на Vercel и подключить репозиторий
3. Добавить Environment Variables (Supabase credentials)

---

## Часть 1: GitHub (репозиторий для кода)

### Шаг 1.1: Зайди на GitHub

1. Открой браузер
2. Перейди по адресу: **https://github.com**
3. Войди в свой аккаунт (или зарегистрируйся, если нет)

### Шаг 1.2: Создай новый репозиторий

1. В правом верхнем углу нажми на **+** (плюс)
2. Выбери **"New repository"** из выпадающего меню
3. Заполни поля:
   - **Repository name:** `ege-russian-app`
   - **Description:** (можно оставить пустым или написать "ЕГЭ Русский язык — подготовка")
   - **Visibility:** выбери **Public** (бесплатно) или **Private** (тоже бесплатно для Vercel)
4. **НЕ ставь** галочки:
   - ❌ Add a README file
   - ❌ Add .gitignore
   - ❌ Choose a license
5. Нажми зелёную кнопку **"Create repository"**

### Шаг 1.3: Скопируй URL репозитория

После создания GitHub покажет страницу с инструкциями. Найди блок:

```
…or push an existing repository from the command line
```

Там будет две команды. Скопируй первую строку — она выглядит так:

```
git remote add origin https://github.com/ТВОЙ_НИКНЕЙМ/ege-russian-app.git
```

### Шаг 1.4: Подключи репозиторий локально

1. Открой **Git Bash** (или Terminal/PowerShell)
2. Перейди в папку проекта:
   ```bash
   cd C:/Users/USER/Documents/kimi/workspace/ege-russian-app
   ```
3. Выполни команду (вставь свою из шага 1.3):
   ```bash
   git remote add origin https://github.com/ТВОЙ_НИКНЕЙМ/ege-russian-app.git
   ```
4. Проверь, что подключилось:
   ```bash
   git remote -v
   ```
   Должно показать:
   ```
   origin  https://github.com/ТВОЙ_НИКНЕЙМ/ege-russian-app.git (fetch)
   origin  https://github.com/ТВОЙ_НИКНЕЙМ/ege-russian-app.git (push)
   ```

### Шаг 1.5: Запушь код на GitHub

Выполни в той же папке:

```bash
git add -A
git commit -m "initial: ready for deploy"
git branch -M master
git push -u origin master
```

Git запросит логин и пароль (или токен). Введи:
- **Username:** твой ник на GitHub
- **Password:** **Personal Access Token** (не пароль от GitHub!)

**Как получить Personal Access Token:**
1. Зайди на https://github.com/settings/tokens
2. Нажми **"Generate new token (classic)"**
3. В поле **Note** напиши: `deploy token`
4. В **Expiration** выбери **No expiration**
5. В **Scopes** поставь галочку **repo** (полный доступ к репозиториям)
6. Нажми **"Generate token"**
7. **Скопируй токен** (он показывается только один раз!)
8. Вставь этот токен как пароль при `git push`

После успешного пуша обнови страницу репозитория на GitHub — там появятся файлы проекта.

---

## Часть 2: Vercel (хостинг для приложения)

### Шаг 2.1: Зайди на Vercel

1. Открой браузер
2. Перейди по адресу: **https://vercel.com**
3. Нажми **"Sign Up"** (или "Continue with GitHub" — проще всего)
4. Если выбрал GitHub — подтверди доступ Vercel к твоим репозиториям

### Шаг 2.2: Создай новый проект

1. На dashboard Vercel нажми большую кнопку **"Add New..."**
2. Выбери **"Project"**
3. Появится список твоих репозиториев GitHub
4. Найди **ege-russian-app** и нажми **"Import"** справа от него

### Шаг 2.3: Настрой проект

На странице **"Configure Project"** заполни:

1. **Framework Preset:** выбери **Vite** из выпадающего списка
2. **Root Directory:** оставь пустым (или `./` если требует)
3. **Build Command:** замени на:
   ```
   cd ege-russian-app && npm run build
   ```
4. **Output Directory:** замени на:
   ```
   ege-russian-app/dist
   ```
5. **Install Command:** оставь `npm install` (или `npm ci`)

### Шаг 2.4: Добавь Environment Variables (ОБЯЗАТЕЛЬНО!)

Прокрути вниз до блока **"Environment Variables"**.

Нажми **"Add"** и добавь переменные одну за другой:

**Первая переменная:**
- **Name:** `VITE_SUPABASE_URL`
- **Value:** `https://твой-проект.supabase.co` (возьми из Supabase Dashboard)

**Вторая переменная:**
- **Name:** `VITE_SUPABASE_ANON_KEY`
- **Value:** `eyJhbG...` (длинный ключ, возьми из Supabase Dashboard)

**Как найти эти значения в Supabase:**
1. Зайди на https://supabase.com
2. Войди в аккаунт → выбери свой проект
3. В левом меню выбери **Settings** (⚙️) → **API**
4. Скопируй:
   - **Project URL** → вставь в `VITE_SUPABASE_URL`
   - **anon public** (ключ под `service_role key`) → вставь в `VITE_SUPABASE_ANON_KEY`

**Если Supabase ещё не создан:**
1. На https://supabase.com нажми **"New Project"**
2. Выбери организацию (обычно твой ник)
3. **Name:** `ege-russian-app`
4. **Database Password:** придумай сложный пароль (запиши!)
5. **Region:** выбери ближайший (например, Frankfurt для Европы)
6. Нажми **"Create new project"** — подождите 1-2 минуты
7. После создания зайди в Settings → API и возьми URL и ключ

### Шаг 2.5: Деплой

Прокрути вниз и нажми большую кнопку **"Deploy"**.

Vercel начнёт сборку:
1. **Building** — установка зависимостей, сборка проекта (~1-2 минуты)
2. **Deploying** — загрузка файлов на CDN (~10 секунд)

Когда увидишь зелёную галочку **"Congratulations!"** — проект задеплоен.

### Шаг 2.6: Скопируй URL

На странице поздравления будет ссылка вида:

```
https://ege-russian-app-abc123.vercel.app
```

**Скопируй её** — это постоянный адрес твоего приложения в интернете.

Можешь открыть в браузере и проверить, что всё работает.

---

## Часть 3: Настройка GitHub Actions (автодеплой)

### Шаг 3.1: Получи Vercel Token

1. Зайди на https://vercel.com/settings/tokens
2. Нажми **"Create Token"**
3. **Name:** `github-actions`
4. Нажми **"Create Token"**
5. **Скопируй токен** (показывается один раз)

### Шаг 3.2: Получи Vercel Org ID и Project ID

1. На dashboard Vercel открой свой проект `ege-russian-app`
2. Перейди в **Settings** → **General**
3. Прокрути вниз до **"Project ID"** — скопируй значение
4. Прокрути ещё ниже до **"Team ID / Personal Account ID"** — скопируй значение (это Org ID)

### Шаг 3.3: Добавь Secrets в GitHub

1. Открой свой репозиторий на GitHub: `https://github.com/ТВОЙ_НИКНЕЙМ/ege-russian-app`
2. Перейди во вкладку **Settings** (вверху)
3. В левом меню выбери **Secrets and variables** → **Actions**
4. Нажми **"New repository secret"**
5. Добавь 5 secrets по очереди:

| Name | Value (что вставить) |
|------|---------------------|
| `VITE_SUPABASE_URL` | URL из Supabase Dashboard |
| `VITE_SUPABASE_ANON_KEY` | anon key из Supabase Dashboard |
| `VERCEL_TOKEN` | Токен из шага 3.1 |
| `VERCEL_ORG_ID` | Team ID / Personal Account ID из шага 3.2 |
| `VERCEL_PROJECT_ID` | Project ID из шага 3.2 |

Для каждого:
1. Введи Name
2. Вставь Value
3. Нажми **"Add secret"**

---

## Часть 4: Проверка автодеплоя

### Шаг 4.1: Сделай тестовое изменение

1. Открой файл `ege-russian-app/src/pages/TheoryPage.tsx`
2. Найди строку с заголовком "Теория" и измени на что-то другое, например:
   ```tsx
   <h1 className="font-bold text-gray-800 text-lg">Теория ЕГЭ</h1>
   ```
   (просто добавь слово "ЕГЭ")
3. Сохрани файл

### Шаг 4.2: Закоммить и запушь

В Git Bash в папке `ege-russian-app`:

```bash
git add -A
git commit -m "test: auto-deploy check"
git push origin master
```

### Шаг 4.3: Проверь GitHub Actions

1. Открой репозиторий на GitHub
2. Перейди во вкладку **Actions**
3. Должна появиться новая запись с желтым кружком (в процессе) или зелёной галочкой (готово)
4. Подожди 1-2 минуты — должна появиться зелёная галочка ✅

### Шаг 4.4: Проверь сайт

1. Открой URL от Vercel (из шага 2.6)
2. Проверь, что изменение применилось (заголовок "Теория ЕГЭ")
3. Если всё работает — автодеплой настроен!

---

## Часть 5: Домен (опционально, но рекомендуется)

### Шаг 5.1: Подключи свой домен

Если у тебя есть свой домен (например, `ege-russian.ru`):

1. На dashboard Vercel открой проект
2. Перейди в **Settings** → **Domains**
3. Введи свой домен (например, `ege-russian.ru`)
4. Нажми **"Add"**
5. Vercel покажет DNS-записи (2 штуки: A и CNAME)
6. Зайди в панель управления доменом (Reg.ru, Beget, Cloudflare и т.д.)
7. Добавь эти DNS-записи
8. Подожди 5-30 минут — домен будет работать

### Шаг 5.2: Или используй бесплатный поддомен Vercel

Vercel уже дал тебе бесплатный URL вида `ege-russian-app-abc123.vercel.app`. Можешь использовать его как есть — он работает без ограничений.

---

## Часть 6: Что делать при обновлениях

После настройки CI/CD тебе нужно делать только это:

```bash
cd ege-russian-app
git add -A
git commit -m "feat: описание изменения"
git push origin master
```

И всё! GitHub Actions автоматически:
1. Соберёт новую версию
2. Задеплоит на Vercel
3. Обновит сайт через 1-2 минуты

---

## Часть 7: Типичные проблемы и решения

### Проблема: "git push" просит пароль, но не принимает
**Решение:** Используй Personal Access Token вместо пароля (см. шаг 1.5)

### Проблема: "Build failed" в Vercel
**Решение:** Проверь, что в Environment Variables добавлены `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`. Без них сборка падает.

### Проблема: "404 Not Found" при обновлении страницы
**Решение:** Убедись, что `vercel.json` содержит SPA rewrite (уже есть в проекте). Если нет — добавь:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Проблема: GitHub Actions не запускается
**Решение:** Проверь, что в Settings → Actions → General → "Workflow permissions" стоит "Read and write permissions"

### Проблема: Данные пользователей не сохраняются
**Решение:** Проверь, что Supabase URL и Anon Key правильные. В консоли браузера (F12 → Console) не должно быть ошибок подключения к Supabase.

---

## Часть 8: Где что находится (шпаргалка)

| Ресурс | URL | Зачем |
|--------|-----|-------|
| GitHub репозиторий | `https://github.com/ТВОЙ_НИК/ege-russian-app` | Код проекта |
| Vercel dashboard | `https://vercel.com/dashboard` | Настройки хостинга |
| Supabase dashboard | `https://supabase.com/dashboard` | База данных |
| Твой сайт | `https://ege-russian-app-xxx.vercel.app` | Готовое приложение |
| GitHub Actions | `https://github.com/ТВОЙ_НИК/ege-russian-app/actions` | Логи автодеплоя |

---

## Итог

После выполнения всех шагов у тебя будет:

✅ **Сайт в интернете** с постоянным URL  
✅ **Автодеплой** — каждый `git push` → обновление сайта через 1-2 минуты  
✅ **Auth** — вход по email/Google работает  
✅ **Синхронизация** — данные учеников сохраняются в облаке  
✅ **Тесты по теории** — с XP и статусами  

**Всё что нужно для обновления в будущем:**
```bash
git add -A && git commit -m "описание" && git push origin master
```
