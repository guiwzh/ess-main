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
              path: '/operation/devices/category',
              name: 'deviceCategory',
              component: 'sub-operation',
              meta: { title: '设备分类' },
            },
            {
              path: '/operation/alarms',
              name: 'alarm',
              component: 'sub-operation',
              meta: { title: '实时告警' },
            },
            {
              path: '/operation/alarms/history',
              name: 'alarmHistory',
              component: 'sub-operation',
              meta: { title: '历史告警' },
            },
            {
              path: '/operation/alarms/rules',
              name: 'alarmRules',
              component: 'sub-operation',
              meta: { title: '告警规则' },
            },
            {
              path: '/operation/work-orders',
              name: 'workOrder',
              component: 'sub-operation',
              meta: { title: '运维工单' },
            },
            {
              path: '/operation/work-orders/create',
              name: 'workOrderCreate',
              component: 'sub-operation',
              meta: { title: '创建工单', hideInMenu: true },
            },
            {
              path: '/operation/work-orders/inspection',
              name: 'inspection',
              component: 'sub-operation',
              meta: { title: '巡检计划' },
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
              meta: { title: '充放电统计' },
            },
            {
              path: '/analysis/efficiency',
              name: 'efficiency',
              component: 'sub-analysis',
              meta: { title: '能量效率' },
            },
            {
              path: '/analysis/revenue',
              name: 'revenue',
              component: 'sub-analysis',
              meta: { title: '收益分析' },
            },
            {
              path: '/analysis/battery-health',
              name: 'batteryHealth',
              component: 'sub-analysis',
              meta: { title: '电池健康度' },
            },
            {
              path: '/analysis/report',
              name: 'report',
              component: 'sub-analysis',
              meta: { title: '日报月报' },
            },
            {
              path: '/analysis/report/custom',
              name: 'reportCustom',
              component: 'sub-analysis',
              meta: { title: '自定义报表' },
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
