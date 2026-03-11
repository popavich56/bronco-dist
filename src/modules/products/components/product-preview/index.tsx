import { getProductPrice } from "@lib/util/get-product-price"
import { Product, Region } from "@xclade/types"
import { ProductPreviewCard } from "./card"
import { retrieveCustomer } from "@lib/data/customer"
import { isApprovedCustomer } from "@lib/util/customer-status"

export default async function ProductPreview({
  product,
  isFeatured,
  region,
  view = "grid",
}: {
  product: Product
  isFeatured?: boolean
  region: Region
  view?: "grid" | "list"
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const customer = await retrieveCustomer()

  // If we require customer logic for pricing visibility, handle it here
  if (!cheapestPrice || !customer) {
    // Return card without price or null if strict
    // Matching original logic: if (!price || !customer) return null
    // But original logic was inside PreviewPrice.
    // Here we replicate: "if we have a price but no customer/logic prevents it, pass it"
    // Actually, original PreviewPrice returned null if no customer.
    // So we pass null as price.
  }

  const shouldShowPrice = !!cheapestPrice && isApprovedCustomer(customer)

  return (
    <ProductPreviewCard
      product={product}
      isFeatured={isFeatured}
      view={view}
      price={shouldShowPrice ? cheapestPrice : null}
    />
  )
}
