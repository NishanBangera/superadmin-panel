"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import type { Ad } from "@/components/ads/ads-data"

function RejectReasonForm({
  ad,
  onOpenChange,
  onConfirm,
}: {
  ad: Ad
  onOpenChange: (open: boolean) => void
  onConfirm: (ad: Ad, reason: string) => void
}) {
  const [reason, setReason] = React.useState("")

  return (
    <>
      <DialogHeader>
        <DialogTitle>Reject Ad</DialogTitle>
        <DialogDescription>
          Rejecting <span className="font-medium text-foreground">{ad.title}</span> ({ad.id}).
        </DialogDescription>
      </DialogHeader>

      <Field>
        <FieldLabel htmlFor="reject-reason">Rejection Reason</FieldLabel>
        <Textarea
          id="reject-reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="e.g. Listed price appears to be a down payment, not the full price. Please update and resubmit."
          rows={4}
          autoFocus
        />
        <FieldDescription>
          This comment will be shown on the user&apos;s dashboard against this ad.
        </FieldDescription>
      </Field>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          variant="destructive"
          disabled={!reason.trim()}
          onClick={() => onConfirm(ad, reason.trim())}
        >
          Reject Ad
        </Button>
      </DialogFooter>
    </>
  )
}

export function RejectReasonDialog({
  ad,
  onOpenChange,
  onConfirm,
}: {
  ad: Ad | null
  onOpenChange: (open: boolean) => void
  onConfirm: (ad: Ad, reason: string) => void
}) {
  return (
    <Dialog open={!!ad} onOpenChange={onOpenChange}>
      <DialogContent>
        {ad && (
          <RejectReasonForm key={ad.id} ad={ad} onOpenChange={onOpenChange} onConfirm={onConfirm} />
        )}
      </DialogContent>
    </Dialog>
  )
}
