'use client';
import { useAuth } from '@/lib/auth/hooks/use-auth';
import Image from 'next/image';
import user_icon from '../../../../public/img/user.svg';

export default function User() {
  const { user } = useAuth();

  return (
    <div className='flex items-center gap-3'>
      <article>
        <h1 className='text-sm text-[#0F172B] text-end'>
          {user?.name ?? 'ZMC User'}
        </h1>
        <p className='text-[#62748E] text-xs text-end'>
          {user?.email ?? 'user@zmc.com'}
        </p>
      </article>
      <Image src={user_icon} alt='User' />
    </div>
  );
}
