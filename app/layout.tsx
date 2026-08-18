import type { ReactNode } from "react"

// Root layout is required by Next.js but the actual HTML shell
// is rendered by app/[locale]/layout.tsx which handles i18n.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
