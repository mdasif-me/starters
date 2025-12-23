import { usePermission } from '../features/auth/hooks'
import type { Role } from '../features/auth/types'

interface PermissionGuardProps {
  children: React.ReactNode
  allowedRoles?: Role[]
  requiredPermission?: string
  fallback?: React.ReactNode
}

export const PermissionGuard = ({
  children,
  allowedRoles,
  requiredPermission,
  fallback = null,
}: PermissionGuardProps) => {
  const { hasRole, hasPermission } = usePermission()

  if (allowedRoles && !hasRole(allowedRoles)) {
    return <>{fallback}</>
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <>{fallback}</>
  }

  return <>{children}</>
}

export const AuthGuard = PermissionGuard
