import { FileTextIcon } from "lucide-react"

import { ModulePlaceholder } from "@/components/layout/module-placeholder"

export default function CmsPage() {
  return (
    <ModulePlaceholder
      icon={FileTextIcon}
      title="CMS"
      description="Control the content shown across the home page and marketing surfaces."
      bullets={[
        "FAQ management",
        "Blog management",
        "Banner ads management",
        "Homepage slider control",
        "Terms & conditions / policy content",
      ]}
    />
  )
}
