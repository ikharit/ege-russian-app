import { UserStats, LessonProgress, WrongAnswer, UserAtomProgress, AnswerHistory } from '../../types'
import { ExamResult } from '../../data/fipiVariants'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { useAnalyticsStore } from '../analyticsStore'

export interface SyncState {
  userId: string | null
  currentLessonId: string | null
  currentLessonStartTime: string | null
  currentLessonHeartsLost: number
  exportCount: number
}

export const initialSyncState: SyncState = {
  userId: null,
  currentLessonId: null,
  currentLessonStartTime: null,
  currentLessonHeartsLost: 0,
  exportCount: 0,
}

export function createSyncActions(
  set: any,
  get: any,
  userStatsRef: () => UserStats,
  lessonProgressRef: () => Record<string, LessonProgress>,
  atomProgressRef: () => Record<string, UserAtomProgress>,
  wrongAnswersRef: () => WrongAnswer[],
  achievementsRef: () => string[],
  taskStatsRef: () => Record<string, any>,
  dailyQuestProgressRef: () => Record<string, any>,
  theoryTestsCompletedRef: () => Record<string, any>,
  leaderboardRanksRef: () => string[],
  teacherStudentsRef: () => any[],
  isTeacherRef: () => boolean,
  examResultsRef: () => ExamResult[],
  answerHistoryRef: () => AnswerHistory[],
) {
  return {
    setUserId: (userId: string | null) => set({ userId }),

    syncProgress: async () => {
      const userId = get().userId
      if (!userId || !isSupabaseConfigured) return
      const bp = useAnalyticsStore.getState().getBehaviorProfile()
      await supabase.from('user_progress').upsert({
        user_id: userId,
        user_stats: userStatsRef(),
        lesson_progress: lessonProgressRef(),
        atom_progress: atomProgressRef(),
        wrong_answers: wrongAnswersRef(),
        achievements: achievementsRef(),
        task_stats: taskStatsRef(),
        daily_quest_progress: dailyQuestProgressRef(),
        theory_tests_completed: theoryTestsCompletedRef(),
        leaderboard_ranks: leaderboardRanksRef(),
        teacher_students: teacherStudentsRef(),
        is_teacher: isTeacherRef(),
        exam_results: examResultsRef(),
        answer_history: answerHistoryRef(),
        behavior_profile: {
          mostActiveCategory: bp.mostActiveCategory,
          leastActiveCategory: bp.leastActiveCategory,
          preferredLearningTime: bp.preferredLearningTime,
          sessionFrequency: bp.sessionFrequency,
          avgSessionDuration: bp.avgSessionDuration,
          totalClicks: bp.totalClicks,
          totalSessions: bp.totalSessions,
          topClickedElements: bp.topClickedElements,
          timeDistribution: bp.timeDistribution,
          clickDistribution: bp.clickDistribution,
          motivationSignals: bp.motivationSignals,
        },
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })
    },

    loadProgress: async () => {
      const userId = get().userId
      if (!userId || !isSupabaseConfigured) return
      const { data, error } = await supabase.from('user_progress').select('*').eq('user_id', userId).single()
      if (data && !error) {
        set({
          userStats: data.user_stats || get().userStats,
          lessonProgress: data.lesson_progress || get().lessonProgress,
          atomProgress: data.atom_progress || get().atomProgress,
          wrongAnswers: data.wrong_answers || get().wrongAnswers,
          achievements: data.achievements || get().achievements,
          taskStats: data.task_stats || get().taskStats,
          dailyQuestProgress: data.daily_quest_progress || get().dailyQuestProgress,
          theoryTestsCompleted: data.theory_tests_completed || get().theoryTestsCompleted,
          leaderboardRanks: data.leaderboard_ranks || get().leaderboardRanks,
          teacherStudents: data.teacher_students || get().teacherStudents,
          isTeacher: data.is_teacher || false,
          examResults: data.exam_results || get().examResults || [],
          answerHistory: data.answer_history || get().answerHistory || [],
        })
      }
    },

    incrementExportCount: () => {
      set((s: any) => ({ exportCount: s.exportCount + 1 }))
    },
  }
}
