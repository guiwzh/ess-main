import { API_BASE_URL, TOKEN_CONFIG } from '@/constants'
import { useUserStore } from '@/store/userStore'
import { getAccessToken, getRefreshToken, setTokens } from '@/utils/auth'
import { emitTokenRefresh } from '@/wujie/bus'
import { message } from 'antd'
import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'

const request = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ---------- 请求拦截器 ----------
request.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

// ---------- Token 统一刷新（带锁） ----------
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

/**
 * 统一 Token 刷新入口（供拦截器 + useBusSync 复用）。
 * - 带锁：并发请求只触发一次刷新，其余排队等待
 * - 刷新成功后：同步 localStorage + zustand store + 广播给子应用
 * - 刷新失败后：清除凭证 + 跳转登录
 */
export function getNewToken(): Promise<string> {
  if (isRefreshing) {
    return new Promise((resolve) => {
      pendingRequests.push(resolve)
    })
  }

  isRefreshing = true

  const refresh = getRefreshToken()
  return axios
    .post<{ data: { token: string; refreshToken: string } }>(`${API_BASE_URL}/auth/refresh`, {
      refreshToken: refresh,
    })
    .then((res) => {
      const { token, refreshToken: newRefresh } = res.data.data

      // 同步 localStorage
      setTokens(token, newRefresh)
      // 同步 zustand store（驱动 useSubAppProps 更新 wujie props）
      useUserStore.getState().setAuth(token, newRefresh)
      // 广播给已加载的子应用，让子应用 store 立即更新
      emitTokenRefresh(token)

      isRefreshing = false
      pendingRequests.forEach((cb) => cb(token))
      pendingRequests = []

      return token
    })
    .catch((err) => {
      isRefreshing = false
      pendingRequests = []
      useUserStore.getState().logout()
      window.location.href = '/login'
      throw err
    })
}

// ---------- 响应拦截器 ----------
request.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ message?: string }>) => {
    // 网络断开检测
    if (!navigator.onLine) {
      message.error('网络已断开，请检查网络连接')
      return Promise.reject(error)
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
    const status = error.response?.status

    // 401: 刷新 token + 重放原始请求
    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const newToken = await getNewToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return request(originalRequest)
      } catch {
        return Promise.reject(error)
      }
    }

    // 403: 无权限
    if (status === 403) {
      message.error('没有权限执行此操作')
    }

    // 500/502/503: 服务异常
    if (status && status >= 500) {
      message.error('服务异常，请稍后重试')
    }

    return Promise.reject(error)
  },
)

// ---------- 带重试的请求方法（仅对网络错误/5xx 重试，4xx 不重试） ----------
export async function requestWithRetry<T>(
  config: Parameters<typeof request>[0],
  retries = TOKEN_CONFIG.MAX_RETRY,
): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await request(config)
    } catch (err) {
      const status = (err as AxiosError)?.response?.status
      // 4xx 客户端错误不重试（401 已由拦截器处理）
      if (status && status >= 400 && status < 500) throw err
      if (i === retries) throw err
      await new Promise((r) => setTimeout(r, TOKEN_CONFIG.RETRY_DELAY * 2 ** i))
    }
  }
  throw new Error('Max retries exceeded')
}

export default request
