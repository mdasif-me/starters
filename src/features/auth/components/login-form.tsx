'use client';

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
} from '@/shared/ui';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import type { LoginCredentials } from '../types/types';

export function LoginForm() {
  const { isLoading, errors, loginUser, clearErrors } = useAuth();
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: '',
  });

  const handleChange = (field: keyof LoginCredentials, value: string) => {
    setCredentials({ ...credentials, [field]: value });
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginUser(credentials);
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Login to Cotap</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {errors.general && (
            <div className='p-3 bg-destructive/10 border border-destructive rounded-md'>
              <p className='text-sm text-destructive'>{errors.general}</p>
            </div>
          )}

          <div>
            <label htmlFor='email' className='block text-sm font-medium mb-1'>
              Email
            </label>
            <Input
              id='email'
              type='email'
              value={credentials.email}
              onChange={(e) => handleChange('email', e.target.value)}
              aria-invalid={!!errors.email}
              autoComplete='email'
            />
            {errors.email && (
              <p className='text-sm text-destructive mt-1'>{errors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium mb-1'
            >
              Password
            </label>
            <Input
              id='password'
              type='password'
              value={credentials.password}
              onChange={(e) => handleChange('password', e.target.value)}
              aria-invalid={!!errors.password}
              autoComplete='current-password'
            />
            {errors.password && (
              <p className='text-sm text-destructive mt-1'>{errors.password}</p>
            )}
          </div>

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          <p className='text-sm text-center text-muted-foreground'>
            Don&#39;t have an account?{' '}
            <Link href='/register' className='text-primary hover:underline'>
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
