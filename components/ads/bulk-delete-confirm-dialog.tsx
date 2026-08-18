"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AlertTriangleIcon } from "lucide-react"

export function BulkDeleteConfirmDialog({
  open,
  count,
  onOpenChange,
  onConfirm,
}: {
  open: boolean
  count: number
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangleIcon className="size-5" />
            </div>
            <DialogTitle>Delete {count} Selected Ads?</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            You are about to permanently delete{" "}
            <span className="font-semibold text-foreground">
              {count} {count === 1 ? "ad" : "ads"}
            </span>
            . This action cannot be undone and will remove the listings and all
            associated analytics.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
          >
            Delete {count} {count === 1 ? "Ad" : "Ads"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
