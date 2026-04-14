import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { emitLocaleChange, emitThemeChange, emitStationChange, onTokenExpired } from './bus'
import { refreshToken as refreshTokenApi } from '@/services/auth'

/**
 * 主应用 bus 同步 hook
 * - 监听 appStore 变更 → 广播给子应用
 * - 监听子应用 bus 事件 → 响应处理
 */
export function useBusSync() {
  const navigate = useNavigate()
  const theme = useAppStore((s) => s.theme)
  const locale = useAppStore((s) => s.locale)
  const currentStation = useAppStore((s) => s.currentStation)
  const setAuth = useUserStore((s) => s.setAuth)
  const logout = useUserStore((s) => s.logout)

  // 主题变更 → 广播给子应用
  useEffect(() => {
    emitThemeChange(theme)
  }, [theme])

  // 语言变更 → 广播给子应用
  useEffect(() => {
    emitLocaleChange(locale)
  }, [locale])

  // 站点变更 → 广播给子应用
  useEffect(() => {
    emitStationChange(currentStation)
  }, [currentStation])

  // 监听子应用 token-expired → 刷新 token 或登出
  useEffect(() => {
    const unsubscribe = onTokenExpired(async () => {
      try {
        const res = await refreshTokenApi()
        setAuth(res.data.data.accessToken, res.data.data.refreshToken)
      } catch {
        logout()
        navigate('/login')
      }
    })
    return () => {
      unsubscribe()
    }
  }, [navigate, setAuth, logout])
}
