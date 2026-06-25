import { describe, it, expect, vi } from 'vitest'

// Mock tts module before importing the component
vi.mock('../lib/tts', () => ({
  speak: vi.fn(),
  isTTSAvailable: vi.fn(() => false),
}))

import { Task16Trainer } from '../pages/Task16Trainer'

describe('Task16Trainer', () => {
  it('imports without errors', () => {
    expect(Task16Trainer).toBeDefined()
  })
})
