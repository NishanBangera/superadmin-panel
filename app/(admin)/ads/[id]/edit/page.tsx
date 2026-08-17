import { AdEditForm } from "@/components/ads/ad-edit-form"

export default async function AdEditPageRoute({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AdEditForm adId={id} />
}
