import { create } from 'zustand'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { TeacherStudentView } from '../types'

interface TeacherAnalyticsState {
  students: TeacherStudentView[]
  loading: boolean
  error: string | null

  // Actions
  fetchStudents: () => Promise<void>
  fetchAllUsers: () => Promise<void>
  fetchStudentErrors: (studentId: string) => Promise<any[]>
  addStudentLink: (studentId: string, className?: string) => Promise<void>
  removeStudentLink: (studentId: string) => Promise<void>
}

export const useTeacherAnalyticsStore = create<TeacherAnalyticsState>((set, get) => ({
  students: [],
  loading: false,
  error: null,

  fetchStudents: async () => {
    if (!isSupabaseConfigured) {
      set({ error: 'Supabase не настроен' })
      return
    }

    set({ loading: true, error: null })

    try {
      // 1. Получаем текущего пользователя
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        set({ students: [], loading: false })
        return
      }

      // 2. Получаем связи учитель-ученик для текущего учителя
      const { data: links, error: linksError } = await supabase
        .from('teacher_student_links')
        .select('student_id, class_name')
        .eq('teacher_id', user.id)

      if (linksError) throw linksError
      if (!links || links.length === 0) {
        set({ students: [], loading: false })
        return
      }

      const studentIds = links.map((l: any) => l.student_id)

      // 2. Получаем прогресс учеников (user_progress) + analytics
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('user_id, user_stats, wrong_answers, task_stats, behavior_profile, exam_results, theory_tests_completed, answer_history, daily_quest_progress, atom_progress')
        .in('user_id', studentIds)

      if (progressError) throw progressError

      // 3. Получаем агрегированные ошибки по словам (student_word_errors)
      const { data: wordErrors, error: wordErrorsError } = await supabase
        .from('student_word_errors')
        .select('*')
        .in('user_id', studentIds)

      if (wordErrorsError) throw wordErrorsError

      // 4. Получаем daily snapshots (user_analytics)
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('user_analytics')
        .select('user_id, daily_snapshots')
        .in('user_id', studentIds)

      if (analyticsError && import.meta.env.DEV) {
        console.warn('user_analytics fetch:', analyticsError)
      }

      // 4. Собираем TeacherStudentView
      const students: TeacherStudentView[] = studentIds.map((studentId: string) => {
        const progress = progressData?.find((p: any) => p.user_id === studentId)
        const stats = progress?.user_stats || {}
        const wrongAnswers = progress?.wrong_answers || []
        const studentWordErrors = (wordErrors || []).filter((e: any) => e.user_id === studentId)
        const analytics = analyticsData?.find((a: any) => a.user_id === studentId)

        // Агрегируем по словам
        const topWeakWords = studentWordErrors
          .sort((a: any, b: any) => b.wrong_count - a.wrong_count)
          .slice(0, 5)
          .map((e: any) => ({
            word: e.word || 'unknown',
            wrongCount: e.wrong_count,
            ruleId: e.rule_id,
          }))

        // Агрегируем по правилам
        const ruleMap: Record<string, { ruleId: string; wrongCount: number; words: Set<string> }> = {}
        for (const e of studentWordErrors) {
          if (!e.rule_id) continue
          if (!ruleMap[e.rule_id]) {
            ruleMap[e.rule_id] = { ruleId: e.rule_id, wrongCount: 0, words: new Set() }
          }
          ruleMap[e.rule_id].wrongCount += e.wrong_count
          if (e.word) ruleMap[e.rule_id].words.add(e.word)
        }
        const topWeakRules = Object.values(ruleMap)
          .sort((a, b) => b.wrongCount - a.wrongCount)
          .slice(0, 5)
          .map((r) => ({
            ruleId: r.ruleId,
            wrongCount: r.wrongCount,
            words: Array.from(r.words),
          }))

        // Общая точность
        const taskStats = progress?.task_stats || {}
        let total = 0, correct = 0
        for (const t of Object.values(taskStats)) {
          total += (t as any).total || 0
          correct += (t as any).correct || 0
        }
        const overallAccuracy = total > 0 ? Math.round((correct / total) * 100) : 0

        return {
          studentId,
          studentName: stats.name || 'Ученик',
          xp: stats.xp || 0,
          level: stats.level || 1,
          streak: stats.streak || 0,
          lastActive: stats.lastActivityDate || '—',
          topWeakWords,
          topWeakRules,
          overallAccuracy,
          totalQuestionsAnswered: stats.totalQuestionsAnswered || 0,
          totalLessonTimeMinutes: stats.totalLessonTimeMinutes || 0,
          maxCombo: stats.maxCombo || 0,
          hearts: stats.hearts || 0,
          maxHearts: stats.maxHearts || 5,
          examResults: progress?.exam_results || [],
          theoryTestsCompleted: progress?.theory_tests_completed || {},
          answerHistory: progress?.answer_history || [],
          dailyQuestProgress: progress?.daily_quest_progress || {},
          behaviorProfile: progress?.behavior_profile || undefined,
          dailySnapshots: analytics?.daily_snapshots || undefined,
          rawProgressData: {
            userStats: stats,
            lessonProgress: progress?.lesson_progress || {},
            taskStats: progress?.task_stats || {},
            achievements: progress?.achievements || [],
            behaviorProfile: progress?.behavior_profile || undefined,
            examResults: progress?.exam_results || [],
            theoryTestsCompleted: progress?.theory_tests_completed || {},
            answerHistory: progress?.answer_history || [],
            atomProgress: progress?.atom_progress || {},
            dailyQuestProgress: progress?.daily_quest_progress || {},
            wrongAnswers: progress?.wrong_answers || [],
          },
        }
      })

      set({ students, loading: false })
    } catch (err: any) {
      set({ error: err.message || 'Ошибка загрузки', loading: false })
    }
  },

  fetchAllUsers: async () => {
    if (!isSupabaseConfigured) {
      set({ error: 'Supabase не настроен' })
      return
    }

    set({ loading: true, error: null })

    // Timeout wrapper: if Supabase is slow, abort and show local data
    const TIMEOUT_MS = 4000
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('timeout')), TIMEOUT_MS)
    )

    try {
      // Parallel queries + timeout
      const [analyticsResult, progressResult] = await Promise.race([
        Promise.all([
          supabase.from('admin_user_analytics').select('user_id, behavior_profile, daily_snapshots').limit(500),
          supabase.from('user_progress').select('user_id, user_stats, task_stats, lesson_progress, achievements, behavior_profile, exam_results, theory_tests_completed, answer_history, daily_quest_progress, atom_progress, wrong_answers').limit(500),
        ]),
        timeout,
      ]) as any

      const { data: analyticsData, error: analyticsError } = analyticsResult
      const { data: progressData, error: progressError } = progressResult

      if (analyticsError && import.meta.env.DEV) {
        console.warn('admin_user_analytics fetch:', analyticsError)
      }
      if (progressError && import.meta.env.DEV) {
        console.warn('user_progress fetch:', progressError)
      }

      const allUserIds = new Set([
        ...(analyticsData || []).map((a: any) => a.user_id),
        ...(progressData || []).map((p: any) => p.user_id),
      ])

      if (allUserIds.size === 0) {
        set({ students: [], loading: false })
        return
      }

      const students: TeacherStudentView[] = Array.from(allUserIds).map((userId: string) => {
        const analytics = analyticsData?.find((a: any) => a.user_id === userId)
        const progress = progressData?.find((p: any) => p.user_id === userId)
        const stats = progress?.user_stats || {}

        const taskStats = progress?.task_stats || {}
        let total = 0, correct = 0
        for (const t of Object.values(taskStats)) {
          total += (t as any).total || 0
          correct += (t as any).correct || 0
        }
        const overallAccuracy = total > 0 ? Math.round((correct / total) * 100) : 0

        return {
          studentId: userId,
          studentName: stats.name || 'Пользователь',
          xp: stats.xp || 0,
          level: stats.level || 1,
          streak: stats.streak || 0,
          lastActive: stats.lastActivityDate || '—',
          topWeakWords: [],
          topWeakRules: [],
          overallAccuracy,
          totalQuestionsAnswered: stats.totalQuestionsAnswered || 0,
          totalLessonTimeMinutes: stats.totalLessonTimeMinutes || 0,
          maxCombo: stats.maxCombo || 0,
          hearts: stats.hearts || 0,
          maxHearts: stats.maxHearts || 5,
          examResults: progress?.exam_results || [],
          theoryTestsCompleted: progress?.theory_tests_completed || {},
          answerHistory: progress?.answer_history || [],
          dailyQuestProgress: progress?.daily_quest_progress || {},
          behaviorProfile: analytics?.behavior_profile || progress?.behavior_profile || undefined,
          dailySnapshots: analytics?.daily_snapshots || undefined,
          rawProgressData: {
            userStats: stats,
            lessonProgress: progress?.lesson_progress || {},
            taskStats: progress?.task_stats || {},
            achievements: progress?.achievements || [],
            behaviorProfile: analytics?.behavior_profile || progress?.behavior_profile || undefined,
            examResults: progress?.exam_results || [],
            theoryTestsCompleted: progress?.theory_tests_completed || {},
            answerHistory: progress?.answer_history || [],
            atomProgress: progress?.atom_progress || {},
            dailyQuestProgress: progress?.daily_quest_progress || {},
            wrongAnswers: progress?.wrong_answers || [],
          },
        }
      })

      set({ students, loading: false })
    } catch (err: any) {
      const msg = err.message || ''
      if (msg.includes('timeout')) {
        set({ error: 'Сервер долго отвечает. Проверьте, запущена ли SQL-миграция.', loading: false })
      } else {
        set({ error: msg || 'Ошибка загрузки', loading: false })
      }
    }
  },

  fetchStudentErrors: async (studentId: string) => {
    if (!isSupabaseConfigured) return []

    const { data, error } = await supabase
      .from('student_word_errors')
      .select('*')
      .eq('user_id', studentId)
      .order('wrong_count', { ascending: false })

    if (error) {
      console.error('fetchStudentErrors error:', error)
      return []
    }

    return data || []
  },

  addStudentLink: async (studentId: string, className?: string) => {
    if (!isSupabaseConfigured) return

    const { error } = await supabase
      .from('teacher_student_links')
      .insert({ student_id: studentId, class_name: className })

    if (error) throw error

    // Обновить список
    await get().fetchStudents()
  },

  removeStudentLink: async (studentId: string) => {
    if (!isSupabaseConfigured) return

    const { error } = await supabase
      .from('teacher_student_links')
      .delete()
      .eq('student_id', studentId)

    if (error) throw error

    // Обновить список
    set((s) => ({
      students: s.students.filter((st) => st.studentId !== studentId),
    }))
  },
}))
