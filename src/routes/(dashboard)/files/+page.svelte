<script lang="ts">
  import { onMount } from 'svelte';
  import { Button } from '$lib/components/ui/button/index.js';
  import { Badge } from '$lib/components/ui/badge/index.js';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card/index.js';
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
  } from '$lib/components/ui/dropdown-menu/index.js';
  import { httpClient } from '$lib/api/index.js';
  import type { FileItem, FileStats } from '$lib/types/files.js';
  import {
    Search,
    Upload,
    MoreHorizontal,
    Eye,
    Download,
    Share2,
    Trash2,
    RefreshCw,
    File,
    Image,
    Video,
    Music,
    FileText,
    Archive,
    Grid,
    List,
    HardDrive,
    FolderOpen,
    Clock,
  } from 'lucide-svelte';

  // 状态
  let files = $state<FileItem[]>([]);
  let stats = $state<FileStats | null>(null);
  let loading = $state(true);
  let keyword = $state('');
  let typeFilter = $state<string>('all');
  let page = $state(1);
  let pageSize = $state(12);
  let total = $state(0);
  let totalPages = $state(0);
  let viewMode = $state<'grid' | 'list'>('grid');

  // 获取文件列表
  async function fetchFiles() {
    loading = true;
    try {
      const response = await httpClient.get<any>('/files', {
        page,
        pageSize,
        keyword: keyword || undefined,
        type: typeFilter === 'all' ? undefined : typeFilter,
      });
      files = response.data.list;
      total = response.data.total;
      totalPages = response.data.totalPages;
    } catch (error) {
      console.error('Failed to fetch files:', error);
    } finally {
      loading = false;
    }
  }

  // 获取文件统计
  async function fetchStats() {
    try {
      const response = await httpClient.get<FileStats>('/files/stats');
      stats = response.data;
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }

  // 删除文件
  async function deleteFile(fileId: string) {
    if (!confirm('确定要删除该文件吗？')) return;
    try {
      await httpClient.delete(`/files/${fileId}`);
      fetchFiles();
      fetchStats();
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
  }

  // 文件类型图标
  function getFileIcon(type: string) {
    switch (type) {
      case 'image':
        return Image;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      case 'document':
        return FileText;
      case 'archive':
        return Archive;
      default:
        return File;
    }
  }

  // 格式化文件大小
  function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  // 初始化
  onMount(() => {
    fetchFiles();
    fetchStats();
  });

  // 监听筛选变化
  $effect(() => {
    if (typeFilter) {
      page = 1;
      fetchFiles();
    }
  });
</script>

<svelte:head>
  <title>文件管理 - Admin Pro</title>
</svelte:head>

<div class="space-y-6">
  <!-- 页面标题 -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-2xl font-bold tracking-tight">文件管理</h1>
      <p class="text-muted-foreground">管理和组织您的文件</p>
    </div>
    <Button>
      <Upload class="mr-2 h-4 w-4" />
      上传文件
    </Button>
  </div>

  <!-- 统计卡片 -->
  {#if stats}
    <div class="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">总文件数</CardTitle>
          <FolderOpen class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.totalFiles}</div>
          <p class="text-xs text-muted-foreground">
            公开 {stats.publicFiles} / 私有 {stats.privateFiles}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">存储空间</CardTitle>
          <HardDrive class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{formatSize(stats.totalSize)}</div>
          <p class="text-xs text-muted-foreground">已使用空间</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">图片文件</CardTitle>
          <Image class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.byType.image?.count || 0}</div>
          <p class="text-xs text-muted-foreground">
            {formatSize(stats.byType.image?.size || 0)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle class="text-sm font-medium">最近上传</CardTitle>
          <Clock class="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div class="text-2xl font-bold">{stats.recentUploads}</div>
          <p class="text-xs text-muted-foreground">近7天</p>
        </CardContent>
      </Card>
    </div>
  {/if}

  <!-- 搜索和筛选 -->
  <Card>
    <CardContent class="pt-6">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="flex flex-1 items-center gap-2">
          <div class="relative flex-1 md:max-w-sm">
            <Search
              class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="搜索文件名..."
              bind:value={keyword}
              class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-9 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onkeydown={(e: KeyboardEvent) => e.key === 'Enter' && fetchFiles()}
            />
          </div>
          <select
            bind:value={typeFilter}
            class="flex h-10 w-[140px] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="all">全部类型</option>
            <option value="image">图片</option>
            <option value="video">视频</option>
            <option value="audio">音频</option>
            <option value="document">文档</option>
            <option value="archive">压缩包</option>
            <option value="other">其他</option>
          </select>
          <Button variant="outline" onclick={() => fetchFiles()}>
            <Search class="mr-2 h-4 w-4" />
            搜索
          </Button>
        </div>
        <div class="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onclick={() => (viewMode = 'grid')}
          >
            <Grid class="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onclick={() => (viewMode = 'list')}
          >
            <List class="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onclick={() => fetchFiles()}>
            <RefreshCw class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>

  <!-- 文件列表 -->
  <Card>
    <CardContent class="p-4">
      {#if loading}
        <div class="flex items-center justify-center py-12">
          <RefreshCw class="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      {:else if files.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <FolderOpen class="h-12 w-12 mb-4" />
          <p>暂无文件</p>
        </div>
      {:else if viewMode === 'grid'}
        <!-- 网格视图 -->
        <div class="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {#each files as file (file.id)}
            {@const FileIcon = getFileIcon(file.type)}
            <div
              class="group relative rounded-lg border bg-card p-4 hover:shadow-md transition-shadow"
            >
              <!-- 文件预览 -->
              <div
                class="aspect-square mb-3 flex items-center justify-center rounded-lg bg-muted/50"
              >
                {#if file.type === 'image' && file.thumbnailUrl}
                  <img
                    src={file.thumbnailUrl}
                    alt={file.originalName}
                    class="h-full w-full object-cover rounded-lg"
                  />
                {:else}
                  <FileIcon class="h-12 w-12 text-muted-foreground" />
                {/if}
              </div>

              <!-- 文件信息 -->
              <div class="space-y-1">
                <h4 class="font-medium text-sm truncate" title={file.originalName}>
                  {file.originalName}
                </h4>
                <div class="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{formatSize(file.size)}</span>
                  <Badge variant="outline" class="text-xs">
                    {file.extension.toUpperCase()}
                  </Badge>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div
                class="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="secondary" size="sm" class="h-8 w-8 p-0">
                      <MoreHorizontal class="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye class="mr-2 h-4 w-4" />
                      预览
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Download class="mr-2 h-4 w-4" />
                      下载
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 class="mr-2 h-4 w-4" />
                      分享
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="text-destructive" onclick={() => deleteFile(file.id)}>
                      <Trash2 class="mr-2 h-4 w-4" />
                      删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <!-- 公开标识 -->
              {#if file.isPublic}
                <div class="absolute top-2 left-2">
                  <Badge variant="secondary" class="text-xs">公开</Badge>
                </div>
              {/if}
            </div>
          {/each}
        </div>
      {:else}
        <!-- 列表视图 -->
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="border-b bg-muted/50">
              <tr>
                <th class="px-4 py-3 text-left text-sm font-medium">文件名</th>
                <th class="px-4 py-3 text-left text-sm font-medium">大小</th>
                <th class="px-4 py-3 text-left text-sm font-medium">类型</th>
                <th class="px-4 py-3 text-left text-sm font-medium">上传者</th>
                <th class="px-4 py-3 text-left text-sm font-medium">上传时间</th>
                <th class="px-4 py-3 text-right text-sm font-medium">操作</th>
              </tr>
            </thead>
            <tbody class="divide-y">
              {#each files as file (file.id)}
                {@const FileIcon = getFileIcon(file.type)}
                <tr class="hover:bg-muted/50">
                  <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                      <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        {#if file.type === 'image' && file.thumbnailUrl}
                          <img
                            src={file.thumbnailUrl}
                            alt={file.originalName}
                            class="h-full w-full object-cover rounded-lg"
                          />
                        {:else}
                          <FileIcon class="h-5 w-5 text-muted-foreground" />
                        {/if}
                      </div>
                      <div>
                        <div class="font-medium text-sm">{file.originalName}</div>
                        {#if file.isPublic}
                          <Badge variant="secondary" class="text-xs mt-1">公开</Badge>
                        {/if}
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-3 text-sm">{formatSize(file.size)}</td>
                  <td class="px-4 py-3">
                    <Badge variant="outline">{file.extension.toUpperCase()}</Badge>
                  </td>
                  <td class="px-4 py-3 text-sm">{file.uploaderName}</td>
                  <td class="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(file.createdAt).toLocaleDateString('zh-CN')}
                  </td>
                  <td class="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal class="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye class="mr-2 h-4 w-4" />
                          预览
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download class="mr-2 h-4 w-4" />
                          下载
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 class="mr-2 h-4 w-4" />
                          分享
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          class="text-destructive"
                          onclick={() => deleteFile(file.id)}
                        >
                          <Trash2 class="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}

      <!-- 分页 -->
      {#if files.length > 0}
        <div class="flex items-center justify-between border-t pt-4 mt-4">
          <div class="text-sm text-muted-foreground">
            共 {total} 个文件，第 {page}/{totalPages} 页
          </div>
          <div class="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onclick={() => {
                page--;
                fetchFiles();
              }}
            >
              上一页
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onclick={() => {
                page++;
                fetchFiles();
              }}
            >
              下一页
            </Button>
          </div>
        </div>
      {/if}
    </CardContent>
  </Card>
</div>
