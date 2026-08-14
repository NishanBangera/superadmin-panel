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
  href: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboardIcon },
  { title: "User Management", href: "/users", icon: UsersIcon },
  { title: "Ads Management", href: "/ads", icon: MegaphoneIcon },
  { title: "Chat & Messaging", href: "/chat", icon: MessagesSquareIcon },
  { title: "CMS", href: "/cms", icon: FileTextIcon },
  { title: "Notifications", href: "/notifications", icon: BellIcon },
  {
    title: "Admin & Role Permissions",
    href: "/admin-roles",
    icon: ShieldCheckIcon,
  },
]
