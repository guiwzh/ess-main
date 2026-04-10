import { useMemo } from 'react'
import { useUserStore } from '@/store/userStore'
import { useAppStore } from '@/store/appStore'

export interface SubAppPropsData {
  token: string | null
  userInfo: ReturnType<typeof useUserStore.getState>['userInfo']
  permissions: string[]
  theme: string
  locale: string
  currentStation: string | null
}

/** 获取传递给子应用的 props（非响应式，用于一次性读取） */
export function getSubAppProps(): SubAppPropsData {
  const userState = useUserStore.getState()
  const appState = useAppStore.getState()

  return {
    token: userState.token,
    userInfo: userState.userInfo,
    permissions: userState.permissions,
    theme: appState.theme,
    locale: appState.locale,
    currentStation: appState.currentStation,
  }
}

/** 响应式 hook：store 变更时自动返回最新 props，驱动 SubApp 重新传递 props 给子应用 */
export function useSubAppProps(): SubAppPropsData {
  const token = useUserStore((s) => s.token)
  const userInfo = useUserStore((s) => s.userInfo)
  const permissions = useUserStore((s) => s.permissions)
  const theme = useAppStore((s) => s.theme)
  const locale = useAppStore((s) => s.locale)
  const currentStation = useAppStore((s) => s.currentStation)

  return useMemo(
    () => ({ token, userInfo, permissions, theme, locale, currentStation }),
    [token, userInfo, permissions, theme, locale, currentStation],
  )
}
