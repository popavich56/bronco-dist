import { Metadata } from "next"
import BulkOrderTemplate from "@modules/bulk-order/templates"
import { retrieveCustomer } from "@lib/data/customer"
import { isApprovedCustomer } from "@lib/util/customer-status"

export const metadata: Metadata = {
  title: "Bulk Order",
  description: "Quickly order multiple products.",
}

export default async function BulkOrderPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const customer = await retrieveCustomer().catch(() => null)

  return <BulkOrderTemplate isValidCustomer={isApprovedCustomer(customer)} />
}
