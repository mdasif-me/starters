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
import { linkOptions } from '@tanstack/react-router'

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
export default options
