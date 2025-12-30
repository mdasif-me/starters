/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
  code?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  status: number;
  message: string;
  code?: string;
  details?: any;
}

export interface RequestConfig {
  requiresAuth?: boolean;
  contentType?: string;
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

export interface CacheConfig {
  enabled?: boolean;
  ttl?: number; //INFO: time to live in milliseconds
  key?: string;
}
