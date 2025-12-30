/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CacheManager } from '../utils/cache-manager';
import { RequestInterceptor, ResponseInterceptor } from './interceptors';
import { ApiResponse } from './types';

export class AxiosClient {
  private static instance: AxiosClient;
  public axiosInstance: AxiosInstance;
  private cacheManager: CacheManager;

  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
      timeout: 30000,
      withCredentials: true,
    });

    this.cacheManager = new CacheManager();
    this.setupInterceptors();
  }

  static getInstance(): AxiosClient {
    if (!AxiosClient.instance) {
      AxiosClient.instance = new AxiosClient();
    }
    return AxiosClient.instance;
  }

  private setupInterceptors(): void {
    // request interceptors
    this.axiosInstance.interceptors.request.use(
      RequestInterceptor.onRequest,
      RequestInterceptor.onRequestError
    );

    // response interceptors
    this.axiosInstance.interceptors.response.use(
      ResponseInterceptor.onResponse,
      ResponseInterceptor.onResponseError
    );
  }

  async get<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.post<ApiResponse<T>>(
      url,
      data,
      config
    );
    return response.data;
  }

  async put<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.put<ApiResponse<T>>(
      url,
      data,
      config
    );
    return response.data;
  }

  async delete<T = any>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.delete<ApiResponse<T>>(
      url,
      config
    );
    return response.data;
  }

  async patch<T = any>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.axiosInstance.patch<ApiResponse<T>>(
      url,
      data,
      config
    );
    return response.data;
  }

  // batch requests
  async all<T extends any[]>(
    requests: Promise<any>[]
  ): Promise<AxiosResponse<T>> {
    return axios.all(requests) as unknown as Promise<AxiosResponse<T>>;
  }

  // clear cache
  clearCache(url?: string): void {
    if (url) {
      this.cacheManager.clearByUrl(url);
    } else {
      this.cacheManager.clearAll();
    }
  }
}

export const apiClient = AxiosClient.getInstance();
