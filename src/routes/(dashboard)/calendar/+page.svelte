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
  import { ChevronLeft, ChevronRight, Plus, Clock, MapPin, Users } from 'lucide-svelte';

  // 模拟日历数据
  const currentMonth = '2024年12月';
  const days = ['日', '一', '二', '三', '四', '五', '六'];

  // 生成日历天数
  const calendarDays = Array.from({ length: 35 }, (_, i) => {
    const day = i - 5; // 假设12月1日是周日
    return {
      day: day > 0 && day <= 31 ? day : null,
      isToday: day === 1,
      hasEvent: [5, 12, 15, 20, 25].includes(day),
    };
  });

  const upcomingEvents = [
    {
      title: '产品评审会议',
      time: '09:00 - 10:30',
      location: '会议室 A',
      type: 'meeting',
      attendees: 5,
    },
    {
      title: '团队周会',
      time: '14:00 - 15:00',
      location: '线上',
      type: 'meeting',
      attendees: 12,
    },
    {
      title: '项目截止日期',
      time: '18:00',
      location: '',
      type: 'deadline',
      attendees: 0,
    },
  ];
</script>

<svelte:head>
  <title>活动日历 - {import.meta.env.VITE_APP_TITLE || 'Admin Pro'}</title>
</svelte:head>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-3xl font-bold">活动日历</h1>
      <p class="text-muted-foreground">管理您的日程安排和活动</p>
    </div>
    <Button>
      <Plus class="mr-2 h-4 w-4" />
      新建活动
    </Button>
  </div>

  <div class="grid gap-6 lg:grid-cols-3">
    <!-- 日历 -->
    <Card class="lg:col-span-2">
      <CardHeader>
        <div class="flex items-center justify-between">
          <CardTitle>{currentMonth}</CardTitle>
          <div class="flex gap-1">
            <Button variant="outline" size="icon">
              <ChevronLeft class="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronRight class="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-7 gap-1">
          {#each days as day (day)}
            <div class="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          {/each}
          {#each calendarDays as { day, isToday, hasEvent }, i (i)}
            <button
              class="relative aspect-square rounded-lg p-2 text-sm transition-colors hover:bg-muted
                {isToday ? 'bg-primary text-primary-foreground' : ''}
                {!day ? 'pointer-events-none' : ''}"
            >
              {day || ''}
              {#if hasEvent && day}
                <span
                  class="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary {isToday
                    ? 'bg-primary-foreground'
                    : ''}"
                ></span>
              {/if}
            </button>
          {/each}
        </div>
      </CardContent>
    </Card>

    <!-- 即将到来的活动 -->
    <Card>
      <CardHeader>
        <CardTitle>即将到来</CardTitle>
        <CardDescription>今天的活动安排</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        {#each upcomingEvents as event (event.title)}
          <div class="rounded-lg border p-3 space-y-2">
            <div class="flex items-start justify-between">
              <h4 class="font-medium">{event.title}</h4>
              <Badge
                variant={event.type === 'deadline' ? 'destructive' : 'secondary'}
                class="text-xs"
              >
                {event.type === 'deadline' ? '截止' : '会议'}
              </Badge>
            </div>
            <div class="space-y-1 text-sm text-muted-foreground">
              <div class="flex items-center gap-2">
                <Clock class="h-3 w-3" />
                <span>{event.time}</span>
              </div>
              {#if event.location}
                <div class="flex items-center gap-2">
                  <MapPin class="h-3 w-3" />
                  <span>{event.location}</span>
                </div>
              {/if}
              {#if event.attendees > 0}
                <div class="flex items-center gap-2">
                  <Users class="h-3 w-3" />
                  <span>{event.attendees} 位参与者</span>
                </div>
              {/if}
            </div>
          </div>
        {/each}

        <Button variant="outline" class="w-full">查看全部活动</Button>
      </CardContent>
    </Card>
  </div>
</div>
