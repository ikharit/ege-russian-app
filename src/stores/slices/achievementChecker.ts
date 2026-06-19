import { achievements as allAchievements, course } from '../../data/courseData'

export function createAchievementChecker(get: any) {
  return (lessonId?: string) => {
    const state = get()
    const unlocked: string[] = []
    const completedLessons = Object.values(state.lessonProgress).filter((l: any) => l.status === 'completed')
    const completedCount = completedLessons.length
    const xp = state.userStats.xp
    const streak = state.userStats.streak
    const level = state.userStats.level
    const currentAchs = state.achievements

    const addIfNew = (id: string) => {
      if (!currentAchs.includes(id) && !unlocked.includes(id)) unlocked.push(id)
    }

    if (completedCount >= 1) addIfNew('ach-first-lesson')
    if (completedCount >= 5) addIfNew('ach-lessons-5')
    if (completedCount >= 10) addIfNew('ach-lessons-10')
    if (completedCount >= 25) addIfNew('ach-lessons-25')
    if (completedCount >= 50) addIfNew('ach-lessons-50')

    if (streak >= 3) addIfNew('ach-streak-3')
    if (streak >= 7) addIfNew('ach-streak-7')
    if (streak >= 14) addIfNew('ach-streak-14')
    if (streak >= 30) addIfNew('ach-streak-30')

    if (xp >= 100) addIfNew('ach-xp-100')
    if (xp >= 500) addIfNew('ach-xp-500')
    if (xp >= 1000) addIfNew('ach-xp-1000')
    if (xp >= 5000) addIfNew('ach-xp-5000')

    if (level >= 5) addIfNew('ach-level-5')
    if (level >= 10) addIfNew('ach-level-10')
    if (level >= 20) addIfNew('ach-level-20')

    const perfectCount = completedLessons.filter((l: any) => l.score === 100).length
    if (perfectCount >= 1) addIfNew('ach-perfect')
    if (perfectCount >= 5) addIfNew('ach-perfect-5')
    if (perfectCount >= 10) addIfNew('ach-perfect-10')

    if (state.userStats.infiniteHearts) addIfNew('ach-infinite')

    const sectionIds = ['section-text-work', 'section-orthoepy-lex', 'section-grammar', 'section-orthography', 'section-punctuation']
    const sectionAchievements = ['ach-section-1', 'ach-section-2', 'ach-section-3']
    const allSectionsComplete = sectionIds.every((sid, idx) => {
      const section = course.sections.find((s: any) => s.id === sid)
      if (!section) return false
      const allCompleted = section.lessons.every((l: any) => state.lessonProgress[l.id]?.status === 'completed')
      if (allCompleted) addIfNew(sectionAchievements[idx])
      return allCompleted
    })
    if (allSectionsComplete) addIfNew('ach-all-sections')

    const atomValues = Object.values(state.atomProgress)
    if (atomValues.some((a: any) => a.totalAttempts > 0)) addIfNew('ach-atom-first')
    const masteredAtoms = atomValues.filter((a: any) => a.masteryLevel === 'mastered').length
    if (masteredAtoms >= 5) addIfNew('ach-atom-master')

    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()
    if (hour >= 22 || hour < 6) addIfNew('ach-night-owl')
    if (hour >= 5 && hour < 9) addIfNew('ach-early-bird')
    if (day === 0 || day === 6) addIfNew('ach-weekend')

    if (lessonId && state.currentLessonStartTime) {
      const start = new Date(state.currentLessonStartTime)
      const durationMin = (now.getTime() - start.getTime()) / (1000 * 60)
      if (durationMin < 2) addIfNew('ach-speedrun')
    }

    if (Object.values(state.lessonProgress).some((l: any) => (l.attempts || 0) >= 10)) {
      addIfNew('ach-persistent')
    }

    if (lessonId && state.currentLessonHeartsLost === 0 && state.userStats.hearts > 0) {
      addIfNew('ach-no-hearts-lost')
    }

    if (state.heartRestoreCount >= 3) addIfNew('ach-heart-restore')
    if (state.exportCount >= 1) addIfNew('ach-export')

    const totalQuestions = state.userStats.totalQuestionsAnswered || 0
    if (totalQuestions >= 50) addIfNew('ach-questions-50')
    if (totalQuestions >= 200) addIfNew('ach-questions-200')
    if (totalQuestions >= 500) addIfNew('ach-questions-500')

    const totalMinutes = state.userStats.totalLessonTimeMinutes || 0
    if (totalMinutes >= 60) addIfNew('ach-time-1h')
    if (totalMinutes >= 300) addIfNew('ach-time-5h')
    if (totalMinutes >= 600) addIfNew('ach-time-10h')

    if (state.achievements.length >= 10) addIfNew('ach-collection')
    if (state.achievements.length >= 20) addIfNew('ach-collector')

    if (Object.values(state.lessonProgress).some((l: any) => (l.attempts || 0) >= 5)) {
      addIfNew('ach-retry-5')
    }

    const mistakesFixed = state.userStats.mistakesFixed || 0
    if (mistakesFixed >= 1) addIfNew('ach-mistake-1')
    if (mistakesFixed >= 5) addIfNew('ach-mistake-5')
    if (mistakesFixed >= 10) addIfNew('ach-mistake-10')
    if (mistakesFixed >= 25) addIfNew('ach-mistake-25')
    if (state.wrongAnswers.length === 0 && mistakesFixed > 0) addIfNew('ach-mistake-all')

    return unlocked
  }
}
