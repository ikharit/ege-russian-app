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
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    }),
    signInWithPassword: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signInWithOAuth: () => Promise.resolve({ data: { url: null }, error: null }),
    signUp: () => Promise.resolve({ data: { user: null, session: null }, error: null }),
    signOut: noop,
    resetPasswordForEmail: noop,
    updateUser: noop,
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
  user_stats: Record<string, any>
  lesson_progress: Record<string, any>
  atom_progress: Record<string, any>
  wrong_answers: any[]
  achievements: string[]
  task_stats: Record<string, any>
  daily_quest_progress: Record<string, any>
  theory_tests_completed: Record<string, any>
  leaderboard_ranks: string[]
  teacher_students: any[]
  is_teacher: boolean
  exam_results: any[]
  answer_history: any[]
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

export type UserAnalytics = {
  user_id: string
  behavior_profile: Record<string, any> | null
  daily_snapshots: Record<string, any>[] | null
  updated_at: string
}

export async function syncUserAnalytics(userId: string, behaviorProfile: Record<string, any>, dailySnapshots: Record<string, any>[]) {
  if (!isSupabaseConfigured) return { error: null }
  const { error } = await supabase.from('user_analytics').upsert({
    user_id: userId,
    behavior_profile: behaviorProfile,
    daily_snapshots: dailySnapshots.slice(-90),
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' })
  return { error }
}

export async function loadUserAnalytics(userId: string) {
  if (!isSupabaseConfigured) return { data: null, error: null }
  const { data, error } = await supabase.from('user_analytics').select('*').eq('user_id', userId).single()
  return { data, error }
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) return null
  return data.user
}

export async function getCurrentSession() {
  if (!isSupabaseConfigured) return null
  const { data, error } = await supabase.auth.getSession()
  if (error || !data?.session) return null
  return data.session
}

export async function signInWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured) return { error: new Error('Supabase not configured') }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signUpWithEmail(email: string, password: string) {
  if (!isSupabaseConfigured) return { error: new Error('Supabase not configured') }
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

export async function signInWithGoogle() {
  if (!isSupabaseConfigured) return { error: new Error('Supabase not configured') }
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  })
  return { data, error }
}

export async function resetPasswordForEmail(email: string) {
  if (!isSupabaseConfigured) return { error: new Error('Supabase not configured') }
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/auth/reset-password'
  })
  return { data, error }
}

export async function signOut() {
  if (!isSupabaseConfigured) return { error: null }
  const { error } = await supabase.auth.signOut()
  return { error }
}
