import { useUserStore } from '@/store/userStore'

/** 检查当前用户是否拥有指定权限 */
export function useAuth() {
  const permissions = useUserStore((s) => s.permissions)

  /** 是否拥有某个权限 */
  const hasPermission = (code: string) => permissions.includes(code)

  /** 是否拥有所有指定权限 */
  const hasAllPermissions = (codes: string[]) => codes.every((c) => permissions.includes(c))

  /** 是否拥有任一指定权限 */
  const hasAnyPermission = (codes: string[]) => codes.some((c) => permissions.includes(c))

  return { permissions, hasPermission, hasAllPermissions, hasAnyPermission }
}
