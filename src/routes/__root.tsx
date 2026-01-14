import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { AnchoredToastProvider, ToastProvider } from '@/components/ui/toast'
import type { ERole, IUser } from '@/features/auth/types'
import type { QueryClient } from '@tanstack/react-query'

interface AuthHelpers {
  getUser: () => IUser | null
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
