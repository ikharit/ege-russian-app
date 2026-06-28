-- Migration 004: RPC functions for leaderboard + teacher RLS policy
-- Fixes: Leaderboard, TeacherAnalytics, UsersPage were empty because
-- user_progress RLS policy (auth.uid() = user_id) blocked reading other users.
-- IMPORTANT: public_leaderboard VIEW does NOT bypass RLS in PostgreSQL.
-- The view is a stored query that still applies RLS on the underlying table.
-- The correct approach is SECURITY DEFINER functions (RPC) — they execute
-- with the privileges of the function owner (postgres), not the invoker.
-- ============================================================================

-- 1. Teacher policy: teachers can view their linked students' progress
CREATE POLICY IF NOT EXISTS "Teachers can view linked students' progress" ON user_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM teacher_student_links
      WHERE teacher_student_links.student_id = user_progress.user_id
      AND teacher_student_links.teacher_id = auth.uid()
    )
  );

-- 2. RPC function for leaderboard (SECURITY DEFINER — bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_id uuid,
  user_stats jsonb,
  lesson_progress jsonb,
  task_stats jsonb,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, user_stats, lesson_progress, task_stats, updated_at
  FROM user_progress
  ORDER BY updated_at DESC;
$$;

-- 3. RPC function for all user progress (teacher analytics / admin)
CREATE OR REPLACE FUNCTION public.get_all_user_progress()
RETURNS TABLE (
  user_id uuid,
  user_stats jsonb,
  lesson_progress jsonb,
  task_stats jsonb,
  achievements jsonb,
  behavior_profile jsonb,
  exam_results jsonb,
  theory_tests_completed jsonb,
  answer_history jsonb,
  daily_quest_progress jsonb,
  atom_progress jsonb,
  wrong_answers jsonb,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM user_progress ORDER BY updated_at DESC;
$$;

-- 4. RPC function for users page (basic info)
CREATE OR REPLACE FUNCTION public.get_all_users_basic()
RETURNS TABLE (
  user_id uuid,
  user_stats jsonb,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, user_stats, updated_at
  FROM user_progress
  ORDER BY updated_at DESC;
$$;

-- 5. Drop the non-working public_leaderboard view (if it exists)
-- Note: PostgreSQL views do NOT bypass RLS on underlying tables.
-- The view was a red herring; RPC functions are the correct solution.
DROP VIEW IF EXISTS public_leaderboard;
