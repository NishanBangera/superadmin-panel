"use client"

import * as React from "react"
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
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"

const defaultOverrides = [
  { category: "Motors", days: "60" },
  { category: "Real Estate", days: "90" },
  { category: "Jobs", days: "30" },
  { category: "Mobile & Tablets", days: "45" },
]

export function AutoExpirySettingsDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [enabled, setEnabled] = React.useState(true)
  const [defaultDays, setDefaultDays] = React.useState("45")
  const [overrides, setOverrides] = React.useState(defaultOverrides)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Auto-Expiry Settings</DialogTitle>
          <DialogDescription>
            Automatically expire listings that haven&apos;t sold after a set
            number of days.
          </DialogDescription>
        </DialogHeader>

        <FieldGroup>
          <Field orientation="horizontal">
            <div className="flex flex-1 flex-col gap-1">
              <FieldLabel htmlFor="auto-expiry-toggle">
                Enable Auto-Expiry
              </FieldLabel>
              <FieldDescription>
                When off, listings stay active until manually managed.
              </FieldDescription>
            </div>
            <Switch
              id="auto-expiry-toggle"
              checked={enabled}
              onCheckedChange={setEnabled}
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="default-days">Default Expiry (Days)</FieldLabel>
            <Input
              id="default-days"
              type="number"
              min={1}
              disabled={!enabled}
              value={defaultDays}
              onChange={(e) => setDefaultDays(e.target.value)}
              className="w-32"
            />
          </Field>

          <FieldSeparator>Per-Category Overrides</FieldSeparator>

          <div className="flex flex-col gap-2">
            {overrides.map((row, index) => (
              <div key={row.category} className="flex items-center gap-3">
                <span className="flex-1 text-sm text-muted-foreground">
                  {row.category}
                </span>
                <Input
                  type="number"
                  min={1}
                  disabled={!enabled}
                  value={row.days}
                  onChange={(e) => {
                    const next = [...overrides]
                    next[index] = { ...row, days: e.target.value }
                    setOverrides(next)
                  }}
                  className="w-24"
                />
                <span className="w-8 text-xs text-muted-foreground">days</span>
              </div>
            ))}
          </div>
        </FieldGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              toast.success("Auto-expiry settings saved")
              onOpenChange(false)
            }}
          >
            Save settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
