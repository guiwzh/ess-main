import { useAuth } from '@/hooks/useAuth'

interface AuthButtonProps {
  /** 所需权限码，拥有任一即可显示 */
  code: string | string[]
  /** 无权限时的替代渲染（默认不渲染） */
  fallback?: React.ReactNode
  children: React.ReactNode
}

/** 权限按钮包裹组件：根据权限码决定子元素是否可见 */
const AuthButton: React.FC<AuthButtonProps> = ({ code, fallback = null, children }) => {
  const { hasPermission, hasAnyPermission } = useAuth()

  const codes = Array.isArray(code) ? code : [code]
  const authorized = codes.length === 1 ? hasPermission(codes[0]) : hasAnyPermission(codes)

  if (!authorized) return <>{fallback}</>

  return <>{children}</>
}

export default AuthButton
