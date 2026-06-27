import { LessonProgress, WrongAnswer, UserAtomProgress } from '../../types'
import { getCanonicalWordId, getRuleId, extractWordFromQuestion } from '../../data/questionMapping'

export function createLessonActions(set: any, get: any) {
  return {
    startLesson: (lessonId: string) => {
      set((state: any) => ({
        currentLessonId: lessonId,
        currentLessonStartTime: new Date().toISOString(),
        currentLessonHeartsLost: 0,
        lessonProgress: {
          ...state.lessonProgress,
          [lessonId]: {
            ...state.lessonProgress[lessonId],
            lessonId,
            status: 'started',
            score: state.lessonProgress[lessonId]?.score || 0,
            bestScore: state.lessonProgress[lessonId]?.bestScore || 0,
            attempts: (state.lessonProgress[lessonId]?.attempts || 0) + 1,
            xpEarned: state.lessonProgress[lessonId]?.xpEarned || 0,
            lastVisitedAt: new Date().toISOString(),
          }
        }
      }))
    },

    completeLesson: (lessonId: string, score: number, xpEarned: number) => {
      const state = get()
      const existing = state.lessonProgress[lessonId]
      const newBestScore = existing?.bestScore ? Math.max(existing.bestScore, score) : score
      const wasCompleted = existing?.status === 'completed'

      let extraMinutes = 0
      if (state.currentLessonStartTime) {
        const start = new Date(state.currentLessonStartTime)
        const durationMin = Math.round((Date.now() - start.getTime()) / (1000 * 60))
        extraMinutes = Math.max(0, durationMin)
      }

      set((s: any) => ({
        lessonProgress: {
          ...s.lessonProgress,
          [lessonId]: {
            lessonId,
            status: 'completed',
            score,
            bestScore: newBestScore,
            attempts: wasCompleted ? (existing?.attempts || 0) : (existing?.attempts || 0) + 1,
            xpEarned: wasCompleted ? (existing?.xpEarned || 0) : (existing?.xpEarned || 0) + xpEarned,
            completedAt: wasCompleted ? (existing?.completedAt || new Date().toISOString()) : new Date().toISOString()
          }
        },
        userStats: {
          ...s.userStats,
          totalLessonTimeMinutes: (s.userStats.totalLessonTimeMinutes || 0) + extraMinutes
        },
        currentLessonStartTime: null,
        currentLessonHeartsLost: 0
      }))

      if (!wasCompleted) {
        get().addXP(xpEarned)
        get().updateStreak()
      }
      const newAchievements = get().checkAchievements(lessonId)
      if (newAchievements.length > 0) {
        set((s: any) => ({
          achievements: [...new Set([...s.achievements, ...newAchievements])],
          lastUnlockedAchievement: newAchievements[0],
          userStats: {
            ...s.userStats,
            achievements: [...new Set([...s.userStats.achievements, ...newAchievements])]
          }
        }))
      }
    },

    getLessonProgress: (lessonId: string): LessonProgress => {
      return get().lessonProgress[lessonId] || {
        lessonId,
        status: 'locked',
        score: 0,
        bestScore: 0,
        attempts: 0,
        xpEarned: 0
      }
    },

    isLessonAvailable: (lessonId: string, prerequisites: string[]) => {
      const progress = get().lessonProgress
      if (prerequisites.length === 0) return true
      return prerequisites.every(prId => progress[prId]?.status === 'completed')
    },
  }
}

export function createAnalyticsActions(set: any, get: any) {
  return {
    recordAtomAttempt: (atomId: string, isCorrect: boolean) => {
      set((s: any) => {
        const existing = s.atomProgress[atomId]
        const total = (existing?.totalAttempts || 0) + 1
        const correct = (existing?.correctCount || 0) + (isCorrect ? 1 : 0)
        const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0
        let mastery: 'new' | 'learning' | 'review' | 'mastered' = 'new'
        if (total >= 10 && accuracy >= 90) mastery = 'mastered'
        else if (total >= 5 && accuracy >= 70) mastery = 'review'
        else if (total >= 1) mastery = 'learning'

        return {
          atomProgress: {
            ...s.atomProgress,
            [atomId]: {
              atomId,
              totalAttempts: total,
              correctCount: correct,
              accuracy,
              lastAttemptAt: new Date().toISOString(),
              masteryLevel: mastery,
            }
          }
        }
      })
    },

    getAtomProgress: (atomId: string): UserAtomProgress => {
      return get().atomProgress[atomId] || {
        atomId,
        totalAttempts: 0,
        correctCount: 0,
        accuracy: 0,
        lastAttemptAt: '',
        masteryLevel: 'new',
      }
    },

    getWeakAtoms: (threshold = 70) => {
      return Object.values(get().atomProgress)
        .filter((p: any) => p.accuracy > 0 && p.accuracy < threshold)
        .sort((a: any, b: any) => a.accuracy - b.accuracy)
        .map((p: any) => p.atomId)
    },

    getTaskStats: () => get().taskStats,

    getProblematicTasks: (limit = 5) => {
      const stats = get().taskStats
      return Object.entries(stats)
        .map(([taskNumber, data]: [string, any]) => ({
          taskNumber,
          accuracy: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0,
          total: data.total,
          wrong: data.wrong,
        }))
        .filter((t: any) => t.total > 0 && t.wrong > 0 && t.accuracy < 95)
        .sort((a: any, b: any) => a.accuracy - b.accuracy)
        .slice(0, limit)
    },

    getProblematicQuestions: (limit = 10) => {
      const wrong = get().wrongAnswers
      // Агрегируем по canonicalWordId, если он есть, иначе по questionId
      const map: Record<string, {
        canonicalWordId?: string
        word?: string
        questionId: string
        text: string
        taskNumber: string
        wrongCount: number
        attempts: number
      }> = {}
      for (const w of wrong) {
        const key = w.canonicalWordId || w.questionId
        if (!map[key]) {
          map[key] = {
            canonicalWordId: w.canonicalWordId,
            word: w.word,
            questionId: w.questionId,
            text: w.text,
            taskNumber: w.taskNumber ?? '—',
            wrongCount: 0,
            attempts: 0,
          }
        }
        map[key].wrongCount++
        map[key].attempts = Math.max(map[key].attempts, w.attempts)
      }
      return Object.values(map)
        .sort((a, b) => b.wrongCount - a.wrongCount)
        .slice(0, limit)
    },

    // === NEW: Unified Analytics by Word ===
    getProblematicWords: (limit = 10) => {
      const wrong = get().wrongAnswers
      const map: Record<string, {
        canonicalWordId: string
        word: string
        ruleId?: string
        taskNumber?: string
        wrongCount: number
        questionIds: Set<string>
        lastOccurred: string
      }> = {}
      for (const w of wrong) {
        const cid = w.canonicalWordId || w.word || w.questionId
        if (!map[cid]) {
          map[cid] = {
            canonicalWordId: w.canonicalWordId || cid,
            word: w.word || 'unknown',
            ruleId: w.ruleId,
            taskNumber: w.taskNumber,
            wrongCount: 0,
            questionIds: new Set(),
            lastOccurred: w.timestamp,
          }
        }
        map[cid].wrongCount++
        map[cid].questionIds.add(w.questionId)
        if (w.timestamp > map[cid].lastOccurred) map[cid].lastOccurred = w.timestamp
      }
      return Object.values(map)
        .sort((a, b) => b.wrongCount - a.wrongCount)
        .slice(0, limit)
        .map(m => ({
          ...m,
          questionIds: Array.from(m.questionIds),
        }))
    },

    // === NEW: Unified Analytics by Rule ===
    getProblematicRules: (limit = 10) => {
      const wrong = get().wrongAnswers
      const map: Record<string, {
        ruleId: string
        taskNumber?: string
        wrongCount: number
        words: Set<string>
        lastOccurred: string
      }> = {}
      for (const w of wrong) {
        const rid = w.ruleId || 'unknown'
        if (!map[rid]) {
          map[rid] = {
            ruleId: rid,
            taskNumber: w.taskNumber,
            wrongCount: 0,
            words: new Set(),
            lastOccurred: w.timestamp,
          }
        }
        map[rid].wrongCount++
        if (w.word) map[rid].words.add(w.word)
        if (w.timestamp > map[rid].lastOccurred) map[rid].lastOccurred = w.timestamp
      }
      return Object.values(map)
        .sort((a, b) => b.wrongCount - a.wrongCount)
        .slice(0, limit)
        .map(m => ({
          ...m,
          words: Array.from(m.words),
        }))
    },

    // === NEW: Get error history for a specific word ===
    getWordErrorHistory: (canonicalWordId: string) => {
      return get().wrongAnswers.filter(
        (w: WrongAnswer) => w.canonicalWordId === canonicalWordId || w.word === canonicalWordId
      )
    },

    // === NEW: Get error history for a specific rule ===
    getRuleErrorHistory: (ruleId: string) => {
      return get().wrongAnswers.filter((w: WrongAnswer) => w.ruleId === ruleId)
    },

    recordWrongAnswer: (question: any, userAnswer: string[], lessonId?: string) => {
      // Reset combo on wrong answer
      get().resetCombo?.()
      
      // Извлекаем canonicalWordId и ruleId из вопроса (синхронно)
      const canonicalWordId = question.canonicalWordId
        || getCanonicalWordId(question)
        || undefined
      const word = question.word
        || extractWordFromQuestion(question.text)
        || undefined
      const ruleId = question.ruleId
        || getRuleId(question.id)
        || undefined
      const errorType = question.errorType || question.atoms?.find((a: string) => a.startsWith('error_')) || undefined
      
      set((s: any) => {
        const existing = s.wrongAnswers.find((w: WrongAnswer) => w.questionId === question.id)
        if (existing) {
          return {
            wrongAnswers: s.wrongAnswers.map((w: WrongAnswer) =>
              w.questionId === question.id
                ? { ...w, userAnswer, timestamp: new Date().toISOString(), attempts: w.attempts + 1, reviewed: false }
                : w
            )
          }
        }
        const newWrong: WrongAnswer = {
          questionId: question.id,
          canonicalWordId,
          word,
          ruleId,
          errorType,
          text: question.text,
          options: question.options,
          correctAnswer: question.correctAnswer,
          userAnswer,
          explanation: question.explanation,
          taskNumber: question.atoms?.find((a: string) => a.startsWith('task'))?.replace('task', '') ?? undefined,
          lessonId,
          timestamp: new Date().toISOString(),
          reviewed: false,
          attempts: 1,
        }
        return { wrongAnswers: [...s.wrongAnswers, newWrong] }
      })
    },

    removeWrongAnswer: (questionId: string) => {
      set((s: any) => ({
        wrongAnswers: s.wrongAnswers.filter((w: WrongAnswer) => w.questionId !== questionId),
        userStats: {
          ...s.userStats,
          mistakesFixed: (s.userStats.mistakesFixed || 0) + 1
        }
      }))
    },

    markWrongAnswerReviewed: (questionId: string) => {
      set((s: any) => ({
        wrongAnswers: s.wrongAnswers.map((w: WrongAnswer) =>
          w.questionId === questionId ? { ...w, reviewed: true } : w
        )
      }))
    },

    incrementWrongAnswerAttempt: (questionId: string, userAnswer: string[]) => {
      set((s: any) => ({
        wrongAnswers: s.wrongAnswers.map((w: WrongAnswer) =>
          w.questionId === questionId
            ? { ...w, userAnswer, attempts: w.attempts + 1, timestamp: new Date().toISOString() }
            : w
        )
      }))
    },

    getWrongAnswers: () => get().wrongAnswers,

    getUnreviewedWrongAnswers: () => get().wrongAnswers.filter((w: WrongAnswer) => !w.reviewed),

    updateTaskStats: (taskNumber: string, isCorrect: boolean) => {
      set((s: any) => {
        const current = s.taskStats[taskNumber] || { total: 0, correct: 0, wrong: 0, lastAttemptAt: '' }
        return {
          taskStats: {
            ...s.taskStats,
            [taskNumber]: {
              total: current.total + 1,
              correct: current.correct + (isCorrect ? 1 : 0),
              wrong: current.wrong + (isCorrect ? 0 : 1),
              lastAttemptAt: new Date().toISOString(),
            }
          }
        }
      })
    },
  }
}
