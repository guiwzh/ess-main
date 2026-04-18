/** localStorage 存储键 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ess_access_token',
  REFRESH_TOKEN: 'ess_refresh_token',
  USER_INFO: 'ess_user_info',
  LOCALE: 'ess_locale',
  THEME: 'ess_theme',
} as const

/** API 基础地址 */
export const API_BASE_URL: string = (() => {
  const url = import.meta.env.VITE_API_BASE_URL
  if (!url || typeof url !== 'string') {
    console.error('[ESS] 环境变量 VITE_API_BASE_URL 未配置，回退到 /api')
    return '/api'
  }
  return url
})()

/** Token 刷新相关 */
export const TOKEN_CONFIG = {
  /** 最大重试次数 */
  MAX_RETRY: 2,
  /** 重试间隔基数（ms） */
  RETRY_DELAY: 1000,
} as const
