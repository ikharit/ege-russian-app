import { achievements as allAchievements, course } from '../../data/courseData'
import { useDuelStore } from '../duelStore'

export function createAchievementChecker(get: any) {
  return (lessonId?: string) => {
    const state = get()
    const unlocked: string[] = []
    const completedLessons = Object.entries(state.lessonProgress)
      .filter(([id, l]: any) => l.status === 'completed')
      .map(([id, l]: any) => ({ ...l, id }))
    const completedCount = completedLessons.length
    const xp = state.userStats.xp
    const streak = state.userStats.streak
    const level = state.userStats.level
    const currentAchs = state.achievements

    const addIfNew = (id: string) => {
      if (!currentAchs.includes(id) && !unlocked.includes(id)) unlocked.push(id)
    }

    // === УРОКИ ===
    if (completedCount >= 1) addIfNew('ach-first-lesson')
    if (completedCount >= 5) addIfNew('ach-lessons-5')
    if (completedCount >= 10) addIfNew('ach-lessons-10')
    if (completedCount >= 25) addIfNew('ach-lessons-25')
    if (completedCount >= 50) addIfNew('ach-lessons-50')

    // === ИДЕАЛЬНЫЕ УРОКИ (подряд) ===
    // Get all completed lessons sorted by completion date
    const sortedCompleted = completedLessons
      .filter((l: any) => l.completedAt)
      .sort((a: any, b: any) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime())
    
    // Single perfect lesson (any completed lesson with score 100)
    if (completedLessons.some((l: any) => l.score === 100)) addIfNew('ach-perfect')
    
    let currentPerfectStreak = 0
    let maxPerfectStreak = 0
    for (const lesson of sortedCompleted as any[]) {
      if (lesson.score === 100) {
        currentPerfectStreak++
        maxPerfectStreak = Math.max(maxPerfectStreak, currentPerfectStreak)
      } else {
        currentPerfectStreak = 0
      }
    }
    
    if (maxPerfectStreak >= 5) addIfNew('ach-perfect-5')
    if (maxPerfectStreak >= 10) addIfNew('ach-perfect-10')

    // === СТРИК ===
    if (streak >= 3) addIfNew('ach-streak-3')
    if (streak >= 7) addIfNew('ach-streak-7')
    if (streak >= 14) addIfNew('ach-streak-14')
    if (streak >= 30) addIfNew('ach-streak-30')

    // === XP ===
    if (xp >= 100) addIfNew('ach-xp-100')
    if (xp >= 500) addIfNew('ach-xp-500')
    if (xp >= 1000) addIfNew('ach-xp-1000')
    if (xp >= 5000) addIfNew('ach-xp-5000')

    // === УРОВНИ ===
    if (level >= 5) addIfNew('ach-level-5')
    if (level >= 10) addIfNew('ach-level-10')
    if (level >= 20) addIfNew('ach-level-20')

    // === РАЗДЕЛЫ ===
    const sectionCheck = [
      { id: 'section-text-work', achievement: 'ach-section-1', title: 'Работа с текстом' },
      { id: 'section-orthoepy-lex', achievement: 'ach-section-2', title: 'Орфоэпия и лексикология' },
      { id: 'section-grammar', achievement: 'ach-section-3', title: 'Грамматика' },
      { id: 'section-orthography', achievement: 'ach-section-4', title: 'Орфография' },
      { id: 'section-punctuation', achievement: 'ach-section-5', title: 'Пунктуация' },
    ]
    
    let allSectionsDone = true
    for (const sec of sectionCheck) {
      const section = course.sections.find((s: any) => s.id === sec.id)
      if (!section) {
        allSectionsDone = false
        continue
      }
      const allCompleted = section.lessons.every((l: any) => state.lessonProgress[l.id]?.status === 'completed')
      if (allCompleted) {
        addIfNew(sec.achievement)
      } else {
        allSectionsDone = false
      }
    }
    if (allSectionsDone) addIfNew('ach-all-sections')

    // === АТОМИЗАЦИЯ ===
    const atomValues = Object.values(state.atomProgress)
    if (atomValues.some((a: any) => a.totalAttempts > 0)) addIfNew('ach-atom-first')
    const masteredAtoms = atomValues.filter((a: any) => a.masteryLevel === 'mastered').length
    if (masteredAtoms >= 5) addIfNew('ach-atom-master')

    // === КОМБО (правильные ответы подряд) ===
    const combo = state.userStats.currentCombo || 0
    const maxCombo = state.userStats.maxCombo || 0
    if (combo >= 5 || maxCombo >= 5) addIfNew('ach-combo-5')
    if (combo >= 10 || maxCombo >= 10) addIfNew('ach-combo-10')

    // === СЕРДЕЧКИ ===
    if (state.userStats.infiniteHearts) addIfNew('ach-infinite')
    if (lessonId && state.currentLessonHeartsLost === 0 && state.userStats.hearts > 0) {
      addIfNew('ach-no-hearts-lost')
    }
    if (state.heartRestoreCount >= 3) addIfNew('ach-heart-restore')

    // === ВРЕМЯ СУТОК ===
    const now = new Date()
    const hour = now.getHours()
    const day = now.getDay()
    if (hour >= 22 || hour < 6) addIfNew('ach-night-owl')
    if (hour >= 5 && hour < 9) addIfNew('ach-early-bird')
    if (day === 0 || day === 6) addIfNew('ach-weekend')

    // === СКОРОСТЬ ===
    if (lessonId && state.currentLessonStartTime) {
      const start = new Date(state.currentLessonStartTime)
      const durationMin = (now.getTime() - start.getTime()) / (1000 * 60)
      if (durationMin < 2) addIfNew('ach-speedrun')
    }

    // === УПОРСТВО ===
    if (Object.values(state.lessonProgress).some((l: any) => (l.attempts || 0) >= 10)) {
      addIfNew('ach-persistent')
    }
    if (Object.values(state.lessonProgress).some((l: any) => (l.attempts || 0) >= 5)) {
      addIfNew('ach-retry-5')
    }

    // === ЭКСПОРТ ===
    if (state.exportCount >= 1) addIfNew('ach-export')

    // === ВОПРОСЫ ===
    const totalQuestions = state.userStats.totalQuestionsAnswered || 0
    if (totalQuestions >= 50) addIfNew('ach-questions-50')
    if (totalQuestions >= 200) addIfNew('ach-questions-200')
    if (totalQuestions >= 500) addIfNew('ach-questions-500')

    // === ВРЕМЯ ===
    const totalMinutes = state.userStats.totalLessonTimeMinutes || 0
    if (totalMinutes >= 60) addIfNew('ach-time-1h')
    if (totalMinutes >= 300) addIfNew('ach-time-5h')
    if (totalMinutes >= 600) addIfNew('ach-time-10h')

    // === КОЛЛЕКЦИЯ ДОСТИЖЕНИЙ ===
    const achievementCount = state.achievements.length + unlocked.length
    if (achievementCount >= 10) addIfNew('ach-collection')
    if (achievementCount >= 20) addIfNew('ach-collector')

    // === РАБОТА НАД ОШИБКАМИ ===
    const mistakesFixed = state.userStats.mistakesFixed || 0
    if (mistakesFixed >= 1) addIfNew('ach-mistake-1')
    if (mistakesFixed >= 5) addIfNew('ach-mistake-5')
    if (mistakesFixed >= 10) addIfNew('ach-mistake-10')
    if (mistakesFixed >= 25) addIfNew('ach-mistake-25')
    if (state.wrongAnswers.length === 0 && mistakesFixed > 0) addIfNew('ach-mistake-all')

    // === ДОЩИНСКИЙ ===
    const dooshinCompleted = completedLessons.filter((l: any) => 
      l.id?.startsWith('lesson-dooshin') || l.id?.startsWith('qd')
    )
    const dooshinCount = dooshinCompleted.length
    
    if (dooshinCount >= 1) addIfNew('ach-dooshin-first')
    if (dooshinCount >= 5) addIfNew('ach-dooshin-5')
    if (dooshinCount >= 10) addIfNew('ach-dooshin-10')
    if (dooshinCount >= 20) addIfNew('ach-dooshin-20')
    // Note: dooshin-all target should match actual count
    const dooshinAllTarget = 40 // adjust if needed
    if (dooshinCount >= dooshinAllTarget) addIfNew('ach-dooshin-all')
    
    // Task-specific dooshin achievements
    const dooshin9Count = dooshinCompleted.filter((l: any) => l.id?.match(/^lesson-dooshin-9-|^qd9-/)).length
    const dooshin10Count = dooshinCompleted.filter((l: any) => l.id?.match(/^lesson-dooshin-10-|^qd10-/)).length
    const dooshin11Count = dooshinCompleted.filter((l: any) => l.id?.match(/^lesson-dooshin-11-|^qd11-/)).length
    const dooshin12Count = dooshinCompleted.filter((l: any) => l.id?.match(/^lesson-dooshin-12-|^qd12-/)).length
    
    // Check if all lessons for each task are completed
    const dooshinSection = course.sections.find((s: any) => s.id === 'section-dooshin-all')
    if (dooshinSection) {
      const task9Group = dooshinSection.groups?.find((g: any) => g.id === 'group-task9')
      const task10Group = dooshinSection.groups?.find((g: any) => g.id === 'group-task10')
      const task11Group = dooshinSection.groups?.find((g: any) => g.id === 'group-task11')
      const task12Group = dooshinSection.groups?.find((g: any) => g.id === 'group-task12')
      
      if (task9Group && task9Group.lessons.every((l: any) => state.lessonProgress[l.id]?.status === 'completed')) {
        addIfNew('ach-dooshin-9')
      }
      if (task10Group && task10Group.lessons.every((l: any) => state.lessonProgress[l.id]?.status === 'completed')) {
        addIfNew('ach-dooshin-task-10')
      }
      if (task11Group && task11Group.lessons.every((l: any) => state.lessonProgress[l.id]?.status === 'completed')) {
        addIfNew('ach-dooshin-11')
      }
      if (task12Group && task12Group.lessons.every((l: any) => state.lessonProgress[l.id]?.status === 'completed')) {
        addIfNew('ach-dooshin-12')
      }
    }

    // === КВЕСТЫ ===
    const questProgress = state.dailyQuestProgress || {}
    const completedQuests = Object.values(questProgress).filter((q: any) => q.completed).length
    if (completedQuests >= 10) addIfNew('ach-quest-master')

    // === БЫСТРЫЙ УЧЕНИК (3 урока за день) ===
    if (lessonId) {
      const today = now.toISOString().split('T')[0]
      const lessonsToday = completedLessons.filter((l: any) => {
        if (!l.completedAt) return false
        return l.completedAt.startsWith(today)
      }).length
      if (lessonsToday >= 3) addIfNew('ach-fast-learner')
    }

    // === ДУЭЛИ ===
    const duels = useDuelStore.getState().duels
    const myDuelResults = Object.values(duels).flatMap(d =>
      d.players.filter(p => p.profileId === state.userId || p.profileId === 'guest')
    )
    const completedDuels = myDuelResults.filter(p => p.completedAt)
    if (completedDuels.length >= 1) addIfNew('ach-duel-first')
    
    const wins = completedDuels.filter(p => {
      const duel = Object.values(duels).find(d => d.players.some(pl => pl.profileId === p.profileId))
      if (!duel || duel.players.length < 2) return false
      const opponent = duel.players.find(op => op.profileId !== p.profileId)
      if (!opponent || !opponent.completedAt) return false
      return p.score > opponent.score
    })
    if (wins.length >= 1) addIfNew('ach-duel-win')
    if (wins.length >= 3) addIfNew('ach-duel-wins-3')
    
    const fastDuel = completedDuels.some(p => p.totalTimeMs < 2 * 60 * 1000)
    if (fastDuel) addIfNew('ach-duel-fast')
    
    const perfectDuel = completedDuels.some(p =>
      p.answers.length === 5 && p.answers.every(a => a.correct)
    )
    if (perfectDuel) addIfNew('ach-duel-perfect')

    return unlocked
  }
}
