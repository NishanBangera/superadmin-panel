"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckIcon,
  LineChartIcon,
  SearchIcon,
  SettingsIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { adsData, categories, statuses, type Ad, type AdStatus } from "@/components/ads/ads-data"
import { getAdsColumns } from "@/components/ads/ads-columns"
import { RejectReasonDialog } from "@/components/ads/reject-reason-dialog"
import { EditAdSheet } from "@/components/ads/edit-ad-sheet"
import { DeleteAdDialog } from "@/components/ads/delete-ad-dialog"
import { AdAnalyticsDialog } from "@/components/ads/ad-analytics-dialog"
import { AutoExpirySettingsDialog } from "@/components/ads/auto-expiry-settings-dialog"

export function AdsTable() {
  const [ads, setAds] = React.useState<Ad[]>(adsData)
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

  const [rejectTarget, setRejectTarget] = React.useState<Ad | null>(null)
  const [editTarget, setEditTarget] = React.useState<Ad | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Ad | null>(null)
  const [analyticsTarget, setAnalyticsTarget] = React.useState<
    Ad | "aggregate" | null
  >(null)
  const [autoExpiryOpen, setAutoExpiryOpen] = React.useState(false)

  const updateAd = React.useCallback((id: string, patch: Partial<Ad>) => {
    setAds((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }, [])

  const setStatus = React.useCallback(
    (ad: Ad, status: AdStatus, extra?: Partial<Ad>) => {
      updateAd(ad.id, { status, ...extra })
    },
    [updateAd]
  )

  const handlers = React.useMemo(
    () => ({
      onApprove: (ad: Ad) => {
        setStatus(ad, "Active", { rejectionReason: undefined })
        toast.success(`${ad.id} approved`, { description: ad.title })
      },
      onReject: (ad: Ad) => setRejectTarget(ad),
      onEdit: (ad: Ad) => setEditTarget(ad),
      onDelete: (ad: Ad) => setDeleteTarget(ad),
      onViewAnalytics: (ad: Ad) => setAnalyticsTarget(ad),
      onToggleFeatured: (ad: Ad, value: boolean) => {
        updateAd(ad.id, { featured: value })
        toast.success(value ? `${ad.id} marked as featured` : `${ad.id} removed from featured`)
      },
      onToggleSold: (ad: Ad, value: boolean) => {
        setStatus(ad, value ? "Sold" : "Active")
        toast.success(value ? `${ad.id} marked as sold` : `${ad.id} marked as active`)
      },
    }),
    [setStatus, updateAd]
  )

  const columns = React.useMemo(() => getAdsColumns(handlers), [handlers])

  const filteredData = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return ads.filter((ad) => {
      const matchesQuery =
        !query ||
        ad.title.toLowerCase().includes(query) ||
        ad.user.name.toLowerCase().includes(query) ||
        ad.id.toLowerCase().includes(query)
      const matchesStatus = statusFilter === "all" || ad.status === statusFilter
      const matchesCategory =
        categoryFilter === "all" || ad.category === categoryFilter
      return matchesQuery && matchesStatus && matchesCategory
    })
  }, [ads, search, statusFilter, categoryFilter])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, rowSelection },
    getRowId: (row) => row.id,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  })

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length

  function clearSelection() {
    setRowSelection({})
  }

  function bulkApprove() {
    selectedRows.forEach((r) => setStatus(r.original, "Active", { rejectionReason: undefined }))
    toast.success(`${selectedCount} ad${selectedCount === 1 ? "" : "s"} approved`)
    clearSelection()
  }

  function bulkReject() {
    selectedRows.forEach((r) => setStatus(r.original, "Rejected"))
    toast.success(`${selectedCount} ad${selectedCount === 1 ? "" : "s"} rejected`)
    clearSelection()
  }

  function bulkFeature() {
    selectedRows.forEach((r) => updateAd(r.original.id, { featured: true }))
    toast.success(`${selectedCount} ad${selectedCount === 1 ? "" : "s"} marked as featured`)
    clearSelection()
  }

  function bulkDelete() {
    const ids = new Set(selectedRows.map((r) => r.original.id))
    setAds((prev) => prev.filter((a) => !ids.has(a.id)))
    toast.success(`${selectedCount} ad${selectedCount === 1 ? "" : "s"} deleted`)
    clearSelection()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Ads Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Review, moderate, and manage every listing on the marketplace.
          </p>
        </div>
        {/* <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" onClick={() => setAutoExpiryOpen(true)}>
            <SettingsIcon /> Auto-expiry settings
          </Button>
          <Button variant="outline" onClick={() => setAnalyticsTarget("aggregate")}>
            <LineChartIcon /> Ad reports &amp; analytics
          </Button>
        </div> */}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, user, or ad ID…"
              className="h-9 pl-8"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={categoryFilter}
            onValueChange={(value) => setCategoryFilter(value ?? "all")}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" disabled={selectedCount === 0}>
                Bulk actions
                {selectedCount > 0 && (
                  <span className="ml-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                    {selectedCount}
                  </span>
                )}
                <ChevronDownIcon />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem onClick={bulkApprove}>
              <CheckIcon /> Bulk approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={bulkReject}>
              <XIcon /> Bulk reject
            </DropdownMenuItem>
            <DropdownMenuItem onClick={bulkFeature}>
              <CheckIcon /> Bulk mark as featured
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={bulkDelete}>
              <Trash2Icon /> Bulk delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  No ads match the current filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          {selectedCount > 0
            ? `${selectedCount} of ${filteredData.length} row(s) selected.`
            : `${filteredData.length} ad${filteredData.length === 1 ? "" : "s"} total.`}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {Math.max(table.getPageCount(), 1)}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </div>

      <RejectReasonDialog
        ad={rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onConfirm={(ad, reason) => {
          setStatus(ad, "Rejected", { rejectionReason: reason })
          toast.success(`${ad.id} rejected`, {
            description: "Reason sent to the user's dashboard.",
          })
          setRejectTarget(null)
        }}
      />

      <EditAdSheet
        ad={editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        onSave={(id, patch) => {
          updateAd(id, patch)
          toast.success(`${id} updated`)
          setEditTarget(null)
        }}
      />

      <DeleteAdDialog
        ad={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={(ad) => {
          setAds((prev) => prev.filter((a) => a.id !== ad.id))
          toast.success(`${ad.id} deleted`)
          setDeleteTarget(null)
        }}
      />

      <AdAnalyticsDialog
        target={analyticsTarget}
        onOpenChange={(open) => !open && setAnalyticsTarget(null)}
      />

      <AutoExpirySettingsDialog
        open={autoExpiryOpen}
        onOpenChange={setAutoExpiryOpen}
      />
    </div>
  )
}
