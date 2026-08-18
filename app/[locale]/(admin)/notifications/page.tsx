import { BellIcon } from "lucide-react"

import { ModulePlaceholder } from "@/components/layout/module-placeholder"

export default function NotificationsPage() {
  return (
    <ModulePlaceholder
      icon={BellIcon}
      title="Notifications"
      description="Send push notifications and platform-wide announcements."
      bullets={[
        "Push notifications to users and segments",
        "Announcement broadcast composer",
        "Delivery status and engagement tracking",
      ]}
    />
  )
}
