import type { Metadata } from "next"
import localFont from "next/font/local"
import { Inter } from "next/font/google"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, setRequestLocale } from "next-intl/server"

import { cn } from "@/lib/utils"
import { IntlErrorHandlingProvider } from "@/components/providers/intl-error-handling-provider"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import {
  getTextDirection,
  isAppLocale,
  routing,
  type AppLocale,
} from "@/i18n/routing"

import "../globals.css"

const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
})

const ibmPlexSansArabic = localFont({
  src: [
    {
      path: "../../public/fonts/IBMPlexSansArabic-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/IBMPlexSansArabic-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../../public/fonts/IBMPlexSansArabic-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/IBMPlexSansArabic-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/IBMPlexArabic-Text.ttf",
      weight: "450",
      style: "normal",
    },
    {
      path: "../../public/fonts/IBMPlexSansArabic-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/IBMPlexSansArabic-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/IBMPlexSansArabic-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ibm-plex-sans-arabic",
  display: "swap",
})

type LocaleLayoutProps = Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://zoqodeal.netlify.app"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ZOQO DEAL Super Admin",
  description: "Marketplace operations workspace — demo preview.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/deal.png", type: "image/png" },
    ],
    apple: "/favicon.png",
  },
  openGraph: {
    title: "ZOQO DEAL Super Admin",
    description: "Marketplace operations workspace — demo preview.",
    url: "/",
    siteName: "ZOQO DEAL Super Admin",
    images: [
      {
        url: "/deal.png",
        width: 1200,
        height: 630,
        alt: "ZOQO DEAL",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZOQO DEAL Super Admin",
    description: "Marketplace operations workspace — demo preview.",
    images: ["/deal.png"],
  },
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params

  if (!isAppLocale(locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html
      lang={locale}
      dir={getTextDirection(locale as AppLocale)}
      className={cn(
        "h-full antialiased",
        inter.variable,
        ibmPlexSansArabic.variable
      )}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col font-sans">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <IntlErrorHandlingProvider locale={locale}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem={false}
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </IntlErrorHandlingProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
