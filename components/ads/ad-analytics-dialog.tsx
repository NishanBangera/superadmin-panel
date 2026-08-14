"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent } from "@/components/ui/card"
import { aggregateTrend, buildAdTrend } from "@/components/ads/ads-analytics-data"
import type { Ad } from "@/components/ads/ads-data"

const chartConfig = {
  views: { label: "Views", color: "var(--chart-1)" },
  clicks: { label: "Clicks", color: "var(--chart-3)" },
} satisfies ChartConfig

function sum(values: number[]) {
  return values.reduce((a, b) => a + b, 0)
}

export function AdAnalyticsDialog({
  target,
  onOpenChange,
}: {
  target: Ad | "aggregate" | null
  onOpenChange: (open: boolean) => void
}) {
  const isAggregate = target === "aggregate"
  const ad = isAggregate ? null : target

  const trend = React.useMemo(() => {
    if (isAggregate) return aggregateTrend
    if (ad) return buildAdTrend(ad.id.charCodeAt(ad.id.length - 1))
    return []
  }, [isAggregate, ad])

  const totalViews = ad ? ad.views : sum(trend.map((t) => t.views))
  const totalClicks = ad ? ad.clicks : sum(trend.map((t) => t.clicks))
  const ctr = totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0"
  const favorites = ad ? ad.favorites : Math.round(totalViews * 0.035)

  return (
    <Dialog open={!!target} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isAggregate ? "Ad reports & analytics" : `Analytics — ${ad?.title}`}
          </DialogTitle>
          <DialogDescription>
            {isAggregate
              ? "Platform-wide ad performance over the last 14 days."
              : `${ad?.id} · views and clicks over the last 14 days.`}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatTile label="Total views" value={totalViews.toLocaleString()} />
          <StatTile label="Total clicks" value={totalClicks.toLocaleString()} />
          <StatTile label="CTR" value={`${ctr}%`} />
          <StatTile label="Favorites" value={favorites.toLocaleString()} />
        </div>

        <ChartContainer config={chartConfig} className="aspect-auto h-64 w-full">
          <LineChart data={trend} margin={{ left: 0, right: 12 }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={2}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Line
              dataKey="views"
              type="monotone"
              stroke="var(--color-views)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="clicks"
              type="monotone"
              stroke="var(--color-clicks)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </DialogContent>
    </Dialog>
  )
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <Card size="sm">
      <CardContent className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="font-heading text-lg font-semibold tracking-tight">
          {value}
        </span>
      </CardContent>
    </Card>
  )
}
