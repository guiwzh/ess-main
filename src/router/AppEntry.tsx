import { useEffect, useState, useMemo } from 'react'
import { Navigate, useRoutes } from 'react-router-dom'
import { Spin } from 'antd'
import { useUserStore } from '@/store/userStore'
import { getUserInfo, getUserRoutes, getUserStations } from '@/services/auth'
import BasicLayout from '@/layouts/BasicLayout'
import { generateRoutes } from './generateRoutes'

const AppEntry: React.FC = () => {
  const token = useUserStore((s) => s.token)
  const dynamicRoutes = useUserStore((s) => s.dynamicRoutes)
  const setUserInfo = useUserStore((s) => s.setUserInfo)
  const setPermissions = useUserStore((s) => s.setPermissions)
  const setDynamicRoutes = useUserStore((s) => s.setDynamicRoutes)
  const setAuthorizedStations = useUserStore((s) => s.setAuthorizedStations)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchUserData() {
      try {
        const [infoRes, routesRes, stationsRes] = await Promise.all([
          getUserInfo(),
          getUserRoutes(),
          getUserStations(),
        ])
        if (cancelled) return

        if (infoRes.data.code === 0) {
          setUserInfo(infoRes.data.data)
          setPermissions(infoRes.data.data.roles)
        }
        if (routesRes.data.code === 0) {
          setDynamicRoutes(routesRes.data.data)
        }
        if (stationsRes.data.code === 0) {
          setAuthorizedStations(stationsRes.data.data)
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

  const childRoutes = useMemo(() => {
    if (!dynamicRoutes.length) return []
    const routes = generateRoutes(dynamicRoutes)
    // 默认重定向到第一条路由
    const firstPath = dynamicRoutes[0]?.path || '/dashboard'
    routes.unshift({ index: true, element: <Navigate to={firstPath} replace /> })
    routes.push({ path: '*', element: <Navigate to={firstPath} replace /> })
    return routes
  }, [dynamicRoutes])

  const element = useRoutes([
    {
      path: '/',
      element: <BasicLayout />,
      children: childRoutes,
    },
  ])

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Spin size="large" />
      </div>
    )
  }

  return element
}

export default AppEntry
