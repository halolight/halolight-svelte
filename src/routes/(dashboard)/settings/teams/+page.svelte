<script lang="ts">
  import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Textarea } from '$lib/components/ui/textarea';
  import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import { Loader2, MoreHorizontal, Pencil, Plus, Trash2, Users } from 'lucide-svelte';

  interface Team {
    id: string;
    name: string;
    description?: string;
    avatar?: string;
    memberCount: number;
    createdAt: string;
  }

  // 模拟团队数据
  let teams = $state<Team[]>([
    {
      id: '1',
      name: '产品团队',
      description: '负责产品规划与设计',
      memberCount: 8,
      createdAt: '2024-01-15T10:00:00Z',
    },
    {
      id: '2',
      name: '技术团队',
      description: '负责系统开发与维护',
      memberCount: 12,
      createdAt: '2024-02-01T10:00:00Z',
    },
    {
      id: '3',
      name: '运营团队',
      description: '负责运营与用户增长',
      memberCount: 5,
      createdAt: '2024-03-10T10:00:00Z',
    },
    {
      id: '4',
      name: '市场团队',
      description: '负责市场推广与品牌建设',
      memberCount: 6,
      createdAt: '2024-04-20T10:00:00Z',
    },
  ]);

  let isLoading = $state(false);
  let isAddDialogOpen = $state(false);
  let isEditDialogOpen = $state(false);
  let isDeleteDialogOpen = $state(false);
  let selectedTeam = $state<Team | null>(null);
  let formData = $state({ name: '', description: '' });
  let isSubmitting = $state(false);

  const totalMembers = $derived(teams.reduce((acc, t) => acc + t.memberCount, 0));

  async function handleCreate() {
    if (!formData.name.trim()) return;
    isSubmitting = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newTeam: Team = {
      id: String(Date.now()),
      name: formData.name,
      description: formData.description,
      memberCount: 0,
      createdAt: new Date().toISOString(),
    };
    teams = [...teams, newTeam];
    isSubmitting = false;
    isAddDialogOpen = false;
    formData = { name: '', description: '' };
  }

  function handleEdit(team: Team) {
    selectedTeam = team;
    formData = { name: team.name, description: team.description || '' };
    isEditDialogOpen = true;
  }

  async function handleUpdate() {
    if (!selectedTeam || !formData.name.trim()) return;
    isSubmitting = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    teams = teams.map((t) =>
      t.id === selectedTeam!.id
        ? { ...t, name: formData.name, description: formData.description }
        : t
    );
    isSubmitting = false;
    isEditDialogOpen = false;
    selectedTeam = null;
    formData = { name: '', description: '' };
  }

  function handleDeleteClick(team: Team) {
    selectedTeam = team;
    isDeleteDialogOpen = true;
  }

  async function handleDelete() {
    if (!selectedTeam) return;
    isSubmitting = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    teams = teams.filter((t) => t.id !== selectedTeam!.id);
    isSubmitting = false;
    isDeleteDialogOpen = false;
    selectedTeam = null;
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('zh-CN');
  }
</script>

<svelte:head>
  <title>团队设置 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <!-- 页面标题 -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">团队设置</h1>
      <p class="mt-1 text-muted-foreground">管理团队信息、成员和组织架构</p>
    </div>
    <Dialog.Root bind:open={isAddDialogOpen}>
      <Dialog.Trigger>
        <Button onclick={() => (formData = { name: '', description: '' })}>
          <Plus class="mr-2 h-4 w-4" />
          创建团队
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>创建新团队</Dialog.Title>
          <Dialog.Description>填写团队基本信息</Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
          <div class="grid gap-2">
            <Label for="name">团队名称</Label>
            <Input id="name" placeholder="输入团队名称" bind:value={formData.name} />
          </div>
          <div class="grid gap-2">
            <Label for="description">团队描述（可选）</Label>
            <Textarea
              id="description"
              placeholder="输入团队描述"
              bind:value={formData.description}
            />
          </div>
        </div>
        <Dialog.Footer>
          <Button variant="outline" onclick={() => (isAddDialogOpen = false)}>取消</Button>
          <Button onclick={handleCreate} disabled={isSubmitting || !formData.name.trim()}>
            {#if isSubmitting}
              <Loader2 class="mr-2 h-4 w-4 animate-spin" />
            {/if}
            创建
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  </div>

  <!-- 统计卡片 -->
  <div class="grid gap-4 md:grid-cols-3">
    <Card>
      <CardHeader class="pb-2">
        <CardDescription>团队总数</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-2xl font-bold text-blue-500">{teams.length}</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="pb-2">
        <CardDescription>总成员数</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-2xl font-bold text-green-500">{totalMembers}</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="pb-2">
        <CardDescription>角色管理</CardDescription>
      </CardHeader>
      <CardContent>
        <a href="/settings/teams/roles">
          <Button variant="outline" size="sm">管理角色</Button>
        </a>
      </CardContent>
    </Card>
  </div>

  <!-- 团队列表 -->
  <Card>
    <CardHeader>
      <CardTitle>团队列表</CardTitle>
      <CardDescription>查看和管理所有团队</CardDescription>
    </CardHeader>
    <CardContent>
      {#if isLoading}
        <div class="flex items-center justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      {:else if teams.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Users class="mb-4 h-12 w-12" />
          <p>暂无团队</p>
          <p class="text-sm">点击上方按钮创建第一个团队</p>
        </div>
      {:else}
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {#each teams as team (team.id)}
            <Card class="transition-shadow hover:shadow-md">
              <CardHeader class="pb-3">
                <div class="flex items-start justify-between">
                  <div class="flex items-center gap-3">
                    <Avatar class="h-10 w-10">
                      <AvatarImage src={team.avatar} />
                      <AvatarFallback>{team.name.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle class="text-base">{team.name}</CardTitle>
                      <CardDescription class="text-xs">
                        {team.description || '暂无描述'}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal class="h-4 w-4" />
                      </Button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="end">
                      <DropdownMenu.Label>操作</DropdownMenu.Label>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item onclick={() => handleEdit(team)}>
                        <Pencil class="mr-2 h-4 w-4" />
                        编辑
                      </DropdownMenu.Item>
                      <DropdownMenu.Separator />
                      <DropdownMenu.Item
                        class="text-destructive"
                        onclick={() => handleDeleteClick(team)}
                      >
                        <Trash2 class="mr-2 h-4 w-4" />
                        删除
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>
              </CardHeader>
              <CardContent class="pt-0">
                <div class="flex items-center justify-between text-sm text-muted-foreground">
                  <div class="flex items-center gap-1">
                    <Users class="h-4 w-4" />
                    <span>{team.memberCount} 成员</span>
                  </div>
                  <Badge variant="secondary">{formatDate(team.createdAt)}</Badge>
                </div>
              </CardContent>
            </Card>
          {/each}
        </div>
      {/if}
    </CardContent>
  </Card>

  <!-- 编辑对话框 -->
  <Dialog.Root bind:open={isEditDialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>编辑团队</Dialog.Title>
        <Dialog.Description>修改团队信息</Dialog.Description>
      </Dialog.Header>
      <div class="grid gap-4 py-4">
        <div class="grid gap-2">
          <Label for="edit-name">团队名称</Label>
          <Input id="edit-name" placeholder="输入团队名称" bind:value={formData.name} />
        </div>
        <div class="grid gap-2">
          <Label for="edit-description">团队描述（可选）</Label>
          <Textarea
            id="edit-description"
            placeholder="输入团队描述"
            bind:value={formData.description}
          />
        </div>
      </div>
      <Dialog.Footer>
        <Button variant="outline" onclick={() => (isEditDialogOpen = false)}>取消</Button>
        <Button onclick={handleUpdate} disabled={isSubmitting || !formData.name.trim()}>
          {#if isSubmitting}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          保存
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>

  <!-- 删除确认对话框 -->
  <Dialog.Root bind:open={isDeleteDialogOpen}>
    <Dialog.Content>
      <Dialog.Header>
        <Dialog.Title>确认删除</Dialog.Title>
        <Dialog.Description>
          确定要删除团队 "{selectedTeam?.name}" 吗？此操作无法撤销。
        </Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button variant="outline" onclick={() => (isDeleteDialogOpen = false)}>取消</Button>
        <Button variant="destructive" onclick={handleDelete} disabled={isSubmitting}>
          {#if isSubmitting}
            <Loader2 class="mr-2 h-4 w-4 animate-spin" />
          {/if}
          删除
        </Button>
      </Dialog.Footer>
    </Dialog.Content>
  </Dialog.Root>
</div>
