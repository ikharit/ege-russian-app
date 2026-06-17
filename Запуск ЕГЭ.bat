@echo off
chcp 65001 >nul
echo.
echo  ============================================
echo   ЕГЭ Русский — подготовка к экзамену
echo  ============================================
echo.

cd /d C:\Users\USER\Documents\kimi\workspace\ege-russian-app
if %errorlevel% neq 0 (
  echo [ОШИБКА] Не удалось найти папку проекта
  pause
  exit /b 1
)

echo [1/3] Проверка зависимостей...
if not exist "node_modules" (
  echo        node_modules не найден — запускаю npm install...
  call npm install
  if %errorlevel% neq 0 (
    echo [ОШИБКА] npm install не выполнен
    pause
    exit /b 1
  )
) else (
  echo        node_modules OK
)

echo.
echo [2/3] Сборка приложения...
call npm run build
if %errorlevel% neq 0 (
  echo [ОШИБКА] Сборка не удалась
  pause
  exit /b 1
)
echo        Сборка завершена

echo.
echo [3/3] Запуск приложения...
echo        Открой браузер и перейди по адресу: http://localhost:4173/
echo        Чтобы остановить — нажми Ctrl + C, потом Y и Enter
echo.

npm run preview

pause
