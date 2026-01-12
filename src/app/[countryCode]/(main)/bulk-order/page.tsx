import { Metadata } from "next"
import BulkOrderTemplate from "@modules/bulk-order/templates"

export const metadata: Metadata = {
  title: "Bulk Order",
  description: "Quickly order multiple products.",
}

export default async function BulkOrderPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  
  return <BulkOrderTemplate />
}
