import { BUS_EVENTS } from '@/constants/bus-events'
import type { Locale, Theme } from '@/store/appStore'
import WujieReact from 'wujie-react'

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

/** 向子应用广播 Token 刷新失败（让子应用 pending 请求 reject，而不是永久挂起） */
export function emitTokenRefreshFailed() {
  bus.$emit(BUS_EVENTS.TOKEN_REFRESH_FAILED)
}

/** 通知子应用重新从 wujie props 拉取 userInfo/permissions */
export function emitUserContextSync() {
  bus.$emit(BUS_EVENTS.USER_CONTEXT_SYNC)
}

/** 监听子应用 token-expired 事件 */
export function onTokenExpired(callback: () => void) {
  bus.$on(BUS_EVENTS.TOKEN_EXPIRED, callback)
  return () => bus.$off(BUS_EVENTS.TOKEN_EXPIRED, callback)
}
