"use client"

import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table"
import { Link } from "@/i18n/navigation"
import { useTranslations, useLocale } from "next-intl"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  ExternalLinkIcon,
  EyeIcon,
  FilterXIcon,
  MoreHorizontalIcon,
  SearchIcon,
  ShieldAlertIcon,
  Trash2Icon,
  XCircleIcon,
  SearchCheckIcon,
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
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { AdsNavTabs } from "@/components/ads/ads-nav-tabs"
import {
  reportReasons,
  reportStatuses,
  type ListingReport,
  type ReportStatus,
} from "@/components/ads/reports-data"
import { useReportsStore } from "@/components/ads/reports-store"
import { useAdsStore } from "@/components/ads/ads-store"
import { ReportDetailsDialog } from "@/components/ads/report-details-dialog"
import { formatDate } from "@/components/ads/ads-columns"

export function ReportsTable() {
  const t = useTranslations("ads")
  const locale = useLocale()
  const { reports, setReportStatus, deleteReport } = useReportsStore()
  const { rejectAd } = useAdsStore()

  const [search, setSearch] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [reasonFilter, setReasonFilter] = React.useState<string>("all")
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [selectedReport, setSelectedReport] = React.useState<ListingReport | null>(null)
  const [detailsOpen, setDetailsOpen] = React.useState(false)

  // Metrics
  const metrics = React.useMemo(() => {
    const total = reports.length
    const pending = reports.filter((r) => r.status === "Pending").length
    const investigating = reports.filter((r) => r.status === "Investigating").length
    const resolved = reports.filter((r) => r.status === "Resolved" || r.status === "Dismissed").length
    return { total, pending, investigating, resolved }
  }, [reports])

  const handleInspect = (report: ListingReport) => {
    setSelectedReport(report)
    setDetailsOpen(true)
  }

  const handleUpdateStatus = (
    report: ListingReport,
    status: ReportStatus,
    actionTaken?: string
  ) => {
    setReportStatus(report.id, status, report.moderatorNotes, actionTaken)
    toast.success(
      t("reports.toasts.statusUpdated", {
        id: report.id,
        status,
      })
    )
  }

  const handleSuspendAd = (report: ListingReport) => {
    const reasonText = `Suspended due to report ${report.id} (${report.reason}): ${report.details}`
    rejectAd(report.adId, reasonText)
    setReportStatus(
      report.id,
      "Resolved",
      report.moderatorNotes,
      `Ad Suspended / Rejected: ${report.reason}`
    )
    toast.success(t("reports.toasts.adSuspended", { adId: report.adId }))
  }

  const handleDelete = (report: ListingReport) => {
    deleteReport(report.id)
    toast.success(`Report ${report.id} deleted`)
  }

  const filteredData = React.useMemo(() => {
    const query = search.trim().toLowerCase()
    return reports.filter((r) => {
      const matchesQuery =
        !query ||
        r.id.toLowerCase().includes(query) ||
        r.adId.toLowerCase().includes(query) ||
        r.adTitle.toLowerCase().includes(query) ||
        r.reportedBy.name.toLowerCase().includes(query) ||
        r.seller.name.toLowerCase().includes(query) ||
        r.reason.toLowerCase().includes(query)

      const matchesStatus = statusFilter === "all" || r.status === statusFilter
      const matchesReason = reasonFilter === "all" || r.reason === reasonFilter

      return matchesQuery && matchesStatus && matchesReason
    })
  }, [reports, search, statusFilter, reasonFilter])

  const columns = React.useMemo<ColumnDef<ListingReport>[]>(
    () => [
      {
        accessorKey: "id",
        header: t("reports.columns.reportId"),
        cell: ({ row }) => (
          <button
            type="button"
            onClick={() => handleInspect(row.original)}
            className="font-mono text-xs font-semibold text-primary hover:underline cursor-pointer"
          >
            {row.original.id}
          </button>
        ),
      },
      {
        accessorKey: "adTitle",
        header: t("reports.columns.listing"),
        cell: ({ row }) => {
          const report = row.original
          return (
            <div className="flex items-center gap-3 min-w-56">
              {report.adImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={report.adImage}
                  alt={report.adTitle}
                  className="size-10 shrink-0 rounded-md object-cover ring-1 ring-border"
                />
              ) : (
                <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <AlertTriangleIcon className="size-4" />
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <Link
                  href={`/ads/${report.adId}`}
                  target="_blank"
                  className="text-xs font-semibold text-foreground hover:underline truncate max-w-48 flex items-center gap-1"
                  title={report.adTitle}
                >
                  {report.adTitle} <ExternalLinkIcon className="size-2.5 shrink-0 text-muted-foreground" />
                </Link>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="font-mono">{report.adId}</span>
                  <span>•</span>
                  <span>{report.adCategory}</span>
                </div>
              </div>
            </div>
          )
        },
      },
      {
        accessorKey: "reason",
        header: t("reports.columns.reason"),
        cell: ({ row }) => {
          const report = row.original
          return (
            <div className="flex flex-col gap-0.5 max-w-64">
              <span className="font-medium text-xs text-foreground flex items-center gap-1.5">
                <ShieldAlertIcon className="size-3.5 text-destructive shrink-0" />
                <span className="truncate">{report.reason}</span>
              </span>
              <span className="text-[11px] text-muted-foreground line-clamp-1">
                {report.details}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "reportedBy",
        header: t("reports.columns.reporter"),
        cell: ({ row }) => {
          const reporter = row.original.reportedBy
          return (
            <div className="flex flex-col min-w-0 text-xs">
              <span className="font-medium truncate max-w-32">{reporter.name}</span>
              <span className="text-[11px] text-muted-foreground truncate max-w-32">
                {reporter.phone}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "seller",
        header: t("reports.columns.seller"),
        cell: ({ row }) => {
          const seller = row.original.seller
          return (
            <div className="flex flex-col min-w-0 text-xs">
              <span className="font-medium truncate max-w-32">{seller.name}</span>
              <span className="text-[11px] text-muted-foreground">
                {seller.accountType}
              </span>
            </div>
          )
        },
      },
      {
        accessorKey: "reportedDate",
        header: t("reports.columns.date"),
        cell: ({ row }) => (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {formatDate(row.original.reportedDate, locale)}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: t("reports.columns.status"),
        cell: ({ row }) => {
          const status = row.original.status
          const badgeClass =
            status === "Pending"
              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
              : status === "Investigating"
              ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30"
              : status === "Resolved"
              ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
              : "bg-muted text-muted-foreground border-border"

          return (
            <Badge variant="outline" className={badgeClass}>
              {status}
            </Badge>
          )
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => {
          const report = row.original
          return (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontalIcon className="size-4" />
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem onClick={() => handleInspect(report)}>
                  <EyeIcon className="size-4" /> {t("reports.actions.viewDetails")}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                {report.status !== "Investigating" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleUpdateStatus(report, "Investigating", "Under Moderator Review")
                    }
                  >
                    <ClockIcon className="size-4" /> {t("reports.actions.investigate")}
                  </DropdownMenuItem>
                )}

                {report.status !== "Resolved" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleUpdateStatus(report, "Resolved", "Resolved by Admin")
                    }
                    className="text-emerald-600 focus:text-emerald-700"
                  >
                    <CheckCircle2Icon className="size-4" /> {t("reports.actions.resolve")}
                  </DropdownMenuItem>
                )}

                {report.status !== "Dismissed" && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleUpdateStatus(report, "Dismissed", "Dismissed - No Violation")
                    }
                  >
                    <XCircleIcon className="size-4" /> {t("reports.actions.dismiss")}
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleSuspendAd(report)}
                >
                  <AlertTriangleIcon className="size-4" /> {t("reports.actions.suspendAd")}
                </DropdownMenuItem>

                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => handleDelete(report)}
                >
                  <Trash2Icon className="size-4" /> {t("reports.actions.deleteReport")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [t, locale]
  )

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const hasActiveFilters =
    search.trim() !== "" || statusFilter !== "all" || reasonFilter !== "all"

  const resetFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setReasonFilter("all")
    setPagination((prev) => ({ ...prev, pageIndex: 0 }))
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
            {t("reports.title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("reports.description")}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <AdsNavTabs />

      {/* Metrics Banner */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Card className="flex-row items-center justify-between gap-3 p-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {t("reports.totalReports")}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
              {metrics.total}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted text-muted-foreground">
            <ShieldAlertIcon className="size-5" />
          </div>
        </Card>

        <Card className="flex-row items-center justify-between gap-3 p-4 border-amber-500/30 bg-amber-500/5">
          <div>
            <p className="text-xs font-medium text-amber-700 dark:text-amber-400">
              {t("reports.pendingReports")}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
              {metrics.pending}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600">
            <ClockIcon className="size-5" />
          </div>
        </Card>

        <Card className="flex-row items-center justify-between gap-3 p-4 border-blue-500/30 bg-blue-500/5">
          <div>
            <p className="text-xs font-medium text-blue-700 dark:text-blue-400">
              {t("reports.investigatingReports")}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
              {metrics.investigating}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/20 text-blue-600">
            <SearchCheckIcon className="size-5" />
          </div>
        </Card>

        <Card className="flex-row items-center justify-between gap-3 p-4 border-emerald-500/30 bg-emerald-500/5">
          <div>
            <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">
              {t("reports.resolvedReports")}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground mt-1">
              {metrics.resolved}
            </p>
          </div>
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600">
            <CheckCircle2Icon className="size-5" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 rounded-xl border bg-card/60 p-4 shadow-xs">
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
              placeholder={t("reports.searchPlaceholder")}
              className="h-9 ps-9"
            />
          </div>

          {/* Status Filter */}
          <Select
            value={statusFilter}
            onValueChange={(val) => {
              setStatusFilter(val ?? "all")
              setPagination((prev) => ({ ...prev, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className="w-full lg:w-44 h-9">
              <SelectValue>
                {statusFilter === "all" ? t("filters.allStatuses") : statusFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
              {reportStatuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Reason Filter */}
          <Select
            value={reasonFilter}
            onValueChange={(val) => {
              setReasonFilter(val ?? "all")
              setPagination((prev) => ({ ...prev, pageIndex: 0 }))
            }}
          >
            <SelectTrigger className="w-full lg:w-56 h-9">
              <SelectValue>
                {reasonFilter === "all" ? t("reports.allReasons") : reasonFilter}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("reports.allReasons")}</SelectItem>
              {reportReasons.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-9 text-xs text-muted-foreground hover:text-foreground shrink-0"
            >
              <FilterXIcon className="size-3.5" /> {t("filters.clearFilters")}
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
                    <p className="font-medium text-foreground">No reports found</p>
                    <p className="text-xs text-muted-foreground">
                      No user submitted flags matching the current filter criteria.
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="mt-2"
                      >
                        Reset filters
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
        <p>
          {t("pagination.showing", {
            start: startRowIndex,
            end: endRowIndex,
            total: filteredData.length,
          })}
        </p>

        <div className="flex items-center gap-2">
          <span>
            {t("pagination.pageOf", {
              current: table.getPageCount() === 0 ? 1 : pagination.pageIndex + 1,
              total: Math.max(table.getPageCount(), 1),
            })}
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

      {/* Details Dialog */}
      <ReportDetailsDialog
        report={selectedReport}
        open={detailsOpen}
        onOpenChange={(open) => {
          setDetailsOpen(open)
          if (!open) setSelectedReport(null)
        }}
      />
    </div>
  )
}
