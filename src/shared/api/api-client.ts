import type { z } from 'zod';

//=====// Types and Configuration //=====//
export interface IApiConfig {
  baseUrl: string;
  timeout: number;
  defaultHeaders: Record<string, string>;
}

export interface IApiFetchOptions extends Omit<RequestInit, 'body'> {
  cache?: RequestCache | 'force-cache' | 'no-store';
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
  timeout?: number;
  auth?: boolean;
  validateResponse?: z.ZodTypeAny;
  body?: BodyInit | Record<string, unknown>;
}

//=====// Configuration //=====//
export const apiConfig: IApiConfig = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'Check your env',
  timeout: Number(process.env.API_TIMEOUT) || 10000,
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
};

//=====// Custom Error Class //=====//
export class IApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code: string,
    public details?: unknown,
    public url?: string,
    public method?: string,
    public response?: Response
  ) {
    super(message);
    this.name = 'IApiError';
    Object.setPrototypeOf(this, IApiError.prototype);
  }

  static async fromResponse(
    response: Response,
    url: string,
    method: string
  ): Promise<IApiError> {
    let errorData: { message?: string; code?: string; details?: unknown } = {};

    try {
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        errorData = await response.json();
      } else {
        const text = await response.text();
        errorData = { message: text || response.statusText };
      }
    } catch {
      errorData = { message: response.statusText };
    }

    return new IApiError(
      errorData.message || 'An error occurred',
      response.status,
      errorData.code || `HTTP_${response.status}`,
      errorData.details,
      url,
      method,
      response
    );
  }
}

//=====// Utility Functions //=====//
export function isApiError(error: unknown): error is IApiError {
  return error instanceof IApiError;
}

function isServer(): boolean {
  return typeof window === 'undefined';
}
//=====// Server-side Request Builder //=====//
async function buildServerRequest(
  url: string,
  options: IApiFetchOptions = {}
): Promise<RequestInit> {
  const headers = new Headers(options.headers);
  Object.entries(apiConfig.defaultHeaders).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  });

  try {
    const { cookies, headers: nextHeaders } = await import('next/headers');
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();
    if (allCookies.length > 0) {
      const cookieString = allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join('; ');
      headers.set('Cookie', cookieString);
    }

    // Forward authentication headers if present
    // NOTE: Future auth integration point - inject tokens here from server-side storage
    const headerStore = await nextHeaders();
    const authHeader = headerStore.get('authorization');
    if (authHeader && !headers.has('authorization')) {
      headers.set('Authorization', authHeader);
    }

    const apiKeyHeader = headerStore.get('x-api-key');
    if (apiKeyHeader && !headers.has('x-api-key')) {
      headers.set('X-API-Key', apiKeyHeader);
    }
  } catch (error) {
    console.warn('Unable to access Next.js headers/cookies:', error);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, validateResponse, ...requestOptions } = options;

  return {
    ...requestOptions,
    headers,
  };
}

//=====// Client-side Request Builder //=====//
function buildClientRequest(
  url: string,
  options: IApiFetchOptions = {}
): RequestInit {
  const headers = new Headers(options.headers);

  // Merge default headers
  Object.entries(apiConfig.defaultHeaders).forEach(([key, value]) => {
    if (!headers.has(key)) {
      headers.set(key, value);
    }
  });

  // NOTE: Future auth integration point - inject tokens here from memory/state
  // Example: const token = authStore.getToken();
  // if (token && options.auth !== false) {
  //   headers.set('Authorization', `Bearer ${token}`);
  // }

  // Exclude body from the returned options as it's handled separately
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, validateResponse, ...requestOptions } = options;

  return {
    ...requestOptions,
    headers,
    credentials: 'include',
  };
}

//=====// Timeout Handling with AbortController //=====//
function withTimeout(
  signal?: AbortSignal,
  timeout?: number
): { signal: AbortSignal; cleanup: () => void } {
  const effectiveTimeout = timeout ?? apiConfig.timeout;
  const controller = new AbortController();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', () => controller.abort());
    }
  }

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, effectiveTimeout);

  const cleanup = () => {
    clearTimeout(timeoutId);
  };

  return { signal: controller.signal, cleanup };
}

//=====// Core API Request Function //=====//
export async function apiRequest<TResponse = unknown>(
  endpoint: string,
  options: IApiFetchOptions = {}
): Promise<TResponse> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${apiConfig.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  let requestInit: RequestInit;
  if (isServer()) {
    requestInit = await buildServerRequest(url, options);
  } else {
    requestInit = buildClientRequest(url, options);
  }
  let body: BodyInit | undefined;
  if (options.body) {
    if (
      options.body instanceof FormData ||
      options.body instanceof URLSearchParams ||
      options.body instanceof Blob ||
      options.body instanceof ArrayBuffer ||
      typeof options.body === 'string'
    ) {
      body = options.body as BodyInit;
    } else {
      body = JSON.stringify(options.body);
    }
    if (options.body instanceof FormData) {
      const headers = new Headers(requestInit.headers);
      headers.delete('Content-Type');
      requestInit.headers = headers;
    }
  }

  requestInit.body = body;

  const { signal, cleanup } = withTimeout(
    options.signal as AbortSignal | undefined,
    options.timeout
  );
  requestInit.signal = signal;

  try {
    const response = await fetch(url, requestInit);
    if (!response.ok) {
      throw await IApiError.fromResponse(
        response,
        url,
        requestInit.method || 'GET'
      );
    }
    const contentType = response.headers.get('content-type');
    let data: unknown;

    if (contentType?.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    if (options.validateResponse) {
      data = options.validateResponse.parse(data);
    }

    return data as TResponse;
  } catch (error) {
    if (isApiError(error)) {
      throw error;
    }
    if (error instanceof Error && error.name === 'AbortError') {
      throw new IApiError(
        'Request timeout or cancelled',
        408,
        'REQUEST_TIMEOUT',
        undefined,
        url,
        requestInit.method || 'GET'
      );
    }
    throw new IApiError(
      error instanceof Error ? error.message : 'Unknown error',
      500,
      'NETWORK_ERROR',
      error,
      url,
      requestInit.method || 'GET'
    );
  } finally {
    cleanup();
  }
}

//=====// Request Builders //=====//
export async function apiGet<TResponse = unknown>(
  endpoint: string,
  options?: Omit<IApiFetchOptions, 'method' | 'body'>
): Promise<TResponse> {
  return apiRequest<TResponse>(endpoint, {
    ...options,
    method: 'GET',
  });
}

export async function apiPost<TResponse = unknown>(
  endpoint: string,
  body?: IApiFetchOptions['body'],
  options?: Omit<IApiFetchOptions, 'method' | 'body'>
): Promise<TResponse> {
  return apiRequest<TResponse>(endpoint, {
    ...options,
    method: 'POST',
    body,
  });
}

export async function apiPut<TResponse = unknown>(
  endpoint: string,
  body?: IApiFetchOptions['body'],
  options?: Omit<IApiFetchOptions, 'method' | 'body'>
): Promise<TResponse> {
  return apiRequest<TResponse>(endpoint, {
    ...options,
    method: 'PUT',
    body,
  });
}

export async function apiPatch<TResponse = unknown>(
  endpoint: string,
  body?: IApiFetchOptions['body'],
  options?: Omit<IApiFetchOptions, 'method' | 'body'>
): Promise<TResponse> {
  return apiRequest<TResponse>(endpoint, {
    ...options,
    method: 'PATCH',
    body,
  });
}

export async function apiDelete<TResponse = unknown>(
  endpoint: string,
  options?: Omit<IApiFetchOptions, 'method' | 'body'>
): Promise<TResponse> {
  return apiRequest<TResponse>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}
