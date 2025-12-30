import { tokenManager } from '@/lib/auth/core/token-manager';
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { apiClient } from './axios-client';

export class RequestInterceptor {
  static async onRequest(
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> {
    //NOTE: add auth token if required
    const requiresAuth = config.headers?.['requires-auth'] !== 'false';

    if (requiresAuth) {
      const token = await tokenManager.getAccessToken();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    //NOTE: add default headers
    config.headers = {
      'Content-Type': 'application/json',
      'X-Client': 'nextjs-web',
      'X-Client-Version': process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      ...config.headers,
    };

    //NOTE: remove custom headers
    delete config.headers?.['requires-auth'];

    return config;
  }

  static onRequestError(error: any): Promise<never> {
    return Promise.reject(error);
  }
}

export class ResponseInterceptor {
  private static isRefreshing = false;
  private static refreshSubscribers: ((token: string) => void)[] = [];

  static onResponse(response: AxiosResponse): AxiosResponse {
    // You can transform response data here
    return response;
  }

  static async onResponseError(error: AxiosError): Promise<any> {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (this.isRefreshing) {
        return new Promise((resolve, reject) => {
          this.refreshSubscribers.push((token: string) => {
            originalRequest.headers!.Authorization = `Bearer ${token}`;
            resolve(apiClient.axiosInstance(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      this.isRefreshing = true;

      try {
        // Try to refresh token
        const newToken = await this.refreshAccessToken();

        // Update token
        await tokenManager.updateAccessToken(newToken);

        // Update original request
        originalRequest.headers!.Authorization = `Bearer ${newToken}`;

        // Retry all queued requests
        this.refreshSubscribers.forEach((cb) => cb(newToken));
        this.refreshSubscribers = [];

        return apiClient.axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - clear tokens and redirect
        await tokenManager.clearTokens();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        this.isRefreshing = false;
      }
    }

    // Handle other errors
    const apiError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'An error occurred',
      code: error.response?.data?.code,
      details: error.response?.data?.details,
    };

    return Promise.reject(apiError);
  }

  private static async refreshAccessToken(): Promise<string> {
    const refreshToken = await tokenManager.getRefreshToken();

    const response = await apiClient.post<{ accessToken: string }>(
      '/auth/refresh',
      {
        refreshToken,
      }
    );

    return response.data.accessToken;
  }
}
