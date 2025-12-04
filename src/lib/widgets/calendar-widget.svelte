<script lang="ts">
  import type { WidgetProps, CalendarEvent } from './types';

  interface Props extends WidgetProps {
    events?: CalendarEvent[];
  }

  let { isMobile = false, events = [] }: Props = $props();

  // Default demo data
  const defaultEvents: CalendarEvent[] = [
    {
      id: '1',
      title: '团队站会',
      start: new Date().toISOString(),
      end: new Date(Date.now() + 3600000).toISOString(),
    },
    {
      id: '2',
      title: '产品评审',
      start: new Date(Date.now() + 7200000).toISOString(),
      end: new Date(Date.now() + 10800000).toISOString(),
    },
    {
      id: '3',
      title: '客户会议',
      start: new Date(Date.now() + 14400000).toISOString(),
      end: new Date(Date.now() + 18000000).toISOString(),
    },
  ];

  const eventList = $derived(events.length > 0 ? events : defaultEvents);

  // Get today's date string
  const today = $derived(new Date().toISOString().slice(0, 10));

  // Filter today's events
  const todayEvents = $derived(
    eventList.filter((event) => {
      const start = event.start?.slice(0, 10);
      return start === today;
    })
  );

  const displayList = $derived(isMobile ? todayEvents.slice(0, 3) : todayEvents.slice(0, 6));

  function formatRange(start?: string, end?: string): string {
    if (!start) return '时间未定';

    const startDate = new Date(start);
    const endDate = end ? new Date(end) : null;

    const fmt = new Intl.DateTimeFormat('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    const startStr = fmt.format(startDate);
    const endStr = endDate ? fmt.format(endDate) : '';

    return endStr ? `${startStr} - ${endStr}` : startStr;
  }
</script>

<div class="h-full flex flex-col gap-3">
  <div class="flex-1 overflow-auto rounded-md border bg-muted/30 p-3">
    {#if todayEvents.length === 0}
      <p class="text-xs text-muted-foreground text-center">暂无日程</p>
    {:else}
      <ul class="space-y-2">
        {#each displayList as event (event.id)}
          <li class="flex items-start justify-between gap-2 rounded-md bg-background p-2 shadow-xs">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium leading-tight truncate">
                {event.title || '未命名事件'}
              </p>
              <p class="text-[11px] text-muted-foreground leading-tight">
                {formatRange(event.start, event.end)}
              </p>
            </div>
            <span class="text-[11px] text-muted-foreground flex-shrink-0">日程</span>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>
