-- Migration 004: public_leaderboard view + teacher RLS policy
-- Fixes: Leaderboard, TeacherAnalytics, UsersPage were empty because
-- user_progress RLS policy (auth.uid() = user_id) blocked reading other users.
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

-- 2. Public leaderboard view: bypasses RLS for leaderboard/global analytics
-- Uses security definer (owner = postgres) to bypass RLS
CREATE OR REPLACE VIEW public_leaderboard AS
SELECT 
  user_id,
  user_stats,
  lesson_progress,
  task_stats,
  achievements,
  behavior_profile,
  exam_results,
  theory_tests_completed,
  answer_history,
  daily_quest_progress,
  atom_progress,
  wrong_answers,
  updated_at
FROM user_progress
ORDER BY updated_at DESC;

-- Grant access to the view for all users
GRANT SELECT ON public_leaderboard TO anon, authenticated;

-- 3. RPC function for leaderboard (alternative if view doesn't bypass RLS)
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

-- 4. RPC function for all user progress (teacher analytics / admin)
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

-- 5. RPC function for users page (basic info)
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
