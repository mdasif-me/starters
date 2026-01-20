import { TanStackDevtools } from '@tanstack/react-devtools'
import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { AnchoredToastProvider, ToastProvider } from '@/components/ui/toast'
import type { ERole, IUser } from '@/features/auth/types'
import InfoForm from '@/features/index/components/info-form'
import VerificationStatus from '@/features/index/components/verification-status'
import { getCookie, getRawCookie } from '@/hooks/use-cookie-storage'
import type { QueryClient } from '@tanstack/react-query'

interface IAuthHelpers {
  getUser: () => IUser | null
  hasRole: (roles: ERole[]) => boolean
  hasPermission: (permission: string) => boolean
}

export interface IRouterContext {
  queryClient: QueryClient
  auth: IAuthHelpers
}

export const Route = createRootRouteWithContext<IRouterContext>()({
  component: () => {
    const token = getRawCookie('token')
    const user_info = getCookie<IUser>('user')
    const isCompany = !!user_info?.company_info
    const isPending = user_info?.company_info?.verification_status === 'pending'

    if (user_info && !isCompany && token) {
      return (
        <div className="w-full flex justify-center braid-shape">
          <div className="w-fit h-fit mx-auto my-auto bg-white rounded-2xl shadow backdrop-blur">
            <InfoForm />
          </div>
        </div>
      )
    }

    if (isPending && token) {
      return <VerificationStatus />
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
