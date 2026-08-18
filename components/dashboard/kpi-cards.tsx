import {
  CreditCardIcon,
  MegaphoneIcon,
  ClockIcon,
  StarIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  UsersIcon,
  WalletIcon,
  type LucideIcon,
} from "lucide-react"
import { useTranslations } from "next-intl"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { kpis } from "@/components/dashboard/dashboard-data"
import { cn } from "@/lib/utils"

const iconMap: Record<string, LucideIcon> = {
  users: UsersIcon,
  megaphone: MegaphoneIcon,
  clock: ClockIcon,
  star: StarIcon,
  wallet: WalletIcon,
  "credit-card": CreditCardIcon,
}

export function KpiCards() {
  const t = useTranslations("dashboard")

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {kpis.map((kpi) => {
        const Icon = iconMap[kpi.icon]
        const TrendIcon = kpi.trend === "up" ? TrendingUpIcon : TrendingDownIcon
        return (
          <Card key={kpi.labelKey} size="sm">
            <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
              <span className="text-sm text-muted-foreground">
                {t(kpi.labelKey)}
              </span>
              <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="flex items-end justify-between gap-2">
              <span className="font-heading text-2xl font-semibold tracking-tight">
                {kpi.value}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 text-xs font-medium",
                  kpi.trend === "up" ? "text-emerald-600" : "text-muted-foreground"
                )}
              >
                <TrendIcon className="size-3.5" />
                {kpi.change}
              </span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
