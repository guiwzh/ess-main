import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { ProLayout } from '@ant-design/pro-components'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/appStore'
import RightContent from './components/RightContent'

const defaultMenus = [
  {
    path: '/dashboard',
    name: '仪表盘',
    icon: 'DashboardOutlined',
  },
  {
    path: '/operation',
    name: '运维管理',
    icon: 'ToolOutlined',
    children: [
      { path: '/operation/devices', name: '设备管理' },
      { path: '/operation/alarms', name: '告警管理' },
    ],
  },
  {
    path: '/analysis',
    name: '数据分析',
    icon: 'BarChartOutlined',
    children: [{ path: '/analysis/reports', name: '报表分析' }],
  },
]

const BasicLayout: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useTranslation('common')
  const { sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const [pathname, setPathname] = useState(location.pathname)

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
        children: defaultMenus,
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
      <Outlet />
    </ProLayout>
  )
}

export default BasicLayout
