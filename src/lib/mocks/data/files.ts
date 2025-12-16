import type { FileItem, Folder, FileStats, FileShare } from '$lib/types/files.js';

/**
 * 生成模拟文件数据
 */
export function generateFiles(count: number = 50): FileItem[] {
  const files: FileItem[] = [];
  const types = ['image', 'video', 'audio', 'document', 'archive', 'other'] as const;
  const statuses = ['ready', 'uploading', 'processing', 'failed'] as const;
  const extensions: Record<(typeof types)[number], string[]> = {
    image: ['jpg', 'png', 'gif', 'webp', 'svg'],
    video: ['mp4', 'avi', 'mov', 'mkv'],
    audio: ['mp3', 'wav', 'ogg', 'flac'],
    document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt'],
    archive: ['zip', 'rar', '7z', 'tar', 'gz'],
    other: ['json', 'xml', 'csv', 'log'],
  };

  const mimeTypes: Record<(typeof types)[number], string[]> = {
    image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
    video: ['video/mp4', 'video/x-msvideo', 'video/quicktime', 'video/x-matroska'],
    audio: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/flac'],
    document: ['application/pdf', 'application/msword', 'application/vnd.ms-excel', 'text/plain'],
    archive: ['application/zip', 'application/x-rar-compressed', 'application/x-7z-compressed'],
    other: ['application/json', 'application/xml', 'text/csv', 'text/plain'],
  };

  for (let i = 1; i <= count; i++) {
    const type = types[Math.floor(Math.random() * types.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const ext = extensions[type][Math.floor(Math.random() * extensions[type].length)];
    const mimeType = mimeTypes[type][Math.floor(Math.random() * mimeTypes[type].length)];
    const size = Math.floor(Math.random() * 10000000) + 1000;
    const originalName = `file-${i}.${ext}`;

    files.push({
      id: `file-${i}`,
      name: `${Date.now()}-${originalName}`,
      originalName,
      path: `/uploads/${type}/${originalName}`,
      url: `https://example.com/files/${type}/${originalName}`,
      thumbnailUrl: type === 'image' ? `https://picsum.photos/seed/${i}/200/200` : undefined,
      size,
      type,
      mimeType,
      extension: ext,
      status,
      uploaderId: `user-${Math.floor(Math.random() * 50) + 1}`,
      uploaderName: `用户${Math.floor(Math.random() * 50) + 1}`,
      folderId: Math.random() > 0.5 ? `folder-${Math.floor(Math.random() * 10) + 1}` : undefined,
      folderPath:
        Math.random() > 0.5
          ? `/我的文件夹/子文件夹${Math.floor(Math.random() * 5) + 1}`
          : undefined,
      tags:
        Math.random() > 0.7
          ? [`标签${Math.floor(Math.random() * 5) + 1}`, `标签${Math.floor(Math.random() * 5) + 6}`]
          : undefined,
      isPublic: Math.random() > 0.5,
      downloadCount: Math.floor(Math.random() * 100),
      viewCount: Math.floor(Math.random() * 500),
      shareUrl: Math.random() > 0.8 ? `https://example.com/share/${i}` : undefined,
      expiresAt:
        Math.random() > 0.9
          ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      metadata:
        type === 'image'
          ? {
              width: Math.floor(Math.random() * 2000) + 500,
              height: Math.floor(Math.random() * 2000) + 500,
              format: ext,
            }
          : type === 'video'
            ? {
                duration: Math.floor(Math.random() * 600),
                format: ext,
              }
            : undefined,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return files.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/**
 * 生成模拟文件夹数据
 */
export function generateFolders(count: number = 10): Folder[] {
  const folders: Folder[] = [];

  for (let i = 1; i <= count; i++) {
    const fileCount = Math.floor(Math.random() * 50);
    const folderCount = Math.floor(Math.random() * 5);
    const totalSize = Math.floor(Math.random() * 100000000) + 1000000;

    folders.push({
      id: `folder-${i}`,
      name: `文件夹${i}`,
      path: `/我的文件夹/文件夹${i}`,
      parentId: i > 5 ? `folder-${Math.floor(Math.random() * 5) + 1}` : undefined,
      parentPath: i > 5 ? `/我的文件夹/文件夹${Math.floor(Math.random() * 5) + 1}` : undefined,
      ownerId: `user-${Math.floor(Math.random() * 50) + 1}`,
      ownerName: `用户${Math.floor(Math.random() * 50) + 1}`,
      isPublic: Math.random() > 0.7,
      fileCount,
      folderCount,
      totalSize,
      description: `这是文件夹${i}的描述`,
      color: ['blue', 'green', 'red', 'yellow', 'purple'][Math.floor(Math.random() * 5)],
      icon: ['folder', 'folder-open', 'folder-lock'][Math.floor(Math.random() * 3)],
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return folders;
}

/**
 * 生成文件统计数据
 */
export function generateFileStats(files: FileItem[]): FileStats {
  const stats: FileStats = {
    totalFiles: files.length,
    totalSize: files.reduce((sum, f) => sum + f.size, 0),
    byType: {
      image: { count: 0, size: 0 },
      video: { count: 0, size: 0 },
      audio: { count: 0, size: 0 },
      document: { count: 0, size: 0 },
      archive: { count: 0, size: 0 },
      other: { count: 0, size: 0 },
    },
    recentUploads: files.filter(
      (f) => new Date(f.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length,
    publicFiles: files.filter((f) => f.isPublic).length,
    privateFiles: files.filter((f) => !f.isPublic).length,
  };

  files.forEach((file) => {
    stats.byType[file.type].count++;
    stats.byType[file.type].size += file.size;
  });

  return stats;
}

/**
 * 生成文件分享数据
 */
export function generateFileShares(count: number = 20): FileShare[] {
  const shares: FileShare[] = [];
  const files = generateFiles(count);

  for (let i = 1; i <= count; i++) {
    const file = files[i - 1];
    const maxDownloads = Math.random() > 0.7 ? Math.floor(Math.random() * 100) + 10 : undefined;
    const downloadCount = maxDownloads
      ? Math.floor(Math.random() * maxDownloads)
      : Math.floor(Math.random() * 50);

    shares.push({
      id: `share-${i}`,
      fileId: file.id,
      file,
      shareUrl: `https://example.com/share/${i}`,
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      password: Math.random() > 0.7 ? Math.random().toString(36).substring(2, 8) : undefined,
      expiresAt:
        Math.random() > 0.5
          ? new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
          : undefined,
      maxDownloads,
      downloadCount,
      creatorId: file.uploaderId,
      creatorName: file.uploaderName,
      isActive: Math.random() > 0.2,
      createdAt: file.createdAt,
      updatedAt: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
    });
  }

  return shares;
}

/**
 * 全局文件数据
 */
export const mockFiles = generateFiles(50);
export const mockFolders = generateFolders(10);
export const mockFileStats = generateFileStats(mockFiles);
export const mockFileShares = generateFileShares(20);
