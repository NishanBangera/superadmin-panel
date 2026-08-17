"use client"

import * as React from "react"
import { adsData, type Ad, type AdStatus } from "@/components/ads/ads-data"

const STORAGE_KEY = "zoqodeal_superadmin_ads_v2"
const SYNC_EVENT = "zoqodeal_ads_store_sync"

function getInitialAds(): Ad[] {
  if (typeof window === "undefined") {
    return adsData
  }
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error("Failed to load ads from localStorage", e)
  }
  return adsData
}

function saveAdsToStorage(ads: Ad[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ads))
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: ads }))
  } catch (e) {
    console.error("Failed to save ads to localStorage", e)
  }
}

export function useAdsStore() {
  const [ads, setAds] = React.useState<Ad[]>(getInitialAds)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    setAds(getInitialAds())
    setIsLoaded(true)

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<Ad[]>
      if (customEvent.detail) {
        setAds(customEvent.detail)
      } else {
        setAds(getInitialAds())
      }
    }

    window.addEventListener(SYNC_EVENT, handleSync)
    window.addEventListener("storage", handleSync)

    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync)
      window.removeEventListener("storage", handleSync)
    }
  }, [])

  const getAd = React.useCallback(
    (id: string): Ad | undefined => {
      return ads.find((a) => a.id === id) || adsData.find((a) => a.id === id)
    },
    [ads]
  )

  const updateAd = React.useCallback(
    (id: string, patch: Partial<Ad>) => {
      setAds((prev) => {
        const next = prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
        saveAdsToStorage(next)
        return next
      })
    },
    []
  )

  const approveAd = React.useCallback(
    (id: string) => {
      updateAd(id, { status: "Active", rejectionReason: undefined })
    },
    [updateAd]
  )

  const rejectAd = React.useCallback(
    (id: string, reason: string) => {
      updateAd(id, { status: "Rejected", rejectionReason: reason })
    },
    [updateAd]
  )

  const deleteAd = React.useCallback(
    (id: string) => {
      setAds((prev) => {
        const next = prev.filter((a) => a.id !== id)
        saveAdsToStorage(next)
        return next
      })
    },
    []
  )

  const deleteAds = React.useCallback(
    (ids: string[]) => {
      const idSet = new Set(ids)
      setAds((prev) => {
        const next = prev.filter((a) => !idSet.has(a.id))
        saveAdsToStorage(next)
        return next
      })
    },
    []
  )

  const toggleFeatured = React.useCallback(
    (id: string, value: boolean) => {
      updateAd(id, { featured: value })
    },
    [updateAd]
  )

  const toggleSold = React.useCallback(
    (id: string, value: boolean) => {
      updateAd(id, { status: value ? "Sold" : "Active" })
    },
    [updateAd]
  )

  const resetToDefault = React.useCallback(() => {
    setAds(adsData)
    saveAdsToStorage(adsData)
  }, [])

  return {
    ads,
    isLoaded,
    getAd,
    updateAd,
    approveAd,
    rejectAd,
    deleteAd,
    deleteAds,
    toggleFeatured,
    toggleSold,
    resetToDefault,
  }
}
