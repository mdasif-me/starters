import { Link, Outlet, createFileRoute, redirect } from '@tanstack/react-router'
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

import userAvatar from '/user.png'

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ context }) => {
    const { auth } = context
    const user = auth.getUser()
    if (!user) {
      throw redirect({
        to: '/auth/login',
      })
    }
  },
  component: AuthenticatedLayout,
})

function AuthenticatedLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="bg-background z-50 sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
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
                <AvatarImage src={userAvatar} alt="user profile" />
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
  )
}
