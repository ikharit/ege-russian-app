import { supabase, isSupabaseConfigured } from './supabase'
import { Question } from '../types'

export const CURRENT_AGENT = 'Агент 7'

export interface QuestionEdit {
  id: string
  question_id: string
  lesson_id: string
  changes: Partial<Question>
  edited_by?: string
  agent?: string
  edited_at: string
  created_at: string
  synced?: boolean
}

const EDITED_KEY = 'ege-question-edits'
const SYNC_QUEUE_KEY = 'ege-question-edits-sync-queue'

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
export function applyQuestionEdits(question: Question | undefined): Question | undefined {
  if (!question || !question.id) {
    console.warn('applyQuestionEdits: invalid question', question)
    return question
  }
  const edits = loadLocalEdits()
  const edit = edits[question.id]
  if (!edit) return question
  return { ...question, ...edit.changes }
}

// Background sync queue — tracks edits that need to be sent to Supabase
function getSyncQueue(): string[] {
  try {
    return JSON.parse(localStorage.getItem(SYNC_QUEUE_KEY) || '[]')
  } catch {
    return []
  }
}

function addToSyncQueue(questionId: string) {
  const queue = getSyncQueue()
  if (!queue.includes(questionId)) {
    queue.push(questionId)
    localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
  }
}

function removeFromSyncQueue(questionId: string) {
  const queue = getSyncQueue().filter(id => id !== questionId)
  localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue))
}

/** Background sync: try to send queued edits to Supabase */
async function backgroundSyncSingle(questionId: string) {
  if (!isSupabaseConfigured || !navigator.onLine) return

  const edits = loadLocalEdits()
  const edit = edits[questionId]
  if (!edit) {
    removeFromSyncQueue(questionId)
    return
  }

  try {
    const { data: { user } } = await supabase.auth.getUser()
    const { error } = await supabase.from('question_edits').upsert({
      question_id: questionId,
      lesson_id: edit.lesson_id,
      changes: edit.changes as any,
      edited_by: user?.id || null,
      agent: edit.agent,
      edited_at: edit.edited_at,
    }, { onConflict: 'question_id' })

    if (!error) {
      // Mark as synced
      edit.synced = true
      saveLocalEdits(edits)
      removeFromSyncQueue(questionId)
    } else {
      console.warn('[questionEdits] Background sync failed:', error)
    }
  } catch (err) {
    console.warn('[questionEdits] Background sync error:', err)
  }
}

/** Process all queued edits in background */
export async function processSyncQueue() {
  if (!isSupabaseConfigured || !navigator.onLine) return

  const queue = getSyncQueue()
  for (const questionId of queue) {
    await backgroundSyncSingle(questionId)
  }
}

/** Save a single edit — localStorage immediately, Supabase in background */
export function saveQuestionEdit(
  questionId: string,
  lessonId: string,
  changes: Partial<Question>
): { success: boolean } {
  // Save to localStorage immediately — instant return
  const edits = loadLocalEdits()
  edits[questionId] = {
    id: questionId,
    question_id: questionId,
    lesson_id: lessonId,
    changes,
    agent: CURRENT_AGENT,
    edited_at: new Date().toISOString(),
    created_at: edits[questionId]?.created_at || new Date().toISOString(),
    synced: false,
  }
  saveLocalEdits(edits)

  // Queue for background sync and fire it off
  addToSyncQueue(questionId)
  // Fire-and-forget: don't await, run in background
  setTimeout(() => backgroundSyncSingle(questionId), 0)

  return { success: true }
}

/** Delete an edit — localStorage immediately, Supabase in background */
export function deleteQuestionEdit(questionId: string): { success: boolean } {
  const edits = loadLocalEdits()
  delete edits[questionId]
  saveLocalEdits(edits)

  // Also remove from queue if pending
  removeFromSyncQueue(questionId)

  // Fire-and-forget delete from Supabase
  if (isSupabaseConfigured && navigator.onLine) {
    setTimeout(() => {
      supabase.from('question_edits').delete().eq('question_id', questionId).catch(() => {})
    }, 0)
  }

  return { success: true }
}

/** Check if a question is currently syncing (pending in queue) */
export function isPendingSync(questionId: string): boolean {
  return getSyncQueue().includes(questionId)
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
        agent: row.agent,
        edited_at: row.edited_at,
        created_at: row.created_at,
        synced: true,
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

/** Auto-retry sync queue periodically */
export function startBackgroundSync() {
  // Retry every 30 seconds
  const interval = setInterval(() => {
    if (navigator.onLine) {
      processSyncQueue().catch(() => {})
    }
  }, 30000)

  // Also retry on online event
  window.addEventListener('online', () => {
    processSyncQueue().catch(() => {})
  })

  return () => clearInterval(interval)
}

/** Subscribe to real-time question edits from Supabase */
export function subscribeToQuestionEdits(callback?: (edit: QuestionEdit) => void) {
  if (!isSupabaseConfigured) return () => {}

  const channel = supabase
    .channel('question_edits_changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'question_edits' },
      (payload) => {
        const row = payload.new as any
        if (!row) return

        const edit: QuestionEdit = {
          id: row.question_id,
          question_id: row.question_id,
          lesson_id: row.lesson_id,
          changes: row.changes as Partial<Question>,
          edited_by: row.edited_by,
          agent: row.agent,
          edited_at: row.edited_at,
          created_at: row.created_at,
          synced: true,
        }

        // Merge into localStorage (Supabase wins if newer)
        const edits = loadLocalEdits()
        const localEdit = edits[row.question_id]
        if (!localEdit || new Date(edit.edited_at) >= new Date(localEdit.edited_at)) {
          edits[row.question_id] = edit
          saveLocalEdits(edits)
          callback?.(edit)
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
