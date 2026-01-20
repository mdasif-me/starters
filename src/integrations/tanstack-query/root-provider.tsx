import { ERole, type IUser } from '@/features/auth/types'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { getCookie } from '@/hooks/use-cookie-storage'

export function getContext() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
      },
    },
  })
  const user = getCookie<IUser>('user')
  if (user) {
    queryClient.setQueryData(['user'], user)
  }

  return {
    queryClient,
  }
}

export function getAuthHelpers(queryClient: QueryClient) {
  const getUser = (): IUser | null => {
    return queryClient.getQueryData<IUser>(['user']) ?? null
  }

  const hasRole = (roles: ERole[]): boolean => {
    const user = getUser()
    if (!user) return false
    const userRole = (user.role as ERole) || ERole.USER
    return roles.includes(userRole)
  }

  const hasPermission = (_permission: string): boolean => {
    //TODO: implement permission check
    return false
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
