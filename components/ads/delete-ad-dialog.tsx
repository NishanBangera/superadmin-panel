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
import type { Ad } from "@/components/ads/ads-data"

export function DeleteAdDialog({
  ad,
  onOpenChange,
  onConfirm,
}: {
  ad: Ad | null
  onOpenChange: (open: boolean) => void
  onConfirm: (ad: Ad) => void
}) {
  return (
    <Dialog open={!!ad} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this ad?</DialogTitle>
          <DialogDescription>
            {ad ? (
              <>
                <span className="font-medium text-foreground">{ad.title}</span>{" "}
                ({ad.id}) will be permanently removed. This action cannot be
                undone.
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => ad && onConfirm(ad)}>
            Delete ad
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
