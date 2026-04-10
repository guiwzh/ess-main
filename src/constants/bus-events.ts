/** wujie bus 事件名常量 */
export const BUS_EVENTS = {
  /** 语言切换 */
  LOCALE_CHANGE: 'locale-change',
  /** 主题切换 */
  THEME_CHANGE: 'theme-change',
  /** 站点切换 */
  STATION_CHANGE: 'station-change',
  /** Token 已刷新 */
  TOKEN_REFRESH: 'token-refresh',
  /** Token 过期（子应用通知主应用） */
  TOKEN_EXPIRED: 'token-expired',
  /** 路由跳转（子应用通知主应用） */
  NAVIGATE: 'navigate',
} as const
