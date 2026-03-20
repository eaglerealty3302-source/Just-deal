import React from 'react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Bar, CartesianGrid } from 'recharts';

interface LeaseTimelineRow {
  unit_no: string;
  start: string;
  end: string;
  tenant: string;
}

interface GanttChartWidgetProps {
  data: LeaseTimelineRow[];
  emptyMessage?: string;
}

export function GanttChartWidget({ data, emptyMessage }: GanttChartWidgetProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[220px]">
        <p className="text-sm font-semibold text-foreground">{emptyMessage || "No Data Available For Lease Timeline"}</p>
      </div>
    );
  }

  // Prepare data for Recharts BarChart to simulate Gantt
  // Each bar will represent a lease, with start and end dates
  // This is a simplified representation. A true Gantt chart might require a more specialized library.
  const processedData = data.map(item => ({
    unit_no: item.unit_no,
    start: new Date(item.start).getTime(),
    end: new Date(item.end).getTime(),
    duration: new Date(item.end).getTime() - new Date(item.start).getTime(),
    tenant: item.tenant,
  }));

  // Sort by start date for better visualization
  processedData.sort((a, b) => a.start - b.start);

  const formatTick = (tickItem: number) => {
    return new Date(tickItem).toLocaleDateString();
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={processedData}
          layout="vertical"
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" domain={['dataMin', 'dataMax']} tickFormatter={formatTick} />
          <YAxis dataKey="unit_no" type="category" width={100} />
          <Tooltip
            formatter={(value: number, name: string, props: any) => {
              if (name === 'start') return [`Start: ${formatTick(value)}`, name];
              if (name === 'end') return [`End: ${formatTick(value)}`, name];
              return [value, name];
            }}
          />
          <Bar dataKey="start" stackId="a" fill="transparent" /> {/* Invisible bar to push the actual bar to the start date */}
          <Bar dataKey="duration" stackId="a" fill="hsl(207, 57%, 41%)" name="Lease Duration" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
