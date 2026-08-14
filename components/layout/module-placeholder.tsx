import type { LucideIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export function ModulePlaceholder({
  icon: Icon,
  title,
  description,
  bullets,
}: {
  icon: LucideIcon
  title: string
  description: string
  bullets: string[]
}) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <Card className="items-center py-16 text-center">
        <CardContent className="flex max-w-md flex-col items-center gap-4">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
            <Icon className="size-6 text-muted-foreground" />
          </div>
          <div className="flex flex-col items-center gap-2">
            <Badge variant="secondary">Coming soon in this preview</Badge>
            <p className="text-sm text-balance text-muted-foreground">
              This module is scoped for the next build pass. Planned
              capabilities based on the phase-1 requirements:
            </p>
          </div>
          <ul className="flex flex-col gap-1.5 text-left text-sm text-muted-foreground">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-start gap-2">
                <span className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground/60" />
                {bullet}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
