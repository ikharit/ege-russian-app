# Supabase Analytics Migration

Run these SQL commands in your Supabase SQL Editor to enable real-time teacher analytics.

## 1. Add behavior_profile column to user_progress

```sql
ALTER TABLE user_progress
ADD COLUMN IF NOT EXISTS behavior_profile JSONB;
```

## 2. Create user_analytics table

```sql
CREATE TABLE IF NOT EXISTS user_analytics (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  behavior_profile JSONB,
  daily_snapshots JSONB DEFAULT '[]',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only read/write their own analytics
CREATE POLICY "Users can manage own analytics"
  ON user_analytics
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## 3. Create teacher_student_links table (if not exists)

```sql
CREATE TABLE IF NOT EXISTS teacher_student_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  class_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(teacher_id, student_id)
);

ALTER TABLE teacher_student_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teachers can manage their links"
  ON teacher_student_links
  FOR ALL
  USING (auth.uid() = teacher_id)
  WITH CHECK (auth.uid() = teacher_id);
```

## 4. Create student_word_errors table (if not exists)

```sql
CREATE TABLE IF NOT EXISTS student_word_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  rule_id TEXT,
  wrong_count INTEGER DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE student_word_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own word errors"
  ON student_word_errors
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

## 5. Update RLS on user_progress to allow teachers to read student data

```sql
-- Drop existing select policy if it exists
DROP POLICY IF EXISTS "Users can read own progress" ON user_progress;
DROP POLICY IF EXISTS "Users can update own progress" ON user_progress;

-- Allow users to read/update their own progress
CREATE POLICY "Users can read own progress"
  ON user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow teachers to read their students' progress via teacher_student_links
CREATE POLICY "Teachers can read student progress"
  ON user_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_student_links
      WHERE teacher_id = auth.uid()
      AND student_id = user_progress.user_id
    )
  );
```

## 6. Update RLS on user_analytics to allow teachers to read

```sql
DROP POLICY IF EXISTS "Users can manage own analytics" ON user_analytics;

CREATE POLICY "Users can read own analytics"
  ON user_analytics
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
  ON user_analytics
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Teachers can read student analytics"
  ON user_analytics
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM teacher_student_links
      WHERE teacher_id = auth.uid()
      AND student_id = user_analytics.user_id
    )
  );
```
