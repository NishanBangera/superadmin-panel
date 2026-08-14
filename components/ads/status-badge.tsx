import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { AdStatus } from "@/components/ads/ads-data"

const statusStyles: Record<AdStatus, string> = {
  Pending: "bg-amber-500/10 text-amber-700 dark:text-amber-400",
  Active: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  Rejected: "bg-red-500/10 text-red-700 dark:text-red-400",
  Sold: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
}

export function StatusBadge({
  status,
  rejectionReason,
}: {
  status: AdStatus
  rejectionReason?: string
}) {
  const badge = (
    <Badge
      variant="ghost"
      className={cn("border-transparent", statusStyles[status])}
    >
      {status}
    </Badge>
  )

  if (status === "Rejected" && rejectionReason) {
    return (
      <Tooltip>
        <TooltipTrigger render={<span className="inline-flex" />}>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="max-w-64">
          {rejectionReason}
        </TooltipContent>
      </Tooltip>
    )
  }

  return badge
}
