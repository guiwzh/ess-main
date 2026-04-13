import WujieReact from 'wujie-react'
import { BUS_EVENTS } from '@/constants/bus-events'
import type { Theme, Locale } from '@/store/appStore'

const { bus } = WujieReact

/** 向子应用广播语言切换 */
export function emitLocaleChange(locale: Locale) {
  bus.$emit(BUS_EVENTS.LOCALE_CHANGE, locale)
}

/** 向子应用广播主题切换 */
export function emitThemeChange(theme: Theme) {
  bus.$emit(BUS_EVENTS.THEME_CHANGE, theme)
}

/** 向子应用广播站点切换 */
export function emitStationChange(stationId: string | null) {
  bus.$emit(BUS_EVENTS.STATION_CHANGE, stationId)
}

/** 向子应用广播 Token 已刷新 */
export function emitTokenRefresh(token: string) {
  bus.$emit(BUS_EVENTS.TOKEN_REFRESH, token)
}

/** 监听子应用 token-expired 事件 */
export function onTokenExpired(callback: () => void) {
  bus.$on(BUS_EVENTS.TOKEN_EXPIRED, callback)
  return () => bus.$off(BUS_EVENTS.TOKEN_EXPIRED, callback)
}

/** 监听子应用路由跳转事件 */
export function onNavigate(callback: (path: string) => void) {
  const handler = (...args: unknown[]) => callback(args[0] as string)
  bus.$on(BUS_EVENTS.NAVIGATE, handler)
  return () => bus.$off(BUS_EVENTS.NAVIGATE, handler)
}
