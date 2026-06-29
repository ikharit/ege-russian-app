Migration 005: Create get_leaderboard RPC for leaderboard
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/szehpyhpsyvkgeakuuec/sql/new
--
-- Fixes: Leaderboard shows only "Вы" because get_leaderboard() RPC does not exist.
-- This function reads all rows from user_progress (bypassing RLS via SECURITY DEFINER).

-- 1. Ensure user_progress table exists
CREATE TABLE IF NOT EXISTS public.user_progress (
  user_id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  user_stats jsonb DEFAULT '{}',
  lesson_progress jsonb DEFAULT '{}',
  task_stats jsonb DEFAULT '{}',
  atom_progress jsonb DEFAULT '{}',
  wrong_answers jsonb DEFAULT '[]',
  achievements jsonb DEFAULT '[]',
  daily_quest_progress jsonb DEFAULT '{}',
  theory_tests_completed jsonb DEFAULT '{}',
  leaderboard_ranks jsonb DEFAULT '[]',
  teacher_students jsonb DEFAULT '[]',
  is_teacher boolean DEFAULT false,
  exam_results jsonb DEFAULT '[]',
  answer_history jsonb DEFAULT '[]',
  behavior_profile jsonb DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on user_progress
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Users can only see/update their own row (DROP IF EXISTS first, then CREATE)
DROP POLICY IF EXISTS "Users can view own progress" ON user_progress;
CREATE POLICY "Users can view own progress" ON user_progress
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;
CREATE POLICY "Users can update own progress" ON user_progress
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 2. Create SECURITY DEFINER RPC function (bypasses RLS, reads all rows)
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

-- 3. Grant execute permissions
GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO anon, authenticated;

-- 4. Create helper RPC for teacher analytics (if not exists)
CREATE OR REPLACE FUNCTION public.get_all_user_progress()
RETURNS TABLE (
  user_id uuid,
  user_stats jsonb,
  lesson_progress jsonb,
  task_stats jsonb,
  atom_progress jsonb,
  wrong_answers jsonb,
  achievements jsonb,
  daily_quest_progress jsonb,
  theory_tests_completed jsonb,
  leaderboard_ranks jsonb,
  teacher_students jsonb,
  is_teacher boolean,
  exam_results jsonb,
  answer_history jsonb,
  behavior_profile jsonb,
  updated_at timestamptz
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id, user_stats, lesson_progress, task_stats, atom_progress, wrong_answers, achievements, daily_quest_progress, theory_tests_completed, leaderboard_ranks, teacher_students, is_teacher, exam_results, answer_history, behavior_profile, updated_at
  FROM user_progress
  ORDER BY updated_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_all_user_progress() TO anon, authenticated;

-- 5. Create helper RPC for users page
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

GRANT EXECUTE ON FUNCTION public.get_all_users_basic() TO anon, authenticated;

-- 6. Verify: check that user_progress has data
SELECT COUNT(*) as user_progress_count FROM user_progress;

-- 7. Verify: test the function
SELECT COUNT(*) as leaderboard_entries FROM get_leaderboard();
