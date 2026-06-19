import { describe, it, expect, vi } from 'vitest'
import { createAchievementChecker } from './achievementChecker'

const mockState = (overrides: any = {}) => ({
  userStats: {
    xp: 0,
    level: 1,
    streak: 0,
    maxStreak: 0,
    lastActivityDate: '',
    hearts: 5,
    maxHearts: 5,
    achievements: [],
    name: 'ученик',
    lastHeartRestore: '',
    infiniteHearts: false,
    totalLessonTimeMinutes: 0,
    totalQuestionsAnswered: 0,
    totalHeartsLost: 0,
    mistakesFixed: 0,
    ...overrides.userStats,
  },
  lessonProgress: {},
  atomProgress: {},
  wrongAnswers: [],
  achievements: overrides.achievements || [],
  heartRestoreCount: 0,
  exportCount: 0,
  currentLessonHeartsLost: 0,
  currentLessonStartTime: null,
  ...overrides,
})

function makeChecker(state: any) {
  const get = () => state
  return createAchievementChecker(get)
}

describe('achievementChecker', () => {
  it('unlocks first lesson achievement', () => {
    const state = mockState({
      lessonProgress: { 'lesson-1': { status: 'completed' } }
    })
    const checker = makeChecker(state)
    expect(checker()).toContain('ach-first-lesson')
  })

  it('unlocks 5 lessons achievement', () => {
    const lp: any = {}
    for (let i = 0; i < 5; i++) lp[`l${i}`] = { status: 'completed' }
    const state = mockState({ lessonProgress: lp })
    const checker = makeChecker(state)
    const result = checker()
    expect(result).toContain('ach-lessons-5')
    expect(result).toContain('ach-first-lesson')
  })

  it('unlocks XP achievements', () => {
    const state = mockState({ userStats: { xp: 500, level: 1, streak: 0, maxStreak: 0, lastActivityDate: '', hearts: 5, maxHearts: 5, achievements: [], name: 'ученик', lastHeartRestore: '', infiniteHearts: false, totalLessonTimeMinutes: 0, totalQuestionsAnswered: 0, totalHeartsLost: 0, mistakesFixed: 0 } })
    const checker = makeChecker(state)
    const result = checker()
    expect(result).toContain('ach-xp-100')
    expect(result).toContain('ach-xp-500')
    expect(result).not.toContain('ach-xp-1000')
  })

  it('unlocks streak achievements', () => {
    const state = mockState({ userStats: { streak: 7, xp: 0, level: 1, maxStreak: 0, lastActivityDate: '', hearts: 5, maxHearts: 5, achievements: [], name: 'ученик', lastHeartRestore: '', infiniteHearts: false, totalLessonTimeMinutes: 0, totalQuestionsAnswered: 0, totalHeartsLost: 0, mistakesFixed: 0 } })
    const checker = makeChecker(state)
    const result = checker()
    expect(result).toContain('ach-streak-3')
    expect(result).toContain('ach-streak-7')
    expect(result).not.toContain('ach-streak-14')
  })

  it('unlocks perfect lesson achievement', () => {
    const state = mockState({
      lessonProgress: { 'l1': { status: 'completed', score: 100 } }
    })
    const checker = makeChecker(state)
    expect(checker()).toContain('ach-perfect')
  })

  it('unlocks infinite hearts achievement', () => {
    const state = mockState({ userStats: { infiniteHearts: true, xp: 0, level: 1, streak: 0, maxStreak: 0, lastActivityDate: '', hearts: 5, maxHearts: 5, achievements: [], name: 'ученик', lastHeartRestore: '', totalLessonTimeMinutes: 0, totalQuestionsAnswered: 0, totalHeartsLost: 0, mistakesFixed: 0 } })
    const checker = makeChecker(state)
    expect(checker()).toContain('ach-infinite')
  })

  it('unlocks atom-first achievement', () => {
    const state = mockState({
      atomProgress: { 'a1': { totalAttempts: 1 } }
    })
    const checker = makeChecker(state)
    expect(checker()).toContain('ach-atom-first')
  })

  it('unlocks atom-master achievement', () => {
    const state = mockState({
      atomProgress: {
        'a1': { masteryLevel: 'mastered' },
        'a2': { masteryLevel: 'mastered' },
        'a3': { masteryLevel: 'mastered' },
        'a4': { masteryLevel: 'mastered' },
        'a5': { masteryLevel: 'mastered' },
      }
    })
    const checker = makeChecker(state)
    expect(checker()).toContain('ach-atom-master')
  })

  it('unlocks heart-restore achievement', () => {
    const state = mockState({ heartRestoreCount: 3 })
    const checker = makeChecker(state)
    expect(checker()).toContain('ach-heart-restore')
  })

  it('unlocks export achievement', () => {
    const state = mockState({ exportCount: 1 })
    const checker = makeChecker(state)
    expect(checker()).toContain('ach-export')
  })

  it('unlocks questions-50 achievement', () => {
    const state = mockState({ userStats: { totalQuestionsAnswered: 50, xp: 0, level: 1, streak: 0, maxStreak: 0, lastActivityDate: '', hearts: 5, maxHearts: 5, achievements: [], name: 'ученик', lastHeartRestore: '', infiniteHearts: false, totalLessonTimeMinutes: 0, totalHeartsLost: 0, mistakesFixed: 0 } })
    const checker = makeChecker(state)
    expect(checker()).toContain('ach-questions-50')
  })

  it('unlocks time-1h achievement', () => {
    const state = mockState({ userStats: { totalLessonTimeMinutes: 60, xp: 0, level: 1, streak: 0, maxStreak: 0, lastActivityDate: '', hearts: 5, maxHearts: 5, achievements: [], name: 'ученик', lastHeartRestore: '', infiniteHearts: false, totalQuestionsAnswered: 0, totalHeartsLost: 0, mistakesFixed: 0 } })
    const checker = makeChecker(state)
    expect(checker()).toContain('ach-time-1h')
  })

  it('unlocks mistake-1 achievement', () => {
    const state = mockState({ userStats: { mistakesFixed: 1, xp: 0, level: 1, streak: 0, maxStreak: 0, lastActivityDate: '', hearts: 5, maxHearts: 5, achievements: [], name: 'ученик', lastHeartRestore: '', infiniteHearts: false, totalLessonTimeMinutes: 0, totalQuestionsAnswered: 0, totalHeartsLost: 0 } })
    const checker = makeChecker(state)
    expect(checker()).toContain('ach-mistake-1')
  })

  it('does not duplicate already unlocked achievements', () => {
    const state = mockState({
      achievements: ['ach-first-lesson'],
      lessonProgress: { 'lesson-1': { status: 'completed' } }
    })
    const checker = makeChecker(state)
    expect(checker()).not.toContain('ach-first-lesson')
  })
})
