import { API_BASE_URL } from '@/constants'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { useCallback, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export interface SubAppPropsData {
  token: string | null
  userInfo: ReturnType<typeof useUserStore.getState>['userInfo']
  permissions: string[]
  theme: string
  locale: string
  currentStation: string | null
  basePath: string
  apiBaseUrl: string
  navigate: (path: string, options?: { state?: Record<string, unknown> }) => void
}

/** 响应式 hook：store 变更时自动返回最新 props，驱动 SubApp 重新传递 props 给子应用 */
export function useSubAppProps(): SubAppPropsData {
  const token = useUserStore((s) => s.token)
  const userInfo = useUserStore((s) => s.userInfo)
  const permissions = useUserStore((s) => s.permissions)
  const theme = useAppStore((s) => s.theme)
  const locale = useAppStore((s) => s.locale)
  const currentStation = useAppStore((s) => s.currentStation)

  const location = useLocation()
  const nav = useNavigate()

  const basePath = useMemo(() => {
    const segments = location.pathname.split('/').filter(Boolean)
    return segments[0] ? '/' + segments[0] : '/'
  }, [location.pathname])

  const navigate = useCallback(
    (path: string, options?: { state?: Record<string, unknown> }) => nav(path, options),
    [nav],
  )

  const apiBaseUrl = window.location.origin + API_BASE_URL

  return useMemo(
    () => ({
      token,
      userInfo,
      permissions,
      theme,
      locale,
      currentStation,
      basePath,
      apiBaseUrl,
      navigate,
    }),
    [token, userInfo, permissions, theme, locale, currentStation, basePath, apiBaseUrl, navigate],
  )
}
