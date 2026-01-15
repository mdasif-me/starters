import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { AnchoredToastProvider, ToastProvider } from '@/components/ui/toast'
import type { ERole, IUser } from '@/features/auth/types'
import InfoForm from '@/features/index/components/info-form'
import VerificationStatus from '@/features/index/components/verification-status'
import { getCookie } from '@/hooks/use-cookie-storage'
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
    const token = getCookie<string>('token')
    const user_info = getCookie<IUser>('user')
    const isCompany = !!user_info?.company_info
    const isPending = user_info?.company_info?.verification_status === 'pending'

    if (isPending && token) {
      return <VerificationStatus />
    }
    if (!isCompany && token) {
      return (
        <div className="w-full flex justify-center braid-shape">
          <div className="w-fit h-fit mx-auto my-auto bg-white rounded-2xl shadow backdrop-blur">
            <InfoForm />
          </div>
        </div>
      )
    }
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
