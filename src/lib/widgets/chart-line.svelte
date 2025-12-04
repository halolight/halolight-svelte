<script lang="ts">
  import { Chart, Axis, Grid, Area, Legend, Tooltip } from 'layerchart';
  import type { WidgetProps, ChartDataPoint } from './types';

  interface Props extends WidgetProps {
    data?: ChartDataPoint[];
  }

  let { isMobile = false, height = 260, data = [] }: Props = $props();

  // Default demo data
  const defaultData: ChartDataPoint[] = [
    { x: '1月', y: 1200 },
    { x: '2月', y: 1900 },
    { x: '3月', y: 1500 },
    { x: '4月', y: 2200 },
    { x: '5月', y: 1800 },
    { x: '6月', y: 2400 },
  ];

  const chartData = $derived(data.length > 0 ? data : defaultData);
  const chartHeight = $derived(isMobile ? 200 : height);
</script>

<div style="height: {chartHeight}px;" class="w-full">
  <Chart
    data={chartData}
    x="x"
    y="y"
    padding={{ left: 40, bottom: 32, right: 10, top: 10 }}
  >
    <Grid />
    <Axis placement="left" grid />
    <Axis placement="bottom" />
    <Area opacity={0.2} class="fill-primary" />
    <Legend />
    <Tooltip let:data>
      <div class="flex items-center justify-between gap-2 p-2">
        <span class="text-xs font-medium">访问量:</span>
        <span class="text-xs ml-2">{data?.y || 0}</span>
      </div>
    </Tooltip>
  </Chart>
</div>
