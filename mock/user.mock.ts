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
          name: 'dashboard',
          icon: 'DashboardOutlined',
          component: 'pages/Dashboard',
          meta: { title: '仪表盘' },
        },
        {
          path: '/operation',
          name: 'operation',
          icon: 'ToolOutlined',
          meta: { title: '运维管理' },
          children: [
            {
              path: '/operation/devices',
              name: 'device',
              component: 'sub-operation',
              meta: { title: '设备管理' },
            },
            {
              path: '/operation/alarms',
              name: 'alarm',
              component: 'sub-operation',
              meta: { title: '告警管理' },
            },
            {
              path: '/operation/work-orders',
              name: 'workOrder',
              component: 'sub-operation',
              meta: { title: '工单管理' },
            },
            {
              path: '/operation/work-orders/create',
              name: 'workOrderCreate',
              component: 'sub-operation',
              meta: { title: '创建工单', hideInMenu: true },
            },
          ],
        },
        {
          path: '/analysis',
          name: 'analysis',
          icon: 'BarChartOutlined',
          meta: { title: '数据分析' },
          children: [
            {
              path: '/analysis/energy-stats',
              name: 'energyStats',
              component: 'sub-analysis',
              meta: { title: '能源统计' },
            },
            {
              path: '/analysis/operation-analysis',
              name: 'operationAnalysis',
              component: 'sub-analysis',
              meta: { title: '运营分析' },
            },
            {
              path: '/analysis/report',
              name: 'report',
              component: 'sub-analysis',
              meta: { title: '报表中心' },
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
