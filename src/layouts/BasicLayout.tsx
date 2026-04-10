import { useState, useMemo } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ProLayout } from '@ant-design/pro-components'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import RouteProgress from '@/components/RouteProgress'
import { useBusSync } from '@/wujie/useBusSync'
import type { RouteItem } from '@/store/userStore'
import RightContent from './components/RightContent'

/** 将后端路由数据转为 ProLayout route 格式 */
function toProLayoutRoutes(
  routes: RouteItem[],
): { path: string; name: string; children?: ReturnType<typeof toProLayoutRoutes> }[] {
  return routes.map((r) => ({
    path: r.path,
    name: r.meta?.title || r.name,
    ...(r.children?.length ? { children: toProLayoutRoutes(r.children) } : {}),
  }))
}

const BasicLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('common')
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const dynamicRoutes = useUserStore((s) => s.dynamicRoutes)
  const [pathname, setPathname] = useState(location.pathname)

  // 主应用与子应用的 bus 事件同步
  useBusSync()

  const menuRoutes = useMemo(() => toProLayoutRoutes(dynamicRoutes), [dynamicRoutes])

  return (
    <ProLayout
      title={t('systemName')}
      logo={null}
      layout="mix"
      collapsed={sidebarCollapsed}
      onCollapse={setSidebarCollapsed}
      location={{ pathname }}
      route={{
        path: '/',
        children: menuRoutes,
      }}
      menuItemRender={(item, dom) => (
        <a
          onClick={() => {
            setPathname(item.path || '/')
            navigate(item.path || '/')
          }}
        >
          {dom}
        </a>
      )}
      actionsRender={() => [<RightContent key="right" />]}
    >
      <RouteProgress />
      <Outlet />
    </ProLayout>
  )
}

export default BasicLayout
