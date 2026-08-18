"use client"

import * as React from "react"
import { useLocale, useTranslations } from "next-intl"

import { usePathname } from "@/i18n/navigation"
import type { AppLocale } from "@/i18n/routing"
import { cn } from "@/lib/utils"

export function LanguageToggle() {
  const t = useTranslations("language")
  const locale = useLocale() as AppLocale
  const pathname = usePathname()
  const [isSwitching, setIsSwitching] = React.useState(false)

  function switchLocale(nextLocale: AppLocale) {
    if (nextLocale === locale) return

    const href =
      nextLocale === "en"
        ? pathname
        : `/${nextLocale}${pathname === "/" ? "" : pathname}`

    setIsSwitching(true)
    window.location.assign(
      `${href}${window.location.search}${window.location.hash}`
    )
  }

  return (
    <div
      role="group"
      aria-label={t("selectorAriaLabel")}
      className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-border/50 bg-muted/50 p-1 text-xs font-medium select-none"
    >
      <button
        type="button"
        aria-pressed={locale === "en"}
        onClick={() => switchLocale("en")}
        disabled={isSwitching || locale === "en"}
        className={cn(
          "inline-flex h-5 min-w-7 items-center justify-center rounded-full px-1.5 outline-none transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          locale === "en"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {t("english")}
      </button>
      <button
        type="button"
        aria-pressed={locale === "ar"}
        onClick={() => switchLocale("ar")}
        disabled={isSwitching || locale === "ar"}
        className={cn(
          "inline-flex h-5 min-w-8 items-center justify-center rounded-full px-1.5 outline-none transition-colors cursor-pointer focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          locale === "ar"
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        {t("arabic")}
      </button>
    </div>
  )
}
