// Common widget types and interfaces

export interface ChartDataPoint {
  x: Date | string | number;
  y: number;
  label?: string;
}

export interface BarChartDataPoint {
  name: string;
  value: number;
  value2?: number;
}

export interface PieChartDataPoint {
  name: string;
  value: number;
  color?: string;
}

export interface TaskItem {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'done';
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
}

export interface WidgetProps {
  isMobile?: boolean;
  height?: number;
}
