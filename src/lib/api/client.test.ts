import { describe, it, expect, vi, beforeEach } from 'vitest';
import { httpClient, createHttpClient, ApiError } from './client';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('httpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  });

  describe('GET 请求', () => {
    it('发送 GET 请求', async () => {
      const responseData = { id: 1, name: 'Test' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ code: 0, data: responseData, message: 'success' }),
      });

      const result = await httpClient.get('/users/1');
      expect(result.data).toEqual(responseData);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('发送带参数的 GET 请求', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ code: 0, data: [], message: 'success' }),
      });

      await httpClient.get('/users', { page: 1, pageSize: 10 });
      expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('page=1'), expect.any(Object));
    });
  });

  describe('POST 请求', () => {
    it('发送 POST 请求', async () => {
      const requestData = { name: 'New User' };
      const responseData = { id: 1, name: 'New User' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ code: 0, data: responseData, message: 'success' }),
      });

      const result = await httpClient.post('/users', requestData);
      expect(result.data).toEqual(responseData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      );
    });
  });

  describe('PUT 请求', () => {
    it('发送 PUT 请求', async () => {
      const requestData = { name: 'Updated User' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ code: 0, data: requestData, message: 'success' }),
      });

      const result = await httpClient.put('/users/1', requestData);
      expect(result.data).toEqual(requestData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PUT',
        })
      );
    });
  });

  describe('DELETE 请求', () => {
    it('发送 DELETE 请求', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ code: 0, data: null, message: 'success' }),
      });

      const result = await httpClient.delete('/users/1');
      expect(result.data).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'DELETE',
        })
      );
    });
  });

  describe('PATCH 请求', () => {
    it('发送 PATCH 请求', async () => {
      const requestData = { status: 'active' };
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ code: 0, data: requestData, message: 'success' }),
      });

      const result = await httpClient.patch('/users/1', requestData);
      expect(result.data).toEqual(requestData);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PATCH',
        })
      );
    });
  });

  describe('错误处理', () => {
    it('处理 HTTP 错误', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ code: 404, message: 'User not found' }),
      });

      await expect(httpClient.get('/users/999')).rejects.toThrow(ApiError);
    });

    it('处理网络错误', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(httpClient.get('/users')).rejects.toThrow();
    });

    it('处理业务错误', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: () => Promise.resolve({ code: 400, message: 'Invalid request', data: null }),
      });

      await expect(httpClient.get('/users')).rejects.toThrow(ApiError);
    });

    it('处理非 JSON 响应', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        headers: new Headers({ 'content-type': 'text/html' }),
        json: () => Promise.resolve({}),
      });

      await expect(httpClient.get('/users')).rejects.toThrow('Invalid response format');
    });
  });
});

describe('createHttpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
  });

  it('创建自定义客户端实例', async () => {
    const customClient = createHttpClient('https://custom.api.com', 5000);
    expect(customClient).toBeDefined();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: () => Promise.resolve({ code: 0, data: {}, message: 'success' }),
    });

    await customClient.get('/test');
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('https://custom.api.com/test'),
      expect.any(Object)
    );
  });
});

describe('ApiError', () => {
  it('创建 API 错误实例', () => {
    const error = new ApiError(400, 'Bad Request', { field: 'invalid' });
    expect(error.code).toBe(400);
    expect(error.message).toBe('Bad Request');
    expect(error.data).toEqual({ field: 'invalid' });
    expect(error.name).toBe('ApiError');
  });
});
