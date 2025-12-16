<script lang="ts">
  import type { WidgetProps, PieChartDataPoint } from './types';

  interface Props extends WidgetProps {
    data?: PieChartDataPoint[];
  }

  let { isMobile = false, height = 260, data = [] }: Props = $props();

  // Default demo data with colors
  const defaultData: PieChartDataPoint[] = [
    { name: '直接访问', value: 3350, color: 'hsl(var(--chart-1))' },
    { name: '搜索引擎', value: 2100, color: 'hsl(var(--chart-2))' },
    { name: '社交媒体', value: 1800, color: 'hsl(var(--chart-3))' },
    { name: '邮件推广', value: 950, color: 'hsl(var(--chart-4))' },
    { name: '其他渠道', value: 650, color: 'hsl(var(--chart-5))' },
  ];

  const chartData = $derived(data.length > 0 ? data : defaultData);
  const chartHeight = $derived(isMobile ? 220 : height);

  // Calculate total for percentage
  const total = $derived(chartData.reduce((sum, item) => sum + item.value, 0));
</script>

<div class="h-full flex flex-col gap-4">
  <div style="height: {chartHeight}px;" class="w-full flex items-center justify-center">
    <!-- Simple pie visualization using CSS -->
    <div class="relative w-full h-full max-w-[200px] max-h-[200px]">
      <svg viewBox="0 0 100 100" class="w-full h-full -rotate-90">
        {#each chartData as item, index (item.name)}
          {@const prevSum = chartData
            .slice(0, index)
            .reduce((sum, i) => sum + (i.value / total) * 360, 0)}
          {@const angle = (item.value / total) * 360}
          {@const largeArc = angle > 180 ? 1 : 0}
          {@const startRad = (prevSum * Math.PI) / 180}
          {@const endRad = ((prevSum + angle) * Math.PI) / 180}
          {@const x1 = 50 + 40 * Math.cos(startRad)}
          {@const y1 = 50 + 40 * Math.sin(startRad)}
          {@const x2 = 50 + 40 * Math.cos(endRad)}
          {@const y2 = 50 + 40 * Math.sin(endRad)}
          <path
            d="M 50 50 L {x1} {y1} A 40 40 0 {largeArc} 1 {x2} {y2} Z"
            fill={item.color}
            class="transition-opacity hover:opacity-80"
          />
        {/each}
      </svg>
    </div>
  </div>

  <!-- Legend -->
  <div class="flex flex-wrap justify-center gap-3">
    {#each chartData as item (item.name)}
      <div class="flex items-center gap-2">
        <span class="h-2.5 w-2.5 rounded-full" style="background-color: {item.color}"></span>
        <span class="text-xs text-muted-foreground">{item.name}</span>
      </div>
    {/each}
  </div>
</div>
