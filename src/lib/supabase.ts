import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

const noop = () => Promise.resolve({ data: null, error: null })

const mockSupabase: any = {
  from: () => ({
    select: () => ({
      eq: () => ({ single: noop })
    }),
    upsert: noop,
    insert: noop,
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null } }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    }),
    signInWithPassword: () => Promise.resolve({ error: null }),
    signUp: () => Promise.resolve({ data: { user: null }, error: null }),
    signOut: noop,
  }
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : mockSupabase

export type Profile = {
  id: string
  username: string
  avatar_url?: string
  created_at: string
}

export type UserProgress = {
  id: string
  user_id: string
  lesson_progress: Record<string, any>
  user_stats: {
    xp: number
    level: number
    hearts: number
    streak: number
    longestStreak: number
    totalQuestions: number
    correctAnswers: number
  }
  achievements: string[]
  updated_at: string
}

export type LeaderboardEntry = {
  id: string
  user_id: string
  username: string
  xp: number
  level: number
  streak: number
  updated_at: string
}
