# НАПОМИНАНИЕ АГЕНТУ — Обновляй агентские файлы!

> Этот файл — триггер для самопроверки. Каждый раз, когда ты (агент) открываешь проект, ПРОЧТИ ЭТО.

## ⚠️ Правило (обязательно)

После КАЖДОЙ сессии с изменениями кода:
1. **Обнови `AGENTS.md`** — добавь запись в changelog (что, почему, файлы)
2. **Обнови `AGENT_TASKS.md`** — статусы задач, новые задачи
3. **Обнови `memory/YYYY-MM-DD.md`** — создай, если не существует, запиши сессию
4. **Обнови `memory/AGENTS-HISTORY.md`** — полная история с контекстом
5. **Обнови `memory/agent-registry.md`** — если изменился статус модуля
6. **Git commit** — `git add -A && git commit -m "..."`
7. **Не создавай CHANGELOG.md** — используй агентские файлы

## 🔍 Проверка перед работой (каждый раз!)

```bash
cd ege-russian-app
git log --oneline -5          # последние изменения
git diff --name-only          # что изменилось с последнего коммита
```

Прочитай `AGENTS.md` → последние 20 строк (что меняли в прошлой сессии).
Прочитай `memory/AGENTS-HISTORY.md` → последние 2 записи.
Проверь `AGENT_TASKS.md` — актуальные задачи и статусы.

## 📝 Что фиксировать

- Feature/bug name
- File paths changed
- Ключевые решения (почему так, а не иначе)
- Breaking changes или deprecations
- Верификация (build проходит, тесты OK, validate:rag OK)

## ❌ Что будет, если не обновлять

- Следующий агент не знает, что уже исправлено
- Дублирование работы
- Regression (сломаем, что уже чинили)
- Hallucination (придумаем правила, которые уже верифицированы)
- Нарушение протокола — AGENTS.md: "Failure to update these files is a protocol violation"

---

*Последнее обновление этого файла: 2026-06-26*
*Актуальная сессия: Multiple features (Friend system, Teacher analytics, CI/CD fixes, PWA Update Toast, TS fixes, Dooshin review groups, ComingSoon sections)*
*Git: `b2501ca` — feat(analytics): extend teacher analytics with new metrics and charts*
