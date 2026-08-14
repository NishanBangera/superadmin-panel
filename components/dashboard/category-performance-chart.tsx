"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { categoryPerformance } from "@/components/dashboard/dashboard-data"

const chartConfig = {
  listings: {
    label: "Active listings",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig

export function CategoryPerformanceChart() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Category performance</CardTitle>
        <CardDescription>Active listings by top category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <BarChart
            data={categoryPerformance}
            layout="vertical"
            margin={{ left: 0, right: 12 }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" hide />
            <YAxis
              dataKey="category"
              type="category"
              tickLine={false}
              axisLine={false}
              width={110}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Bar
              dataKey="listings"
              fill="var(--color-listings)"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
