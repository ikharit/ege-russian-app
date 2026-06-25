-- ============================================================================
-- Migration: Create user_analytics table + admin view for global analytics
-- ============================================================================
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Create user_analytics table
CREATE TABLE IF NOT EXISTS public.user_analytics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  behavior_profile JSONB,
  daily_snapshots JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- 3. Policy: users can only modify their own data
DROP POLICY IF EXISTS "Users can manage own analytics" ON public.user_analytics;
CREATE POLICY "Users can manage own analytics"
  ON public.user_analytics
  FOR ALL
  USING (auth.uid() = user_id);

-- 4. Add behavior_profile to user_progress if not exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'user_progress' 
      AND column_name = 'behavior_profile'
  ) THEN
    ALTER TABLE public.user_progress ADD COLUMN behavior_profile JSONB;
  END IF;
END $$;

-- 5. Create admin view for reading all analytics (bypasses RLS)
-- Note: view created with security definer bypasses RLS policies
CREATE OR REPLACE VIEW public.admin_user_analytics AS
  SELECT 
    user_id,
    behavior_profile,
    daily_snapshots,
    updated_at
  FROM public.user_analytics;

-- 6. Grant access to the view for anon and authenticated roles
GRANT SELECT ON public.admin_user_analytics TO anon;
GRANT SELECT ON public.admin_user_analytics TO authenticated;

-- 7. Also grant select on underlying table for the view to work
GRANT SELECT ON public.user_analytics TO anon;
GRANT SELECT ON public.user_analytics TO authenticated;

-- 8. Create RPC function for admin aggregation (alternative to view)
CREATE OR REPLACE FUNCTION public.get_all_user_analytics()
RETURNS TABLE (
  user_id UUID,
  behavior_profile JSONB,
  daily_snapshots JSONB,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    ua.user_id,
    ua.behavior_profile,
    ua.daily_snapshots,
    ua.updated_at
  FROM public.user_analytics ua;
$$;

-- 9. Grant execute on function
GRANT EXECUTE ON FUNCTION public.get_all_user_analytics() TO anon;
GRANT EXECUTE ON FUNCTION public.get_all_user_analytics() TO authenticated;
