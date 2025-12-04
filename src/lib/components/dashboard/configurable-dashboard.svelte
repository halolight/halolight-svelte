<script lang="ts">
  import { GripVertical, X, Plus, RotateCcw, Save, Settings, BarChart3 } from 'lucide-svelte';
  import { Button } from '$lib/components/ui/button';
  import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
  import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '$lib/components/ui/sheet';
  import {
    dashboardStore,
    widgetTemplates,
    type WidgetType,
  } from '$lib/stores/dashboard-store.svelte';
  import ChartLine from '$lib/widgets/chart-line.svelte';
  import ChartBar from '$lib/widgets/chart-bar.svelte';
  import ChartPie from '$lib/widgets/chart-pie.svelte';
  import TasksWidget from '$lib/widgets/tasks-widget.svelte';
  import CalendarWidget from '$lib/widgets/calendar-widget.svelte';

  let containerWidth = $state(0);
  let containerRef: HTMLDivElement;

  // Compute responsive columns
  const columns = $derived(containerWidth < 640 ? 1 : containerWidth < 1024 ? 6 : 12);
  const isMobile = $derived(columns === 1);

  // Icon map for widget templates
  const iconMap: Record<string, any> = {
    BarChart3,
    LineChart: BarChart3, // Fallback
    BarChart: BarChart3,
    PieChart: BarChart3,
    Users: BarChart3,
    Bell: BarChart3,
    CheckSquare: BarChart3,
    Calendar: BarChart3,
    Zap: BarChart3,
  };

  // Widget content renderer
  function WidgetContent(type: WidgetType, _isMobile: boolean) {
    switch (type) {
      case 'chart-line':
        return ChartLine;
      case 'chart-bar':
        return ChartBar;
      case 'chart-pie':
        return ChartPie;
      case 'tasks':
        return TasksWidget;
      case 'calendar':
        return CalendarWidget;
      default:
        return null;
    }
  }

  // Measure container width
  $effect(() => {
    if (containerRef) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          containerWidth = entry.contentRect.width;
        }
      });
      observer.observe(containerRef);
      return () => observer.disconnect();
    }
  });

  function handleAddWidget(type: WidgetType, title: string) {
    dashboardStore.addWidget({ type, title });
  }
</script>

<div bind:this={containerRef} class="space-y-4">
  <!-- Toolbar -->
  <div class="flex items-center justify-between">
    <div class="flex items-center gap-2">
      <Button variant="outline" size="sm" onclick={() => window.location.reload()}>
        <RotateCcw class="h-4 w-4 mr-1" />
        刷新
      </Button>
    </div>
    <div class="flex items-center gap-2">
      {#if dashboardStore.isEditing}
        <Sheet>
          <SheetTrigger>
            <Button variant="outline" size="sm">
              <Plus class="h-4 w-4 mr-1" />
              部件
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>部件</SheetTitle>
              <SheetDescription>选择要添加到仪表盘的部件</SheetDescription>
            </SheetHeader>
            <div class="grid gap-3 mt-4">
              {#each widgetTemplates as template (template.type)}
                {@const Icon = iconMap[template.icon] || BarChart3}
                <Button
                  variant="outline"
                  class="justify-start h-auto py-3"
                  onclick={() => {
                    handleAddWidget(template.type, template.title);
                  }}
                >
                  <Icon class="h-5 w-5 mr-3" />
                  <div class="text-left">
                    <p class="font-medium">{template.title}</p>
                    <p class="text-xs text-muted-foreground">
                      {template.description}
                    </p>
                  </div>
                </Button>
              {/each}
            </div>
          </SheetContent>
        </Sheet>
        <Button variant="outline" size="sm" onclick={() => dashboardStore.resetToDefault()}>
          <RotateCcw class="h-4 w-4 mr-1" />
          重置
        </Button>
        <Button size="sm" onclick={() => dashboardStore.setIsEditing(false)}>
          <Save class="h-4 w-4 mr-1" />
          保存
        </Button>
      {:else}
        <Button variant="outline" size="sm" onclick={() => dashboardStore.setIsEditing(true)}>
          <Settings class="h-4 w-4 mr-1" />
          自定义
        </Button>
      {/if}
    </div>
  </div>

  <!-- Widget Grid -->
  {#if containerWidth > 0}
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each dashboardStore.widgets as widget (widget.id)}
        {@const WidgetComponent = WidgetContent(widget.type, isMobile)}
        <Card class={dashboardStore.isEditing ? 'ring-2 ring-primary/20' : ''}>
          <CardHeader class="pb-2 flex flex-row items-center justify-between space-y-0">
            <div class="flex items-center gap-2">
              {#if dashboardStore.isEditing}
                <div class="cursor-grab active:cursor-grabbing">
                  <GripVertical class="h-4 w-4 text-muted-foreground" />
                </div>
              {/if}
              <CardTitle class="text-sm font-medium">{widget.title}</CardTitle>
            </div>
            {#if dashboardStore.isEditing}
              <Button
                variant="ghost"
                size="icon"
                class="h-6 w-6"
                onclick={() => dashboardStore.removeWidget(widget.id)}
              >
                <X class="h-3 w-3" />
              </Button>
            {/if}
          </CardHeader>
          <CardContent class="pt-2">
            {#if WidgetComponent}
              {@const Component = WidgetComponent}
              <Component {isMobile} />
            {:else}
              <div class="text-sm text-muted-foreground">部件类型: {widget.type}</div>
            {/if}
          </CardContent>
        </Card>
      {/each}
    </div>
  {/if}

  <!-- Empty State -->
  {#if dashboardStore.widgets.length === 0}
    <Card class="p-8 text-center">
      <BarChart3 class="mx-auto h-12 w-12 text-muted-foreground/50" />
      <h3 class="mt-4 text-lg font-medium">没有部件</h3>
      <p class="mt-2 text-muted-foreground">点击「自定义」按钮添加仪表盘部件</p>
    </Card>
  {/if}
</div>
