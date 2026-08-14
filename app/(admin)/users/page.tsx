import { UsersIcon } from "lucide-react"

import { ModulePlaceholder } from "@/components/layout/module-placeholder"

export default function UsersPage() {
  return (
    <ModulePlaceholder
      icon={UsersIcon}
      title="User Management"
      description="View, verify, and manage every marketplace account from one place."
      bullets={[
        "Search & filter by name, email, phone, and status",
        "Block / suspend users, reset password, view activity history",
        "Manage user roles (admin, moderator, support)",
        "Premium & verified user tags, fraud detection flags",
        "Free listing & promotion credit management",
        "Custom payment link generation for business packages",
      ]}
    />
  )
}
