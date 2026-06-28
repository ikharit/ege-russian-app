-- Add agent field to question_edits for tracking which AI agent made the edit
-- e.g. 'Агент 7', 'teacher', etc.

alter table public.question_edits
add column if not exists agent text;

-- Index for filtering by agent
CREATE INDEX IF NOT EXISTS idx_question_edits_agent ON public.question_edits(agent);

-- Comment on the column for documentation
comment on column public.question_edits.agent is 'Identifier of the AI agent or user who made this edit (e.g. Агент 7)';
