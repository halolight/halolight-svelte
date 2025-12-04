import type { BaseEntity, PaginatedResponse } from './index.js';

/**
 * 文件类型
 */
export type FileType = 'image' | 'video' | 'audio' | 'document' | 'archive' | 'other';

/**
 * 文件状态
 */
export type FileStatus = 'uploading' | 'processing' | 'ready' | 'failed' | 'deleted';

/**
 * 文件信息
 */
export interface FileItem extends BaseEntity {
  name: string;
  originalName: string;
  path: string;
  url: string;
  thumbnailUrl?: string;
  size: number;
  type: FileType;
  mimeType: string;
  extension: string;
  status: FileStatus;
  uploaderId: string;
  uploaderName: string;
  folderId?: string;
  folderPath?: string;
  tags?: string[];
  isPublic: boolean;
  downloadCount: number;
  viewCount: number;
  shareUrl?: string;
  expiresAt?: string;
  metadata?: {
    width?: number;
    height?: number;
    duration?: number;
    format?: string;
    [key: string]: any;
  };
}

/**
 * 文件夹信息
 */
export interface Folder extends BaseEntity {
  name: string;
  path: string;
  parentId?: string;
  parentPath?: string;
  ownerId: string;
  ownerName: string;
  isPublic: boolean;
  fileCount: number;
  folderCount: number;
  totalSize: number;
  description?: string;
  color?: string;
  icon?: string;
}

/**
 * 文件列表查询参数
 */
export interface FileListQuery {
  page?: number;
  pageSize?: number;
  folderId?: string;
  type?: FileType;
  status?: FileStatus;
  keyword?: string;
  uploaderId?: string;
  tags?: string[];
  startDate?: string;
  endDate?: string;
  sortBy?: 'name' | 'size' | 'createdAt' | 'downloadCount';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 文件列表响应
 */
export type FileListResponse = PaginatedResponse<FileItem>;

/**
 * 文件夹列表响应
 */
export type FolderListResponse = PaginatedResponse<Folder>;

/**
 * 文件上传参数
 */
export interface FileUploadDto {
  file: File;
  folderId?: string;
  isPublic?: boolean;
  tags?: string[];
  expiresAt?: string;
  onProgress?: (progress: number) => void;
}

/**
 * 文件上传响应
 */
export interface FileUploadResponse {
  file: FileItem;
  uploadId: string;
}

/**
 * 批量文件操作
 */
export interface BatchFileOperation {
  fileIds: string[];
  action: 'move' | 'copy' | 'delete' | 'addTags' | 'removeTags' | 'setPublic' | 'setPrivate';
  targetFolderId?: string;
  tags?: string[];
}

/**
 * 文件统计
 */
export interface FileStats {
  totalFiles: number;
  totalSize: number;
  byType: Record<FileType, { count: number; size: number }>;
  recentUploads: number;
  publicFiles: number;
  privateFiles: number;
}

/**
 * 文件分享设置
 */
export interface FileShareSettings {
  fileId: string;
  isPublic: boolean;
  password?: string;
  expiresAt?: string;
  maxDownloads?: number;
  allowedUserIds?: string[];
}

/**
 * 文件分享信息
 */
export interface FileShare extends BaseEntity {
  fileId: string;
  file: FileItem;
  shareUrl: string;
  code: string;
  password?: string;
  expiresAt?: string;
  maxDownloads?: number;
  downloadCount: number;
  creatorId: string;
  creatorName: string;
  isActive: boolean;
}
