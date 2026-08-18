"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Textarea } from "@/components/ui/textarea"
import { categories, statuses, type Ad } from "@/components/ads/ads-data"

type FormState = {
  title: string
  category: string
  price: string
  status: string
  location: string
  description: string
}

function toForm(ad: Ad): FormState {
  return {
    title: ad.title,
    category: ad.category,
    price: String(ad.price),
    status: ad.status,
    location: ad.location,
    description: ad.description,
  }
}

function EditAdForm({
  ad,
  onOpenChange,
  onSave,
}: {
  ad: Ad
  onOpenChange: (open: boolean) => void
  onSave: (id: string, patch: Partial<Ad>) => void
}) {
  const [form, setForm] = React.useState<FormState>(() => toForm(ad))

  return (
    <>
      <SheetHeader>
        <SheetTitle>Edit Ad Details</SheetTitle>
        <SheetDescription>
          Updating {ad.id} — changes apply immediately in this preview.
        </SheetDescription>
      </SheetHeader>

      <FieldGroup className="px-4">
        <Field>
          <FieldLabel htmlFor="edit-title">Title</FieldLabel>
          <Input
            id="edit-title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </Field>

        <Field orientation="responsive">
          <Field>
            <FieldLabel htmlFor="edit-category">Category</FieldLabel>
            <Select
              value={form.category}
              onValueChange={(value) =>
                value && setForm({ ...form, category: value })
              }
            >
              <SelectTrigger id="edit-category" className="w-full">
                <SelectValue>{form.category}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="edit-status">Status</FieldLabel>
            <Select
              value={form.status}
              onValueChange={(value) =>
                value && setForm({ ...form, status: value })
              }
            >
              <SelectTrigger id="edit-status" className="w-full">
                <SelectValue>{form.status}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
        </Field>

        <Field orientation="responsive">
          <Field>
            <FieldLabel htmlFor="edit-price">Price (OMR)</FieldLabel>
            <Input
              id="edit-price"
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="edit-location">Location</FieldLabel>
            <Input
              id="edit-location"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </Field>
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-description">Description</FieldLabel>
          <Textarea
            id="edit-description"
            rows={5}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </Field>
      </FieldGroup>

      <SheetFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSave(ad.id, {
              title: form.title,
              category: form.category,
              price: Number(form.price) || 0,
              status: form.status as Ad["status"],
              location: form.location,
              description: form.description,
            })
          }
        >
          Save Changes
        </Button>
      </SheetFooter>
    </>
  )
}

export function EditAdSheet({
  ad,
  onOpenChange,
  onSave,
}: {
  ad: Ad | null
  onOpenChange: (open: boolean) => void
  onSave: (id: string, patch: Partial<Ad>) => void
}) {
  return (
    <Sheet open={!!ad} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        {ad && (
          <EditAdForm key={ad.id} ad={ad} onOpenChange={onOpenChange} onSave={onSave} />
        )}
      </SheetContent>
    </Sheet>
  )
}
