/* eslint-disable @typescript-eslint/no-explicit-any */
import { jwtDecode } from 'jwt-decode';
import { NextResponse, type NextRequest } from 'next/server';
import { ROLES } from '../constants/roles';
import {
  ADMIN_ROUTES,
  PROTECTED_ROUTES,
  PUBLIC_ROUTES,
} from '../constants/routes';

export class AuthMiddleware {
  static async handle(request: NextRequest): Promise<NextResponse> {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('access_token')?.value;

    // 1. Check public routes
    if (this.isPublicRoute(pathname)) {
      return NextResponse.next();
    }

    // 2. Check if token exists
    if (!token) {
      return this.redirectToLogin(request, pathname);
    }

    try {
      const decoded = jwtDecode<{ role: string; permissions: string[] }>(token);

      // 3. Check protected routes
      if (this.isProtectedRoute(pathname)) {
        return this.handleProtectedRoute(request, decoded);
      }

      // 4. Check admin routes
      if (this.isAdminRoute(pathname)) {
        return this.handleAdminRoute(request, decoded);
      }

      // 5. Add user info to headers
      return this.addUserHeaders(request, decoded);
    } catch (error) {
      console.error('Middleware error:', error);
      return this.clearAuthAndRedirect(request);
    }
  }

  private static isPublicRoute(pathname: string): boolean {
    return PUBLIC_ROUTES.some((route) => this.matchRoute(pathname, route));
  }

  private static isProtectedRoute(pathname: string): boolean {
    return PROTECTED_ROUTES.some((route) => this.matchRoute(pathname, route));
  }

  private static isAdminRoute(pathname: string): boolean {
    return ADMIN_ROUTES.some((route) => this.matchRoute(pathname, route));
  }

  private static matchRoute(pathname: string, pattern: string): boolean {
    if (pattern.includes(':')) {
      const regex = new RegExp(`^${pattern.replace(/:[^/]+/g, '([^/]+)')}$`);
      return regex.test(pathname);
    }
    return pathname.startsWith(pattern);
  }

  private static redirectToLogin(
    request: NextRequest,
    fromPath: string
  ): NextResponse {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', fromPath);
    return NextResponse.redirect(loginUrl);
  }

  private static handleProtectedRoute(
    request: NextRequest,
    user: any
  ): NextResponse {
    const headers = new Headers(request.headers);
    headers.set('x-user-id', user.sub || '');
    headers.set('x-user-role', user.role || '');

    return NextResponse.next({
      request: { headers },
    });
  }

  private static handleAdminRoute(
    request: NextRequest,
    user: any
  ): NextResponse {
    if (![ROLES.ADMIN, ROLES.SUPER_ADMIN].includes(user.role)) {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }

    const headers = new Headers(request.headers);
    headers.set('x-user-id', user.sub || '');
    headers.set('x-user-role', user.role || '');
    headers.set('x-user-permissions', user.permissions?.join(',') || '');

    return NextResponse.next({
      request: { headers },
    });
  }

  private static addUserHeaders(request: NextRequest, user: any): NextResponse {
    const headers = new Headers(request.headers);
    headers.set('x-user-id', user.sub || '');
    headers.set('x-user-role', user.role || '');

    if (user.permissions) {
      headers.set('x-user-permissions', user.permissions.join(','));
    }

    return NextResponse.next({
      request: { headers },
    });
  }

  private static clearAuthAndRedirect(request: NextRequest): NextResponse {
    const response = NextResponse.redirect(new URL('/login', request.url));

    // Clear auth cookies
    ['access_token', 'refresh_token'].forEach((cookie) => {
      response.cookies.delete(cookie);
    });

    return response;
  }
}
