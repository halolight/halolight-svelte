import { http, HttpResponse, delay } from 'msw';
import type { BatchFileOperation } from '$lib/types/files.js';
import { mockFiles, mockFolders, mockFileStats, mockFileShares } from '../data/files.js';

const API_BASE = '/api';

/**
 * 文件相关 API Mock handlers
 */
export const fileHandlers = [
  // 获取文件列表
  http.get(`${API_BASE}/files`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;
    const type = url.searchParams.get('type');
    const status = url.searchParams.get('status');
    const folderId = url.searchParams.get('folderId');
    const keyword = url.searchParams.get('keyword') || '';

    let filtered = mockFiles;

    // 类型筛选
    if (type) {
      filtered = filtered.filter((f) => f.type === type);
    }

    // 状态筛选
    if (status) {
      filtered = filtered.filter((f) => f.status === status);
    }

    // 文件夹筛选
    if (folderId) {
      filtered = filtered.filter((f) => f.folderId === folderId);
    }

    // 关键词搜索
    if (keyword) {
      filtered = filtered.filter(
        (f) =>
          f.originalName.includes(keyword) ||
          f.uploaderName.includes(keyword) ||
          (f.tags && f.tags.some((tag) => tag.includes(keyword)))
      );
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = filtered.slice(start, end);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),

  // 获取文件详情
  http.get(`${API_BASE}/files/:id`, async ({ params }) => {
    await delay(200);
    const { id } = params;
    const file = mockFiles.find((f) => f.id === id);

    if (!file) {
      return HttpResponse.json(
        {
          code: 404,
          message: '文件不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: file,
    });
  }),

  // 上传文件
  http.post(`${API_BASE}/files/upload`, async () => {
    await delay(1000);

    const newFile = {
      id: `file-${mockFiles.length + 1}`,
      name: `${Date.now()}-example.pdf`,
      originalName: 'example.pdf',
      path: '/uploads/document/example.pdf',
      url: 'https://example.com/files/document/example.pdf',
      size: 1024000,
      type: 'document' as const,
      mimeType: 'application/pdf',
      extension: 'pdf',
      status: 'ready' as const,
      uploaderId: 'current-user',
      uploaderName: '当前用户',
      isPublic: false,
      downloadCount: 0,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      code: 0,
      message: '上传成功',
      data: {
        file: newFile,
        uploadId: `upload-${Date.now()}`,
      },
    });
  }),

  // 更新文件信息
  http.put(`${API_BASE}/files/:id`, async ({ params, request }) => {
    await delay(300);
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    const file = mockFiles.find((f) => f.id === id);

    if (!file) {
      return HttpResponse.json(
        {
          code: 404,
          message: '文件不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    const updatedFile = {
      ...file,
      ...(body || {}),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      code: 0,
      message: '更新成功',
      data: updatedFile,
    });
  }),

  // 删除文件
  http.delete(`${API_BASE}/files/:id`, async ({ params }) => {
    await delay(300);
    const { id } = params;
    const file = mockFiles.find((f) => f.id === id);

    if (!file) {
      return HttpResponse.json(
        {
          code: 404,
          message: '文件不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: '删除成功',
      data: null,
    });
  }),

  // 批量操作文件
  http.post(`${API_BASE}/files/batch`, async ({ request }) => {
    await delay(500);
    const body = (await request.json()) as BatchFileOperation;
    const { fileIds, action } = body;

    return HttpResponse.json({
      code: 0,
      message: `批量${action}成功`,
      data: {
        successCount: fileIds.length,
        failedCount: 0,
      },
    });
  }),

  // 获取文件统计
  http.get(`${API_BASE}/files/stats`, async () => {
    await delay(200);
    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: mockFileStats,
    });
  }),

  // 获取文件夹列表
  http.get(`${API_BASE}/folders`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;

    const total = mockFolders.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = mockFolders.slice(start, end);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),

  // 创建文件夹
  http.post(`${API_BASE}/folders`, async ({ request }) => {
    await delay(300);
    const body = (await request.json()) as Record<string, unknown>;

    const newFolder = {
      id: `folder-${mockFolders.length + 1}`,
      ...(body || {}),
      fileCount: 0,
      folderCount: 0,
      totalSize: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      code: 0,
      message: '创建成功',
      data: newFolder,
    });
  }),

  // 获取文件分享列表
  http.get(`${API_BASE}/files/shares`, async ({ request }) => {
    await delay(300);
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page')) || 1;
    const pageSize = Number(url.searchParams.get('pageSize')) || 10;

    const total = mockFileShares.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = mockFileShares.slice(start, end);

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        list,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  }),

  // 创建文件分享
  http.post(`${API_BASE}/files/:id/share`, async ({ params, request }) => {
    await delay(300);
    const { id } = params;
    const body = (await request.json()) as Record<string, unknown>;
    const file = mockFiles.find((f) => f.id === id);

    if (!file) {
      return HttpResponse.json(
        {
          code: 404,
          message: '文件不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    const share = {
      id: `share-${mockFileShares.length + 1}`,
      fileId: file.id,
      file,
      shareUrl: `https://example.com/share/${mockFileShares.length + 1}`,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      ...(body || {}),
      downloadCount: 0,
      creatorId: 'current-user',
      creatorName: '当前用户',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json({
      code: 0,
      message: '分享成功',
      data: share,
    });
  }),

  // 下载文件
  http.get(`${API_BASE}/files/:id/download`, async ({ params }) => {
    await delay(500);
    const { id } = params;
    const file = mockFiles.find((f) => f.id === id);

    if (!file) {
      return HttpResponse.json(
        {
          code: 404,
          message: '文件不存在',
          data: null,
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      code: 0,
      message: 'success',
      data: {
        url: file.url,
        filename: file.originalName,
      },
    });
  }),
];
