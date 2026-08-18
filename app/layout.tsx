import type { Metadata } from "next"
import type { ReactNode } from "react"

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://superadmin.zoqodeal.com"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
}

// Root layout is required by Next.js but the actual HTML shell
// is rendered by app/[locale]/layout.tsx which handles i18n.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
