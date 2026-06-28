-- Migration 001: Unified Tracking Schema
-- ========================================
-- Добавляет поля для answer_history, exam_results в user_progress
-- Создаёт нормализованные таблицы для аналитики и связи учитель-ученик

-- 1. Добавить поля в существующую таблицу user_progress (если они ещё не добавлены)
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS exam_results JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS answer_history JSONB DEFAULT '[]';

-- 2. Таблица детальных ответов (answer_logs)
-- Нормализованная таблица для каждого ответа пользователя.
-- Позволяет делать SQL-агрегации без парсинга JSON.
CREATE TABLE IF NOT EXISTS answer_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  canonical_word_id TEXT,
  word TEXT,
  rule_id TEXT,
  task_number TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  user_answer TEXT[],
  error_type TEXT,
  time_spent_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- индексы для быстрой агрегации
  CONSTRAINT answer_logs_user_question UNIQUE (user_id, question_id, created_at)
);

-- Индексы для агрегации
CREATE INDEX IF NOT EXISTS idx_answer_logs_user_task ON answer_logs(user_id, task_number);
CREATE INDEX IF NOT EXISTS idx_answer_logs_user_word ON answer_logs(user_id, canonical_word_id);
CREATE INDEX IF NOT EXISTS idx_answer_logs_user_rule ON answer_logs(user_id, rule_id);
CREATE INDEX IF NOT EXISTS idx_answer_logs_user_created ON answer_logs(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answer_logs_question ON answer_logs(question_id);

-- 3. Таблица связи учитель-ученик
CREATE TABLE IF NOT EXISTS teacher_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  class_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (teacher_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_teacher_student_links_teacher ON teacher_student_links(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_student_links_student ON teacher_student_links(student_id);

-- 4. Таблица агрегированных ошибок по словам (materialized view alternative)
-- Позволяет быстро получить "топ ошибок ученика" без сканирования всех answer_logs
CREATE TABLE IF NOT EXISTS student_word_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  canonical_word_id TEXT NOT NULL,
  word TEXT,
  rule_id TEXT,
  task_number TEXT,
  wrong_count INTEGER DEFAULT 0,
  last_occurred TIMESTAMPTZ,
  UNIQUE (user_id, canonical_word_id)
);

CREATE INDEX IF NOT EXISTS idx_student_word_errors_user ON student_word_errors(user_id);
CREATE INDEX IF NOT EXISTS idx_student_word_errors_rule ON student_word_errors(user_id, rule_id);

-- 5. Триггер: при вставке в answer_logs с is_correct=false → обновить student_word_errors
CREATE OR REPLACE FUNCTION upsert_student_word_error()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_correct = false THEN
    INSERT INTO student_word_errors (user_id, canonical_word_id, word, rule_id, task_number, wrong_count, last_occurred)
    VALUES (NEW.user_id, NEW.canonical_word_id, NEW.word, NEW.rule_id, NEW.task_number, 1, NEW.created_at)
    ON CONFLICT (user_id, canonical_word_id)
    DO UPDATE SET
      wrong_count = student_word_errors.wrong_count + 1,
      last_occurred = NEW.created_at,
      word = COALESCE(NEW.word, student_word_errors.word),
      rule_id = COALESCE(NEW.rule_id, student_word_errors.rule_id),
      task_number = COALESCE(NEW.task_number, student_word_errors.task_number);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_answer_log_insert ON answer_logs;
CREATE TRIGGER trg_answer_log_insert
  AFTER INSERT ON answer_logs
  FOR EACH ROW
  EXECUTE FUNCTION upsert_student_word_error();

-- 6. Функция для преподавателя: получить ошибки учеников
CREATE OR REPLACE FUNCTION get_student_errors(teacher_uuid UUID)
RETURNS TABLE (
  student_id UUID,
  canonical_word_id TEXT,
  word TEXT,
  rule_id TEXT,
  task_number TEXT,
  wrong_count INTEGER,
  last_occurred TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT s.student_id, e.canonical_word_id, e.word, e.rule_id, e.task_number, e.wrong_count, e.last_occurred
  FROM student_word_errors e
  JOIN teacher_student_links s ON e.user_id = s.student_id
  WHERE s.teacher_id = teacher_uuid
  ORDER BY e.last_occurred DESC;
END;
$$ LANGUAGE plpgsql;
