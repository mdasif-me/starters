import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'
import StoreDevtools from '../lib/demo-store-devtools'

import type { QueryClient } from '@tanstack/react-query'
import type { Role } from '../features/auth/types'

interface AuthHelpers {
  getUser: () => import('../features/auth/types').User | null
  hasRole: (roles: Role[]) => boolean
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
        <Outlet />
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            StoreDevtools,
            TanStackQueryDevtools,
          ]}
        />
      </>
    )
  },
})
