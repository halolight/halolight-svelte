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
  import { Separator } from '$lib/components/ui/separator';
  import { authStore } from '$lib/stores/auth.svelte.js';
  import { Check, Crown, Shield, UserRoundCheck } from 'lucide-svelte';

  const user = $derived(authStore.user);
  const permissions = $derived(authStore.permissions);

  // 模拟多账号数据
  const accounts = $derived([
    {
      id: '1',
      name: user?.name || '管理员',
      email: user?.email || 'admin@halolight.h7ml.cn',
      role: { name: 'admin', label: '超级管理员', permissions: ['*'] },
      lastLoginAt: new Date().toISOString(),
      isActive: true,
    },
    {
      id: '2',
      name: '运营账号',
      email: 'operator@example.com',
      role: {
        name: 'operator',
        label: '运营人员',
        permissions: ['dashboard:view', 'users:view', 'messages:*'],
      },
      lastLoginAt: new Date(Date.now() - 86400000).toISOString(),
      isActive: false,
    },
    {
      id: '3',
      name: '访客账号',
      email: 'guest@example.com',
      role: { name: 'guest', label: '访客', permissions: ['dashboard:view'] },
      lastLoginAt: new Date(Date.now() - 172800000).toISOString(),
      isActive: false,
    },
  ]);

  let switchingId = $state<string | null>(null);

  async function handleSwitch(accountId: string) {
    if (accounts.find((acc) => acc.id === accountId)?.isActive) return;
    switchingId = accountId;
    // 模拟切换延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));
    switchingId = null;
    // 实际切换逻辑这里省略
  }

  function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleString('zh-CN');
  }
</script>

<svelte:head>
  <title>账号与权限 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex flex-col gap-2">
    <h1 class="text-3xl font-bold tracking-tight">账号与权限</h1>
  </div>

  <div class="grid gap-4 lg:grid-cols-3">
    <Card class="lg:col-span-2">
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle>可用账号</CardTitle>
          <CardDescription>选择要使用的账号身份</CardDescription>
        </div>
        <Badge variant="secondary">共 {accounts.length} 个</Badge>
      </CardHeader>
      <CardContent class="space-y-3">
        {#each accounts as acc (acc.id)}
          <div
            class="flex flex-col gap-2 rounded-xl border bg-card px-4 py-3 md:flex-row md:items-center"
          >
            <div class="flex flex-1 items-start gap-3 md:items-center">
              <div
                class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary"
              >
                {#if acc.isActive}
                  <Crown class="h-5 w-5" />
                {:else}
                  <UserRoundCheck class="h-5 w-5" />
                {/if}
              </div>
              <div class="flex flex-col">
                <div class="flex items-center gap-2">
                  <span class="font-medium">{acc.name}</span>
                  <Badge variant={acc.isActive ? 'default' : 'outline'}>
                    {acc.role.label}
                  </Badge>
                  {#if acc.isActive}
                    <Badge class="bg-emerald-500 text-white hover:bg-emerald-500/90">当前</Badge>
                  {/if}
                </div>
                <p class="text-sm text-muted-foreground">{acc.email}</p>
                {#if acc.lastLoginAt}
                  <p class="text-xs text-muted-foreground">
                    上次登录：{formatDate(acc.lastLoginAt)}
                  </p>
                {/if}
              </div>
            </div>
            <div class="flex items-center gap-2">
              <Badge variant="secondary">{acc.role.permissions.length} 项权限</Badge>
              <Button
                variant={acc.isActive ? 'secondary' : 'outline'}
                size="sm"
                disabled={acc.isActive || switchingId === acc.id}
                onclick={() => handleSwitch(acc.id)}
              >
                {#if acc.isActive}
                  <Check class="mr-2 h-4 w-4" />
                  使用中
                {:else}
                  <UserRoundCheck class="mr-2 h-4 w-4" />
                  {switchingId === acc.id ? '切换中...' : '切换'}
                {/if}
              </Button>
            </div>
          </div>
        {/each}
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>当前权限</CardTitle>
        <CardDescription>当前账号的角色与权限列表</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center gap-2">
          <Shield class="h-4 w-4 text-primary" />
          <span class="font-medium">
            {permissions.includes('*') ? '超级管理员' : '普通用户'}
          </span>
          <Badge variant="secondary">{permissions.length} 权限</Badge>
        </div>
        <Separator />
        <div class="flex flex-wrap gap-2">
          {#if permissions.length === 0}
            <p class="text-sm text-muted-foreground">暂无权限</p>
          {:else}
            {#each permissions as perm (perm)}
              <Badge variant="outline" class="font-mono text-xs">{perm}</Badge>
            {/each}
          {/if}
        </div>
      </CardContent>
    </Card>
  </div>
</div>
