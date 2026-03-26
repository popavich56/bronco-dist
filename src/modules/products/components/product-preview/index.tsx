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
  const { cheapestPrice } = getProductPrice({ product })
  const customer = await retrieveCustomer()
  const approved = isApprovedCustomer(customer)
  const shouldShowPrice = !!cheapestPrice && approved

  return (
    <ProductPreviewCard
      product={product}
      isFeatured={isFeatured}
      view={view}
      price={shouldShowPrice ? cheapestPrice : null}
      isApproved={approved}
      isLoggedIn={!!customer}
      countryCode={region.countries?.[0]?.iso_2 ?? "us"}
    />
  )
}
