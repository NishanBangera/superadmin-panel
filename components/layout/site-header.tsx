"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BellIcon, LogOutIcon, SearchIcon, SettingsIcon, UserIcon } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
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
  const current = navItems.find((item) => item.href === pathname)

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-1 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {pathname.startsWith("/ads") && pathname !== "/ads" ? (
            <>
              <BreadcrumbItem>
                <BreadcrumbLink render={<Link href="/ads" />}>
                  Ads Management
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              {pathname.endsWith("/edit") ? (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      render={
                        <Link
                          href={pathname.replace("/edit", "")}
                          className="font-mono text-xs"
                        />
                      }
                    >
                      {pathname.split("/")[2]}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage className="font-medium text-foreground">
                      Edit
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                </>
              ) : (
                <BreadcrumbItem>
                  <BreadcrumbPage className="font-mono text-xs font-medium text-foreground">
                    {pathname.split("/")[2]}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}
            </>
          ) : (
            <BreadcrumbItem>
              <BreadcrumbPage className="font-medium text-foreground">
                {current?.title ?? "ZOQO DEAL"}
              </BreadcrumbPage>
            </BreadcrumbItem>
          )}
        </BreadcrumbList>
      </Breadcrumb>

      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden sm:block">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search…"
            className="h-8 w-56 pl-8"
            aria-label="Search"
          />
        </div>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="relative">
                <BellIcon />
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
              View all notifications
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
              <span className="font-normal text-muted-foreground">
                developer@sketchmonk.com
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <UserIcon /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <SettingsIcon /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <LogOutIcon /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Badge variant="secondary" className="hidden md:inline-flex">
          Demo Preview
        </Badge>
      </div>
    </header>
  )
}
