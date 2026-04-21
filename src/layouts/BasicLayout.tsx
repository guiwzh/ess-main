import ErrorBoundary from '@/components/ErrorBoundary'
import { useAppStore } from '@/store/appStore'
import type { RouteItem } from '@/store/userStore'
import { useUserStore } from '@/store/userStore'
import { useBusSync } from '@/wujie/useBusSync'
import * as AntdIcons from '@ant-design/icons'
import { AppstoreOutlined } from '@ant-design/icons'
import { ProLayout } from '@ant-design/pro-components'
import { useMemo, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import RightContent from './components/RightContent'

const iconMap = AntdIcons as unknown as Record<string, React.ComponentType>

/** 根据 icon 字符串动态解析 antd Icon 组件，未找到时回退默认图标 */
function resolveIcon(iconName?: string): ReactNode | undefined {
  if (!iconName) return undefined
  const IconComp = iconMap[iconName]
  return IconComp ? <IconComp /> : <AppstoreOutlined />
}

interface ProLayoutRoute {
  path: string
  name: string
  icon?: ReactNode
  children?: ProLayoutRoute[]
}

/** 将后端路由数据转为 ProLayout route 格式，过滤 hideInMenu，使用 i18n 翻译菜单名 */
function toProLayoutRoutes(routes: RouteItem[], t: (key: string) => string): ProLayoutRoute[] {
  return routes
    .filter((r) => !r.meta?.hideInMenu)
    .map((r) => ({
      path: r.path,
      name: t(r.dictKey),
      ...(r.icon ? { icon: resolveIcon(r.icon) } : {}),
      ...(r.children?.length ? { children: toProLayoutRoutes(r.children, t) } : {}),
    }))
}

const BasicLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('common')
  const { t: tMenu } = useTranslation('menu')
  const sidebarCollapsed = useAppStore((s) => s.sidebarCollapsed)
  const setSidebarCollapsed = useAppStore((s) => s.setSidebarCollapsed)
  const dynamicRoutes = useUserStore((s) => s.dynamicRoutes)
  const [openKeys, setOpenKeys] = useState<string[]>([])

  // 主应用与子应用的 bus 事件同步
  useBusSync()

  const menuRoutes = useMemo(
    () => toProLayoutRoutes(dynamicRoutes, tMenu as (key: string) => string),
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
      menuProps={{ inlineCollapsed: sidebarCollapsed, openKeys, onOpenChange: setOpenKeys }}
      actionsRender={() => [<RightContent key="right" />]}
      contentStyle={{ padding: 18 }}
    >
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </ProLayout>
  )
}

export default BasicLayout
