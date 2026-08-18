import { AdDetailsView } from "@/components/ads/ad-details-view"

export default async function AdDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  return <AdDetailsView adId={id} />
}
