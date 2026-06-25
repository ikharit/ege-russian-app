-- Table for storing question edits from teacher mode
-- All users can read edits; only authenticated users can create/update

create table if not exists public.question_edits (
  id uuid default gen_random_uuid() primary key,
  question_id text not null,
  lesson_id text not null,
  changes jsonb not null, -- stores Partial<Question> as JSON
  edited_by uuid references auth.users(id) on delete set null,
  edited_at timestamptz default now() not null,
  created_at timestamptz default now() not null,
  unique(question_id)
);

-- Index for fast lookup by question_id
CREATE INDEX IF NOT EXISTS idx_question_edits_question_id ON public.question_edits(question_id);

-- RLS policies
ALTER TABLE public.question_edits ENABLE ROW LEVEL SECURITY;

-- Everyone can read all edits (so all users see corrected questions)
CREATE POLICY "Allow everyone to read question edits"
  ON public.question_edits
  FOR SELECT
  USING (true);

-- Only authenticated users can insert (teachers)
CREATE POLICY "Allow authenticated users to insert question edits"
  ON public.question_edits
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Only the editor or admin can update their own edits
CREATE POLICY "Allow users to update their own question edits"
  ON public.question_edits
  FOR UPDATE
  USING (auth.uid() = edited_by)
  WITH CHECK (auth.uid() = edited_by);

-- Only the editor or admin can delete their own edits
CREATE POLICY "Allow users to delete their own question edits"
  ON public.question_edits
  FOR DELETE
  USING (auth.uid() = edited_by);
