import { MessagesSquareIcon } from "lucide-react"

import { ModulePlaceholder } from "@/components/layout/module-placeholder"

export default function ChatPage() {
  return (
    <ModulePlaceholder
      icon={MessagesSquareIcon}
      title="Chat & Messaging"
      description="Monitor and moderate buyer-seller conversations across the platform."
      bullets={[
        "Monitor live conversations between users",
        "Block abusive users and review message reports",
        "Chat moderation logs",
        "Admin chat with users directly",
        "Manage designated support chat numbers",
      ]}
    />
  )
}
