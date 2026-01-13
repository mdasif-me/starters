import { AuthProvider } from '@/app/providers/auth-provider';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import React from 'react';
import { ErrorBoundary } from '../components/shared/error-boundary';

async function getCookieData() {
  const cookieStore = await cookies();
  const cookieData = cookieStore.getAll();
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve(cookieData);
    }, 1000)
  );
}

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const user = await getCookieData();

  if (!user) {
    redirect('/login');
  }

  return (
    <ErrorBoundary>
      <AuthProvider initialUser={user}>
        <div className='min-h-screen container mx-auto h-full'>
          <main>{children}</main>
          <footer className='border-t border-gray-200 mt-8 py-6'>
            <div className='container mx-auto px-4 text-center text-gray-600'>
              <p>
                © {new Date().getFullYear()} EduCenter. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
}
