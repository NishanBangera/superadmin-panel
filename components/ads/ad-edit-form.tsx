"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  CompassIcon,
  HomeIcon,
  ImageIcon,
  InfoIcon,
  KeyIcon,
  LinkIcon,
  MapPinIcon,
  PlusIcon,
  SaveIcon,
  SparklesIcon,
  Trash2Icon,
  UploadCloudIcon,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import {
  advancedFeaturesList,
  advancedFeaturesLabels,
  amenityLabels,
  availableAmenities,
  bedroomOptions,
  categories,
  citiesByGovernorate,
  furnishingOptions,
  governorates,
  nearbyFacilitiesList,
  nearbyFacilitiesLabels,
  paymentMethods,
  paymentMethodLabels,
  postingTypes,
  projectStatusOptions,
  propertyTypes,
  statuses,
  type Ad,
  type AdStatus,
  type PostingType,
  type PropertyDetails,
} from "@/components/ads/ads-data"
import { useAdsStore } from "@/components/ads/ads-store"

type FormState = {
  title: string
  titleAr: string
  category: string
  subcategory: string
  postingType: PostingType
  status: AdStatus
  price: string
  priceNegotiable: boolean
  governorate: string
  city: string
  address: string
  description: string
  rejectionReason: string
  featured: boolean
  verified: boolean
  expiryDate: string
  images: string[]
  propertyDetails: PropertyDetails
}

function initFormState(ad: Ad): FormState {
  return {
    title: ad.title || "",
    titleAr: ad.titleAr || "",
    category: ad.category || "Apartments",
    subcategory: ad.subcategory || "",
    postingType: ad.postingType || "For Sale",
    status: ad.status || "Pending",
    price: String(ad.price ?? 0),
    priceNegotiable: !!ad.propertyDetails?.priceNegotiable,
    governorate: ad.governorate || "Muscat",
    city: ad.city || "Al Mouj",
    address: ad.address || "",
    description: ad.description || "",
    rejectionReason: ad.rejectionReason || "",
    featured: !!ad.featured,
    verified: !!ad.verified,
    expiryDate: ad.expiryDate || "",
    images: ad.images && ad.images.length > 0 ? [...ad.images] : [],
    propertyDetails: {
      propertyType: ad.propertyDetails?.propertyType || "Apartment",
      bedrooms: ad.propertyDetails?.bedrooms || "2",
      bathrooms: ad.propertyDetails?.bathrooms || 2,
      area: ad.propertyDetails?.area || 120,
      landArea: ad.propertyDetails?.landArea || 0,
      floorNumber: ad.propertyDetails?.floorNumber || "",
      furnishing: ad.propertyDetails?.furnishing || "no",
      projectStatus: ad.propertyDetails?.projectStatus || "ready",
      handoverBy: ad.propertyDetails?.handoverBy || "",
      paymentMethod: ad.propertyDetails?.paymentMethod || "monthly",
      priceNegotiable: !!ad.propertyDetails?.priceNegotiable,
      amenities: ad.propertyDetails?.amenities ? [...ad.propertyDetails.amenities] : [],
      advancedFeatures: ad.propertyDetails?.advancedFeatures
        ? [...ad.propertyDetails.advancedFeatures]
        : [],
      nearbyFacilities: ad.propertyDetails?.nearbyFacilities
        ? [...ad.propertyDetails.nearbyFacilities]
        : [],
    },
  }
}

export function AdEditForm({ adId }: { adId: string }) {
  const router = useRouter()
  const { getAd, updateAd } = useAdsStore()
  const ad = getAd(adId)

  const [form, setForm] = React.useState<FormState | null>(() =>
    ad ? initFormState(ad) : null
  )
  const [newImageUrl, setNewImageUrl] = React.useState("")
  const [isDragging, setIsDragging] = React.useState(false)
  const [showUrlInput, setShowUrlInput] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    if (ad && !form) {
      setForm(initFormState(ad))
    }
  }, [ad, form])

  if (!ad || !form) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <h2 className="text-xl font-semibold">Listing Not Found</h2>
        <p className="text-sm text-muted-foreground">
          Cannot edit non-existent listing ID: {adId}
        </p>
        <Button variant="outline" render={<Link href="/ads" />}>
          <ArrowLeftIcon className="size-4" /> Return to Ads Table
        </Button>
      </div>
    )
  }

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    if (!form.title.trim()) {
      toast.error("Please enter a property listing title")
      return
    }

    const priceNum = parseFloat(form.price)
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price amount in OMR")
      return
    }

    const patch: Partial<Ad> = {
      title: form.title.trim(),
      titleAr: form.titleAr.trim() || undefined,
      category: form.category,
      subcategory: form.subcategory.trim() || undefined,
      postingType: form.postingType,
      status: form.status,
      price: priceNum,
      governorate: form.governorate,
      city: form.city.trim() || "Muscat",
      location: `${form.governorate}, ${form.city.trim() || "Muscat"}`,
      address: form.address.trim() || undefined,
      description: form.description.trim(),
      rejectionReason:
        form.status === "Rejected"
          ? form.rejectionReason.trim() || "Listing did not meet platform guidelines"
          : undefined,
      featured: form.featured,
      verified: form.verified,
      expiryDate: form.expiryDate,
      images: form.images,
      propertyDetails: {
        ...form.propertyDetails,
        priceNegotiable: form.priceNegotiable,
      },
    }

    updateAd(ad.id, patch)
    toast.success(`Property listing ${ad.id} updated successfully`, {
      description: "All changes have been saved to the marketplace.",
    })
    router.push(`/ads/${ad.id}`)
  }

  const toggleAmenity = (amenity: string) => {
    setForm((prev) => {
      if (!prev) return prev
      const current = prev.propertyDetails.amenities || []
      const updated = current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity]
      return {
        ...prev,
        propertyDetails: {
          ...prev.propertyDetails,
          amenities: updated,
        },
      }
    })
  }

  const toggleAdvancedFeature = (feature: string) => {
    setForm((prev) => {
      if (!prev) return prev
      const current = prev.propertyDetails.advancedFeatures || []
      const updated = current.includes(feature)
        ? current.filter((f) => f !== feature)
        : [...current, feature]
      return {
        ...prev,
        propertyDetails: {
          ...prev.propertyDetails,
          advancedFeatures: updated,
        },
      }
    })
  }

  const toggleNearbyFacility = (facility: string) => {
    setForm((prev) => {
      if (!prev) return prev
      const current = prev.propertyDetails.nearbyFacilities || []
      const updated = current.includes(facility)
        ? current.filter((f) => f !== facility)
        : [...current, facility]
      return {
        ...prev,
        propertyDetails: {
          ...prev.propertyDetails,
          nearbyFacilities: updated,
        },
      }
    })
  }

  const processFiles = (files: FileList | File[]) => {
    const validImageFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    )

    if (validImageFiles.length === 0) {
      toast.error("Please select valid image files (JPG, PNG, WebP)")
      return
    }

    const readers = validImageFiles.map((file) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result)
          }
        }
        reader.readAsDataURL(file)
      })
    })

    Promise.all(readers).then((dataUrls) => {
      setForm((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          images: [...prev.images, ...dataUrls],
        }
      })
      toast.success(
        `${dataUrls.length} ${dataUrls.length === 1 ? "photo" : "photos"} added to listing`
      )
    })
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files)
      e.target.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files)
    }
  }

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return
    setForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        images: [...prev.images, newImageUrl.trim()],
      }
    })
    setNewImageUrl("")
    toast.success("Image added to gallery preview")
  }

  const handleRemoveImage = (index: number) => {
    setForm((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        images: prev.images.filter((_, idx) => idx !== index),
      }
    })
    toast.success("Photo removed")
  }

  const handleMoveImage = (index: number, direction: -1 | 1) => {
    setForm((prev) => {
      if (!prev) return prev
      const newImages = [...prev.images]
      const targetIndex = index + direction
      if (targetIndex < 0 || targetIndex >= newImages.length) return prev
      const temp = newImages[index]
      newImages[index] = newImages[targetIndex]
      newImages[targetIndex] = temp
      return {
        ...prev,
        images: newImages,
      }
    })
  }

  const handleSetCover = (index: number) => {
    if (index === 0) return
    setForm((prev) => {
      if (!prev) return prev
      const newImages = [...prev.images]
      const [chosen] = newImages.splice(index, 1)
      newImages.unshift(chosen)
      return {
        ...prev,
        images: newImages,
      }
    })
    toast.success("Cover photo updated")
  }

  const availableCities = citiesByGovernorate[form.governorate] || []

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-7xl mx-auto pb-16">
      {/* Header & Sticky Actions */}
      <div className="flex flex-col gap-3">
        <Breadcrumb>
          <BreadcrumbList className="text-sm font-medium">
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link href="/ads" />}>
                Ads Management
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                render={
                  <Link
                    href={`/ads/${ad.id}`}
                    className="font-mono"
                  />
                }
              >
                {ad.id}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                Edit
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon-sm"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-tight">
                Edit Real Estate Listing ({ad.id})
              </h1>
              <p className="text-xs text-muted-foreground">
                Update property specifications, pricing, location in Oman, and amenities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground">
              <SaveIcon className="size-4" /> Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main 2-column Content */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Card 1: Listing Overview & Category */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <InfoIcon className="size-4 text-primary" /> Listing Overview
              </CardTitle>
              <CardDescription>
                Title, classification category, and transaction purpose
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="ad-title">Listing Title (English) *</FieldLabel>
                <Input
                  id="ad-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="e.g. 3BHK Waterfront Villa with Pool — Al Mouj"
                  required
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="ad-category">Category</FieldLabel>
                  <Select
                    value={form.category}
                    onValueChange={(val) => {
                      if (val) setForm({ ...form, category: val })
                    }}
                  >
                    <SelectTrigger id="ad-category" className="w-full">
                      <SelectValue>{form.category || "Select Category"}</SelectValue>
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
                  <FieldLabel htmlFor="ad-subcategory">Subcategory</FieldLabel>
                  <Input
                    id="ad-subcategory"
                    value={form.subcategory}
                    onChange={(e) =>
                      setForm({ ...form, subcategory: e.target.value })
                    }
                    placeholder="e.g. Residential Villas, Apartments for Sale"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="ad-postingType">Listing Purpose</FieldLabel>
                  <Select
                    value={form.postingType}
                    onValueChange={(val) => {
                      if (val)
                        setForm({
                          ...form,
                          postingType: val as PostingType,
                        })
                    }}
                  >
                    <SelectTrigger id="ad-postingType" className="w-full">
                      <SelectValue>{form.postingType || "For Sale"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {postingTypes.map((pt) => (
                        <SelectItem key={pt} value={pt}>
                          {pt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="ad-price">
                    Price (OMR{form.postingType === "For Rent" ? " / Monthly" : ""}) *
                  </FieldLabel>
                  <Input
                    id="ad-price"
                    type="number"
                    min={0}
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="re-payment">Payment Period</FieldLabel>
                  <Select
                    value={form.propertyDetails.paymentMethod || "monthly"}
                    onValueChange={(val) => {
                      if (val) {
                        setForm({
                          ...form,
                          propertyDetails: {
                            ...form.propertyDetails,
                            paymentMethod: val as PropertyDetails["paymentMethod"],
                          },
                        })
                      }
                    }}
                  >
                    <SelectTrigger id="re-payment" className="w-full">
                      <SelectValue>
                        {paymentMethodLabels[form.propertyDetails.paymentMethod || "monthly"] || "Monthly"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {paymentMethods.map((pm) => (
                        <SelectItem key={pm.value} value={pm.value}>
                          {pm.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Switch
                  id="ad-priceNegotiable"
                  checked={form.priceNegotiable}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, priceNegotiable: checked })
                  }
                />
                <label
                  htmlFor="ad-priceNegotiable"
                  className="text-xs font-medium cursor-pointer text-foreground select-none"
                >
                  Price is negotiable
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Real Estate Property Specifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <HomeIcon className="size-4 text-primary" /> Property Specifications
              </CardTitle>
              <CardDescription>
                Layout, area sizes, bedrooms, bathrooms, and project status
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="re-propType">Building / Property Type</FieldLabel>
                  <Select
                    value={form.propertyDetails.propertyType || "Apartment"}
                    onValueChange={(val) => {
                      if (val) {
                        setForm({
                          ...form,
                          propertyDetails: {
                            ...form.propertyDetails,
                            propertyType: val as PropertyDetails["propertyType"],
                          },
                        })
                      }
                    }}
                  >
                    <SelectTrigger id="re-propType" className="w-full">
                      <SelectValue>{form.propertyDetails.propertyType || "Apartment"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {propertyTypes.map((pt) => (
                        <SelectItem key={pt} value={pt}>
                          {pt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="re-bedrooms">Bedrooms</FieldLabel>
                  <Select
                    value={form.propertyDetails.bedrooms || "2"}
                    onValueChange={(val) => {
                      if (val) {
                        setForm({
                          ...form,
                          propertyDetails: {
                            ...form.propertyDetails,
                            bedrooms: val,
                          },
                        })
                      }
                    }}
                  >
                    <SelectTrigger id="re-bedrooms" className="w-full">
                      <SelectValue>
                        {bedroomOptions.find((b) => b.value === form.propertyDetails.bedrooms)?.label || form.propertyDetails.bedrooms || "2 BHK"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {bedroomOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="re-bathrooms">Bathrooms</FieldLabel>
                  <Input
                    id="re-bathrooms"
                    type="number"
                    min={0}
                    value={form.propertyDetails.bathrooms ?? 1}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        propertyDetails: {
                          ...form.propertyDetails,
                          bathrooms: parseInt(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="re-area">Built-up Area (sqm) *</FieldLabel>
                  <Input
                    id="re-area"
                    type="number"
                    min={0}
                    value={form.propertyDetails.area || 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        propertyDetails: {
                          ...form.propertyDetails,
                          area: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="re-landArea">Plot / Land Area (sqm)</FieldLabel>
                  <Input
                    id="re-landArea"
                    type="number"
                    min={0}
                    value={form.propertyDetails.landArea || 0}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        propertyDetails: {
                          ...form.propertyDetails,
                          landArea: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    placeholder="For villas/land"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="re-furnishing">Furnishing Status</FieldLabel>
                  <Select
                    value={form.propertyDetails.furnishing || "no"}
                    onValueChange={(val) => {
                      if (val) {
                        setForm({
                          ...form,
                          propertyDetails: {
                            ...form.propertyDetails,
                            furnishing: val as PropertyDetails["furnishing"],
                          },
                        })
                      }
                    }}
                  >
                    <SelectTrigger id="re-furnishing" className="w-full">
                      <SelectValue>
                        {furnishingOptions.find((f) => f.value === form.propertyDetails.furnishing)?.label || "Unfurnished"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {furnishingOptions.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field>
                  <FieldLabel htmlFor="re-floor">Floor Number</FieldLabel>
                  <Input
                    id="re-floor"
                    value={form.propertyDetails.floorNumber || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        propertyDetails: {
                          ...form.propertyDetails,
                          floorNumber: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. 5th Floor, G + 2"
                  />
                </Field>

                <Field>
                  <FieldLabel htmlFor="re-completion">Project Status</FieldLabel>
                  <Select
                    value={form.propertyDetails.projectStatus || "ready"}
                    onValueChange={(val) => {
                      if (val) {
                        setForm({
                          ...form,
                          propertyDetails: {
                            ...form.propertyDetails,
                            projectStatus: val as PropertyDetails["projectStatus"],
                          },
                        })
                      }
                    }}
                  >
                    <SelectTrigger id="re-completion" className="w-full">
                      <SelectValue>
                        {projectStatusOptions.find((p) => p.value === form.propertyDetails.projectStatus)?.label || "Ready"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatusOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel htmlFor="re-handover">Handover By</FieldLabel>
                  <Input
                    id="re-handover"
                    value={form.propertyDetails.handoverBy || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        propertyDetails: {
                          ...form.propertyDetails,
                          handoverBy: e.target.value,
                        },
                      })
                    }
                    placeholder="e.g. Q4 2026, Q2 2027"
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Amenities & Features */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <SparklesIcon className="size-4 text-primary" /> Amenities & Property Features
              </CardTitle>
              <CardDescription>
                Select all residential amenities and communal facilities available
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <div>
                <span className="text-xs font-semibold text-foreground block mb-2">
                  Core Amenities
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {availableAmenities.map((amenity) => {
                    const checked = (
                      form.propertyDetails.amenities || []
                    ).includes(amenity)
                    return (
                      <label
                        key={amenity}
                        className={`flex items-center gap-2 rounded-lg border p-2 text-xs transition-colors cursor-pointer ${checked
                            ? "border-primary bg-primary/10 font-medium text-foreground"
                            : "border-border bg-background hover:bg-muted text-muted-foreground"
                          }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleAmenity(amenity)}
                        />
                        <span>{amenityLabels[amenity] ?? amenity}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <span className="text-xs font-semibold text-foreground block mb-2 flex items-center gap-1.5">
                  <KeyIcon className="size-3.5 text-primary" /> Advanced Features
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {advancedFeaturesList.map((feat) => {
                    const checked = (
                      form.propertyDetails.advancedFeatures || []
                    ).includes(feat)
                    return (
                      <label
                        key={feat}
                        className={`flex items-center gap-2 rounded-lg border p-2 text-xs transition-colors cursor-pointer ${checked
                            ? "border-primary bg-primary/10 font-medium text-foreground"
                            : "border-border bg-background hover:bg-muted text-muted-foreground"
                          }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleAdvancedFeature(feat)}
                        />
                        <span>{advancedFeaturesLabels[feat] ?? feat}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <Separator />

              <div>
                <span className="text-xs font-semibold text-foreground block mb-2 flex items-center gap-1.5">
                  <CompassIcon className="size-3.5 text-primary" /> Nearby Facilities & Landmarks
                </span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {nearbyFacilitiesList.map((fac) => {
                    const checked = (
                      form.propertyDetails.nearbyFacilities || []
                    ).includes(fac)
                    return (
                      <label
                        key={fac}
                        className={`flex items-center gap-2 rounded-lg border p-2 text-xs transition-colors cursor-pointer ${checked
                            ? "border-primary bg-primary/10 font-medium text-foreground"
                            : "border-border bg-background hover:bg-muted text-muted-foreground"
                          }`}
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={() => toggleNearbyFacility(fac)}
                        />
                        <span>{nearbyFacilitiesLabels[fac] ?? fac}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 4: Description */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Property Description</CardTitle>
              <CardDescription>
                Comprehensive description for prospective buyers and tenants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                rows={6}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Describe key property highlights, proximity to landmarks, view, and lease terms..."
                className="leading-relaxed"
              />
            </CardContent>
          </Card>
        </div>

        {/* Right 1-column Sidebar Controls */}
        <div className="flex flex-col gap-6">
          {/* Moderation & Status Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Moderation & Status</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="ad-status">Listing Status</FieldLabel>
                <Select
                  value={form.status}
                  onValueChange={(val) => {
                    if (val) setForm({ ...form, status: val as AdStatus })
                  }}
                >
                  <SelectTrigger id="ad-status" className="w-full">
                    <SelectValue>{form.status || "Pending"}</SelectValue>
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

              {form.status === "Rejected" && (
                <Field>
                  <FieldLabel htmlFor="ad-rejectionReason">
                    Rejection Reason
                  </FieldLabel>
                  <Textarea
                    id="ad-rejectionReason"
                    rows={3}
                    value={form.rejectionReason}
                    onChange={(e) =>
                      setForm({ ...form, rejectionReason: e.target.value })
                    }
                    placeholder="Specify reason shown on user dashboard..."
                  />
                  <FieldDescription>
                    This explanation is displayed to the seller.
                  </FieldDescription>
                </Field>
              )}

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Featured Property</span>
                  <span className="text-xs text-muted-foreground">
                    Pin at top of search results
                  </span>
                </div>
                <Switch
                  checked={form.featured}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, featured: checked })
                  }
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Verified Property</span>
                  <span className="text-xs text-muted-foreground">
                    Show verified badge
                  </span>
                </div>
                <Switch
                  checked={form.verified}
                  onCheckedChange={(checked) =>
                    setForm({ ...form, verified: checked })
                  }
                />
              </div>

              <Separator />

              <Field>
                <FieldLabel htmlFor="ad-expiryDate">Listing Expiry Date</FieldLabel>
                <Input
                  id="ad-expiryDate"
                  type="date"
                  value={form.expiryDate}
                  onChange={(e) =>
                    setForm({ ...form, expiryDate: e.target.value })
                  }
                />
              </Field>
            </CardContent>
          </Card>

          {/* Location & Address in Oman */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPinIcon className="size-4 text-primary" /> Location in Oman
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="loc-governorate">Governorate</FieldLabel>
                <Select
                  value={form.governorate}
                  onValueChange={(val) => {
                    if (val) {
                      const newCities = citiesByGovernorate[val] || []
                      setForm({
                        ...form,
                        governorate: val,
                        city: newCities[0] || form.city,
                      })
                    }
                  }}
                >
                  <SelectTrigger id="loc-governorate" className="w-full">
                    <SelectValue>{form.governorate || "Select Governorate"}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {governorates.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="loc-city">Area / Neighborhood *</FieldLabel>
                {availableCities.length > 0 ? (
                  <Select
                    value={form.city}
                    onValueChange={(val) => {
                      if (val) setForm({ ...form, city: val })
                    }}
                  >
                    <SelectTrigger id="loc-city" className="w-full">
                      <SelectValue>{form.city || "Select Area"}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id="loc-city"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="e.g. Al Mouj, Qurum, Seeb"
                    required
                  />
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="loc-address">Street / Building Address</FieldLabel>
                <Input
                  id="loc-address"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  placeholder="e.g. Street 12, Marina Way"
                />
              </Field>
            </CardContent>
          </Card>

          {/* Photo Gallery & Upload Dropzone */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="size-4 text-primary" /> Photos ({form.images.length})
                </CardTitle>
                {form.images.length > 0 && (
                  <span className="text-[11px] text-muted-foreground">
                    First photo is cover
                  </span>
                )}
              </div>
              <CardDescription className="text-xs">
                Upload listing photos or drag and drop files from your device.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3.5">
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileInputChange}
              />

              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-5 text-center cursor-pointer transition-all select-none",
                  isDragging
                    ? "border-primary bg-primary/10 scale-[0.99]"
                    : "border-muted-foreground/25 bg-muted/20 hover:border-primary/50 hover:bg-muted/40"
                )}
              >
                <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <UploadCloudIcon className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5">
                  <p className="text-xs font-medium text-foreground">
                    <span className="text-primary font-semibold hover:underline">Click to browse</span> or drag & drop
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    PNG, JPG, WebP, or SVG (multiple files supported)
                  </p>
                </div>
              </div>

              {/* Secondary URL toggle */}
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 self-start transition-colors cursor-pointer"
                >
                  <LinkIcon className="size-3.5" />
                  {showUrlInput ? "Hide URL input" : "Or add photo by image URL"}
                </button>

                {showUrlInput && (
                  <div className="flex gap-2 pt-0.5">
                    <Input
                      placeholder="Paste image URL (https://…)"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddImage()
                        }
                      }}
                      className="text-xs h-8"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={handleAddImage}
                      className="shrink-0 h-8"
                    >
                      <PlusIcon className="size-3.5 mr-1" /> Add
                    </Button>
                  </div>
                )}
              </div>

              {/* Photos Grid Preview */}
              {form.images.length > 0 && (
                <div className="flex flex-col gap-2 pt-1">
                  <Separator />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto pr-0.5">
                    {form.images.map((img, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "group relative aspect-4/3 rounded-lg overflow-hidden border bg-muted/40 transition-all",
                          idx === 0 ? "ring-2 ring-primary ring-offset-1" : ""
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Photo ${idx + 1}`}
                          className="size-full object-cover"
                        />

                        {/* Cover badge */}
                        {idx === 0 && (
                          <span className="absolute top-1.5 left-1.5 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground shadow-xs">
                            Cover
                          </span>
                        )}

                        {/* Action Toolbar on Hover */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] text-white/90 font-medium px-1">
                              #{idx + 1}
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleRemoveImage(idx)
                              }}
                              className="size-6 rounded bg-destructive/90 hover:bg-destructive text-white flex items-center justify-center transition-colors cursor-pointer"
                              title="Remove photo"
                            >
                              <Trash2Icon className="size-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between gap-1">
                            <div className="flex gap-1">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMoveImage(idx, -1)
                                  }}
                                  className="size-5 rounded bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-[10px] cursor-pointer"
                                  title="Move left"
                                >
                                  ←
                                </button>
                              )}
                              {idx < form.images.length - 1 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleMoveImage(idx, 1)
                                  }}
                                  className="size-5 rounded bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-[10px] cursor-pointer"
                                  title="Move right"
                                >
                                  →
                                </button>
                              )}
                            </div>
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSetCover(idx)
                                }}
                                className="text-[10px] font-medium text-white bg-white/25 hover:bg-white/40 px-1.5 py-0.5 rounded transition-colors cursor-pointer"
                                title="Set as primary cover photo"
                              >
                                Set Cover
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="sticky bottom-0 z-20 flex items-center justify-between rounded-xl border bg-background/95 p-4 shadow-lg backdrop-blur supports-backdrop-filter:bg-background/80">
        <p className="text-xs text-muted-foreground">
          Editing listing <span className="font-mono font-semibold text-foreground">{ad.id}</span>
        </p>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground">
            <SaveIcon className="size-4" /> Save Changes
          </Button>
        </div>
      </div>
    </form>
  )
}
