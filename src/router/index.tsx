import { createBrowserRouter, Navigate } from 'react-router-dom'
import type { RouteItem } from '@/store/userStore'
import BlankLayout from '@/layouts/BlankLayout'
import BasicLayout from '@/layouts/BasicLayout'
import LoginPage from '@/pages/Login'
import { generateRoutes } from './generateRoutes'

/** 根据认证状态和动态路由创建应用路由 */
export function createAppRouter(authenticated: boolean, dynamicRoutes: RouteItem[]) {
  if (!authenticated) {
    return createBrowserRouter([
      {
        path: '/login',
        element: <BlankLayout />,
        children: [{ index: true, element: <LoginPage /> }],
      },
      { path: '*', element: <Navigate to="/login" replace /> },
    ])
  }

  const childRoutes = generateRoutes(dynamicRoutes)
  const firstPath = dynamicRoutes[0]?.path || '/dashboard'
  if (dynamicRoutes.length) {
    childRoutes.unshift({ index: true, element: <Navigate to={firstPath} replace /> })
    childRoutes.push({ path: '*', element: <Navigate to={firstPath} replace /> })
  }

  return createBrowserRouter([
    {
      path: '/login',
      element: <BlankLayout />,
      children: [{ index: true, element: <LoginPage /> }],
    },
    {
      path: '/',
      element: <BasicLayout />,
      children: childRoutes,
    },
  ])
}
