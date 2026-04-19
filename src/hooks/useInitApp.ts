import { getUserInfo, getUserRoutes, getUserStations } from '@/services'
import { useUserStore } from '@/store/userStore'
import { useEffect, useState } from 'react'

/** 应用初始化：认证检查 + 加载用户数据/路由/站点 */
export function useInitApp() {
  const token = useUserStore((s) => s.token)
  const setUserInfo = useUserStore((s) => s.setUserInfo)
  const setPermissions = useUserStore((s) => s.setPermissions)
  const setDynamicRoutes = useUserStore((s) => s.setDynamicRoutes)
  const setAuthorizedStations = useUserStore((s) => s.setAuthorizedStations)
  const [loading, setLoading] = useState(!!token)

  useEffect(() => {
    if (!token) return

    let cancelled = false

    async function fetchUserData() {
      try {
        const [infoRes, routesRes, stationsRes] = await Promise.all([
          getUserInfo(),
          getUserRoutes(),
          getUserStations(),
        ])
        if (cancelled) return

        if (infoRes.code === 0) {
          setUserInfo(infoRes.data)
          setPermissions(infoRes.data.permissions)
        }
        if (routesRes.code === 0) {
          setDynamicRoutes(routesRes.data)
        }
        if (stationsRes.code === 0) {
          setAuthorizedStations(stationsRes.data)
        }
      } catch {
        // token 无效等异常由 axios 拦截器处理
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchUserData()
    return () => {
      cancelled = true
    }
  }, [token, setUserInfo, setPermissions, setDynamicRoutes, setAuthorizedStations])

  return { loading, authenticated: !!token }
}
