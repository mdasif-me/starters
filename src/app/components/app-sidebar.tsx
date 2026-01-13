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
import Logo from './logo';

const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  navMain: [
    {
      title: 'Starting',
      url: '',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Students',
          url: '/students',
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
          url: '/classes-and-batches',
          isActive: true,
          icon: BookOpen,
        },
        {
          title: 'Attendance',
          url: '/attendance',
          icon: ClipboardCheck,
        },
        {
          title: 'Marks & Grades',
          url: '/marks-and-grades',
          icon: Award,
        },
        {
          title: 'Fees & Payments',
          url: '/fees-and-payments',
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
          url: '/reports',
          icon: FileText,
        },
        {
          title: 'Notifications',
          url: '/notifications',
          icon: Bell,
        },
        {
          title: 'Settings',
          url: '/settings',
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
        <Logo />
      </SidebarHeader>
      <SidebarContent>
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
                        <a href={item.url} className='flex items-center gap-2'>
                          {IconComponent ? (
                            <IconComponent size={24} className='shrink-0' />
                          ) : (
                            <FallbackIcon />
                          )}
                          <span>{item.title}</span>
                        </a>
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
