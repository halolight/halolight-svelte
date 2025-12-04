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
  import { Checkbox } from '$lib/components/ui/checkbox';
  import { ScrollArea } from '$lib/components/ui/scroll-area';
  import * as Dialog from '$lib/components/ui/dialog';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import {
    Check,
    ChevronLeft,
    Loader2,
    MoreHorizontal,
    Pencil,
    Plus,
    Shield,
    Trash2,
    Users,
  } from 'lucide-svelte';

  interface RoleDetail {
    id: string;
    name: string;
    label: string;
    description?: string;
    permissions: string[];
    userCount: number;
  }

  interface PermissionItem {
    key: string;
    label: string;
    group: string;
  }

  const roleColors: Record<string, string> = {
    admin: 'bg-red-500/10 text-red-500',
    manager: 'bg-blue-500/10 text-blue-500',
    editor: 'bg-green-500/10 text-green-500',
    viewer: 'bg-yellow-500/10 text-yellow-500',
  };

  // 模拟权限列表
  const permissionList: PermissionItem[] = [
    { key: 'dashboard:view', label: '查看仪表盘', group: '仪表盘' },
    { key: 'dashboard:edit', label: '编辑仪表盘', group: '仪表盘' },
    { key: 'users:view', label: '查看用户', group: '用户管理' },
    { key: 'users:create', label: '创建用户', group: '用户管理' },
    { key: 'users:edit', label: '编辑用户', group: '用户管理' },
    { key: 'users:delete', label: '删除用户', group: '用户管理' },
    { key: 'roles:view', label: '查看角色', group: '角色管理' },
    { key: 'roles:create', label: '创建角色', group: '角色管理' },
    { key: 'roles:edit', label: '编辑角色', group: '角色管理' },
    { key: 'roles:delete', label: '删除角色', group: '角色管理' },
    { key: 'settings:view', label: '查看设置', group: '系统设置' },
    { key: 'settings:edit', label: '编辑设置', group: '系统设置' },
  ];

  // 模拟角色数据
  let roles = $state<RoleDetail[]>([
    {
      id: 'admin',
      name: 'admin',
      label: '超级管理员',
      description: '拥有系统全部权限',
      permissions: ['*'],
      userCount: 2,
    },
    {
      id: 'manager',
      name: 'manager',
      label: '管理员',
      description: '管理用户和内容',
      permissions: ['dashboard:view', 'dashboard:edit', 'users:view', 'users:create', 'users:edit'],
      userCount: 5,
    },
    {
      id: 'editor',
      name: 'editor',
      label: '编辑员',
      description: '编辑和发布内容',
      permissions: ['dashboard:view', 'users:view'],
      userCount: 12,
    },
    {
      id: 'viewer',
      name: 'viewer',
      label: '访客',
      description: '只读权限',
      permissions: ['dashboard:view'],
      userCount: 25,
    },
  ]);

  let isLoading = $state(false);
  let isAddDialogOpen = $state(false);
  let isEditDialogOpen = $state(false);
  let isDeleteDialogOpen = $state(false);
  let selectedRole = $state<RoleDetail | null>(null);
  let formData = $state({ name: '', label: '', description: '', permissions: [] as string[] });
  let isSubmitting = $state(false);

  // 按分组整理权限
  const permissionsByGroup = $derived(() => {
    const groups: Record<string, Array<{ key: string; label: string }>> = {};
    permissionList.forEach((p) => {
      if (!groups[p.group]) {
        groups[p.group] = [];
      }
      groups[p.group].push({ key: p.key, label: p.label });
    });
    return groups;
  });

  const totalUsers = $derived(roles.reduce((acc, r) => acc + r.userCount, 0));

  function resetFormData() {
    formData = { name: '', label: '', description: '', permissions: [] };
  }

  async function handleCreate() {
    if (!formData.name.trim() || !formData.label.trim()) return;
    isSubmitting = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    const newRole: RoleDetail = {
      id: String(Date.now()),
      name: formData.name,
      label: formData.label,
      description: formData.description,
      permissions: formData.permissions,
      userCount: 0,
    };
    roles = [...roles, newRole];
    isSubmitting = false;
    isAddDialogOpen = false;
    resetFormData();
  }

  function handleEdit(role: RoleDetail) {
    selectedRole = role;
    formData = {
      name: role.name,
      label: role.label,
      description: role.description || '',
      permissions: role.permissions.includes('*')
        ? permissionList.map((p) => p.key)
        : [...role.permissions],
    };
    isEditDialogOpen = true;
  }

  async function handleUpdate() {
    if (!selectedRole || !formData.name.trim() || !formData.label.trim()) return;
    isSubmitting = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    roles = roles.map((r) =>
      r.id === selectedRole!.id
        ? {
            ...r,
            name: formData.name,
            label: formData.label,
            description: formData.description,
            permissions: formData.permissions,
          }
        : r
    );
    isSubmitting = false;
    isEditDialogOpen = false;
    selectedRole = null;
    resetFormData();
  }

  function handleDeleteClick(role: RoleDetail) {
    selectedRole = role;
    isDeleteDialogOpen = true;
  }

  async function handleDelete() {
    if (!selectedRole) return;
    isSubmitting = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    roles = roles.filter((r) => r.id !== selectedRole!.id);
    isSubmitting = false;
    isDeleteDialogOpen = false;
    selectedRole = null;
  }

  function togglePermission(key: string) {
    if (formData.permissions.includes(key)) {
      formData.permissions = formData.permissions.filter((p) => p !== key);
    } else {
      formData.permissions = [...formData.permissions, key];
    }
  }

  function toggleGroupPermissions(groupKeys: string[]) {
    const allSelected = groupKeys.every((k) => formData.permissions.includes(k));
    if (allSelected) {
      formData.permissions = formData.permissions.filter((p) => !groupKeys.includes(p));
    } else {
      formData.permissions = [...new Set([...formData.permissions, ...groupKeys])];
    }
  }

  function isGroupAllSelected(groupKeys: string[]): boolean {
    return groupKeys.every((k) => formData.permissions.includes(k));
  }

  function isGroupPartiallySelected(groupKeys: string[]): boolean {
    return (
      groupKeys.some((k) => formData.permissions.includes(k)) && !isGroupAllSelected(groupKeys)
    );
  }
</script>

<svelte:head>
  <title>角色管理 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <!-- 页面标题 -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-4">
      <a href="/settings/teams">
        <Button variant="ghost" size="icon">
          <ChevronLeft class="h-5 w-5" />
        </Button>
      </a>
      <div>
        <h1 class="text-3xl font-bold tracking-tight">角色管理</h1>
        <p class="mt-1 text-muted-foreground">创建和管理系统角色，配置角色权限</p>
      </div>
    </div>
    <Dialog.Root bind:open={isAddDialogOpen}>
      <Dialog.Trigger>
        <Button onclick={resetFormData}>
          <Plus class="mr-2 h-4 w-4" />
          创建角色
        </Button>
      </Dialog.Trigger>
      <Dialog.Content class="max-w-2xl">
        <Dialog.Header>
          <Dialog.Title>创建新角色</Dialog.Title>
          <Dialog.Description>定义角色信息和权限</Dialog.Description>
        </Dialog.Header>
        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-2">
              <Label for="name">角色标识</Label>
              <Input id="name" placeholder="如: editor" bind:value={formData.name} />
            </div>
            <div class="grid gap-2">
              <Label for="label">角色名称</Label>
              <Input id="label" placeholder="如: 编辑员" bind:value={formData.label} />
            </div>
          </div>
          <div class="grid gap-2">
            <Label for="description">角色描述（可选）</Label>
            <Textarea
              id="description"
              placeholder="输入角色描述"
              bind:value={formData.description}
            />
          </div>
          <div class="grid gap-2">
            <Label>权限配置</Label>
            <ScrollArea class="h-[300px] pr-4">
              <div class="space-y-4">
                {#each Object.entries(permissionsByGroup()) as [group, perms] (group)}
                  {@const groupKeys = perms.map((p) => p.key)}
                  {@const allSelected = isGroupAllSelected(groupKeys)}
                  {@const partialSelected = isGroupPartiallySelected(groupKeys)}
                  <div class="space-y-2">
                    <div class="flex items-center gap-2">
                      <Checkbox
                        id="group-{group}"
                        checked={allSelected}
                        indeterminate={partialSelected}
                        onCheckedChange={() => toggleGroupPermissions(groupKeys)}
                      />
                      <Label for="group-{group}" class="cursor-pointer font-medium">{group}</Label>
                    </div>
                    <div class="ml-6 grid grid-cols-2 gap-2">
                      {#each perms as perm (perm.key)}
                        <div class="flex items-center gap-2">
                          <Checkbox
                            id={perm.key}
                            checked={formData.permissions.includes(perm.key)}
                            onCheckedChange={() => togglePermission(perm.key)}
                          />
                          <Label for={perm.key} class="cursor-pointer text-sm font-normal">
                            {perm.label}
                          </Label>
                        </div>
                      {/each}
                    </div>
                  </div>
                {/each}
              </div>
            </ScrollArea>
          </div>
        </div>
        <Dialog.Footer>
          <Button variant="outline" onclick={() => (isAddDialogOpen = false)}>取消</Button>
          <Button
            onclick={handleCreate}
            disabled={isSubmitting || !formData.name.trim() || !formData.label.trim()}
          >
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
        <CardDescription>角色总数</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-2xl font-bold text-blue-500">{roles.length}</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="pb-2">
        <CardDescription>权限项总数</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-2xl font-bold text-green-500">{permissionList.length}</p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader class="pb-2">
        <CardDescription>已分配用户</CardDescription>
      </CardHeader>
      <CardContent>
        <p class="text-2xl font-bold text-purple-500">{totalUsers}</p>
      </CardContent>
    </Card>
  </div>

  <!-- 角色列表 -->
  <Card>
    <CardHeader>
      <CardTitle>角色列表</CardTitle>
      <CardDescription>查看和管理所有角色及其权限</CardDescription>
    </CardHeader>
    <CardContent>
      {#if isLoading}
        <div class="flex items-center justify-center py-8">
          <Loader2 class="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      {:else if roles.length === 0}
        <div class="flex flex-col items-center justify-center py-12 text-muted-foreground">
          <Shield class="mb-4 h-12 w-12" />
          <p>暂无角色</p>
          <p class="text-sm">点击上方按钮创建第一个角色</p>
        </div>
      {:else}
        <div class="space-y-4">
          {#each roles as role (role.id)}
            <Card class="transition-shadow hover:shadow-md">
              <CardContent class="p-4">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-4">
                    <div
                      class="flex h-10 w-10 items-center justify-center rounded-lg {roleColors[
                        role.id
                      ] || 'bg-gray-500/10'}"
                    >
                      <Shield class="h-5 w-5" />
                    </div>
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="font-semibold">{role.label}</h3>
                        <Badge variant="outline" class="text-xs">{role.name}</Badge>
                      </div>
                      <p class="text-sm text-muted-foreground">
                        {role.description || '暂无描述'}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4">
                    <div class="text-right text-sm">
                      <div class="flex items-center gap-1 text-muted-foreground">
                        <Users class="h-4 w-4" />
                        <span>{role.userCount} 用户</span>
                      </div>
                      <div class="flex items-center gap-1 text-muted-foreground">
                        <Check class="h-4 w-4" />
                        <span>
                          {role.permissions.includes('*')
                            ? '全部权限'
                            : `${role.permissions.length} 权限`}
                        </span>
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
                        <DropdownMenu.Item onclick={() => handleEdit(role)}>
                          <Pencil class="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenu.Item>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Item
                          class="text-destructive"
                          onclick={() => handleDeleteClick(role)}
                          disabled={role.id === 'admin'}
                        >
                          <Trash2 class="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenu.Item>
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </div>
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
    <Dialog.Content class="max-w-2xl">
      <Dialog.Header>
        <Dialog.Title>编辑角色</Dialog.Title>
        <Dialog.Description>修改角色信息和权限</Dialog.Description>
      </Dialog.Header>
      <div class="grid gap-4 py-4">
        <div class="grid grid-cols-2 gap-4">
          <div class="grid gap-2">
            <Label for="edit-name">角色标识</Label>
            <Input id="edit-name" placeholder="如: editor" bind:value={formData.name} />
          </div>
          <div class="grid gap-2">
            <Label for="edit-label">角色名称</Label>
            <Input id="edit-label" placeholder="如: 编辑员" bind:value={formData.label} />
          </div>
        </div>
        <div class="grid gap-2">
          <Label for="edit-description">角色描述（可选）</Label>
          <Textarea
            id="edit-description"
            placeholder="输入角色描述"
            bind:value={formData.description}
          />
        </div>
        <div class="grid gap-2">
          <Label>权限配置</Label>
          <ScrollArea class="h-[300px] pr-4">
            <div class="space-y-4">
              {#each Object.entries(permissionsByGroup()) as [group, perms] (group)}
                {@const groupKeys = perms.map((p) => p.key)}
                {@const allSelected = isGroupAllSelected(groupKeys)}
                {@const partialSelected = isGroupPartiallySelected(groupKeys)}
                <div class="space-y-2">
                  <div class="flex items-center gap-2">
                    <Checkbox
                      id="edit-group-{group}"
                      checked={allSelected}
                      indeterminate={partialSelected}
                      onCheckedChange={() => toggleGroupPermissions(groupKeys)}
                    />
                    <Label for="edit-group-{group}" class="cursor-pointer font-medium"
                      >{group}</Label
                    >
                  </div>
                  <div class="ml-6 grid grid-cols-2 gap-2">
                    {#each perms as perm (perm.key)}
                      <div class="flex items-center gap-2">
                        <Checkbox
                          id="edit-{perm.key}"
                          checked={formData.permissions.includes(perm.key)}
                          onCheckedChange={() => togglePermission(perm.key)}
                        />
                        <Label for="edit-{perm.key}" class="cursor-pointer text-sm font-normal">
                          {perm.label}
                        </Label>
                      </div>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </ScrollArea>
        </div>
      </div>
      <Dialog.Footer>
        <Button variant="outline" onclick={() => (isEditDialogOpen = false)}>取消</Button>
        <Button
          onclick={handleUpdate}
          disabled={isSubmitting || !formData.name.trim() || !formData.label.trim()}
        >
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
          确定要删除角色 "{selectedRole?.label}" 吗？此操作无法撤销。
          {#if selectedRole?.userCount && selectedRole.userCount > 0}
            <span class="mt-2 block text-destructive">
              警告：该角色下有 {selectedRole.userCount} 个用户，删除后这些用户将失去该角色。
            </span>
          {/if}
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
