# План: Backend / Auth / Firestore Sync

## Текущее состояние
- `src/lib/supabase.ts` — есть mockSupabase, `isSupabaseConfigured`, типы `Profile`, `UserProgress`, `LeaderboardEntry`
- `progressStore.ts` — есть `syncProgress`/`loadProgress`, но они синхронизируют только `userStats`, `lessonProgress`, `achievements` (не включают `theoryTestsCompleted`, `atomProgress`, `wrongAnswers`, `taskStats`, `dailyQuestProgress`)
- `setUserId` — есть, но нет UI для аутентификации
- Нет автосинхронизации при изменениях

## Что нужно сделать

### Stage 1: Улучшить syncProgress / loadProgress
- `syncProgress` должен сохранять ВСЕ данные из progressStore:
  - `userStats`, `lessonProgress`, `atomProgress`, `wrongAnswers`, `achievements`, `taskStats`, `dailyQuestProgress`, `theoryTestsCompleted`, `leaderboardRanks`, `teacherStudents`, `isTeacher`
- `loadProgress` должен загружать все эти данные и восстанавливать состояние
- Добавить `onConflict: 'user_id'` для upsert

### Stage 2: Auth UI (AuthModal.tsx)
- Компонент с входом через email/password
- Вход через Google OAuth (Supabase Auth)
- Регистрация нового пользователя
- Состояния: loading, error, success
- После входа — автозагрузка прогресса + автосинхронизация

### Stage 3: Интеграция в App.tsx
- Добавить AuthModal в маршрутизацию или в Dashboard
- Показывать кнопку "Войти" в профиле/хедере
- После входа — скрыть модалку, показать имя пользователя
- Добавить `useEffect` для автосинхронизации при изменении progressStore

### Stage 4: Автосинхронизация
- `useEffect` в App.tsx — подписывается на изменения progressStore
- Дебаунс 5 секунд после последнего изменения
- Синхронизировать только если пользователь авторизован
- Индикатор синхронизации (зелёная точка / "Сохранено")

## Файлы для изменения
1. `src/lib/supabase.ts` — расширить типы, добавить auth helpers
2. `src/stores/progressStore.ts` — расширить syncProgress/loadProgress
3. `src/components/AuthModal.tsx` — новый файл
4. `src/App.tsx` — интеграция AuthModal, автосинхронизация
5. `src/types/index.ts` — возможно расширить типы

## Примечания
- Supabase уже подключён через `VITE_SUPABASE_URL` и `VITE_SUPABASE_ANON_KEY`
- Если env vars не заданы — mockSupabase предотвращает ошибки
- Для Google OAuth нужно настроить Provider в Supabase Dashboard (не в коде)
