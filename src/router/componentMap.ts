import type { ComponentType } from 'react'
import { lazy } from 'react'

type LazyComponent = React.LazyExoticComponent<ComponentType>

/** 主应用内置页面组件映射：后端返回的 component 字段 → React 组件 */
const componentMap: Record<string, LazyComponent> = {
  'pages/Dashboard': lazy(() => import('@/pages/Dashboard')),
}

export default componentMap
