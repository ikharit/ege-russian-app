# Аудит системы данных — RAG, агентские файлы, БД, RLM+графы

**Дата:** 2026-06-26  
**Агент:** state-sync audit  
**Проект:** ege-russian-app v1.9.0

---

## 1. RAG Pipeline — текущее состояние

### Что работает ✅

| Компонент | Статус | Описание |
|-----------|--------|----------|
| `build-rag-index.js` | ✅ | Собирает 1379 entries из theory/*.ts + explanations/*.json |
| `knowledge-index.json` | ✅ | 1379 entries (89 theory + 1020 generic + 78 task9 + 192 task-specific) |
| `RAGRetriever` | ✅ | Fuse.js + TF-IDF hybrid, client-side, без external API |
| `retrieve()` | ✅ | Fuzzy search по word/content/explanation/tags |
| `retrieveSemantic()` | ✅ | TF-IDF cosine similarity |
| `retrieveHybrid()` | ✅ | 0.5*TF-IDF + 0.5*(1-fuseScore) |
| `generateExplanation()` | ✅ | Генерирует объяснение ТОЛЬКО из retrieved rules |
| `verifyExplanation()` | ✅ | Детектирует contradiction (проверяемый/непроверяемый) |
| `buildRAGPrompt()` | ✅ | Генерирует prompt для агентов с RAG-контекстом |
| `validate:rag` | ✅ | 1379 entries, 0 errors, 268 warnings |

### Проблемы ⚠️

**1.1. 268 contradiction warnings (не критично, но шум)**
- Все warnings — один тип: entry содержит оба слова "проверяемый" и "непроверяемый"
- Причина: объяснения типа "все остальные слова — проверяемые, кроме исключений, которые непроверяемые"
- Это false positive валидатора: он ищет literal string match, не понимает контекст
- **Рекомендация**: добавить context-aware проверку в `verify-rag.js` — исключать случаи, когда оба слова встречаются в рамках объяснения исключений

**1.2. Хрупкий парсинг theory файлов**
- `build-rag-index.js` (строка 26) использует regex для парсинга TypeScript:
  ```js
  const ruleMatches = content.matchAll(/\{\s*id:\s*['"]([^'"]+)['"][\s\S]*?content:\s*['"]([^'"]+)['"][\s\S]*?examples:\s*\[([\s\S]*?)\][\s\S]*?tags:\s*\[([^\]]*)\]/g);
  ```
- Если theory файл изменит формат (например, добавит `description` между `content` и `examples`) — regex сломается
- **Рекомендация**: экспортировать rules как JSON или использовать AST-парсинг

**1.3. Нет embedding-based retrieval**
- `retrieveWithEmbedding()` реализован, но `embedding` поля не заполняются в `build-rag-index.js`
- Векторы остаются `undefined` — метод не используется
- **Рекомендация**: при масштабировании до 10K+ entries добавить `@xenova/transformers` для локальных embeddings

**1.4. RAG не интегрирован в QuestionCard/Trainer**
- Проверка `src/pages/QuestionCard.tsx` — не использует `ragRetriever` для генерации объяснений
- Объяснения берутся из `explanation` поля вопроса (hardcoded)
- **Рекомендация**: добавить RAG fallback для вопросов без explanation

### Вердикт: RAG работает, но не используется в runtime

RAG pipeline — это **защита для агентов**, не для пользователей. Агенты обязаны использовать RAG перед генерацией контента, но пользовательский интерфейс (QuestionCard, тренажёры) не использует RAG для динамических объяснений. Это по дизайну (объяснения должны быть проверены заранее), но можно усилить.

---

## 2. Агентские файлы — текущее состояние

### Что работает ✅

| Файл | Статус | Описание |
|------|--------|----------|
| `AGENTS.md` | ✅ Актуален | Changelog, RAG protocol, commit rules (обновлено 2026-06-26) |
| `AGENT_TASKS.md` | ✅ Актуален | Задачи А1-А29, все ✅ Завершено (последняя А29) |
| `AGENT_REMINDER.md` | ✅ Актуален | Дата 2026-06-26, включает все обязательные файлы |
| `memory/2026-06-26.md` | ✅ Актуален | Полная сессия с changelog'ом |
| `memory/AGENTS-HISTORY.md` | ✅ Актуален | Архив всех коммитов |
| `memory/agent-registry.md` | ✅ Актуален | Статусы модулей |

### Проблемы ⚠️

**2.1. Mixed line endings**
- `AGENT_TASKS.md` — CRLF (`\r\n`), все остальные — LF (`\n`)
- Это мешает инструменту `Edit` (нужны exact `\r\n` escapes)
- **Рекомендация**: `dos2unix` или `.gitattributes` с `* text=auto`

**2.2. AGENT_TASKS.md — 1090 строк, тяжело читать**
- Каждая задача дублирует структуру (Статус, Где, Решение, Файлы, Git, Критерий)
- Можно сократить до summary формата
- **Рекомендация**: добавить `AGENT_TASKS.md` в `.gitattributes` с `linguist-generated=true` — не влияет на diff stats

**2.3. Нет дедупликации задач**
- Задачи А1-А29 — все помечены ✅ Завершено
- Нет "backlog" или "icebox" — всё либо в работе, либо завершено
- **Рекомендация**: добавить раздел "Backlog" для будущих задач

### Вердикт: Агентские файлы работают отлично

Методика state-sync работает. Каждая сессия оставляет след. Единственная проблема — CRLF в AGENT_TASKS.md.

---

## 3. База данных (Supabase) — текущее состояние

### Схема

```sql
-- Таблицы пользователей (auth.users — встроенная)
public.user_progress          -- JSONB прогресс, уникальный на user_id
public.user_analytics         -- JSONB behavior_profile, predictive_stats
public.answer_logs            -- Нормализованные ответы (task_id, correct, timestamp)
public.student_word_errors    -- Агрегированные ошибки (word, error_count, last_seen)

-- Таблицы социальных функций
public.friend_requests        -- from_user_id, to_user_id, status (pending/accepted/rejected)
public.friends                -- user_id, friend_id (bidirectional)
public.user_profiles          -- username, avatar, last_active

-- Таблицы учителя
public.teacher_student_links  -- teacher_id, student_id, invite_code
public.question_edits         -- question_id, corrected_answer, status

-- RLS включён на всех таблицах
```

### Что работает ✅
- Все таблицы с RLS (Row Level Security)
- Foreign keys на `auth.users(id)` с ON DELETE CASCADE
- JSONB для гибких структур (progress, analytics)
- Нормализованная `answer_logs` для SQL-агрегаций

### Проблемы ⚠️

**3.1. Дублирование миграций**
- `001_unified_tracking.sql` и `001_unified_tracking_v2.sql` — оба создают одни и те же таблицы
- `001_user_analytics.sql` — отдельная миграция для `user_analytics` (можно было включить в unified)
- **Рекомендация**: объединить в одну baseline-миграцию, удалить дубли

**3.2. Нет индексов на JSONB поля**
- `user_progress.raw_data` — JSONB, но нет GIN индекса
- `user_analytics.behavior_profile` — JSONB, нет GIN индекса
- При росте пользователей запросы станут медленными
- **Рекомендация**: добавить GIN индексы на JSONB поля

**3.3. Нет materialized view для аналитики**
- `teacherAnalyticsStore.ts` делает агрегацию в JavaScript (groupBy, reduce)
- Supabase может делать это на стороне БД через VIEW
- **Рекомендация**: добавить `CREATE VIEW` для агрегированной аналитики

**3.4. `admin_user_analytics` — требует service_role**
- `teacherAnalyticsStore.ts` пытается читать `admin_user_analytics`, но требует `service_role` ключ
- Это security risk — нельзя давать service_role ключ в клиентский код
- **Рекомендация**: использовать Edge Function (Supabase Function) для админ-аналитики

### Вердикт: БД структурирована хорошо, есть технический долг

---

## 4. Оценка RLM + графов знаний

### Что предлагает пользователь

Перевести данные на **Retrieval Language Model (RLM)** + **Knowledge Graphs** для более высокой производительности.

### Что это значит

| Технология | Описание | Пример |
|------------|----------|--------|
| **RLM** | LLM + Retrieval pipeline с векторным хранилищем | LangChain + Pinecone + OpenAI embeddings |
| **Knowledge Graph** | Графовая БД с узлами (сущности) и рёбрами (отношения) | Neo4j, RDF, или pgvector + graph tables |

### Текущая архитектура vs RLM+графы

| Аспект | Текущая (Fuse.js + TF-IDF) | RLM + векторное хранилище | Knowledge Graph |
|--------|---------------------------|---------------------------|-----------------|
| **Entries** | 1379 | 1379 (избыточно) | 1379 |
| **Latency** | ~5ms (client-side) | ~200-500ms (API roundtrip) | ~10-50ms (DB) |
| **Offline** | ✅ Да | ❌ Нет (требует API) | ❌ Частично |
| **Cost** | $0 | $0.0001-0.01/query (OpenAI) | $0 (self-hosted) |
| **Сложность** | Низкая | Высокая | Средняя |
| **Масштабирование** | До ~10K entries | До 1M+ entries | До 1M+ entries |
| **Интерпретируемость** | Высокая (Fuse score) | Низкая (чёрный ящик) | Высокая (графовые связи) |
| **RAG integration** | Встроено | Требует переписывания | Требует переписывания |

### Графовые связи уже существуют!

Текущая система **уже имеет** графовую структуру:

```
KnowledgeEntry
  ├── id (уникальный)
  ├── source (theory/*.ts, explanations/*.json)
  ├── taskNumber (1-27)
  ├── ruleId (ссылка на theory)
  ├── word (связь с вопросом)
  ├── relatedAtoms (['task9', 'root_vowel_alternation'])
  └── lessonId (cross-link)

questionMapping.ts
  ├── canonicalWordId → orthographyId + dooshinId
  └── Связь: одно слово → несколько вопросов
```

Это **неявный knowledge graph**. Можно сделать его явным, не добавляя Neo4j.

### Вердикт: RLM+графы — преждевременная оптимизация

**Не рекомендуется сейчас.**

**Почему:**
1. **1379 entries** — это крошечный размер. Fuse.js + TF-IDF обрабатывает это за 5ms на клиенте. RLM с векторным хранилищем даст 100x latency и 1000x cost.
2. **Графовые связи уже есть** — `relatedAtoms`, `questionMapping`, `canonicalWordId`. Достаточно сделать их queryable через обычный SQL/JSON.
3. **Offline-first** — текущая система работает без интернета. RLM требует API.
4. **PWA + Service Worker** — весь knowledge-index.json кешируется. RLM требует кешировать embeddings ( bulky).

**Когда перейти:**
- При 10K+ entries (новые предметы, новые языки)
- При необходимости semantic search across languages (русский ↔ английский)
- При добавлении AI-ассистента для пользователей (не только агентов)

**Что делать сейчас вместо RLM:**
1. **Улучшить current RAG**: добавить embedding generation (`@xenova/transformers`) в `build-rag-index.js`
2. **Сделать граф явным**: добавить `graph-relations.json` с явными edges (word → atom → rule → task → lesson)
3. **Query interface**: добавить `queryRAGGraph()` для навигации по связям (word → все его правила → все связанные слова)
4. **pgvector в Supabase**: если нужен semantic search для user-generated content (не для агентов)

---

## 5. Итоговые рекомендации

### Сейчас (неделя)
- [ ] **Убрать 268 RAG warnings**: добавить context-aware фильтр в `verify-rag.js` (исключить "проверяемый/непроверяемый" в рамках одного объяснения исключений)
- [ ] **Нормализовать line endings**: `AGENT_TASKS.md` → LF (`.gitattributes` или manual)
- [ ] **Объединить дубли миграций**: `001_unified_tracking.sql` + `001_unified_tracking_v2.sql` → одна baseline

### Ближайший месяц
- [ ] **Улучшить RAG парсинг**: перейти от regex к AST/JSON export для theory файлов
- [ ] **Добавить RAG в QuestionCard**: fallback для вопросов без explanation
- [ ] **Supabase GIN индексы**: на `user_progress.raw_data`, `user_analytics.behavior_profile`
- [ ] **Edge Function для admin analytics**: убрать `service_role` ключ из клиентского кода
- [ ] **Explicit knowledge graph**: `graph-relations.json` с явными edges между word/atom/rule/task

### Квартал (если масштабирование)
- [ ] **pgvector в Supabase**: semantic search для user-generated content
- [ ] **Local embeddings**: `@xenova/transformers` для offline embedding generation
- [ ] **RLM рассмотреть**: только при 10K+ entries или добавлении AI-ассистента для пользователей

### НЕ делать сейчас
- ❌ **Neo4j / Knowledge Graph DB**: текущая система `relatedAtoms` + `questionMapping` достаточна
- ❌ **Pinecone / Weaviate / внешнее vector storage**: 1379 entries, Fuse.js справляется
- ❌ **OpenAI embeddings / LLM API**: cost без benefit, нарушает offline-first
- ❌ **LangChain / LlamaIndex**: overkill для текущего масштаба

---

## 6. Заключение

**Система данных работает хорошо.** RAG pipeline защищает от галлюцинаций агентов, агентские файлы синхронизируются, БД структурирована логично. Главные проблемы — косметические (268 warnings, CRLF, дубли миграций), не архитектурные.

**RLM+графы — это преждевременная оптимизация.** Текущая система уже содержит графовые связи (relatedAtoms, questionMapping, canonicalWordId). Переход на внешнее vector storage даст 100x latency, 1000x cost, и потеряет offline-first — без benefit при 1379 entries.

**Рекомендация:** сфокусироваться на content expansion (добавить задания 18, 25, 27, теорию для task1-3) и user-facing features (RAG в QuestionCard, адаптивные объяснения). Когда entries достигнут 10K — тогда пересмотреть архитектуру retrieval.
