import { AppSidebar } from '@/app/components/shared/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/app/components/shared/ui/breadcrumb';
import { Separator } from '@/app/components/shared/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/app/components/shared/ui/sidebar';
import { SearchForm } from '../../components/shared/search-form';
import User from '../../components/shared/user';

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className='flex w-full items-center justify-between border-b px-4'>
          <header className='flex h-16 shrink-0 items-center gap-2'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='#'>Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className='lg:block hidden'>
              <Separator
                orientation='vertical'
                className='mr-2 data-[orientation=vertical]:h-4'
              />
            </div>
            <div className='lg:block hidden'>
              <SearchForm />
            </div>
          </header>
          <User />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
