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
import { useTranslations, useLocale } from "next-intl"
import {
  ArrowDownUpIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterXIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  Trash2Icon,
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
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  categories,
  postingTypes,
  statuses,
  type Ad,
  type AdStatus,
} from "@/components/ads/ads-data"
import { getAdsColumns } from "@/components/ads/ads-columns"
import { RejectReasonDialog } from "@/components/ads/reject-reason-dialog"
import { DeleteAdDialog } from "@/components/ads/delete-ad-dialog"
import { BulkDeleteConfirmDialog } from "@/components/ads/bulk-delete-confirm-dialog"
import { AutoExpirySettingsDialog } from "@/components/ads/auto-expiry-settings-dialog"
import { useAdsStore } from "@/components/ads/ads-store"

export function AdsTable() {
  const t = useTranslations('ads')
  const locale = useLocale()
  const {
    ads,
    updateAd,
    approveAd,
    rejectAd,
    deleteAd,
    deleteAds,
    toggleFeatured,
    toggleSold,
  } = useAdsStore()

  // Filter States
  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [categoryFilter, setCategoryFilter] = React.useState<string>("all")
  const [postingTypeFilter, setPostingTypeFilter] = React.useState<string>("all")
  const [minPrice, setMinPrice] = React.useState<string>("")
  const [maxPrice, setMaxPrice] = React.useState<string>("")
  const [featuredOnly, setFeaturedOnly] = React.useState<boolean>(false)
  const [sortField, setSortField] = React.useState<string>("postedDate")
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("desc")

  // Pagination & Selection States
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({})

  // Modal / Dialog States
  const [rejectTarget, setRejectTarget] = React.useState<Ad | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Ad | null>(null)
  const [bulkDeleteOpen, setBulkDeleteOpen] = React.useState(false)
  const [autoExpiryOpen, setAutoExpiryOpen] = React.useState(false)

  const sortFieldLabels: Record<string, string> = {
    postedDate: t('sort.postedDate'),
    price: t('sort.price'),
    views: t('sort.views'),
    title: t('sort.title'),
  }

  const getSortDirectionLabel = (field: string, direction: "asc" | "desc"): string => {
    if (field === "postedDate") {
      return direction === "desc" ? t('sort.newestFirst') : t('sort.oldestFirst')
    }
    return direction === "desc" ? t('sort.highToLow') : t('sort.lowToHigh')
  }

  const handlers = React.useMemo(
    () => ({
      onApprove: (ad: Ad) => {
        approveAd(ad.id)
        toast.success(t('toasts.approved', { id: ad.id }), { description: ad.title })
      },
      onReject: (ad: Ad) => setRejectTarget(ad),
      onDelete: (ad: Ad) => setDeleteTarget(ad),
      onToggleFeatured: (ad: Ad, value: boolean) => {
        toggleFeatured(ad.id, value)
        toast.success(
          value ? t('toasts.markedFeatured', { id: ad.id }) : t('toasts.removedFeatured', { id: ad.id })
        )
      },
      onToggleSold: (ad: Ad, value: boolean) => {
        toggleSold(ad.id, value)
        toast.success(
          value ? t('toasts.markedSold', { id: ad.id }) : t('toasts.markedActive', { id: ad.id })
        )
      },
    }),
    [approveAd, toggleFeatured, toggleSold, t]
  )

  const columns = React.useMemo(() => getAdsColumns(handlers, t, locale), [handlers, t, locale])

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    postingTypeFilter !== "all" ||
    minPrice !== "" ||
    maxPrice !== "" ||
    featuredOnly ||
    sortField !== "postedDate" ||
    sortDirection !== "desc"

  const resetAllFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setCategoryFilter("all")
    setPostingTypeFilter("all")
    setMinPrice("")
    setMaxPrice("")
    setFeaturedOnly(false)
    setSortField("postedDate")
    setSortDirection("desc")
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
  }

  // Filter and Sort Data
  const filteredData = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    const parsedMinPrice = minPrice !== "" ? parseFloat(minPrice) : null
    const parsedMaxPrice = maxPrice !== "" ? parseFloat(maxPrice) : null

    const result = ads.filter((ad) => {
      // Search
      const matchesQuery =
        !query ||
        ad.title.toLowerCase().includes(query) ||
        ad.user.name.toLowerCase().includes(query) ||
        ad.id.toLowerCase().includes(query) ||
        ad.location.toLowerCase().includes(query)

      // Status
      const matchesStatus = statusFilter === "all" || ad.status === statusFilter

      // Category
      const matchesCategory =
        categoryFilter === "all" || ad.category === categoryFilter

      // Posting Type
      const matchesPostingType =
        postingTypeFilter === "all" || ad.postingType === postingTypeFilter

      // Price Range
      const matchesMinPrice =
        parsedMinPrice === null || isNaN(parsedMinPrice) || ad.price >= parsedMinPrice
      const matchesMaxPrice =
        parsedMaxPrice === null || isNaN(parsedMaxPrice) || ad.price <= parsedMaxPrice

      // Featured
      const matchesFeatured = !featuredOnly || ad.featured

      return (
        matchesQuery &&
        matchesStatus &&
        matchesCategory &&
        matchesPostingType &&
        matchesMinPrice &&
        matchesMaxPrice &&
        matchesFeatured
      )
    })

    // Sort
    result.sort((a, b) => {
      let comparison = 0
      if (sortField === "postedDate") {
        comparison =
          new Date(a.postedDate).getTime() - new Date(b.postedDate).getTime()
      } else if (sortField === "price") {
        comparison = a.price - b.price
      } else if (sortField === "views") {
        comparison = a.views - b.views
      } else if (sortField === "title") {
        comparison = a.title.localeCompare(b.title)
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [
    ads,
    search,
    statusFilter,
    categoryFilter,
    postingTypeFilter,
    minPrice,
    maxPrice,
    featuredOnly,
    sortField,
    sortDirection,
  ])

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination,
      sorting,
      rowSelection,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    getRowId: (row) => row.id,
  })

  const selectedRows = table.getSelectedRowModel().rows
  const selectedCount = selectedRows.length
  const pendingSelectedRows = selectedRows.filter(
    (r) => r.original.status === "Pending"
  )
  const pendingSelectedCount = pendingSelectedRows.length

  function clearSelection() {
    setRowSelection({})
  }

  function bulkApprovePendingOnly() {
    if (pendingSelectedCount === 0) return
    pendingSelectedRows.forEach((r) => approveAd(r.original.id))
    toast.success(t('toasts.bulkApproved', { count: pendingSelectedCount }))
    clearSelection()
  }

  function bulkFeature() {
    selectedRows.forEach((r) => toggleFeatured(r.original.id, true))
    toast.success(t('toasts.bulkFeatured', { count: selectedCount }))
    clearSelection()
  }

  function handleConfirmBulkDelete() {
    const ids = selectedRows.map((r) => r.original.id)
    deleteAds(ids)
    toast.success(t('toasts.bulkDeleted', { count: selectedCount }))
    clearSelection()
  }

  const startRowIndex =
    filteredData.length === 0
      ? 0
      : pagination.pageIndex * pagination.pageSize + 1
  const endRowIndex = Math.min(
    (pagination.pageIndex + 1) * pagination.pageSize,
    filteredData.length
  )

  return (
    <div className="flex flex-col gap-5 min-w-0">
      {/* Header Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {t('pageHeader.title')}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t('pageHeader.description')}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setAutoExpiryOpen(true)}>
            <SettingsIcon className="size-4" /> {t('pageHeader.autoExpirySettings')}
          </Button>
        </div>
      </div>

      {/* Primary & Advanced Filters Section */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card/60 p-4 shadow-xs">
        {/* Row 1: Search and Main Selects */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute top-1/2 start-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value)
                setPagination((prev) => ({ ...prev, pageIndex: 0 }))
              }}
              placeholder={t('filters.searchPlaceholder')}
              className="h-9 ps-9"
            />
          </div>

          {/* Status Dropdown */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val ?? "all")
              setPagination((prev) => ({ ...prev, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className="w-full lg:w-40 h-9">
              <SelectValue>
                {statusFilter === "all" ? t('filters.allStatuses') : statusFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allStatuses')}</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Category Dropdown */}
          <Select
            value={categoryFilter}
            onValueChange={(val) => {
              setCategoryFilter(val ?? "all")
              setPagination((prev) => ({ ...prev, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className="w-full lg:w-48 h-9">
              <SelectValue>
                {categoryFilter === "all" ? t('filters.allCategories') : categoryFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allCategories')}</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Posting Type Dropdown */}
          <Select
            value={postingTypeFilter}
            onValueChange={(val) => {
              setPostingTypeFilter(val ?? "all")
              setPagination((prev) => ({ ...prev, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className="w-full lg:w-44 h-9">
              <SelectValue>
                {postingTypeFilter === "all" ? t('filters.allPostingTypes') : postingTypeFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('filters.allPostingTypes')}</SelectItem>
              {postingTypes.map((pt) => (
                <SelectItem key={pt} value={pt}>
                  {pt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Bulk Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 shrink-0"
                  disabled={selectedCount === 0}
                >
                  {t('bulkActions.label')}
                  {selectedCount > 0 && (
                    <span className="ms-1 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                      {selectedCount}
                    </span>
                  )}
                  <ChevronDownIcon className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              {/* Only allow approve for pending selections */}
              {pendingSelectedCount > 0 && (
                <DropdownMenuItem onClick={bulkApprovePendingOnly}>
                  <SparklesIcon className="size-4 text-emerald-600" />
                  {t('bulkActions.approvePending', { count: pendingSelectedCount })}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={bulkFeature}>
                <SparklesIcon className="size-4 text-amber-500" /> {t('bulkActions.markFeatured')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => setBulkDeleteOpen(true)}
              >
                <Trash2Icon className="size-4" /> {t('bulkActions.bulkDelete')} ({selectedCount})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Row 2: Price Range, Sort By, Sort Order, Featured Toggle, Reset */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Price Range Filter */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{t('filters.priceLabel')}</span>
              <Input
                type="number"
                min={0}
                placeholder={t('filters.minPlaceholder')}
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value)
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                }}
                className="h-8 w-24 text-xs"
              />
              <span>–</span>
              <Input
                type="number"
                min={0}
                placeholder={t('filters.maxPlaceholder')}
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value)
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                }}
                className="h-8 w-24 text-xs"
              />
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            {/* Sort Field and Direction */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <ArrowDownUpIcon className="size-3.5" />
              <span className="font-medium text-foreground">{t('sort.label')}</span>
              <Select
                value={sortField}
                onValueChange={(val) => val && setSortField(val)}
              >
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue>{sortFieldLabels[sortField] || t('sort.postedDate')}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="postedDate">{t('sort.postedDate')}</SelectItem>
                  <SelectItem value="price">{t('sort.price')}</SelectItem>
                  <SelectItem value="views">{t('sort.views')}</SelectItem>
                  <SelectItem value="title">{t('sort.title')}</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortDirection}
                onValueChange={(val) =>
                  val && setSortDirection(val as "asc" | "desc")
                }
              >
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue>{getSortDirectionLabel(sortField, sortDirection)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    {sortField === "postedDate" ? t('sort.newestFirst') : t('sort.highToLow')}
                  </SelectItem>
                  <SelectItem value="asc">
                    {sortField === "postedDate" ? t('sort.oldestFirst') : t('sort.lowToHigh')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="h-4 w-px bg-border hidden sm:block" />

            {/* Featured Only Switch */}
            <div className="flex items-center gap-2">
              <Switch
                id="featured-filter-toggle"
                checked={featuredOnly}
                onCheckedChange={(checked) => {
                  setFeaturedOnly(checked)
                  setPagination((prev) => ({ ...prev, pageIndex: 0 }))
                }}
              />
              <label
                htmlFor="featured-filter-toggle"
                className="text-xs font-medium cursor-pointer text-foreground select-none"
              >
                {t('filters.featuredOnly')}
              </label>
            </div>
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetAllFilters}
              className="h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              <FilterXIcon className="size-3.5" /> {t('filters.clearFilters')}
            </Button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full overflow-x-auto rounded-xl ring-1 ring-foreground/10 bg-card shadow-xs">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent bg-muted/40">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="font-semibold text-xs text-foreground/80 py-3">
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
                  className="transition-colors hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-36 text-center text-sm text-muted-foreground"
                >
                  <div className="flex flex-col items-center justify-center gap-1.5 py-4">
                    <p className="font-medium text-foreground">{t('emptyState.title')}</p>
                    <p className="text-xs text-muted-foreground">
                      {t('emptyState.description')}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetAllFilters}
                        className="mt-2"
                      >
                        {t('emptyState.resetButton')}
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & Footer Controls */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row text-xs text-muted-foreground">
        <div className="flex flex-wrap items-center gap-4">
          <p>
            {selectedCount > 0
              ? t('pagination.selected', { count: selectedCount, total: filteredData.length })
              : t('pagination.showing', { start: startRowIndex, end: endRowIndex, total: filteredData.length })}
          </p>

          {/* Items per page selector */}
          <div className="flex items-center gap-1.5">
            <span>{t('pagination.rowsPerPage')}</span>
            <Select
              value={String(pagination.pageSize)}
              onValueChange={(val) => {
                if (val) {
                  setPagination({
                    pageIndex: 0,
                    pageSize: Number(val),
                  })
                }
              }}
            >
              <SelectTrigger className="h-8 w-18 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Page navigation */}
        <div className="flex items-center gap-2">
          <span>
            {t('pagination.pageOf', { current: table.getPageCount() === 0 ? 1 : pagination.pageIndex + 1, total: Math.max(table.getPageCount(), 1) })}
          </span>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeftIcon className="size-4 rtl:rotate-180" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRightIcon className="size-4 rtl:rotate-180" />
          </Button>
        </div>
      </div>

      {/* Dialogs */}
      <RejectReasonDialog
        ad={rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        onConfirm={(ad, reason) => {
          rejectAd(ad.id, reason)
          toast.success(t('toasts.rejected', { id: ad.id }), {
            description: t('toasts.rejectedDescription'),
          })
          setRejectTarget(null)
        }}
      />

      <DeleteAdDialog
        ad={deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        onConfirm={(ad) => {
          deleteAd(ad.id)
          toast.success(t('toasts.deleted', { id: ad.id }))
          setDeleteTarget(null)
        }}
      />

      <BulkDeleteConfirmDialog
        open={bulkDeleteOpen}
        count={selectedCount}
        onOpenChange={setBulkDeleteOpen}
        onConfirm={handleConfirmBulkDelete}
      />

      <AutoExpirySettingsDialog
        open={autoExpiryOpen}
        onOpenChange={setAutoExpiryOpen}
      />
    </div>
  )
}
