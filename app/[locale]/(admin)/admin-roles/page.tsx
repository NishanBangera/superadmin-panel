import { ShieldCheckIcon } from "lucide-react"

import { ModulePlaceholder } from "@/components/layout/module-placeholder"

export default function AdminRolesPage() {
  return (
    <ModulePlaceholder
      icon={ShieldCheckIcon}
      title="Admin & Role Permissions"
      description="Manage sub-admin accounts and fine-grained role-based access."
      bullets={[
        "Add sub-admins",
        "Role-based permissions (admin, moderator, support)",
        "Audit log of admin actions",
      ]}
    />
  )
}
