import type { ApiResponse } from '$lib/types/index.js';
import { API_BASE_URL, API_TIMEOUT, HTTP_STATUS } from '$lib/utils/constants.js';

/**
 * API 请求配置
 */
export interface RequestConfig extends RequestInit {
  timeout?: number;
  token?: string;
}

/**
 * API 错误类
 */
export class ApiError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * HTTP 客户端
 */
class HttpClient {
  private baseURL: string;
  private defaultTimeout: number;

  constructor(baseURL: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseURL = baseURL;
    this.defaultTimeout = timeout;
  }

  /**
   * 设置认证令牌
   */
  private getAuthHeaders(token?: string): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const authToken = token || this.getStoredToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    return headers;
  }

  /**
   * 从存储获取令牌
   */
  private getStoredToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  }

  /**
   * 处理响应
   */
  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get('content-type');
    const isJson = contentType?.includes('application/json');

    if (!isJson) {
      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Invalid response format', null);
    }

    const data: ApiResponse<T> = await response.json();

    // 检查业务状态码
    if (data.code !== 0) {
      throw new ApiError(data.code, data.message, data.data);
    }

    return data;
  }

  /**
   * 发起请求
   */
  private async request<T>(url: string, config: RequestConfig = {}): Promise<ApiResponse<T>> {
    const { timeout = this.defaultTimeout, token, ...init } = config;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        ...init,
        headers: {
          ...this.getAuthHeaders(token),
          ...init.headers,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // HTTP 状态码错误处理
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          response.status,
          errorData.message || response.statusText,
          errorData.data
        );
      }

      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new ApiError(HTTP_STATUS.GATEWAY_TIMEOUT, 'Request timeout', null);
      }

      throw new ApiError(HTTP_STATUS.INTERNAL_SERVER_ERROR, 'Network error', error);
    }
  }

  /**
   * GET 请求
   */
  async get<T>(
    url: string,
    params?: Record<string, any>,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params).toString()}` : '';
    return this.request<T>(`${url}${queryString}`, {
      ...config,
      method: 'GET',
    });
  }

  /**
   * POST 请求
   */
  async post<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT 请求
   */
  async put<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE 请求
   */
  async delete<T>(url: string, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'DELETE',
    });
  }

  /**
   * PATCH 请求
   */
  async patch<T>(url: string, data?: any, config?: RequestConfig): Promise<ApiResponse<T>> {
    return this.request<T>(url, {
      ...config,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

/**
 * 默认 HTTP 客户端实例
 */
export const httpClient = new HttpClient();

/**
 * 导出创建客户端的工厂函数
 */
export function createHttpClient(baseURL?: string, timeout?: number): HttpClient {
  return new HttpClient(baseURL, timeout);
}
