import { lazy } from 'react'
import type { ComponentType } from 'react'

type LazyComponent = React.LazyExoticComponent<ComponentType>

/** 页面组件映射：后端返回的 component 字段 → React.lazy 组件 */
const componentMap: Record<string, LazyComponent> = {
  'pages/Dashboard': lazy(() => import('@/pages/Dashboard')),
  // 子应用占位：后续步骤中添加 SubApp 容器组件
  // 'sub-operation': lazy(() => import('@/pages/SubApp/Operation')),
  // 'sub-analysis': lazy(() => import('@/pages/SubApp/Analysis')),
}

export default componentMap
