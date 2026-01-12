import { Product, Region, Customer } from "@xclade/types"
import ProductActions from "@modules/products/components/product-actions"
import { getProductByHandle } from "@lib/data/products"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  product,
  region,
  customer,
}: {
  product: Product
  region: Region
  customer: Customer | null
}) {
  // No internal fetch - synchronous render
  if (!product) {
    return null
  }

  return (
    <ProductActions
      product={product}
      region={region}
      isValidCustomer={!!customer}
    />
  )
}
