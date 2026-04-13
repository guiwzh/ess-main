/* eslint-disable react-refresh/only-export-components */
import { Navigate } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import type { RouteItem } from '@/store/userStore'
import componentMap from './componentMap'

/** 403 占位（后续步骤替换为真实 403 页面） */
const Forbidden = () => <div style={{ padding: 48, textAlign: 'center' }}>403 - 无权访问</div>

/** 将后端路由数据扁平化为 react-router RouteObject 数组 */
export function generateRoutes(routes: RouteItem[]): RouteObject[] {
  const result: RouteObject[] = []

  function flatten(items: RouteItem[]) {
    for (const route of items) {
      if (route.component) {
        // 叶子节点：匹配组件
        const LazyComp = componentMap[route.component]
        result.push({
          path: route.path.replace(/^\//, ''),
          element: LazyComp ? <LazyComp /> : <Forbidden />,
        })
      }

      if (route.children?.length) {
        // 父节点无组件 → 重定向到第一个子路由
        if (!route.component) {
          result.push({
            path: route.path.replace(/^\//, ''),
            element: <Navigate to={route.children[0].path} replace />,
          })
        }
        flatten(route.children)
      }
    }
  }

  flatten(routes)
  return result
}
