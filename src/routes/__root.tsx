import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { AnchoredToastProvider, ToastProvider } from '@/components/ui/toast'
import type { QueryClient } from '@tanstack/react-query'
import type { ERole } from '@/features/auth/types'

interface AuthHelpers {
  getUser: () => import('@/features/auth/types').IUser | null
  hasRole: (roles: ERole[]) => boolean
  hasPermission: (permission: string) => boolean
}

export interface MyRouterContext {
  queryClient: QueryClient
  auth: AuthHelpers
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    return (
      <>
        <ToastProvider>
          <AnchoredToastProvider>
            <Outlet />
          </AnchoredToastProvider>
        </ToastProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
      </>
    )
  },
})
