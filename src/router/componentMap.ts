import { lazy } from 'react'
import type { ComponentType } from 'react'
import SubApp from '@/wujie/SubApp'

type LazyComponent = React.LazyExoticComponent<ComponentType>
type AnyComponent = LazyComponent | ComponentType

/** 页面组件映射：后端返回的 component 字段 → React 组件 */
const componentMap: Record<string, AnyComponent> = {
  'pages/Dashboard': lazy(() => import('@/pages/Dashboard')),
  'sub-operation': () => SubApp({ name: 'sub-operation' }),
  'sub-analysis': () => SubApp({ name: 'sub-analysis' }),
}

export default componentMap
