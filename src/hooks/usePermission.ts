import { useUserStore } from '@/store/userStore'

export function usePermission() {
  const permissions = useUserStore((s) => s.permissions)

  /** 是否拥有指定权限码 */
  const has = (code: string) => permissions.includes(code)

  /** 是否拥有指定权限码中的任一个 */
  const hasAny = (codes: string[]) => codes.some((c) => permissions.includes(c))

  /** 是否拥有指定的全部权限码 */
  const hasAll = (codes: string[]) => codes.every((c) => permissions.includes(c))

  return { has, hasAny, hasAll }
}
