import { useAppStore } from '@/store/appStore'
import { useUserStore } from '@/store/userStore'
import { getNewToken } from '@/utils/request'
import { useEffect, useRef } from 'react'
import {
  emitLocaleChange,
  emitStationChange,
  emitThemeChange,
  emitUserContextSync,
  onTokenExpired,
} from './bus'

/**
 * 主应用 bus 同步 hook
 * - 监听 appStore 变更 → 广播给子应用
 * - 监听子应用 bus 事件 → 响应处理
 */
export function useBusSync() {
  const theme = useAppStore((s) => s.theme)
  const locale = useAppStore((s) => s.locale)
  const currentStation = useAppStore((s) => s.currentStation)
  const userInfo = useUserStore((s) => s.userInfo)
  const permissions = useUserStore((s) => s.permissions)
  /**
   * 跳过首次渲染的 bus emit。
   * 原因：主应用 mount 时子应用尚未加载完成，bus 事件无人订阅会触发 wujie warn。
   * 初始值已通过 wujie props 传递给子应用（见 useSubAppProps），无需通过 bus 重复同步。
   * 仅在用户运行时切换主题/语言/站点时才需要 bus 通知已加载的子应用更新状态。
   *
   * 实现：利用 React effects 按声明顺序执行的特性 ——
   * 1. emit effects 先执行：检查 mountedRef.current，首次为 false → 跳过
   * 2. 标记 effect 最后执行：设置 mountedRef.current = true
   * 后续 state 变更触发的 effect 中 mountedRef.current 已为 true → 正常 emit
   */
  const mountedRef = useRef(false)

  // 主题变更 → 广播给子应用
  useEffect(() => {
    if (mountedRef.current) emitThemeChange(theme)
  }, [theme])

  // 语言变更 → 广播给子应用
  useEffect(() => {
    if (mountedRef.current) emitLocaleChange(locale)
  }, [locale])

  // 站点变更 → 广播给子应用
  useEffect(() => {
    if (mountedRef.current) emitStationChange(currentStation)
  }, [currentStation])

  // userInfo / permissions 变更 → 通知子应用从 wujie props 拉新
  useEffect(() => {
    if (mountedRef.current) emitUserContextSync()
  }, [userInfo, permissions])

  // 标记已挂载（必须在上面的 emit effects 之后声明，React 按声明顺序执行 effects）
  useEffect(() => {
    mountedRef.current = true
  }, [])

  // 监听子应用 token-expired → 复用统一刷新逻辑（getNewToken 内部处理 zustand + bus + 失败跳转）
  useEffect(() => {
    const unsubscribe = onTokenExpired(async () => {
      try {
        await getNewToken()
      } catch {
        // getNewToken 内部已处理登出 + 跳转 /login
      }
    })
    return () => {
      unsubscribe()
    }
  }, [])
}
