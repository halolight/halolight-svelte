<script lang="ts">
  import { CheckSquare } from 'lucide-svelte';
  import { Badge } from '$lib/components/ui/badge';
  import type { WidgetProps, TaskItem } from './types';

  interface Props extends WidgetProps {
    tasks?: TaskItem[];
  }

  let { isMobile = false, tasks = [] }: Props = $props();

  // Default demo data
  const defaultTasks: TaskItem[] = [
    {
      id: '1',
      title: '完成项目文档',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-12-10',
    },
    {
      id: '2',
      title: '代码审查',
      status: 'pending',
      priority: 'medium',
      dueDate: '2024-12-08',
    },
    {
      id: '3',
      title: '修复 Bug #234',
      status: 'in_progress',
      priority: 'high',
      dueDate: '2024-12-06',
    },
    {
      id: '4',
      title: '团队会议',
      status: 'done',
      priority: 'low',
      dueDate: '2024-12-05',
    },
    {
      id: '5',
      title: '更新依赖包',
      status: 'pending',
      priority: 'low',
      dueDate: '2024-12-15',
    },
  ];

  const taskList = $derived(tasks.length > 0 ? tasks : defaultTasks);
  const displayList = $derived(isMobile ? taskList.slice(0, 3) : taskList);

  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: '待处理',
      in_progress: '进行中',
      done: '已完成',
    };
    return labels[status] || status;
  }

  function getStatusVariant(status: string): 'default' | 'outline' | 'secondary' {
    if (status === 'in_progress') return 'default';
    if (status === 'done') return 'secondary';
    return 'outline';
  }
</script>

<div class="space-y-3">
  {#each displayList as task (task.id)}
    <div class="flex items-center gap-3">
      <CheckSquare class="h-4 w-4 text-muted-foreground flex-shrink-0" />
      <div class="flex-1 min-w-0">
        <span class="text-sm truncate block">{task.title}</span>
        {#if task.dueDate}
          <span class="text-xs text-muted-foreground">{task.dueDate}</span>
        {/if}
      </div>
      <Badge variant={getStatusVariant(task.status)} class="text-xs flex-shrink-0">
        {getStatusLabel(task.status)}
      </Badge>
    </div>
  {/each}
</div>
