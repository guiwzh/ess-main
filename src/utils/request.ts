import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios'
import { message } from 'antd'
import { API_BASE_URL, TOKEN_CONFIG } from '@/constants'
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '@/utils/auth'

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

// ---------- Token 刷新锁 ----------
let isRefreshing = false
let pendingRequests: Array<(token: string) => void> = []

function onTokenRefreshed(newToken: string) {
  pendingRequests.forEach((cb) => cb(newToken))
  pendingRequests = []
}

async function refreshToken(): Promise<string> {
  const refresh = getRefreshToken()
  const res = await axios.post<{ data: { token: string; refreshToken: string } }>(
    `${API_BASE_URL}/auth/refresh`,
    { refreshToken: refresh },
  )
  const { token, refreshToken: newRefresh } = res.data.data
  setTokens(token, newRefresh)
  return token
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

    // 401: 自动刷新 token + 重放
    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          pendingRequests.push((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`
            resolve(request(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const newToken = await refreshToken()
        isRefreshing = false
        onTokenRefreshed(newToken)
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return request(originalRequest)
      } catch {
        isRefreshing = false
        pendingRequests = []
        clearTokens()
        window.location.href = '/login'
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

// ---------- 带重试的请求方法（用于关键接口） ----------
export async function requestWithRetry<T>(
  config: Parameters<typeof request>[0],
  retries = TOKEN_CONFIG.MAX_RETRY,
): Promise<T> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await request(config)
    } catch (err) {
      if (i === retries) throw err
      await new Promise((r) => setTimeout(r, TOKEN_CONFIG.RETRY_DELAY * 2 ** i))
    }
  }
  throw new Error('Max retries exceeded')
}

export default request
