import { TanStackDevtools } from '@tanstack/react-devtools'
import {
  Link,
  Outlet,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import ClerkProvider from '../integrations/clerk/provider'

import StoreDevtools from '../lib/demo-store-devtools'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import type { QueryClient } from '@tanstack/react-query'
import GlobalSearch from '../components/global-search'
import { AppSidebar } from '../components/ui/app-sidebar'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '../components/ui/base-avatar'
import { Separator } from '../components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '../components/ui/sidebar'

import user from '/user.png'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <ClerkProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
              <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1 text-muted-foreground" />
                <Separator
                  orientation="vertical"
                  className="mr-2 data-[orientation=vertical]:h-9"
                />
                <div className="lg:block md:hidden sm:block hidden">
                  <GlobalSearch />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={`${user}`} alt={`user profile`} />
                    <AvatarFallback>AS</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <Link
                      to="/"
                      className="text-sm font-medium text-foreground hover:text-primary"
                    >
                      {'Kathryn Campbell'}
                    </Link>
                    <div className="text-xs font-normal text-muted-foreground">
                      {'kathryn.campbell@example.com'}
                    </div>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <Outlet />
            </div>
          </SidebarInset>
        </SidebarProvider>
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
      </ClerkProvider>
    </>
  ),
})
