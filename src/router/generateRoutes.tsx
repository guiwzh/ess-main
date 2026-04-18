/* eslint-disable react-refresh/only-export-components */
import type { RouteItem } from '@/store/userStore'
import { useUserStore } from '@/store/userStore'
import SubApp from '@/wujie/SubApp'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import componentMap from './componentMap'

/** 403 占位（后续步骤替换为真实 403 页面） */
const Forbidden = () => <div style={{ padding: 48, textAlign: 'center' }}>403 - 无权访问</div>

/** 判断 component 是否是已注册的子应用 */
function isSubApp(component: string): boolean {
  return useUserStore.getState().subAppConfigs.some((app) => app.name === component)
}

/** 将后端路由数据扁平化为 react-router RouteObject 数组 */
export function generateRoutes(routes: RouteItem[]): RouteObject[] {
  const result: RouteObject[] = []

  function flatten(items: RouteItem[]) {
    for (const route of items) {
      if (route.component) {
        // 优先匹配内置页面组件
        const LocalComp = componentMap[route.component]
        if (LocalComp) {
          result.push({
            path: route.path.replace(/^\//, ''),
            element: <LocalComp />,
          })
        } else if (isSubApp(route.component)) {
          // 动态识别子应用：后端返回的 component 与 subApps 注册名一致
          const appName = route.component
          result.push({
            path: route.path.replace(/^\//, '') + '/*',
            element: <SubApp name={appName} />,
          })
        } else {
          result.push({
            path: route.path.replace(/^\//, ''),
            element: <Forbidden />,
          })
        }
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
