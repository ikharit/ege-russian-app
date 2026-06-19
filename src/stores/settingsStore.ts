import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SettingsState {
  soundEnabled: boolean
  theme: 'light' | 'dark' | 'system'
  
  toggleSound: () => void
  setSoundEnabled: (enabled: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  getEffectiveTheme: () => 'light' | 'dark'
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      soundEnabled: true,
      theme: 'light',

      toggleSound: () => {
        set((s) => ({ soundEnabled: !s.soundEnabled }))
      },
      setSoundEnabled: (enabled: boolean) => {
        set({ soundEnabled: enabled })
      },
      setTheme: (theme: 'light' | 'dark' | 'system') => {
        set({ theme })
      },
      getEffectiveTheme: () => {
        const { theme } = get()
        if (theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        }
        return theme
      },
    }),
    {
      name: 'ege-settings-storage',
    }
  )
)
