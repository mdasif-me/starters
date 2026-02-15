'use client';

import { useLocalStorage } from '@/shared/hooks';
import { STORAGE_KEYS } from '@/shared/lib';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import * as authApi from '../api/api';
import { validateLoginForm, validateRegisterForm } from '../schema';
import type {
  AuthFormErrors,
  LoginCredentials,
  RegisterCredentials,
  Session,
} from '../types/types';

export function useAuth() {
  const router = useRouter();
  const [session, setSession] = useLocalStorage<Session | null>(
    STORAGE_KEYS.AUTH_TOKEN,
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<AuthFormErrors>({});

  const user = session?.user || null;
  const isAuthenticated = !!session;

  /**
   * Login user
   */
  const loginUser = useCallback(
    async (credentials: LoginCredentials): Promise<boolean> => {
      const validationErrors = validateLoginForm(credentials);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return false;
      }

      setIsLoading(true);
      setErrors({});

      try {
        const newSession = await authApi.login(credentials);
        setSession(newSession);
        router.push('/');
        return true;
      } catch (err) {
        setErrors({
          general: err instanceof Error ? err.message : 'Failed to login',
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [router, setSession]
  );

  /**
   * Register new user
   */
  const registerUser = useCallback(
    async (credentials: RegisterCredentials): Promise<boolean> => {
      const validationErrors = validateRegisterForm(credentials);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return false;
      }

      setIsLoading(true);
      setErrors({});

      try {
        const newSession = await authApi.register(credentials);
        setSession(newSession);
        router.push('/');
        return true;
      } catch (err) {
        setErrors({
          general: err instanceof Error ? err.message : 'Failed to register',
        });
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [router, setSession]
  );

  /**
   * Logout user
   */
  const logoutUser = useCallback(async () => {
    setIsLoading(true);

    try {
      await authApi.logout();
      setSession(null);
      router.push('/login');
    } catch (err) {
      console.error('Logout failed:', err);
      // Still clear session on error
      setSession(null);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  }, [router, setSession]);

  /**
   * Clear any errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    errors,
    loginUser,
    registerUser,
    logoutUser,
    clearErrors,
  };
}
