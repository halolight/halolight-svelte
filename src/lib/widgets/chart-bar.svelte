<script lang="ts">
  import { Chart, Axis, Grid, Bar, Legend, Tooltip } from 'layerchart';
  import type { WidgetProps, BarChartDataPoint } from './types';

  interface Props extends WidgetProps {
    data?: BarChartDataPoint[];
  }

  let { isMobile = false, height = 260, data = [] }: Props = $props();

  // Default demo data
  const defaultData: BarChartDataPoint[] = [
    { name: '1月', value: 6500, value2: 4200 },
    { name: '2月', value: 7200, value2: 4800 },
    { name: '3月', value: 6800, value2: 4500 },
    { name: '4月', value: 8100, value2: 5300 },
    { name: '5月', value: 7600, value2: 5000 },
    { name: '6月', value: 9200, value2: 6100 },
  ];

  const chartData = $derived(data.length > 0 ? data : defaultData);
  const chartHeight = $derived(isMobile ? 200 : height);
</script>

<div style="height: {chartHeight}px;" class="w-full">
  <Chart
    data={chartData}
    x="name"
    y="value"
    padding={{ left: 50, bottom: 40, right: 10, top: 10 }}
  >
    <Grid />
    <Axis placement="left" grid />
    <Axis placement="bottom" />
    <Bar class="fill-primary" />
    <Legend />
    <Tooltip let:data>
      <div class="flex items-center justify-between gap-2 p-2">
        <span class="text-xs font-medium">销售额:</span>
        <span class="text-xs ml-2">¥{(data?.value || 0).toLocaleString()}</span>
      </div>
    </Tooltip>
  </Chart>
</div>
