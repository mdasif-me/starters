import type { IRole, IUser } from '@/features/auth/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export function getContext() {
  const queryClient = new QueryClient()
  return {
    queryClient,
  }
}

export function getAuthHelpers(queryClient: QueryClient) {
  const getUser = (): IUser | null => {
    return queryClient.getQueryData<IUser>(['user']) ?? null
  }

  const hasRole = (roles: IRole[]): boolean => {
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
