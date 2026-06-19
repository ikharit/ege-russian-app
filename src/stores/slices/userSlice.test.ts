import { describe, it, expect, vi } from 'vitest'
import { getInitialStats, createUserActions } from './userSlice'

describe('getInitialStats', () => {
  it('returns default stats', () => {
    const stats = getInitialStats()
    expect(stats.xp).toBe(0)
    expect(stats.level).toBe(1)
    expect(stats.hearts).toBe(5)
    expect(stats.maxHearts).toBe(5)
    expect(stats.streak).toBe(0)
    expect(stats.name).toBe('ученик')
  })
})

describe('createUserActions', () => {
  const createMock = () => {
    const state: any = {
      userStats: getInitialStats(),
      currentLessonHeartsLost: 0,
      heartRestoreCount: 0,
    }
    const get = () => state
    const set = (fn: any) => {
      const patch = typeof fn === 'function' ? fn(state) : fn
      Object.assign(state, { ...state, ...patch })
    }
    return { state, get, set }
  }

  it('addXP increases XP and level', () => {
    const { state, get, set } = createMock()
    const actions = createUserActions(set, get)
    actions.addXP(150)
    expect(state.userStats.xp).toBe(150)
    expect(state.userStats.level).toBe(2)
  })

  it('loseHeart decreases hearts and tracks loss', () => {
    const { state, get, set } = createMock()
    const actions = createUserActions(set, get)
    const result = actions.loseHeart()
    expect(result).toBe(true)
    expect(state.userStats.hearts).toBe(4)
    expect(state.userStats.totalHeartsLost).toBe(1)
    expect(state.currentLessonHeartsLost).toBe(1)
  })

  it('loseHeart returns false when no hearts', () => {
    const { state, get, set } = createMock()
    state.userStats.hearts = 0
    const actions = createUserActions(set, get)
    expect(actions.loseHeart()).toBe(false)
  })

  it('restoreHearts restores to max', () => {
    const { state, get, set } = createMock()
    state.userStats.hearts = 2
    const actions = createUserActions(set, get)
    actions.restoreHearts()
    expect(state.userStats.hearts).toBe(5)
    expect(state.heartRestoreCount).toBe(1)
  })

  it('setUserName updates name', () => {
    const { state, get, set } = createMock()
    const actions = createUserActions(set, get)
    actions.setUserName('Иван')
    expect(state.userStats.name).toBe('Иван')
  })

  it('toggleInfiniteHearts toggles flag', () => {
    const { state, get, set } = createMock()
    const actions = createUserActions(set, get)
    actions.toggleInfiniteHearts()
    expect(state.userStats.infiniteHearts).toBe(true)
    actions.toggleInfiniteHearts()
    expect(state.userStats.infiniteHearts).toBe(false)
  })

  it('recordQuestionAnswered increments counter', () => {
    const { state, get, set } = createMock()
    const actions = createUserActions(set, get)
    actions.recordQuestionAnswered()
    expect(state.userStats.totalQuestionsAnswered).toBe(1)
  })

  it('updateStreak increments streak on consecutive days', () => {
    const { state, get, set } = createMock()
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    state.userStats.lastActivityDate = yesterday.toISOString().split('T')[0]
    state.userStats.streak = 3
    const actions = createUserActions(set, get)
    actions.updateStreak()
    expect(state.userStats.streak).toBe(4)
    expect(state.userStats.maxStreak).toBe(4)
  })

  it('updateStreak resets streak after gap without freeze', () => {
    const { state, get, set } = createMock()
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    state.userStats.lastActivityDate = threeDaysAgo.toISOString().split('T')[0]
    state.userStats.streak = 5
    state.userStats.streakFreezeUsed = 1
    const actions = createUserActions(set, get)
    actions.updateStreak()
    expect(state.userStats.streak).toBe(1)
    expect(state.userStats.streakFrozen).toBe(false)
  })
})
