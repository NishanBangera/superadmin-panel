"use client"

import * as React from "react"
import {
  initialReportsData,
  type ListingReport,
  type ReportStatus,
} from "@/components/ads/reports-data"

const STORAGE_KEY = "zoqodeal_superadmin_listing_reports_v1"
const SYNC_EVENT = "zoqodeal_reports_store_sync"

function getInitialReports(): ListingReport[] {
  if (typeof window === "undefined") {
    return initialReportsData
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
    console.error("Failed to load reports from localStorage", e)
  }
  return initialReportsData
}

function saveReportsToStorage(reports: ListingReport[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reports))
    window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: reports }))
  } catch (e) {
    console.error("Failed to save reports to localStorage", e)
  }
}

export function useReportsStore() {
  const [reports, setReports] = React.useState<ListingReport[]>(getInitialReports)
  const [isLoaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    setReports(getInitialReports())
    setIsLoaded(true)

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<ListingReport[]>
      if (customEvent.detail) {
        setReports(customEvent.detail)
      } else {
        setReports(getInitialReports())
      }
    }

    window.addEventListener(SYNC_EVENT, handleSync)
    window.addEventListener("storage", handleSync)

    return () => {
      window.removeEventListener(SYNC_EVENT, handleSync)
      window.removeEventListener("storage", handleSync)
    }
  }, [])

  const getReport = React.useCallback(
    (id: string): ListingReport | undefined => {
      return reports.find((r) => r.id === id)
    },
    [reports]
  )

  const getReportsByAdId = React.useCallback(
    (adId: string): ListingReport[] => {
      return reports.filter((r) => r.adId === adId)
    },
    [reports]
  )

  const updateReport = React.useCallback(
    (id: string, patch: Partial<ListingReport>) => {
      setReports((prev) => {
        const next = prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
        saveReportsToStorage(next)
        return next
      })
    },
    []
  )

  const setReportStatus = React.useCallback(
    (id: string, status: ReportStatus, notes?: string, actionTaken?: string) => {
      updateReport(id, {
        status,
        ...(notes !== undefined && { moderatorNotes: notes }),
        ...(actionTaken !== undefined && { actionTaken }),
        ...(status === "Resolved" || status === "Dismissed"
          ? { resolvedAt: new Date().toISOString() }
          : {}),
      })
    },
    [updateReport]
  )

  const deleteReport = React.useCallback((id: string) => {
    setReports((prev) => {
      const next = prev.filter((r) => r.id !== id)
      saveReportsToStorage(next)
      return next
    })
  }, [])

  const resetReports = React.useCallback(() => {
    setReports(initialReportsData)
    saveReportsToStorage(initialReportsData)
  }, [])

  const pendingCount = React.useMemo(
    () => reports.filter((r) => r.status === "Pending").length,
    [reports]
  )

  return {
    reports,
    isLoaded,
    pendingCount,
    getReport,
    getReportsByAdId,
    updateReport,
    setReportStatus,
    deleteReport,
    resetReports,
  }
}
