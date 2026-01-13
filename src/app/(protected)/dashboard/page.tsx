import { AppSidebar } from '@/app/components/app-sidebar';
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
import Image from 'next/image';
import user from '../../../../public/img/user.svg';
import { SearchForm } from '../../components/search-form';

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
          <div className='flex items-center gap-3'>
            <article>
              <h1 className='text-sm text-[#0F172B] text-end'>Admin User</h1>
              <p className='text-[#62748E] text-xs text-end'>
                admin@educenter.com
              </p>
            </article>
            <Image src={user} alt='User' />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
