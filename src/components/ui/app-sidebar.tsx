import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Link, linkOptions, useLocation } from '@tanstack/react-router'
import { LogOutIcon } from 'lucide-react'
import * as React from 'react'
import Logo from '/logo.svg'

import {
  UserGroupIcon as AgentsIcon,
  CheckmarkBadge03Icon as ApprovalIcon,
  DashboardSquare01Icon as DashboardStroke,
  File02Icon as ProjectStroke,
  ChartUpIcon as RevenueIcon,
  Analytics01Icon as SalesIcon,
  SaveMoneyEuroIcon as WithdrawalsIcon,
} from '@hugeicons-pro/core-stroke-rounded'

import {
  UserGroupIcon as AgentsSolid,
  CheckmarkBadge03Icon as ApprovalSolid,
  DashboardSquare01Icon as DashboardSolid,
  File02Icon as ProjectSolid,
  ChartUpIcon as RevenueSolid,
  Analytics01Icon as SalesSolid,
  SaveMoneyEuroIcon as WithdrawalsSolid,
} from '@hugeicons-pro/core-solid-rounded'

import { cn } from '../../lib/utils'
import { Icon } from '../../utils/icon'

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { pathname } = useLocation()
  const options = linkOptions([
    {
      to: '/',
      label: 'Dashboard',
      icon: DashboardStroke,
      solidicon: DashboardSolid,
      activeOptions: { exact: true },
    },
    {
      to: '/projects',
      label: 'Projects',
      icon: ProjectStroke,
      solidicon: ProjectSolid,
    },
    {
      to: '/sales',
      label: 'Sales',
      icon: SalesIcon,
      solidicon: SalesSolid,
      activeOptions: { exact: true },
    },
    {
      to: '/revenue',
      label: 'Revenue',
      icon: RevenueIcon,
      solidicon: RevenueSolid,
      activeOptions: { exact: true },
    },
    {
      to: '/agents',
      label: 'Agents',
      icon: AgentsIcon,
      solidicon: AgentsSolid,
      activeOptions: { exact: true },
    },
    {
      to: '/withdrawals',
      label: 'Withdrawals',
      icon: WithdrawalsIcon,
      solidicon: WithdrawalsSolid,
      activeOptions: { exact: true },
    },
    {
      to: '/approvals',
      label: 'Approvals',
      icon: ApprovalIcon,
      solidicon: ApprovalSolid,
      activeOptions: { exact: true },
    },
  ])

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <Link to="/">
          <img src={Logo} alt="logo" />
        </Link>
      </SidebarHeader>
      <SidebarContent className="mt-16">
        {options.map((option) => {
          const [isHovered, setIsHovered] = React.useState(false)
          const isActive = pathname === option.to

          return (
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              key={option.to}
              className="relative"
            >
              <Link
                {...option}
                key={option.to}
                activeProps={{ className: `text-primary font-medium` }}
                className={cn(
                  'flex items-center gap-3 mx-4 rounded-xl p-3 text-sm transition-all duration-200',
                  isActive || isHovered
                    ? 'bg-primary/5 text-primary hover:bg-primary/5'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5',
                )}
              >
                <Icon
                  key={option.to}
                  icon={isActive || isHovered ? option.solidicon : option.icon}
                  size={20}
                  strokeWidth={isActive || isHovered ? 0.5 : 2}
                  className={cn(
                    'shrink-0',
                    isActive || isHovered
                      ? 'text-primary'
                      : 'text-muted-foreground',
                  )}
                />
                {option.label}
              </Link>
              {(isActive || isHovered) && (
                <div className="bg-primary absolute top-2 left-0 h-7 w-1 rounded-tr-xl rounded-br-xl transition-all duration-200" />
              )}
            </div>
          )
        })}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size={'lg'}
              className="bg-destructive/5 hover:bg-destructive/10"
            >
              <LogOutIcon size={24} className="text-destructive shrink-0" />
              <span className="text-destructive text-lg">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
