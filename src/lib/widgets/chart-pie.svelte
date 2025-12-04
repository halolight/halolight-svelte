<script lang="ts">
  import { Chart, Pie, Legend, Tooltip } from 'layerchart';
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
  <div style="height: {chartHeight}px;" class="w-full">
    <Chart
      data={chartData}
      value="value"
      category="name"
      padding={{ left: 10, right: 10, top: 10, bottom: 10 }}
    >
      <Pie />
      <Legend />
      <Tooltip let:data>
        <div class="space-y-1 p-2">
          <div class="text-xs font-medium">{data?.name || ''}</div>
          <div class="text-xs text-muted-foreground">
            {(data?.value || 0).toLocaleString()} ({(((data?.value || 0) / total) * 100).toFixed(1)}%)
          </div>
        </div>
      </Tooltip>
    </Chart>
  </div>

  <!-- Legend -->
  <div class="flex flex-wrap justify-center gap-3">
    {#each chartData as item}
      <div class="flex items-center gap-2">
        <span
          class="h-2.5 w-2.5 rounded-full"
          style="background-color: {item.color}"
        ></span>
        <span class="text-xs text-muted-foreground">{item.name}</span>
      </div>
    {/each}
  </div>
</div>
