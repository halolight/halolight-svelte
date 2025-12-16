<script lang="ts">
  import { SvelteSet } from 'svelte/reactivity';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Separator } from '$lib/components/ui/separator';
  import * as Dialog from '$lib/components/ui/dialog';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import {
    Clock,
    Download,
    Eye,
    File,
    FileCode,
    FileImage,
    FileSpreadsheet,
    FileText,
    FolderOpen,
    Grid,
    List,
    Plus,
    Search,
    Share2,
    Star,
    StarOff,
    Tag,
    Trash2,
    User,
    Users,
    X,
  } from 'lucide-svelte';

  // 文件夹列表
  const folders = [
    { name: '全部文档', icon: FolderOpen },
    { name: '项目文档', icon: FileText },
    { name: '设计资源', icon: FileImage },
    { name: '技术文档', icon: FileCode },
    { name: '报表', icon: FileSpreadsheet },
    { name: '会议记录', icon: File },
  ];

  const typeIcons: Record<string, typeof File> = {
    pdf: FileText,
    doc: FileText,
    image: FileImage,
    spreadsheet: FileSpreadsheet,
    code: FileCode,
    other: File,
  };

  const typeColors: Record<string, string> = {
    pdf: 'text-red-500',
    doc: 'text-blue-500',
    image: 'text-green-500',
    spreadsheet: 'text-emerald-500',
    code: 'text-purple-500',
    other: 'text-gray-500',
  };

  // 模拟文档数据
  const documents = [
    {
      id: '1',
      name: '产品需求文档 v2.0.pdf',
      type: 'pdf',
      size: 2456000,
      folder: '项目文档',
      views: 128,
      shared: true,
      createdAt: '2024-11-20T10:30:00Z',
      updatedAt: '2024-11-28T14:20:00Z',
      author: { name: '张三', avatar: '' },
      collaborators: [
        { id: '1', name: '李四', avatar: '' },
        { id: '2', name: '王五', avatar: '' },
      ],
      tags: ['产品', '需求', 'v2.0'],
    },
    {
      id: '2',
      name: 'UI设计稿-首页.sketch',
      type: 'image',
      size: 15680000,
      folder: '设计资源',
      views: 256,
      shared: false,
      createdAt: '2024-11-15T09:00:00Z',
      updatedAt: '2024-11-27T16:45:00Z',
      author: { name: '设计师小王', avatar: '' },
      tags: ['设计', 'UI', '首页'],
    },
    {
      id: '3',
      name: 'API接口文档.md',
      type: 'code',
      size: 128000,
      folder: '技术文档',
      views: 512,
      shared: true,
      createdAt: '2024-11-10T08:30:00Z',
      updatedAt: '2024-11-29T10:00:00Z',
      author: { name: '后端开发', avatar: '' },
      tags: ['API', '接口', '文档'],
    },
    {
      id: '4',
      name: '月度销售报表.xlsx',
      type: 'spreadsheet',
      size: 856000,
      folder: '报表',
      views: 89,
      shared: false,
      createdAt: '2024-11-25T14:00:00Z',
      updatedAt: '2024-11-30T09:30:00Z',
      author: { name: '财务小李', avatar: '' },
      tags: ['报表', '销售', '月度'],
    },
    {
      id: '5',
      name: '周会会议记录-第48周.docx',
      type: 'doc',
      size: 256000,
      folder: '会议记录',
      views: 45,
      shared: true,
      createdAt: '2024-11-29T15:00:00Z',
      updatedAt: '2024-11-29T17:00:00Z',
      author: { name: '项目经理', avatar: '' },
      tags: ['会议', '周会', '记录'],
    },
  ];

  let searchQuery = $state('');
  let selectedFolder = $state('全部文档');
  let viewMode = $state<'grid' | 'list'>('list');
  let isUploadDialogOpen = $state(false);
  let starred = new SvelteSet<string>();
  let selectedDocument = $state<(typeof documents)[0] | null>(null);

  const filteredDocuments = $derived(
    documents.filter((doc) => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFolder = selectedFolder === '全部文档' || doc.folder === selectedFolder;
      return matchesSearch && matchesFolder;
    })
  );

  const folderCounts = $derived(() => {
    const counts: Record<string, number> = { 全部文档: documents.length };
    documents.forEach((doc) => {
      counts[doc.folder] = (counts[doc.folder] || 0) + 1;
    });
    return counts;
  });

  function toggleStar(id: string, e?: MouseEvent) {
    e?.stopPropagation();
    if (starred.has(id)) {
      starred.delete(id);
    } else {
      starred.add(id);
    }
  }

  function handleDelete(id: string, e?: MouseEvent) {
    e?.stopPropagation();
    if (selectedDocument?.id === id) {
      selectedDocument = null;
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  }

  function formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('zh-CN');
  }
</script>

<svelte:head>
  <title>文档管理 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <!-- 页面标题 -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">文档管理</h1>
    </div>
    <Dialog.Root bind:open={isUploadDialogOpen}>
      <Dialog.Trigger>
        <Button>
          <Plus class="mr-2 h-4 w-4" />
          上传文档
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>上传文档</Dialog.Title>
          <Dialog.Description>选择要上传的文档文件</Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
          <div class="flex w-full items-center justify-center">
            <label
              class="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors hover:bg-muted/50"
            >
              <div class="flex flex-col items-center justify-center pb-6 pt-5">
                <FileText class="mb-2 h-8 w-8 text-muted-foreground" />
                <p class="text-sm text-muted-foreground">点击或拖拽文件到此处上传</p>
              </div>
              <input type="file" class="hidden" multiple />
            </label>
          </div>
        </div>
        <Dialog.Footer>
          <Button variant="outline" onclick={() => (isUploadDialogOpen = false)}>取消</Button>
          <Button onclick={() => (isUploadDialogOpen = false)}>上传</Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  </div>

  <!-- 移动端文件夹选择器 -->
  <div class="mb-4 lg:hidden">
    <Card>
      <CardContent class="p-3">
        <div class="flex items-center gap-2 overflow-x-auto pb-2">
          {#each folders as folder (folder.name)}
            <button
              onclick={() => (selectedFolder = folder.name)}
              class="flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm transition-colors {selectedFolder ===
              folder.name
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'}"
            >
              <folder.icon class="h-4 w-4" />
              <span>{folder.name}</span>
              <Badge
                variant={selectedFolder === folder.name ? 'secondary' : 'outline'}
                class="h-5 min-w-5 px-1.5 text-xs"
              >
                {folderCounts()[folder.name] || 0}
              </Badge>
            </button>
          {/each}
        </div>
      </CardContent>
    </Card>
  </div>

  <div class="grid gap-6 lg:grid-cols-12">
    <!-- 桌面端文件夹列表 -->
    <div class="hidden lg:col-span-2 lg:block">
      <Card class="h-[calc(100vh-220px)]">
        <CardHeader class="pb-2">
          <CardTitle class="text-base">文件夹</CardTitle>
        </CardHeader>
        <CardContent class="p-2">
          <nav class="space-y-1">
            {#each folders as folder (folder.name)}
              <button
                onclick={() => (selectedFolder = folder.name)}
                class="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors {selectedFolder ===
                folder.name
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'}"
              >
                <div class="flex items-center gap-2">
                  <folder.icon class="h-4 w-4" />
                  <span class="truncate">{folder.name}</span>
                </div>
                <Badge
                  variant={selectedFolder === folder.name ? 'secondary' : 'outline'}
                  class="h-5 min-w-5 px-1.5"
                >
                  {folderCounts()[folder.name] || 0}
                </Badge>
              </button>
            {/each}
          </nav>
        </CardContent>
      </Card>
    </div>

    <!-- 文档列表 -->
    <div
      class="col-span-12 transition-all duration-300 {selectedDocument
        ? 'lg:col-span-5'
        : 'lg:col-span-10'}"
    >
      <Card class="h-[calc(100vh-220px)]">
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between gap-4">
            <div class="relative max-w-sm flex-1">
              <Search
                class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input placeholder="搜索文档..." bind:value={searchQuery} class="pl-10" />
            </div>
            <div class="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="icon"
                onclick={() => (viewMode = 'grid')}
              >
                <Grid class="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="icon"
                onclick={() => (viewMode = 'list')}
              >
                <List class="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent class="p-0">
          <ScrollArea class="h-[calc(100vh-340px)]">
            {#if viewMode === 'grid'}
              <div class="grid gap-3 p-4 sm:grid-cols-2">
                {#each filteredDocuments as doc (doc.id)}
                  {@const Icon = typeIcons[doc.type] || File}
                  <div
                    class="group relative cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md {selectedDocument?.id ===
                    doc.id
                      ? 'ring-2 ring-primary'
                      : ''}"
                    onclick={() => (selectedDocument = doc)}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === 'Enter' && (selectedDocument = doc)}
                  >
                    <div class="flex items-start justify-between">
                      <div
                        class="rounded-lg bg-muted p-2 {typeColors[doc.type] || typeColors.other}"
                      >
                        <Icon class="h-5 w-5" />
                      </div>
                      <div class="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          class="h-7 w-7"
                          onclick={(e) => toggleStar(doc.id, e)}
                        >
                          {#if starred.has(doc.id)}
                            <Star class="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                          {:else}
                            <StarOff class="h-3.5 w-3.5" />
                          {/if}
                        </Button>
                      </div>
                    </div>
                    <div class="mt-2">
                      <p class="truncate text-sm font-medium">{doc.name}</p>
                      <p class="mt-1 text-xs text-muted-foreground">
                        {formatFileSize(doc.size)} · {formatDate(doc.updatedAt)}
                      </p>
                    </div>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="divide-y">
                {#each filteredDocuments as doc (doc.id)}
                  {@const Icon = typeIcons[doc.type] || File}
                  <div
                    class="flex cursor-pointer items-center justify-between px-4 py-3 transition-colors hover:bg-muted/50 {selectedDocument?.id ===
                    doc.id
                      ? 'bg-muted'
                      : ''}"
                    onclick={() => (selectedDocument = doc)}
                    role="button"
                    tabindex="0"
                    onkeydown={(e) => e.key === 'Enter' && (selectedDocument = doc)}
                  >
                    <div class="flex min-w-0 flex-1 items-center gap-3">
                      <div
                        class="shrink-0 rounded-lg bg-muted p-2 {typeColors[doc.type] ||
                          typeColors.other}"
                      >
                        <Icon class="h-4 w-4" />
                      </div>
                      <div class="min-w-0 flex-1">
                        <p class="truncate text-sm font-medium">{doc.name}</p>
                        <p class="truncate text-xs text-muted-foreground">
                          {formatFileSize(doc.size)} · {formatDate(doc.updatedAt)}{doc.author?.name
                            ? ` · ${doc.author.name}`
                            : ''}
                        </p>
                      </div>
                    </div>
                    <div class="ml-2 flex shrink-0 items-center gap-1">
                      {#if doc.shared}
                        <Badge variant="outline" class="text-xs">
                          <Share2 class="mr-1 h-3 w-3" />
                          共享
                        </Badge>
                      {/if}
                      <Button
                        variant="ghost"
                        size="icon"
                        class="h-7 w-7"
                        onclick={(e) => toggleStar(doc.id, e)}
                      >
                        {#if starred.has(doc.id)}
                          <Star class="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                        {:else}
                          <StarOff class="h-3.5 w-3.5" />
                        {/if}
                      </Button>
                    </div>
                  </div>
                {/each}
              </div>
            {/if}

            {#if filteredDocuments.length === 0}
              <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <FileText class="mb-4 h-12 w-12" />
                <p>暂无文档</p>
              </div>
            {/if}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>

    <!-- 桌面端文档详情面板 -->
    {#if selectedDocument}
      {@const Icon = typeIcons[selectedDocument.type] || File}
      <div class="hidden lg:col-span-5 lg:block">
        <Card class="h-[calc(100vh-220px)]">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <CardTitle class="text-base">文档详情</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                class="h-8 w-8"
                onclick={() => (selectedDocument = null)}
              >
                <X class="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <Separator />
          <ScrollArea class="h-[calc(100vh-320px)]">
            <CardContent class="space-y-6 pt-4">
              <!-- 文件图标和名称 -->
              <div class="flex flex-col items-center text-center">
                <div
                  class="mb-3 rounded-xl bg-muted p-4 {typeColors[selectedDocument.type] ||
                    typeColors.other}"
                >
                  <Icon class="h-12 w-12" />
                </div>
                <h3 class="text-lg font-semibold">{selectedDocument.name}</h3>
                <p class="text-sm text-muted-foreground">{selectedDocument.folder}</p>
              </div>

              <!-- 操作按钮 -->
              <div class="flex justify-center gap-2">
                <Button variant="outline" size="sm">
                  <Eye class="mr-2 h-4 w-4" />
                  预览
                </Button>
                <Button variant="outline" size="sm">
                  <Download class="mr-2 h-4 w-4" />
                  下载
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 class="mr-2 h-4 w-4" />
                  分享
                </Button>
              </div>

              <Separator />

              <!-- 文件信息 -->
              <div class="space-y-4">
                <h4 class="text-sm font-medium">文件信息</h4>
                <div class="space-y-3 text-sm">
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">类型</span>
                    <Badge variant="secondary">{selectedDocument.type.toUpperCase()}</Badge>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">大小</span>
                    <span>{formatFileSize(selectedDocument.size)}</span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">浏览次数</span>
                    <span class="flex items-center gap-1">
                      <Eye class="h-3 w-3" />
                      {selectedDocument.views}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">创建时间</span>
                    <span class="flex items-center gap-1">
                      <Clock class="h-3 w-3" />
                      {formatDateTime(selectedDocument.createdAt)}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-muted-foreground">修改时间</span>
                    <span>{formatDateTime(selectedDocument.updatedAt)}</span>
                  </div>
                </div>
              </div>

              <Separator />

              <!-- 作者信息 -->
              {#if selectedDocument.author}
                <div class="space-y-3">
                  <h4 class="flex items-center gap-2 text-sm font-medium">
                    <User class="h-4 w-4" />
                    作者
                  </h4>
                  <div class="flex items-center gap-3">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-medium"
                    >
                      {selectedDocument.author.name?.[0] ?? '?'}
                    </div>
                    <div>
                      <p class="text-sm font-medium">{selectedDocument.author.name ?? '未知'}</p>
                      <p class="text-xs text-muted-foreground">文档所有者</p>
                    </div>
                  </div>
                </div>
              {/if}

              <!-- 协作者 -->
              {#if selectedDocument.collaborators && selectedDocument.collaborators.length > 0}
                <Separator />
                <div class="space-y-3">
                  <h4 class="flex items-center gap-2 text-sm font-medium">
                    <Users class="h-4 w-4" />
                    协作者 ({selectedDocument.collaborators.length})
                  </h4>
                  <div class="space-y-2">
                    {#each selectedDocument.collaborators as collaborator (collaborator.id)}
                      <div class="flex items-center gap-3">
                        <div
                          class="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium"
                        >
                          {collaborator.name[0]}
                        </div>
                        <span class="text-sm">{collaborator.name}</span>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}

              <!-- 标签 -->
              {#if selectedDocument.tags && selectedDocument.tags.length > 0}
                <Separator />
                <div class="space-y-3">
                  <h4 class="flex items-center gap-2 text-sm font-medium">
                    <Tag class="h-4 w-4" />
                    标签
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    {#each selectedDocument.tags as tag, index (index)}
                      <Badge variant="secondary">{tag}</Badge>
                    {/each}
                  </div>
                </div>
              {/if}

              <Separator />

              <!-- 危险操作 -->
              <div class="space-y-3">
                <h4 class="text-sm font-medium text-destructive">危险操作</h4>
                <div class="flex gap-2">
                  <Button variant="outline" size="sm">编辑</Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onclick={(e) => selectedDocument && handleDelete(selectedDocument.id, e)}
                  >
                    <Trash2 class="mr-2 h-4 w-4" />
                    删除
                  </Button>
                </div>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>
      </div>
    {/if}
  </div>
</div>
