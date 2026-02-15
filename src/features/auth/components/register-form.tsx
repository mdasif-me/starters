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
import type { RegisterCredentials } from '../types/types';

export function RegisterForm() {
  const { isLoading, errors, registerUser, clearErrors } = useAuth();
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (field: keyof RegisterCredentials, value: string) => {
    setCredentials({ ...credentials, [field]: value });
    clearErrors();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await registerUser(credentials);
  };

  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardHeader>
        <CardTitle>Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className='space-y-4'>
          {errors.general && (
            <div className='p-3 bg-destructive/10 border border-destructive rounded-md'>
              <p className='text-sm text-destructive'>{errors.general}</p>
            </div>
          )}

          <div>
            <label htmlFor='name' className='block text-sm font-medium mb-1'>
              Name
            </label>
            <Input
              id='name'
              type='text'
              value={credentials.name}
              onChange={(e) => handleChange('name', e.target.value)}
              aria-invalid={!!errors.name}
              autoComplete='name'
            />
            {errors.name && (
              <p className='text-sm text-destructive mt-1'>{errors.name}</p>
            )}
          </div>

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
              autoComplete='new-password'
            />
            {errors.password && (
              <p className='text-sm text-destructive mt-1'>{errors.password}</p>
            )}
          </div>

          <div>
            <label
              htmlFor='confirmPassword'
              className='block text-sm font-medium mb-1'
            >
              Confirm Password
            </label>
            <Input
              id='confirmPassword'
              type='password'
              value={credentials.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              aria-invalid={!!errors.confirmPassword}
              autoComplete='new-password'
            />
            {errors.confirmPassword && (
              <p className='text-sm text-destructive mt-1'>
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <Button type='submit' className='w-full' disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </Button>

          <p className='text-sm text-center text-muted-foreground'>
            Already have an account?{' '}
            <Link href='/login' className='text-primary hover:underline'>
              Login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
