# План реализации: Магазин наград + Сравнение с другими

## Файлы для создания

1. `src/stores/shopStore.ts` — Zustand store с 15+ товарами, 5 категорий, 4 редкости, purchase/equip
2. `src/pages/ShopPage.tsx` — страница магазина с сеткой, фильтрами, анимацией, confetti
3. `src/utils/comparisonEngine.ts` — движок перцентилей (speed, accuracy, efficiency, streak)
4. `src/components/ComparisonStats.tsx` — карточка сравнения для Dashboard
5. `src/pages/ComparisonPage.tsx` — полная страница сравнения

## Файлы для обновления

6. `src/App.tsx` — добавить маршруты `/shop` и `/comparison`
7. `src/pages/Dashboard.tsx` — добавить карточку "Магазин" и карточку "Сравнение"
8. `src/pages/Profile.tsx` — добавить секцию "Мои предметы" (инвентарь)
9. `src/pages/Leaderboard.tsx` — добавить колонку перцентиль
10. `src/pages/Statistics.tsx` — добавить сравнение или ссылку
11. `src/components/Header.tsx` — показывать экипированную аватарку
12. `src/types/index.ts` — добавить типы ShopItem, EquippedItems (если нужно)

## Проверка
- `npm run build` — без ошибок TypeScript
