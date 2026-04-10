import { http, HttpResponse, delay } from 'msw'

/** 统一响应结构 */
interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

function success<T>(data: T, message = 'ok'): ApiResponse<T> {
  return { code: 0, message, data }
}

/** 登录接口 POST /api/auth/login */
const loginHandler = http.post('/api/auth/login', async ({ request }) => {
  await delay(300)
  const body = (await request.json()) as { username?: string; password?: string }

  if (body.username === 'admin' && body.password === 'admin123') {
    return HttpResponse.json(
      success({
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
      }),
    )
  }

  return HttpResponse.json({ code: 401, message: '用户名或密码错误', data: null }, { status: 401 })
})

/** Token 刷新 POST /api/auth/refresh */
const refreshHandler = http.post('/api/auth/refresh', async () => {
  await delay(100)
  return HttpResponse.json(
    success({
      accessToken: 'mock-access-token-refreshed-' + Date.now(),
      refreshToken: 'mock-refresh-token-refreshed-' + Date.now(),
    }),
  )
})

/** 用户信息 GET /api/user/info */
const userInfoHandler = http.get('/api/user/info', async () => {
  await delay(200)
  return HttpResponse.json(
    success({
      id: '1',
      username: 'admin',
      realName: '管理员',
      avatar: '',
      roles: ['admin'],
    }),
  )
})

/** 权限路由 GET /api/user/routes */
const userRoutesHandler = http.get('/api/user/routes', async () => {
  await delay(200)
  return HttpResponse.json(
    success([
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
    ]),
  )
})

/** 授权站点列表 GET /api/user/stations */
const stationsHandler = http.get('/api/user/stations', async () => {
  await delay(150)
  return HttpResponse.json(
    success([
      { id: 'station-001', name: '储能站点A' },
      { id: 'station-002', name: '储能站点B' },
      { id: 'station-003', name: '储能站点C' },
    ]),
  )
})

export const handlers = [
  loginHandler,
  refreshHandler,
  userInfoHandler,
  userRoutesHandler,
  stationsHandler,
]
