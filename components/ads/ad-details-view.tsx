"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  BadgeCheckIcon,
  BuildingIcon,
  CalendarIcon,
  CheckCircle2Icon,
  CheckIcon,
  ClockIcon,
  CompassIcon,
  CopyIcon,
  CreditCardIcon,
  DollarSignIcon,
  EditIcon,
  EyeIcon,
  HeartIcon,
  HomeIcon,
  ImageIcon,
  KeyIcon,
  LayersIcon,
  MailIcon,
  MapPinIcon,
  MousePointerClickIcon,
  PhoneIcon,
  ShieldAlertIcon,
  SparklesIcon,
  TagIcon,
  Trash2Icon,
  TrendingUpIcon,
  UserIcon,
  XIcon,
} from "lucide-react"
import { toast } from "sonner"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { StatusBadge } from "@/components/ads/status-badge"
import { RejectReasonDialog } from "@/components/ads/reject-reason-dialog"
import { DeleteAdDialog } from "@/components/ads/delete-ad-dialog"
import { useAdsStore } from "@/components/ads/ads-store"
import { formatPrice, formatDate } from "@/components/ads/ads-columns"

const postingTypeColors: Record<string, string> = {
  Sale: "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
  Rent: "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
  Project: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
}

export function AdDetailsView({ adId }: { adId: string }) {
  const router = useRouter()
  const {
    getAd,
    approveAd,
    rejectAd,
    deleteAd,
    toggleFeatured,
    toggleSold,
  } = useAdsStore()

  const ad = getAd(adId)

  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0)
  const [rejectDialogOpen, setRejectDialogOpen] = React.useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)

  if (!ad) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
          <TagIcon className="size-7 text-muted-foreground" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-semibold">Listing Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1">
            No real estate listing found with ID: {adId}
          </p>
        </div>
        <Button variant="outline" render={<Link href="/ads" />}>
          <ArrowLeftIcon className="size-4" /> Back to Ads List
        </Button>
      </div>
    )
  }

  const isPending = ad.status === "Pending"
  const isRejected = ad.status === "Rejected"
  const images = ad.images && ad.images.length > 0 ? ad.images : []
  const hasMultipleImages = images.length > 1
  const ctr =
    ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(1) : "0.0"

  const handleApprove = () => {
    approveAd(ad.id)
    toast.success(`Listing ${ad.id} approved`, {
      description: "The real estate listing is now active on Zoqodeal.",
    })
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const prop = ad.propertyDetails

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto pb-12">
      {/* Top Header & Navigation */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/ads" className="hover:text-foreground transition-colors">
            Ads Management
          </Link>
          <span>/</span>
          <span className="font-mono text-foreground font-medium">{ad.id}</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon-sm"
              render={<Link href="/ads" />}
              aria-label="Back to ads"
            >
              <ArrowLeftIcon className="size-4" />
            </Button>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
                  {ad.title}
                </h1>
                <StatusBadge
                  status={ad.status}
                  rejectionReason={ad.rejectionReason}
                />
                <Badge
                  variant="outline"
                  className={
                    postingTypeColors[ad.postingType] ||
                    "bg-muted text-muted-foreground"
                  }
                >
                  For {ad.postingType}
                </Badge>
                {ad.featured && (
                  <Badge
                    variant="outline"
                    className="border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400 gap-1 font-normal"
                  >
                    <SparklesIcon className="size-3 fill-amber-500 text-amber-500" />
                    Featured
                  </Badge>
                )}
                {ad.verified && (
                  <Badge
                    variant="outline"
                    className="border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 gap-1 font-normal"
                  >
                    <BadgeCheckIcon className="size-3 text-emerald-600" />
                    Verified Property
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <span className="font-mono">{ad.id}</span>
                <span>•</span>
                <span>{ad.category}</span>
                {ad.subcategory && <span>({ad.subcategory})</span>}
                <span>•</span>
                <span>Posted {formatDate(ad.postedDate)}</span>
              </p>
            </div>
          </div>

          {/* Header Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Show Approve and Reject ONLY when Pending */}
            {isPending && (
              <>
                <Button
                  onClick={handleApprove}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                >
                  <CheckIcon className="size-4" /> Approve Ad
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setRejectDialogOpen(true)}
                >
                  <XIcon className="size-4" /> Reject Ad
                </Button>
              </>
            )}

            <Button
              variant="outline"
              render={<Link href={`/ads/${ad.id}/edit`} />}
            >
              <EditIcon className="size-4" /> Edit Listing
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setDeleteDialogOpen(true)}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              aria-label="Delete ad"
            >
              <Trash2Icon className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Pending Moderation Banner */}
      {isPending && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/20">
              <ClockIcon className="size-5 text-amber-700 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-semibold">Pending Superadmin Approval</p>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80">
                This real estate listing has been submitted and is awaiting admin verification before publishing publicly.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              onClick={handleApprove}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-8 text-xs"
            >
              <CheckIcon className="size-3.5" /> Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRejectDialogOpen(true)}
              className="border-amber-600/30 hover:bg-amber-500/20 h-8 text-xs text-amber-900 dark:text-amber-100"
            >
              <XIcon className="size-3.5" /> Reject
            </Button>
          </div>
        </div>
      )}

      {/* Rejection Alert Banner */}
      {isRejected && ad.rejectionReason && (
        <div className="flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-destructive">
          <ShieldAlertIcon className="size-5 shrink-0 mt-0.5" />
          <div className="flex flex-col gap-1">
            <p className="text-sm font-semibold">Listing Rejection Reason</p>
            <p className="text-xs text-destructive/90 leading-relaxed">
              {ad.rejectionReason}
            </p>
          </div>
        </div>
      )}

      {/* Key Metric Highlights Bar */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <Card className="p-3.5 flex flex-col gap-1 bg-card">
          <span className="text-xs text-muted-foreground font-medium">Price</span>
          <span className="text-lg font-bold text-foreground">
            {formatPrice(ad.price, ad.category, ad.priceUnit)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            {prop?.priceNegotiable ? "Negotiable" : "Fixed price"}
          </span>
        </Card>

        <Card className="p-3.5 flex flex-col gap-1 bg-card">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <EyeIcon className="size-3 text-muted-foreground" /> Views
          </span>
          <span className="text-lg font-bold text-foreground">
            {ad.views.toLocaleString()}
          </span>
          <span className="text-[11px] text-muted-foreground">Listing impressions</span>
        </Card>

        <Card className="p-3.5 flex flex-col gap-1 bg-card">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <MousePointerClickIcon className="size-3 text-muted-foreground" /> Inquiries
          </span>
          <span className="text-lg font-bold text-foreground">
            {ad.clicks.toLocaleString()}
          </span>
          <span className="text-[11px] text-muted-foreground">CTR: {ctr}%</span>
        </Card>

        <Card className="p-3.5 flex flex-col gap-1 bg-card">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <HeartIcon className="size-3 text-muted-foreground" /> Favorites
          </span>
          <span className="text-lg font-bold text-foreground">
            {ad.favorites.toLocaleString()}
          </span>
          <span className="text-[11px] text-muted-foreground">Saved searches</span>
        </Card>

        <Card className="p-3.5 flex flex-col gap-1 bg-card">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <CalendarIcon className="size-3 text-muted-foreground" /> Posted Date
          </span>
          <span className="text-sm font-semibold text-foreground">
            {formatDate(ad.postedDate)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            Expires {formatDate(ad.expiryDate)}
          </span>
        </Card>

        <Card className="p-3.5 flex flex-col gap-1 bg-card">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
            <MapPinIcon className="size-3 text-muted-foreground" /> Location
          </span>
          <span className="text-sm font-semibold text-foreground truncate" title={ad.location}>
            {ad.city || ad.location}
          </span>
          <span className="text-[11px] text-muted-foreground truncate">
            {ad.governorate || "Oman"}
          </span>
        </Card>
      </div>

      {/* Main Grid: Left Details (2 cols) & Right Sidebar (1 col) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Photos, Specifications, Amenities, Advanced Features, Description */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Photo Gallery Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <ImageIcon className="size-4 text-primary" /> Property Photos & Media
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {images.length} {images.length === 1 ? "Photo" : "Photos"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {images.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {/* Primary Large Image */}
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-muted ring-1 ring-foreground/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={images[selectedImageIndex] || images[0]}
                      alt={ad.title}
                      className="size-full object-cover transition-all"
                    />
                    <div className="absolute bottom-3 left-3 rounded-md bg-black/60 px-2.5 py-1 text-xs text-white backdrop-blur-xs">
                      Photo {selectedImageIndex + 1} of {images.length}
                    </div>
                  </div>

                  {/* Thumbnail Row */}
                  {hasMultipleImages && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1">
                      {images.map((img, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                            selectedImageIndex === idx
                              ? "border-primary ring-2 ring-primary/30"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt=""
                            className="size-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-12 text-center text-muted-foreground bg-muted/20">
                  <ImageIcon className="size-10 mb-2 opacity-50" />
                  <p className="text-sm font-medium">No media uploaded</p>
                  <p className="text-xs">This property listing has no photos attached.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real Estate Property Specifications */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <HomeIcon className="size-4 text-primary" /> Property Specifications
              </CardTitle>
              <CardDescription>
                Detailed characteristics and architectural specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6 sm:grid-cols-3">
                <div>
                  <span className="text-xs text-muted-foreground block">Building / Property Type</span>
                  <span className="text-sm font-semibold text-foreground">
                    {prop?.propertyType || ad.category}
                  </span>
                </div>

                {prop?.bedrooms && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Bedrooms</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.bedrooms}
                    </span>
                  </div>
                )}

                {prop?.bathrooms !== undefined && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Bathrooms</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.bathrooms} Baths
                    </span>
                  </div>
                )}

                {prop?.area && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Built-up Area</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.area.toLocaleString()} sqm
                    </span>
                  </div>
                )}

                {prop?.landArea && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Plot / Land Area</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.landArea.toLocaleString()} sqm
                    </span>
                  </div>
                )}

                <div>
                  <span className="text-xs text-muted-foreground block">Furnishing</span>
                  <span className="text-sm font-semibold text-foreground">
                    {prop?.furnishing || "Unfurnished"}
                  </span>
                </div>

                {prop?.ownership && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Ownership Title</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.ownership}
                    </span>
                  </div>
                )}

                {prop?.parkingSpaces !== undefined && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Parking Spaces</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.parkingSpaces} {prop.parkingSpaces === 1 ? "Space" : "Spaces"}
                    </span>
                  </div>
                )}

                {prop?.floorNumber && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Floor Level</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.floorNumber}
                    </span>
                  </div>
                )}

                {prop?.developer && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Developer</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.developer}
                    </span>
                  </div>
                )}

                {prop?.completionStatus && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Project Status</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.completionStatus}
                    </span>
                  </div>
                )}

                {prop?.handoverDate && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Handover Date</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.handoverDate}
                    </span>
                  </div>
                )}

                {prop?.zonedFor && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Zoning / Use</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.zonedFor}
                    </span>
                  </div>
                )}

                {prop?.paymentMethod && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Payment Terms</span>
                    <span className="text-sm font-semibold text-foreground">
                      {prop.paymentMethod}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Amenities & Features */}
          {prop?.amenities && prop.amenities.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <SparklesIcon className="size-4 text-primary" /> Amenities & Property Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {prop.amenities.map((amenity, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="gap-1.5 py-1 px-2.5 text-xs font-normal"
                    >
                      <CheckIcon className="size-3 text-emerald-600" />
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Advanced Features & Highlights */}
          {prop?.advancedFeatures && prop.advancedFeatures.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <KeyIcon className="size-4 text-primary" /> Advanced Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {prop.advancedFeatures.map((feat, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="gap-1.5 py-1 px-2.5 text-xs font-normal border-primary/20 bg-primary/5 text-primary"
                    >
                      <SparklesIcon className="size-3" />
                      {feat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Nearby Facilities */}
          {prop?.nearbyFacilities && prop.nearbyFacilities.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CompassIcon className="size-4 text-primary" /> Nearby Facilities & Landmarks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {prop.nearbyFacilities.map((fac, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="gap-1.5 py-1 px-2.5 text-xs font-normal"
                    >
                      <MapPinIcon className="size-3 text-muted-foreground" />
                      {fac}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Description Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Property Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-line">
                {ad.description || "No description provided for this listing."}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar: Seller Info, Moderation Controls, Address */}
        <div className="flex flex-col gap-6">
          {/* Seller / Advertiser Profile */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <UserIcon className="size-4 text-primary" /> Seller & Contact Details
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {ad.user.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm truncate">
                      {ad.user.name}
                    </span>
                    {ad.user.isVerified && (
                      <BadgeCheckIcon className="size-4 text-primary shrink-0" />
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Listed as {ad.user.accountType}
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex flex-col gap-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <MailIcon className="size-3.5 text-muted-foreground" /> Email
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground truncate max-w-36">
                      {ad.user.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(ad.user.email, "Email")}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Copy email"
                    >
                      <CopyIcon className="size-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <PhoneIcon className="size-3.5 text-muted-foreground" /> Phone
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">
                      {ad.user.phone}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(ad.user.phone, "Phone")}
                      className="p-1 text-muted-foreground hover:text-foreground"
                      title="Copy phone"
                    >
                      <CopyIcon className="size-3" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <CalendarIcon className="size-3.5 text-muted-foreground" /> Member Since
                  </span>
                  <span className="font-medium text-foreground">
                    {ad.user.memberSince || "Jan 2024"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground flex items-center gap-1.5">
                    <TagIcon className="size-3.5 text-muted-foreground" /> Total Listings
                  </span>
                  <span className="font-medium text-foreground">
                    {ad.user.totalAds || 1} ads
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moderation Controls Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TrendingUpIcon className="size-4 text-primary" /> Moderation & Settings
              </CardTitle>
              <CardDescription>
                Listing status flags and visibility
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Featured Listing</span>
                  <span className="text-xs text-muted-foreground">
                    Promote property at top of search results
                  </span>
                </div>
                <Switch
                  checked={ad.featured}
                  onCheckedChange={(val) => {
                    toggleFeatured(ad.id, val)
                    toast.success(
                      val
                        ? `${ad.id} marked as featured`
                        : `${ad.id} removed from featured`
                    )
                  }}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Mark as Sold / Closed</span>
                  <span className="text-xs text-muted-foreground">
                    Mark property deal completed
                  </span>
                </div>
                <Switch
                  checked={ad.status === "Sold"}
                  disabled={ad.status === "Rejected"}
                  onCheckedChange={(val) => {
                    toggleSold(ad.id, val)
                    toast.success(
                      val ? `${ad.id} marked as sold` : `${ad.id} marked as active`
                    )
                  }}
                />
              </div>

              {isPending && (
                <>
                  <Separator />
                  <div className="flex flex-col gap-2 pt-1">
                    <span className="text-xs font-semibold text-muted-foreground">
                      Moderator Decision
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        onClick={handleApprove}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <CheckIcon className="size-4" /> Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setRejectDialogOpen(true)}
                      >
                        <XIcon className="size-4" /> Reject
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Location & Address Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPinIcon className="size-4 text-primary" /> Location & Address
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Governorate:</span>
                <span className="font-medium text-foreground">
                  {ad.governorate || "Muscat"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">City / Neighborhood:</span>
                <span className="font-medium text-foreground">{ad.city}</span>
              </div>
              {ad.address && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Street / Sector:</span>
                  <span className="font-medium text-foreground text-right max-w-44">
                    {ad.address}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <RejectReasonDialog
        ad={rejectDialogOpen ? ad : null}
        onOpenChange={(open) => !open && setRejectDialogOpen(false)}
        onConfirm={(_targetAd, reason) => {
          rejectAd(ad.id, reason)
          toast.success(`${ad.id} rejected`, {
            description: "Reason recorded and notification sent to user.",
          })
          setRejectDialogOpen(false)
        }}
      />

      <DeleteAdDialog
        ad={deleteDialogOpen ? ad : null}
        onOpenChange={(open) => !open && setDeleteDialogOpen(false)}
        onConfirm={() => {
          deleteAd(ad.id)
          toast.success(`${ad.id} deleted`)
          setDeleteDialogOpen(false)
          router.push("/ads")
        }}
      />
    </div>
  )
}
