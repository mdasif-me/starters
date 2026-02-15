import { apiGet, apiPost } from '@/shared/api/api-client';
import type {
  LoginCredentials,
  RegisterCredentials,
  Session,
} from '../types/types';

/**
 * Login with email and password
 */
export async function login(credentials: LoginCredentials): Promise<Session> {
  return apiPost<Session>(
    '/api/auth/login',
    credentials as unknown as Record<string, unknown>
  );
}

/**
 * Register a new user
 */
export async function register(
  credentials: RegisterCredentials
): Promise<Session> {
  return apiPost<Session>(
    '/api/auth/register',
    credentials as unknown as Record<string, unknown>
  );
}

/**
 * Logout current user
 */
export async function logout(): Promise<void> {
  return apiPost<void>('/api/auth/logout', {});
}

/**
 * Get current user session
 */
export async function getSession(): Promise<Session | null> {
  try {
    return await apiGet<Session>('/api/auth/session');
  } catch {
    return null;
  }
}

/**
 * Refresh authentication token
 */
export async function refreshToken(): Promise<Session> {
  return apiPost<Session>('/api/auth/refresh', {});
}

/**
 * Request password reset
 */
export async function requestPasswordReset(email: string): Promise<void> {
  return apiPost<void>('/api/auth/password-reset/request', { email });
}

/**
 * Reset password with token
 */
export async function resetPassword(
  token: string,
  newPassword: string
): Promise<void> {
  return apiPost<void>('/api/auth/password-reset/confirm', {
    token,
    newPassword,
  });
}
