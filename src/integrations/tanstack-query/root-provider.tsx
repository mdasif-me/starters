import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Role, User } from '@/features/auth/types'

export function getContext() {
  const queryClient = new QueryClient()
  return {
    queryClient,
  }
}

export function getAuthHelpers(queryClient: QueryClient) {
  const getUser = (): User | null => {
    return queryClient.getQueryData<User>(['user']) ?? null
  }

  const hasRole = (roles: Role[]): boolean => {
    const user = getUser()
    if (!user) return false
    return roles.includes(user.role)
  }

  const hasPermission = (permission: string): boolean => {
    const user = getUser()
    if (!user || !user.permissions) return false
    return user.permissions.includes(permission)
  }

  return {
    getUser,
    hasRole,
    hasPermission,
  }
}

export function Provider({
  children,
  queryClient,
}: {
  children: React.ReactNode
  queryClient: QueryClient
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
