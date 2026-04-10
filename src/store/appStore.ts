import { create } from 'zustand'
import { STORAGE_KEYS } from '@/constants'

export type Theme = 'light' | 'dark'
export type Locale = 'zh' | 'en'

interface AppState {
  theme: Theme
  locale: Locale
  sidebarCollapsed: boolean
  currentStation: string | null
}

interface AppActions {
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  setLocale: (locale: Locale) => void
  setSidebarCollapsed: (collapsed: boolean) => void
  toggleSidebar: () => void
  setCurrentStation: (stationId: string | null) => void
}

export const useAppStore = create<AppState & AppActions>()((set) => ({
  theme: (localStorage.getItem(STORAGE_KEYS.THEME) as Theme) || 'light',
  locale: (localStorage.getItem(STORAGE_KEYS.LOCALE) as Locale) || 'zh',
  sidebarCollapsed: false,
  currentStation: null,

  setTheme: (theme) => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme)
    set({ theme })
  },

  toggleTheme: () =>
    set((state) => {
      const next = state.theme === 'light' ? 'dark' : 'light'
      localStorage.setItem(STORAGE_KEYS.THEME, next)
      return { theme: next }
    }),

  setLocale: (locale) => {
    localStorage.setItem(STORAGE_KEYS.LOCALE, locale)
    set({ locale })
  },

  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setCurrentStation: (stationId) => set({ currentStation: stationId }),
}))
