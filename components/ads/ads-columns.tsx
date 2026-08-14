"use client"

import type { ColumnDef } from "@tanstack/react-table"
import {
  CheckIcon,
  EditIcon,
  ImageIcon,
  LineChartIcon,
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

export function formatPrice(price: number, category: string) {
  if (price === 0) {
    return category === "Jobs" ? "Not disclosed" : "Free / On request"
  }
  return `${price.toLocaleString("en-US")} OMR`
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

export type AdsColumnHandlers = {
  onApprove: (ad: Ad) => void
  onReject: (ad: Ad) => void
  onEdit: (ad: Ad) => void
  onDelete: (ad: Ad) => void
  onViewAnalytics: (ad: Ad) => void
  onToggleFeatured: (ad: Ad, value: boolean) => void
  onToggleSold: (ad: Ad, value: boolean) => void
}

export function getAdsColumns(handlers: AdsColumnHandlers): ColumnDef<Ad>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          indeterminate={
            table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
          }
          onCheckedChange={(value) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "Ad ID",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.id}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => {
        const ad = row.original
        return (
          <div className="flex min-w-56 items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <ImageIcon className="size-4 text-muted-foreground" />
            </div>
            <div className="flex min-w-0 flex-col">
              <span className="max-w-72 truncate text-sm font-medium">
                {ad.title}
              </span>
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                {ad.category}
                {ad.featured && (
                  <Badge variant="outline" className="h-4 px-1.5 text-[10px]">
                    Featured
                  </Badge>
                )}
              </span>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user
        return (
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarFallback>{user.initials}</AvatarFallback>
            </Avatar>
            <span className="max-w-32 truncate text-sm">{user.name}</span>
          </div>
        )
      },
      filterFn: (row, _id, value: string) =>
        row.original.user.name.toLowerCase().includes(value.toLowerCase()) ||
        row.original.title.toLowerCase().includes(value.toLowerCase()),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge
          status={row.original.status}
          rejectionReason={row.original.rejectionReason}
        />
      ),
      filterFn: (row, _id, value: string[]) =>
        !value?.length || value.includes(row.original.status),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums">
          {formatPrice(row.original.price, row.original.category)}
        </span>
      ),
    },
    {
      accessorKey: "postedDate",
      header: "Date",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {formatDate(row.original.postedDate)}
        </span>
      ),
    },
    {
      id: "featured",
      header: "Featured",
      cell: ({ row }) => (
        <Switch
          checked={row.original.featured}
          onCheckedChange={(value) => handlers.onToggleFeatured(row.original, value)}
          aria-label="Toggle featured"
        />
      ),
    },
    {
      id: "sold",
      header: "Sold",
      cell: ({ row }) => (
        <Switch
          checked={row.original.status === "Sold"}
          disabled={row.original.status === "Rejected"}
          onCheckedChange={(value) => handlers.onToggleSold(row.original, value)}
          aria-label="Mark as sold"
        />
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const ad = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon-sm">
                  <MoreHorizontalIcon />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                disabled={ad.status === "Active"}
                onClick={() => handlers.onApprove(ad)}
              >
                <CheckIcon /> Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={ad.status === "Rejected"}
                onClick={() => handlers.onReject(ad)}
              >
                <XIcon /> Reject
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handlers.onEdit(ad)}>
                <EditIcon /> Edit ad details
              </DropdownMenuItem>
              {/* <DropdownMenuItem onClick={() => handlers.onViewAnalytics(ad)}>
                <LineChartIcon /> View analytics
              </DropdownMenuItem> */}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => handlers.onDelete(ad)}
              >
                <Trash2Icon /> Delete ad
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
