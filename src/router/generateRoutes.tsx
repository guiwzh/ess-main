import Forbidden from '@/pages/403'
import type { RouteItem } from '@/store/userStore'
import SubApp from '@/wujie/SubApp'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import componentMap from './componentMap'

/** 将后端路由数据扁平化为 react-router RouteObject 数组 */
export function generateRoutes(routes: RouteItem[]): RouteObject[] {
  const result: RouteObject[] = []

  function flatten(items: RouteItem[], parentSubApp?: RouteItem['subApp']) {
    for (const route of items) {
      // 子路由无 subApp 时继承父级
      const effectiveSubApp = route.subApp ?? parentSubApp

      if (route.children?.length) {
        // 有子路由 → 菜单容器，重定向到第一个子路由
        if (!route.component) {
          result.push({
            path: route.path,
            element: <Navigate to={route.children[0].path} replace />,
          })
        }
        flatten(route.children, effectiveSubApp)
      } else if (route.component) {
        // 叶子节点 + 本地组件（component 优先于继承的 subApp）
        const LocalComp = componentMap[route.component]
        result.push({
          path: route.path,
          element: LocalComp ? <LocalComp /> : <Forbidden />,
        })
      } else if (effectiveSubApp) {
        // 叶子节点 + 子应用（自身或继承自父级）
        result.push({
          path: route.path + '/*',
          element: (
            <SubApp
              name={effectiveSubApp.name}
              url={effectiveSubApp.url}
              alive={effectiveSubApp.alive}
            />
          ),
        })
      }
    }
  }

  flatten(routes)
  return result
}
