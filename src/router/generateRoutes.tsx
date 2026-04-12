/* eslint-disable react-refresh/only-export-components */
import { Suspense } from 'react'
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import type { RouteItem } from '@/store/userStore'
import componentMap from './componentMap'

/** 403 占位（后续步骤替换为真实 403 页面） */
const Forbidden = () => <div style={{ padding: 48, textAlign: 'center' }}>403 - 无权访问</div>

/** 将后端路由数据转换为 react-router RouteObject */
export function generateRoutes(routes: RouteItem[], parentPath = ''): RouteObject[] {
  return routes.map((route) => {
    // 根据父路径计算相对路径
    // /dashboard → dashboard
    // /operation/devices → devices (parent=/operation)
    // /operation/devices/category → devices/category (parent=/operation)
    let relativePath: string
    if (parentPath && route.path.startsWith(parentPath + '/')) {
      relativePath = route.path.slice(parentPath.length + 1)
    } else {
      relativePath = route.path.replace(/^\//, '')
    }

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
      routeObj.children = generateRoutes(route.children, route.path)
      // 父级路由默认重定向到第一个子路由（使用相对路径）
      if (!route.component && route.children[0]) {
        let firstChildRelative: string
        if (route.children[0].path.startsWith(route.path + '/')) {
          firstChildRelative = route.children[0].path.slice(route.path.length + 1)
        } else {
          firstChildRelative = route.children[0].path.replace(/^\//, '')
        }
        routeObj.children.unshift({
          index: true,
          element: <Navigate to={firstChildRelative} replace />,
        })
      }
    }

    return routeObj
  })
}
