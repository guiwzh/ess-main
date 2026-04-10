import { defineMock } from 'vite-plugin-mock-dev-server'

export default defineMock([
  {
    url: '/api/user/info',
    delay: 200,
    body: {
      code: 0,
      message: 'ok',
      data: {
        id: '1',
        username: 'admin',
        realName: '管理员',
        avatar: '',
        roles: ['admin'],
      },
    },
  },
  {
    url: '/api/user/routes',
    delay: 200,
    body: {
      code: 0,
      message: 'ok',
      data: [
        {
          path: '/dashboard',
          name: 'Dashboard',
          icon: 'DashboardOutlined',
          component: 'pages/Dashboard',
          meta: { title: '仪表盘' },
        },
        {
          path: '/operation',
          name: 'Operation',
          icon: 'ToolOutlined',
          meta: { title: '运维管理' },
          children: [
            {
              path: '/operation/devices',
              name: 'Devices',
              component: 'sub-operation',
              meta: { title: '设备管理' },
            },
            {
              path: '/operation/alarms',
              name: 'Alarms',
              component: 'sub-operation',
              meta: { title: '告警管理' },
            },
          ],
        },
        {
          path: '/analysis',
          name: 'Analysis',
          icon: 'BarChartOutlined',
          meta: { title: '数据分析' },
          children: [
            {
              path: '/analysis/reports',
              name: 'Reports',
              component: 'sub-analysis',
              meta: { title: '报表分析' },
            },
          ],
        },
      ],
    },
  },
  {
    url: '/api/user/stations',
    delay: 150,
    body: {
      code: 0,
      message: 'ok',
      data: [
        { id: 'station-001', name: '储能站点A' },
        { id: 'station-002', name: '储能站点B' },
        { id: 'station-003', name: '储能站点C' },
      ],
    },
  },
])
