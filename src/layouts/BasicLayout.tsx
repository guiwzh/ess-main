import { useMemo, type ReactNode } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ProLayout } from '@ant-design/pro-components'
import { useTranslation } from 'react-i18next'
import * as AntdIcons from '@ant-design/icons'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { useBusSync } from '@/wujie/useBusSync'
import type { RouteItem } from '@/store/userStore'
import RightContent from './components/RightContent'

/** 根据 icon 字符串动态解析 antd Icon 组件 */
function resolveIcon(iconName?: string): ReactNode | undefined {
  if (!iconName) return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComp = (AntdIcons as any)[iconName]
  return IconComp ? <IconComp /> : undefined
}

/** 将后端路由数据转为 ProLayout route 格式，使用 i18n 翻译菜单名 */
function toProLayoutRoutes(
  routes: RouteItem[],
  t: (key: string) => string,
): {
  path: string
  name: string
  icon?: ReactNode
  children?: ReturnType<typeof toProLayoutRoutes>
}[] {
  return routes.map((r) => ({
    path: r.path,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    name: (t as any)(r.name),
    ...(r.icon ? { icon: resolveIcon(r.icon) } : {}),
    ...(r.children?.length ? { children: toProLayoutRoutes(r.children, t) } : {}),
  }))
}

const BasicLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('common')
  const { t: tMenu } = useTranslation('menu')
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const dynamicRoutes = useUserStore((s) => s.dynamicRoutes)

  // 主应用与子应用的 bus 事件同步
  useBusSync()

  const menuRoutes = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => toProLayoutRoutes(dynamicRoutes, tMenu as any),
    [dynamicRoutes, tMenu],
  )

  return (
    <ProLayout
      title={t('systemName')}
      logo={null}
      layout="mix"
      collapsed={sidebarCollapsed}
      onCollapse={setSidebarCollapsed}
      location={{ pathname: location.pathname }}
      route={{
        path: '/',
        children: menuRoutes,
      }}
      menuItemRender={(item, dom) => (
        <a
          onClick={() => {
            navigate(item.path || '/')
          }}
        >
          {dom}
        </a>
      )}
      actionsRender={() => [<RightContent key="right" />]}
      contentStyle={{ padding: 18 }}
    >
      <Outlet />
    </ProLayout>
  )
}

export default BasicLayout
