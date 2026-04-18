import request from '@/utils/request'

export interface LoginParams {
  username: string
  password: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
}

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

/** 登录 */
export function login(data: LoginParams) {
  return request.post<ApiResponse<LoginResult>>('/auth/login', data)
}

/** 获取用户信息 */
export function getUserInfo() {
  return request.get<ApiResponse<import('@/store/userStore').UserInfo>>('/user/info')
}

/** 获取权限路由 + 子应用注册配置 */
export function getUserRoutes() {
  return request.get<
    ApiResponse<{
      routes: import('@/store/userStore').RouteItem[]
      subApps: import('@/store/userStore').SubAppConfig[]
    }>
  >('/user/routes')
}

/** 获取授权站点 */
export function getUserStations() {
  return request.get<ApiResponse<import('@/store/userStore').Station[]>>('/user/stations')
}
