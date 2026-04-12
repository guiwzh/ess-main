import { lazy } from 'react'
import type { ComponentType } from 'react'

type LazyComponent = React.LazyExoticComponent<ComponentType>

/** 页面组件映射：后端返回的 component 字段 → React.lazy 组件 */
const componentMap: Record<string, LazyComponent> = {
  'pages/Dashboard': lazy(() => import('@/pages/Dashboard')),
  'sub-operation': lazy(() =>
    import('@/wujie/SubApp').then((mod) => ({
      default: () => mod.default({ name: 'sub-operation' }),
    })),
  ),
  'sub-analysis': lazy(() =>
    import('@/wujie/SubApp').then((mod) => ({
      default: () => mod.default({ name: 'sub-analysis' }),
    })),
  ),
}

export default componentMap
