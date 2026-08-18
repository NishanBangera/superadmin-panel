"use client"

import type { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import {
  CheckIcon,
  EditIcon,
  EyeIcon,
  ImageIcon,
  MoreHorizontalIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Switch } from "@/components/ui/switch"
import { StatusBadge } from "@/components/ads/status-badge"
import type { Ad } from "@/components/ads/ads-data"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TranslatorFn = (key: string, values?: any) => string

export function formatPrice(
  price: number,
  postingType: string | undefined,
  t: TranslatorFn
) {
  if (price === 0) {
    return t("cellValues.onRequest")
  }
  const formatted = `${price.toLocaleString("en-US")} ${t("cellValues.currency")}`
  return postingType === "For Rent" ? `${formatted} ${t("cellValues.perMonth")}` : formatted
}

export function formatDate(value: string, locale: string) {
  return new Date(value).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

const postingTypeColors: Record<string, string> = {
  "For Sale": "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  "For Rent": "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  "Projects": "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
}

function getPostingTypeLabel(
  postingType: string | undefined,
  t: TranslatorFn
): string {
  switch (postingType) {
    case "For Sale":
      return t("cellValues.forSale")
    case "For Rent":
      return t("cellValues.forRent")
    case "Projects":
      return t("cellValues.projects")
    default:
      return t("cellValues.forSale")
  }
}

export type AdsColumnHandlers = {
  onApprove: (ad: Ad) => void
  onReject: (ad: Ad) => void
  onDelete: (ad: Ad) => void
  onToggleFeatured: (ad: Ad, value: boolean) => void
  onToggleSold: (ad: Ad, value: boolean) => void
}

export function getAdsColumns(
  handlers: AdsColumnHandlers,
  t: TranslatorFn,
  locale: string
): ColumnDef<Ad>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label={t("cellValues.selectAll")}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label={t("cellValues.selectRow")}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("columns.adId"),
      cell: ({ row }) => (
        <Link
          href={`/ads/${row.original.id}`}
          className="font-mono text-xs font-medium text-foreground hover:underline"
        >
          {row.original.id}
        </Link>
      ),
    },
    {
      accessorKey: "title",
      header: t("columns.listingCategory"),
      cell: ({ row }) => {
        const ad = row.original
        const primaryImage = ad.images && ad.images.length > 0 ? ad.images[0] : null

        return (
          <div className="flex min-w-64 items-center gap-3">
            <Link
              href={`/ads/${ad.id}`}
              className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10 transition-opacity hover:opacity-80"
            >
              {primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryImage}
                  alt={ad.title}
                  className="size-full object-cover"
                />
              ) : (
                <ImageIcon className="size-5 text-muted-foreground" />
              )}
            </Link>
            <div className="flex min-w-0 flex-col gap-0.5">
              <Link
                href={`/ads/${ad.id}`}
                className="max-w-72 truncate text-sm font-medium text-foreground hover:underline"
                title={ad.title}
              >
                {ad.title}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
                <span>{ad.category}</span>
                {ad.subcategory && (
                  <>
                    <span>•</span>
                    <span className="truncate max-w-28">{ad.subcategory}</span>
                  </>
                )}
                {ad.featured && (
                  <Badge
                    variant="outline"
                    className="h-4 border-amber-500/30 bg-amber-500/10 px-1.5 text-[10px] text-amber-700 dark:text-amber-400 font-normal"
                  >
                    Featured
                  </Badge>
                )}
              </div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "postingType",
      header: t("columns.type"),
      cell: ({ row }) => {
        const type = row.original.postingType || "For Sale"
        return (
          <Badge
            variant="outline"
            className={postingTypeColors[type] || "bg-muted text-muted-foreground"}
          >
            {getPostingTypeLabel(row.original.postingType, t)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "user",
      header: t("columns.user"),
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col min-w-0">
              <span className="max-w-32 truncate text-sm font-medium">
                {user.name}
              </span>
              <span className="text-[11px] text-muted-foreground">
                {user.accountType || t("cellValues.individual")}
              </span>
            </div>
          </div>
        )
      },
      filterFn: (row, _id, value: string) =>
        row.original.user.name.toLowerCase().includes(value.toLowerCase()) ||
        row.original.title.toLowerCase().includes(value.toLowerCase()) ||
        row.original.id.toLowerCase().includes(value.toLowerCase()),
    },
    {
      accessorKey: "status",
      header: t("columns.status"),
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
          rejectionReason={row.original.rejectionReason}
        />
      ),
    },
    {
      accessorKey: "price",
      header: t("columns.price"),
      cell: ({ row }) => (
        <span className="text-sm font-medium tabular-nums">
          {formatPrice(row.original.price, row.original.postingType, t)}
        </span>
      ),
    },
    {
      accessorKey: "postedDate",
      header: t("columns.date"),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {formatDate(row.original.postedDate, locale)}
        </span>
      ),
    },
    {
      id: "featured",
      header: t("columns.featured"),
      cell: ({ row }) => (
        <Switch
          checked={row.original.featured}
          onCheckedChange={(value) =>
            handlers.onToggleFeatured(row.original, value)
          }
          aria-label={t("cellValues.toggleFeatured")}
        />
      ),
    },
    {
      id: "sold",
      header: t("columns.sold"),
      cell: ({ row }) => (
        <Switch
          checked={row.original.status === "Sold"}
          disabled={row.original.status === "Rejected"}
          onCheckedChange={(value) =>
            handlers.onToggleSold(row.original, value)
          }
          aria-label={t("cellValues.markAsSold")}
        />
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const ad = row.original
        const isPending = ad.status === "Pending"

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontalIcon className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                render={<Link href={`/ads/${ad.id}`} className="flex items-center gap-2 w-full" />}
              >
                <EyeIcon className="size-4" /> {t("cellValues.viewDetails")}
              </DropdownMenuItem>
              <DropdownMenuItem
                render={<Link href={`/ads/${ad.id}/edit`} className="flex items-center gap-2 w-full" />}
              >
                <EditIcon className="size-4" /> {t("cellValues.editAdDetails")}
              </DropdownMenuItem>

              {/* ONLY show Approve and Reject options for pending ads */}
              {isPending && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handlers.onApprove(ad)}
                    className="text-emerald-600 focus:text-emerald-700 dark:text-emerald-400"
                  >
                    <CheckIcon className="size-4 text-emerald-600" /> {t("cellValues.approveAd")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handlers.onReject(ad)}
                    className="text-destructive focus:text-destructive"
                  >
                    <XIcon className="size-4" /> {t("cellValues.rejectAd")}
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handlers.onDelete(ad)}
              >
                <Trash2Icon className="size-4" /> {t("cellValues.deleteAd")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
