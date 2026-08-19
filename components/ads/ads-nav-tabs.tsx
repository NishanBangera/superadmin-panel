"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import {
  LayoutListIcon,
  ClockIcon,
  CheckCircle2Icon,
  ZapIcon,
  FlagIcon,
} from "lucide-react"

import { Link, usePathname } from "@/i18n/navigation"
import { useAdsStore } from "@/components/ads/ads-store"
import { useReportsStore } from "@/components/ads/reports-store"
import { cn } from "@/lib/utils"

export function AdsNavTabs({ className }: { className?: string }) {
  const t = useTranslations("ads")
  const pathname = usePathname()
  const { ads, isLoaded: adsLoaded } = useAdsStore()
  const { reports, pendingCount: pendingReportsCount, isLoaded: reportsLoaded } = useReportsStore()

  const allCount = adsLoaded ? ads.length : 0
  const pendingCount = adsLoaded ? ads.filter((a) => a.status === "Pending").length : 0
  const soldCount = adsLoaded ? ads.filter((a) => a.status === "Sold").length : 0
  const zoqodealCount = adsLoaded
    ? ads.filter((a) => a.postingType === "Sell ZoqoDeal").length
    : 0
  const reportsCount = reportsLoaded ? reports.length : 0

  const tabs = [
    {
      id: "all",
      href: "/ads",
      label: t("tabs.all"),
      icon: LayoutListIcon,
      count: allCount,
      isActive: pathname === "/ads",
    },
    {
      id: "pending",
      href: "/ads/pending",
      label: t("tabs.pending"),
      icon: ClockIcon,
      count: pendingCount,
      badgeVariant: pendingCount > 0 ? "warning" : "default",
      isActive: pathname === "/ads/pending",
    },
    {
      id: "sold",
      href: "/ads/sold",
      label: t("tabs.sold"),
      icon: CheckCircle2Icon,
      count: soldCount,
      isActive: pathname === "/ads/sold",
    },
    {
      id: "zoqodeal",
      href: "/ads/zoqodeal",
      label: t("tabs.zoqodeal"),
      icon: ZapIcon,
      count: zoqodealCount,
      isActive: pathname === "/ads/zoqodeal",
    },
    {
      id: "reports",
      href: "/ads/reports",
      label: t("tabs.reports"),
      icon: FlagIcon,
      count: reportsCount,
      badgeCount: pendingReportsCount > 0 ? pendingReportsCount : reportsCount,
      badgeVariant: pendingReportsCount > 0 ? "destructive" : "default",
      isActive: pathname === "/ads/reports",
    },
  ]

  return (
    <div className={cn("w-full overflow-x-auto pb-1", className)} style={{ scrollbarWidth: "none" }}>
      <nav
        className="inline-flex min-w-full items-center gap-1 rounded-xl border bg-muted/40 p-1 text-sm font-medium"
        aria-label="Ads management navigation"
      >
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs transition-all whitespace-nowrap",
                tab.isActive
                  ? "bg-card text-foreground shadow-xs ring-1 ring-border font-semibold"
                  : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "size-3.5 shrink-0",
                  tab.isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="hidden sm:inline">{tab.label}</span>
              <span
                className={cn(
                  "inline-flex h-4.5 min-w-4.5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold tabular-nums",
                  tab.badgeVariant === "warning"
                    ? "bg-amber-500/20 text-amber-800 dark:text-amber-300"
                    : tab.badgeVariant === "destructive"
                    ? "bg-destructive/15 text-destructive"
                    : tab.isActive
                    ? "bg-muted text-foreground"
                    : "bg-muted/70 text-muted-foreground"
                )}
              >
                {tab.badgeCount !== undefined ? tab.badgeCount : tab.count}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
