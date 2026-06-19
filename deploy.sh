#!/bin/bash
# Автоматический деплой на Vercel
# Требует: git, node, npm

set -e

echo "🚀 Начинаю деплой ЕГЭ Русского..."

# 1. Проверка зависимостей
echo "📦 Проверка зависимостей..."
command -v git >/dev/null 2>&1 || { echo "❌ git не найден"; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ node не найден"; exit 1; }

# 2. GitHub remote
echo "🔗 Настройка GitHub..."
if ! git remote -v >/dev/null 2>&1; then
    echo "⚠️  Git remote не настроен. Создай репозиторий на GitHub и выполни:"
    echo "    git remote add origin https://github.com/USERNAME/ege-russian-app.git"
    echo "    git push -u origin master"
    exit 1
fi

# 3. Commit
echo "💾 Коммит изменений..."
git add -A
git commit -m "deploy: auto-deploy $(date +%Y-%m-%d-%H:%M)" || true

# 4. Push
echo "☁️  Push на GitHub..."
git push origin master

# 5. Vercel (если есть)
if command -v vercel >/dev/null 2>&1; then
    echo "🌐 Деплой на Vercel..."
    cd ege-russian-app/dist
    vercel --prod
else
    echo ""
    echo "✅ Код запушен на GitHub!"
    echo ""
    echo "Для деплоя на Vercel:"
    echo "  1. Зайди на https://vercel.com/new"
    echo "  2. Import Git Repository"
    echo "  3. Framework: Vite"
    echo "  4. Build Command: cd ege-russian-app && npm run build"
    echo "  5. Output Directory: ege-russian-app/dist"
    echo "  6. Добавь Environment Variables:"
    echo "       VITE_SUPABASE_URL=..."
    echo "       VITE_SUPABASE_ANON_KEY=..."
    echo ""
    echo "Или установи Vercel CLI: npm i -g vercel"
    echo "Затем: cd ege-russian-app/dist && vercel --prod"
fi

echo "🎉 Готово!"
