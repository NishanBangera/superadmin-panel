import {
  LayoutDashboardIcon,
  UsersIcon,
  MegaphoneIcon,
  MessagesSquareIcon,
  FileTextIcon,
  BellIcon,
  ShieldCheckIcon,
  type LucideIcon,
} from "lucide-react"

export type NavItem = {
  title: string
  titleKey: string
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    titleKey: "navigation.dashboard",
    href: "/dashboard",
    icon: LayoutDashboardIcon,
  },
  {
    title: "User Management",
    titleKey: "navigation.userManagement",
    href: "/users",
    icon: UsersIcon,
  },
  {
    title: "Ads Management",
    titleKey: "navigation.adsManagement",
    href: "/ads",
    icon: MegaphoneIcon,
  },
  {
    title: "Chat & Messaging",
    titleKey: "navigation.chatMessaging",
    href: "/chat",
    icon: MessagesSquareIcon,
  },
  {
    title: "CMS",
    titleKey: "navigation.cms",
    href: "/cms",
    icon: FileTextIcon,
  },
  {
    title: "Notifications",
    titleKey: "navigation.notifications",
    href: "/notifications",
    icon: BellIcon,
  },
  {
    title: "Admin & Role Permissions",
    titleKey: "navigation.adminRoles",
    href: "/admin-roles",
    icon: ShieldCheckIcon,
  },
]
