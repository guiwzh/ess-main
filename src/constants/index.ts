/** localStorage 存储键 */
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'ess_access_token',
  REFRESH_TOKEN: 'ess_refresh_token',
  USER_INFO: 'ess_user_info',
  LOCALE: 'ess_locale',
  THEME: 'ess_theme',
} as const

/** API 基础地址 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL as string

/** 子应用地址 */
export const SUB_APP_URLS = {
  OPERATION: import.meta.env.VITE_SUB_OPERATION_URL as string,
  ANALYSIS: import.meta.env.VITE_SUB_ANALYSIS_URL as string,
} as const

/** Token 刷新相关 */
export const TOKEN_CONFIG = {
  /** 最大重试次数 */
  MAX_RETRY: 2,
  /** 重试间隔基数（ms） */
  RETRY_DELAY: 1000,
} as const
