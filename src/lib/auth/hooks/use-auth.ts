import { authApi } from '@/lib/api/endpoints';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { tokenManager, type IDecodedToken } from '../core/token-manager';

interface IUseAuthReturn {
  user: IDecodedToken | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
}

export function useAuth(): IUseAuthReturn {
  const router = useRouter();
  const [user, setUser] = useState<IDecodedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      const currentUser = await tokenManager.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Auth initialization failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        const response = await authApi.login({ email, password });

        await tokenManager.setTokens({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          expiresAt: Date.now() + response.expiresIn * 1000,
        });

        const userData = tokenManager.decodeToken(response.accessToken);
        setUser(userData);

        // redirect based on role or return URL
        const searchParams = new URLSearchParams(window.location.search);
        const redirectTo =
          searchParams.get('redirect') || getDefaultRoute(userData?.role);

        router.push(redirectTo);
        router.refresh(); // refresh server components
      } catch (error) {
        console.error('Login failed:', error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await tokenManager.clearTokens();
      setUser(null);

      // clear any cached data
      if (typeof window !== 'undefined') {
        localStorage.clear();
        sessionStorage.clear();
      }

      router.push('/login');
      router.refresh();
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await tokenManager.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('User refresh failed:', error);
      setUser(null);
    }
  }, []);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      if (!user?.permissions) return false;
      return user.permissions.includes(permission);
    },
    [user]
  );

  const hasRole = useCallback(
    (role: string): boolean => {
      return user?.role === role;
    },
    [user]
  );

  const hasAnyPermission = useCallback(
    (permissions: string[]): boolean => {
      if (!user?.permissions) return false;
      return permissions.some((permission) =>
        user.permissions.includes(permission)
      );
    },
    [user]
  );

  const hasAllPermissions = useCallback(
    (permissions: string[]): boolean => {
      if (!user?.permissions) return false;
      return permissions.every((permission) =>
        user.permissions.includes(permission)
      );
    },
    [user]
  );

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
  };
}

function getDefaultRoute(role?: string): string {
  switch (role) {
    case 'super_admin':
    case 'admin':
      return '/admin/dashboard';
    case 'manager':
      return '/manager/dashboard';
    default:
      return '/dashboard';
  }
}
