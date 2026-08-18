import { useTranslations } from "next-intl"
import {
  BanIcon,
  CheckIcon,
  FlagIcon,
  TagIcon,
  WalletIcon,
  XIcon,
  type LucideIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { recentActivity } from "@/components/dashboard/dashboard-data"
import { cn } from "@/lib/utils"

const typeStyles: Record<
  string,
  { icon: LucideIcon; className: string }
> = {
  approve: { icon: CheckIcon, className: "bg-emerald-500/10 text-emerald-600" },
  reject: { icon: XIcon, className: "bg-red-500/10 text-red-600" },
  flag: { icon: FlagIcon, className: "bg-amber-500/10 text-amber-600" },
  block: { icon: BanIcon, className: "bg-red-500/10 text-red-600" },
  payment: { icon: WalletIcon, className: "bg-blue-500/10 text-blue-600" },
  sold: { icon: TagIcon, className: "bg-violet-500/10 text-violet-600" },
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function RecentActivityTable() {
  const t = useTranslations("dashboard")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("recentActivity")}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col divide-y divide-border">
        {recentActivity.map((item, index) => {
          const style = typeStyles[item.type]
          const Icon = style.icon
          return (
            <div
              key={index}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Avatar size="sm">
                <AvatarFallback>
                  {item.actor === "System" ? "SY" : initials(item.actor)}
                </AvatarFallback>
              </Avatar>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="truncate text-sm">
                  <span className="font-medium text-foreground">
                    {item.actor}
                  </span>{" "}
                  <span className="text-muted-foreground">{item.action}</span>{" "}
                  <span className="font-medium text-foreground">
                    {item.target}
                  </span>
                </p>
                <span className="text-xs text-muted-foreground">
                  {item.time}
                </span>
              </div>
              <div
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full",
                  style.className
                )}
              >
                <Icon className="size-3.5" />
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
