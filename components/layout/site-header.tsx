"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellIcon, LogOutIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/layout/theme-toggle"
import { navItems } from "@/components/layout/nav-items"

const notifications = [
  { title: "3 ads pending approval", time: "5m ago" },
  { title: "New user report submitted", time: "1h ago" },
  { title: "Boost package purchased", time: "3h ago" },
]

export function SiteHeader() {
  const pathname = usePathname()
  const current = navItems.find((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname.startsWith(item.href)
  )

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full min-w-0 shrink-0 items-center justify-between gap-2 border-b bg-background/95 px-3 sm:px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="h-4" />
        <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground truncate">
          {current?.title ?? "ZOQO DEAL Super Admin"}
        </h2>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <div className="relative hidden md:block">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search…"
            className="h-8 w-36 lg:w-52 pl-8 text-xs"
            aria-label="Search"
          />
        </div>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="relative">
                <BellIcon className="size-4" />
                <span className="absolute top-1 right-1 size-1.5 rounded-full bg-destructive" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-72">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n.title}
                className="flex flex-col items-start gap-0.5"
              >
                <span className="text-sm">{n.title}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-muted-foreground">
              View All Notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="rounded-full">
                <Avatar size="sm">
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">
                Super Admin
              </span>
              <span className="font-normal text-xs text-muted-foreground">
                developer@sketchmonk.com
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon className="size-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon className="size-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOutIcon className="size-4" /> Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Badge variant="secondary" className="hidden lg:inline-flex text-xs">
          Demo Preview
        </Badge>
      </div>
    </header>
  )
}
