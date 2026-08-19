"use client"

import Image from "next/image"
import { useTranslations } from "next-intl"

import { Link, usePathname } from "@/i18n/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { navItems } from "@/components/layout/nav-items"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAdsStore } from "@/components/ads/ads-store"

export function AppSidebar() {
  const pathname = usePathname()
  const t = useTranslations()
  const { ads, isLoaded: adsLoaded } = useAdsStore()

  const pendingAdsCount = adsLoaded
    ? ads.filter((a) => a.status === "Pending").length
    : 0

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-sidebar-accent transition-colors cursor-pointer"
              render={<Link href="/dashboard" />}
            >
              <div className="flex aspect-square size-8 shrink-0 items-center justify-center rounded-lg overflow-hidden bg-white/95 p-1 shadow-xs ring-1 ring-border/50">
                <Image
                  src="/favicon.png"
                  alt={t("brand.name")}
                  width={24}
                  height={24}
                  priority
                  className="size-full object-contain"
                />
              </div>
              <div className="grid flex-1 text-start leading-tight">
                <span className="truncate font-heading text-sm font-semibold tracking-tight text-sidebar-foreground">
                  {t("brand.name")}
                </span>
                <span className="truncate text-[11px] font-medium text-sidebar-foreground/60">
                  {t("brand.subtitle")}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href)

                const isAdsItem = item.href === "/ads"

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={t(item.titleKey)}
                      render={<Link href={item.href} />}
                    >
                      <item.icon />
                      <span className="flex-1">{t(item.titleKey)}</span>
                      {isAdsItem && pendingAdsCount > 0 && (
                        <span className="ms-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-500/20 px-1 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                          {pendingAdsCount}
                        </span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="cursor-default"
              tooltip="developer@sketchmonk.com"
              render={<div />}
            >
              <Avatar size="sm">
                <AvatarFallback>SA</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-start leading-tight">
                <span className="truncate text-sm font-medium">
                  {t("userMenu.superAdmin")}
                </span>
                <span className="truncate text-xs text-sidebar-foreground/60">
                  developer@sketchmonk.com
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
