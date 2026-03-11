import { Product, Region, Customer } from "@xclade/types"
import ProductActions from "@modules/products/components/product-actions"
import { getProductByHandle } from "@lib/data/products"
import { isApprovedCustomer, isPendingCustomer } from "@lib/util/customer-status"

/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  product,
  region,
  customerPromise,
}: {
  product: Product
  region: Region
  customerPromise: Promise<Customer | null>
}) {
  const customer = await customerPromise
  // No internal fetch - synchronous render
  if (!product) {
    return null
  }

  return (
    <ProductActions
      product={product}
      region={region}
      isValidCustomer={isApprovedCustomer(customer)}
      isPending={isPendingCustomer(customer)}
    />
  )
}
