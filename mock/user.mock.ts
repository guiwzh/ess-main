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
        permissions: [
          'dashboard:view',
          'device:view',
          'device:edit',
          'alarm:view',
          'alarm:confirm',
          'workorder:view',
          'workorder:create',
          'workorder:assign',
          'analysis:view',
          'report:view',
          'report:export',
        ],
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
          dictKey: 'dashboard',
          icon: 'DashboardOutlined',
          component: 'pages/Dashboard',
          meta: { title: '仪表盘' },
        },
        {
          path: '/operation',
          dictKey: 'operation',
          icon: 'ToolOutlined',
          subApp: { name: 'sub-operation', url: 'http://localhost:5175' },
          meta: { title: '运维管理' },
          children: [
            {
              path: '/operation/devices',
              dictKey: 'device',
              meta: { title: '设备管理' },
            },
            {
              path: '/operation/alarms',
              dictKey: 'alarm',
              meta: { title: '告警管理' },
            },
            {
              path: '/operation/work-orders',
              dictKey: 'workOrder',
              meta: { title: '工单管理' },
            },
          ],
        },
        {
          path: '/analysis',
          dictKey: 'analysis',
          icon: 'BarChartOutlined',
          subApp: { name: 'sub-analysis', url: 'http://localhost:5176' },
          meta: { title: '数据分析' },
          children: [
            {
              path: '/analysis/energy-stats',
              dictKey: 'energyStats',
              meta: { title: '能源统计' },
            },
            {
              path: '/analysis/operation-analysis',
              dictKey: 'operationAnalysis',
              meta: { title: '运营分析' },
            },
            {
              path: '/analysis/report',
              dictKey: 'report',
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
