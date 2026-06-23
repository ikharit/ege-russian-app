-- Migration 002: RLS Policies for Unified Tracking
-- ==================================================
-- Включает Row Level Security для новых таблиц
-- и создаёт политики для учеников и преподавателей.

-- 1. Включить RLS на новых таблицах
ALTER TABLE answer_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_student_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_word_errors ENABLE ROW LEVEL SECURITY;

-- 2. Политики для answer_logs
-- Ученик видит только свои ответы
CREATE POLICY "Users can read their own answer logs"
  ON answer_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own answer logs"
  ON answer_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Преподаватель может видеть ответы своих учеников
CREATE POLICY "Teachers can read their students' answer logs"
  ON answer_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_student_links
      WHERE teacher_student_links.teacher_id = auth.uid()
      AND teacher_student_links.student_id = answer_logs.user_id
    )
  );

-- 3. Политики для teacher_student_links
-- Преподаватель может управлять своими связями
CREATE POLICY "Teachers can manage their student links"
  ON teacher_student_links FOR ALL
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);

-- Ученик может видеть, кто его преподаватель
CREATE POLICY "Students can see their teachers"
  ON teacher_student_links FOR SELECT
  USING (auth.uid() = student_id);

-- 4. Политики для student_word_errors
-- Ученик видит только свои ошибки
CREATE POLICY "Users can read their own word errors"
  ON student_word_errors FOR SELECT
  USING (auth.uid() = user_id);

-- Преподаватель может видеть ошибки своих учеников
CREATE POLICY "Teachers can read their students' word errors"
  ON student_word_errors FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_student_links
      WHERE teacher_student_links.teacher_id = auth.uid()
      AND teacher_student_links.student_id = student_word_errors.user_id
    )
  );

-- 5. Обновить политики для user_progress (если ещё не созданы)
-- Проверяем, существуют ли политики, и создаём если нет
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can read their own progress'
  ) THEN
    CREATE POLICY "Users can read their own progress"
      ON user_progress FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can update their own progress'
  ) THEN
    CREATE POLICY "Users can update their own progress"
      ON user_progress FOR UPDATE
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Users can insert their own progress'
  ) THEN
    CREATE POLICY "Users can insert their own progress"
      ON user_progress FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;
END
$$;

-- 6. Преподаватель может читать прогресс учеников (через teacher_student_links)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Teachers can read their students progress'
  ) THEN
    CREATE POLICY "Teachers can read their students progress"
      ON user_progress FOR SELECT
      USING (
        EXISTS (
          SELECT 1 FROM teacher_student_links
          WHERE teacher_student_links.teacher_id = auth.uid()
          AND teacher_student_links.student_id = user_progress.user_id
        )
      );
  END IF;
END
$$;
