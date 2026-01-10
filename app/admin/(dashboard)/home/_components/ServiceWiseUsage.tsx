'use client';

import { Pie, PieChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DashboardUsageDataType } from '@/services/dashboardService';

const chartConfig = {
  visitors: { label: 'Visitors' },
  visa_applications: { label: 'Visa Applications', color: 'var(--chart-1)' },
  passport_services: { label: 'Passport Services', color: 'var(--chart-2)' },
  apostille: { label: 'Apostille', color: 'var(--chart-3)' },
  oci_card: { label: 'OCI Card', color: 'var(--chart-4)' },
} satisfies ChartConfig;

function ServiceWiseUsage({ dashboardUsage }: { dashboardUsage: DashboardUsageDataType[] | null }) {
  const chartData =
    (dashboardUsage ?? [])
      .sort((a, b) => b.percentage - a.percentage)
      .map((item, index) => ({
        service: item.name,
        percentage: item.percentage,
        fill: `var(--chart-${index + 1})`,
      })) || [];

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex items-center justify-between flex-wrap">
        <CardTitle>Service-wise Usage</CardTitle>
      </CardHeader>
      <CardContent className="@container/pie-chart-box my-auto">
        <div className="grid grid-cols-[60%_1fr] @max-lg/pie-chart-box:grid-cols-1 items-center gap-2">
          <div className="chartBox">
            <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[350px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={chartData} dataKey="percentage" nameKey="service" />
              </PieChart>
            </ChartContainer>
          </div>
          <div className="labels space-y-2 pl-4">
            <ul className="labels-list space-y-2">
              {chartData.slice(0, 4).map((e) => (
                <li key={e.service} className="flex items-center gap-2">
                  <span
                    className="inline-block size-4 rounded-sm"
                    style={{ backgroundColor: e.fill }}
                  />
                  <p className="text-sm text-muted-foreground capitalize">
                    {e.service.replace('_', ' ')} – {e.percentage.toFixed(1)}%
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ServiceWiseUsage;
