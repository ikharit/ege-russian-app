-- Migration 003: GIN indexes for JSONB columns (performance optimization)
-- Run after 001_unified_tracking_v2.sql and 001_user_analytics.sql
-- ============================================================================

-- GIN index on user_stats (most frequently queried JSONB field)
CREATE INDEX IF NOT EXISTS idx_user_progress_stats ON user_progress USING GIN (user_stats);

-- GIN index on exam_results (used by teacher analytics)
CREATE INDEX IF NOT EXISTS idx_user_progress_exam ON user_progress USING GIN (exam_results);

-- GIN index on behavior_profile (used by predictive analytics)
CREATE INDEX IF NOT EXISTS idx_user_analytics_behavior ON user_analytics USING GIN (behavior_profile);

-- GIN index on daily_snapshots (used by trend analysis)
CREATE INDEX IF NOT EXISTS idx_user_analytics_snapshots ON user_analytics USING GIN (daily_snapshots);

-- Index on updated_at for incremental sync queries
CREATE INDEX IF NOT EXISTS idx_user_progress_updated ON user_progress(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_analytics_updated ON user_analytics(updated_at DESC);
