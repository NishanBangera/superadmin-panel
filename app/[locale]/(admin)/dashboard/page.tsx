import { KpiCards } from "@/components/dashboard/kpi-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { CategoryPerformanceChart } from "@/components/dashboard/category-performance-chart"
import { RecentActivityTable } from "@/components/dashboard/recent-activity-table"

export default function DashboardPage() {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">ZOQO DEAL</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Dashboard
        </h1>
      </div>

      <KpiCards />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <RevenueChart />
        <CategoryPerformanceChart />
      </div>

      <RecentActivityTable />
    </div>
  )
}
