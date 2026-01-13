import * as React from 'react';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/app/components/shared/ui/sidebar';
import {
  Award,
  Bell,
  BookOpen,
  ClipboardCheck,
  CreditCard,
  FileText,
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import LogoWithName from './logo';
import { SearchForm } from './search-form';

const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Starting',
      url: '',
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'Students',
          url: '/dashboard/students',
          icon: Users,
        },
      ],
    },
    {
      title: 'Management',
      url: '',
      items: [
        {
          title: 'Classes & Batches',
          url: '/dashboard/classes-and-batches',
          isActive: true,
          icon: BookOpen,
        },
        {
          title: 'Attendance',
          url: '/dashboard/attendance',
          icon: ClipboardCheck,
        },
        {
          title: 'Marks & Grades',
          url: '/dashboard/marks-and-grades',
          icon: Award,
        },
        {
          title: 'Fees & Payments',
          url: '/dashboard/fees-and-payments',
          icon: CreditCard,
        },
      ],
    },
    {
      title: 'Reports & Settings',
      url: '',
      items: [
        {
          title: 'Reports',
          url: '/dashboard/reports',
          icon: FileText,
        },
        {
          title: 'Notifications',
          url: '/dashboard/notifications',
          icon: Bell,
        },
        {
          title: 'Settings',
          url: '/dashboard/settings',
          icon: Settings,
        },
      ],
    },
  ],
};

const FallbackIcon = ({ className }: { className?: string }) => (
  <div className={`w-4 h-4 ${className}`} />
);

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className='border-b'>
        <LogoWithName />
      </SidebarHeader>
      <SidebarContent>
        <div className='block lg:hidden mt-3'>
          <SearchForm />
        </div>
        {data.navMain.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const IconComponent = item.icon;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <Link
                          href={item.url}
                          className='flex items-center gap-2'
                        >
                          {IconComponent ? (
                            <IconComponent size={24} className='shrink-0' />
                          ) : (
                            <FallbackIcon />
                          )}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
