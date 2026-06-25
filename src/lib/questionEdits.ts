import { supabase, isSupabaseConfigured } from './supabase'
import { Question } from '../types'

export interface QuestionEdit {
  id: string
  question_id: string
  lesson_id: string
  changes: Partial<Question>
  edited_by?: string
  edited_at: string
  created_at: string
}

const EDITED_KEY = 'ege-question-edits'

/** Load edits from localStorage */
export function loadLocalEdits(): Record<string, QuestionEdit> {
  try {
    return JSON.parse(localStorage.getItem(EDITED_KEY) || '{}')
  } catch {
    return {}
  }
}

/** Save edits to localStorage */
export function saveLocalEdits(edits: Record<string, QuestionEdit>) {
  localStorage.setItem(EDITED_KEY, JSON.stringify(edits))
}

/** Apply edits to a question */
export function applyQuestionEdits(question: Question): Question {
  const edits = loadLocalEdits()
  const edit = edits[question.id]
  if (!edit) return question
  return { ...question, ...edit.changes }
}

/** Save a single edit to Supabase (if online) + localStorage */
export async function saveQuestionEdit(
  questionId: string,
  lessonId: string,
  changes: Partial<Question>
): Promise<{ success: boolean; error?: string }> {
  // Always save to localStorage first
  const edits = loadLocalEdits()
  edits[questionId] = {
    id: questionId,
    question_id: questionId,
    lesson_id: lessonId,
    changes,
    edited_at: new Date().toISOString(),
    created_at: edits[questionId]?.created_at || new Date().toISOString(),
  }
  saveLocalEdits(edits)

  // Sync to Supabase if configured and user is online
  if (!isSupabaseConfigured || !navigator.onLine) {
    return { success: true }
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('question_edits').upsert({
      question_id: questionId,
      lesson_id: lessonId,
      changes: changes as any,
      edited_by: user?.id || null,
      edited_at: new Date().toISOString(),
    }, { onConflict: 'question_id' })

    if (error) {
      console.warn('[questionEdits] Supabase sync failed:', error)
      return { success: true, error: error.message } // localStorage saved, so still success
    }
    return { success: true }
  } catch (err) {
    console.warn('[questionEdits] Supabase sync error:', err)
    return { success: true, error: String(err) }
  }
}

/** Delete an edit from Supabase + localStorage */
export async function deleteQuestionEdit(questionId: string): Promise<{ success: boolean }> {
  const edits = loadLocalEdits()
  delete edits[questionId]
  saveLocalEdits(edits)

  if (!isSupabaseConfigured || !navigator.onLine) {
    return { success: true }
  }

  try {
    await supabase.from('question_edits').delete().eq('question_id', questionId)
    return { success: true }
  } catch {
    return { success: true }
  }
}

/** Load all edits from Supabase and merge with localStorage */
export async function loadQuestionEditsFromSupabase(): Promise<Record<string, QuestionEdit>> {
  const localEdits = loadLocalEdits()

  if (!isSupabaseConfigured || !navigator.onLine) {
    return localEdits
  }

  try {
    const { data, error } = await supabase
      .from('question_edits')
      .select('*')
      .order('edited_at', { ascending: false })

    if (error || !data) {
      return localEdits
    }

    // Merge: Supabase edits take precedence (newer)
    const merged: Record<string, QuestionEdit> = { ...localEdits }
    for (const row of data) {
      const edit: QuestionEdit = {
        id: row.question_id,
        question_id: row.question_id,
        lesson_id: row.lesson_id,
        changes: row.changes as Partial<Question>,
        edited_by: row.edited_by,
        edited_at: row.edited_at,
        created_at: row.created_at,
      }
      // Supabase edit wins if it's newer or not in localStorage
      const localEdit = localEdits[row.question_id]
      if (!localEdit || new Date(edit.edited_at) >= new Date(localEdit.edited_at)) {
        merged[row.question_id] = edit
      }
    }
    saveLocalEdits(merged)
    return merged
  } catch {
    return localEdits
  }
}
