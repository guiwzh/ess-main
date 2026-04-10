/* eslint-disable react-refresh/only-export-components */
import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import type { RouteItem } from '@/store/userStore'
import componentMap from './componentMap'

/** 403 占位（后续步骤替换为真实 403 页面） */
const Forbidden = () => <div style={{ padding: 48, textAlign: 'center' }}>403 - 无权访问</div>

/** 将后端路由数据转换为 react-router RouteObject */
export function generateRoutes(routes: RouteItem[]): RouteObject[] {
  return routes.map((route) => {
    // 取路径最后一段作为相对路径，确保嵌套路由正确匹配
    // /dashboard → dashboard, /operation/devices → devices
    const segments = route.path.split('/').filter(Boolean)
    const relativePath = segments[segments.length - 1] || route.path

    const routeObj: RouteObject = {
      path: relativePath,
    }

    // 叶子节点：匹配组件
    if (route.component) {
      const LazyComp = componentMap[route.component]
      if (LazyComp) {
        routeObj.element = (
          <Suspense fallback={<div>Loading...</div>}>
            <LazyComp />
          </Suspense>
        )
      } else {
        // 组件未注册，显示 403
        routeObj.element = <Forbidden />
      }
    }

    // 有子路由
    if (route.children?.length) {
      routeObj.children = generateRoutes(route.children)
      // 父级路由默认重定向到第一个子路由（使用相对路径）
      if (!route.component && route.children[0]) {
        const firstChildSegments = route.children[0].path.split('/').filter(Boolean)
        const firstChildRelative =
          firstChildSegments[firstChildSegments.length - 1] || route.children[0].path
        routeObj.children.unshift({
          index: true,
          element: <Navigate to={firstChildRelative} replace />,
        })
      }
    }

    return routeObj
  })
}
