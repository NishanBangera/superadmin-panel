"use client"

import * as React from "react"
import { Link } from "@/i18n/navigation"
import { useTranslations, useLocale } from "next-intl"
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  MailIcon,
  PhoneIcon,
  ShieldAlertIcon,
  UserIcon,
  XCircleIcon,
  ClockIcon,
  FileTextIcon,
  BuildingIcon,
  Trash2Icon,
} from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { ListingReport, ReportStatus } from "@/components/ads/reports-data"
import { useReportsStore } from "@/components/ads/reports-store"
import { useAdsStore } from "@/components/ads/ads-store"
import { formatDate } from "@/components/ads/ads-columns"

export type ReportDetailsDialogProps = {
  report: ListingReport | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ReportDetailsDialog({
  report,
  open,
  onOpenChange,
}: ReportDetailsDialogProps) {
  const t = useTranslations("ads.reports")
  const locale = useLocale()
  const { setReportStatus, deleteReport } = useReportsStore()
  const { rejectAd } = useAdsStore()

  const [notes, setNotes] = React.useState("")
  const [isNotesModified, setIsNotesModified] = React.useState(false)

  React.useEffect(() => {
    if (report) {
      setNotes(report.moderatorNotes || "")
      setIsNotesModified(false)
    }
  }, [report])

  if (!report) return null

  const handleSaveNotes = () => {
    setReportStatus(report.id, report.status, notes, report.actionTaken)
    setIsNotesModified(false)
    toast.success(t("toasts.notesSaved"))
  }

  const handleUpdateStatus = (newStatus: ReportStatus, actionTaken?: string) => {
    setReportStatus(report.id, newStatus, notes, actionTaken)
    toast.success(
      t("toasts.statusUpdated", {
        id: report.id,
        status: newStatus,
      })
    )
    onOpenChange(false)
  }

  const handleSuspendAd = () => {
    const reasonText = `Suspended due to report ${report.id} (${report.reason}): ${report.details}`
    rejectAd(report.adId, reasonText)
    setReportStatus(
      report.id,
      "Resolved",
      notes,
      `Ad Suspended / Rejected: ${report.reason}`
    )
    toast.success(t("toasts.adSuspended", { adId: report.adId }))
    onOpenChange(false)
  }

  const handleDelete = () => {
    deleteReport(report.id)
    toast.success(`Report ${report.id} deleted`)
    onOpenChange(false)
  }

  const statusBadgeColor =
    report.status === "Pending"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30"
      : report.status === "Investigating"
      ? "bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-500/30"
      : report.status === "Resolved"
      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30"
      : "bg-muted text-muted-foreground border-border"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between gap-3 pe-6">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-semibold text-primary">
                {report.id}
              </span>
              <Badge variant="outline" className={statusBadgeColor}>
                {report.status}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(report.reportedDate, locale)}
            </span>
          </div>
          <DialogTitle className="text-lg font-heading">
            {report.reason}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {t("dialog.subtitle")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2 text-sm">
          {/* Target Listing Summary Card */}
          <div className="flex items-start gap-3 rounded-xl border bg-muted/40 p-3">
            {report.adImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={report.adImage}
                alt={report.adTitle}
                className="size-16 shrink-0 rounded-lg object-cover ring-1 ring-border"
              />
            ) : (
              <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-muted">
                <BuildingIcon className="size-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-muted-foreground">
                  {report.adId}
                </span>
                <Link
                  href={`/ads/${report.adId}`}
                  target="_blank"
                  className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                >
                  Inspect Ad <ExternalLinkIcon className="size-3" />
                </Link>
              </div>
              <p className="font-semibold text-sm truncate">{report.adTitle}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{report.adCategory}</span>
                <span>•</span>
                <span className="font-semibold text-foreground">
                  {report.adPrice.toLocaleString("en-US")} OMR
                </span>
                <span>•</span>
                <Badge variant="outline" className="text-[10px] h-4">
                  {report.adPostingType}
                </Badge>
              </div>
            </div>
          </div>

          {/* User Submitted Report Details */}
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3.5">
            <div className="flex items-center gap-2 font-semibold text-xs text-destructive mb-1.5">
              <ShieldAlertIcon className="size-4" />
              <span>{t("dialog.violationDetails")}: {report.reason}</span>
            </div>
            <p className="text-xs leading-relaxed text-foreground whitespace-pre-line bg-card/60 p-2.5 rounded-lg border">
              &quot;{report.details}&quot;
            </p>
          </div>

          {/* Reporter vs Seller Info */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Reporter Card */}
            <div className="rounded-xl border bg-card p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <UserIcon className="size-3.5" />
                <span>{t("dialog.reporterInfo")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback className="text-xs">
                    {report.reportedBy.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-xs truncate">
                    {report.reportedBy.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MailIcon className="size-3" /> {report.reportedBy.email}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <PhoneIcon className="size-3" /> {report.reportedBy.phone}
                  </span>
                </div>
              </div>
            </div>

            {/* Seller Card */}
            <div className="rounded-xl border bg-card p-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <BuildingIcon className="size-3.5" />
                <span>{t("dialog.sellerInfo")}</span>
              </div>
              <div className="flex items-center gap-2">
                <Avatar size="sm">
                  <AvatarFallback className="text-xs">
                    {report.seller.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <span className="font-medium text-xs truncate">
                    {report.seller.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <MailIcon className="size-3" /> {report.seller.email}
                  </span>
                  <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                    <PhoneIcon className="size-3" /> {report.seller.phone} ({report.seller.accountType})
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Taken (if any) */}
          {report.actionTaken && (
            <div className="flex items-center gap-2 rounded-lg bg-muted/60 p-2.5 text-xs">
              <CheckCircle2Icon className="size-4 text-emerald-600 shrink-0" />
              <div className="flex flex-col">
                <span className="font-semibold text-foreground">
                  {t("dialog.actionTaken")}: {report.actionTaken}
                </span>
                {report.resolvedAt && (
                  <span className="text-[10px] text-muted-foreground">
                    Resolved on {formatDate(report.resolvedAt, locale)}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Moderator Notes */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="moderator-notes"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5"
            >
              <FileTextIcon className="size-3.5" />
              {t("dialog.moderatorNotes")}
            </label>
            <Textarea
              id="moderator-notes"
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value)
                setIsNotesModified(true)
              }}
              placeholder={t("dialog.notesPlaceholder")}
              className="text-xs min-h-20"
            />
            {isNotesModified && (
              <div className="flex justify-end">
                <Button size="xs" variant="outline" onClick={handleSaveNotes}>
                  {t("dialog.saveNotes")}
                </Button>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-2 border-t pt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:bg-destructive/10 text-xs w-full sm:w-auto"
          >
            <Trash2Icon className="size-3.5" />
            {t("actions.deleteReport")}
          </Button>

          <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
            {report.status !== "Investigating" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus("Investigating", "Under Moderator Review")}
                className="text-xs"
              >
                <ClockIcon className="size-3.5" />
                {t("actions.investigate")}
              </Button>
            )}

            {report.status !== "Dismissed" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus("Dismissed", "Dismissed - No Violation")}
                className="text-xs text-muted-foreground"
              >
                <XCircleIcon className="size-3.5" />
                {t("actions.dismiss")}
              </Button>
            )}

            {report.status !== "Resolved" && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleUpdateStatus("Resolved", "Issue Resolved by Moderator")}
                className="text-xs text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
              >
                <CheckCircle2Icon className="size-3.5" />
                {t("actions.resolve")}
              </Button>
            )}

            <Button
              variant="destructive"
              size="sm"
              onClick={handleSuspendAd}
              className="text-xs font-semibold"
            >
              <AlertTriangleIcon className="size-3.5" />
              {t("actions.suspendAd")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
