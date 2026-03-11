import { listProducts } from "@lib/data/products"
import { searchProducts } from "@lib/data/search"
import { Product, Region, Customer } from "@xclade/types"
import UsuallyBoughtTogetherBar from "./client-bar"
import { isApprovedCustomer } from "@lib/util/customer-status"

type UsuallyBoughtTogetherProps = {
  product: Product
  region: Region
  countryCode: string
  customerPromise?: Promise<Customer | null>
}

export default async function UsuallyBoughtTogether({
  product,
  region,
  countryCode,
  customerPromise,
}: UsuallyBoughtTogetherProps) {
  // Smarter Logic: Prioritize Deep Context
  const filterParts: string[] = [`id:!=${product.id}`]

  // 1. Same Collection is the strongest signal
  if (product.collection_id) {
    filterParts.push(`collection_id:=${product.collection_id}`)
  }
  // 2. Fallback to Category if no collection
  else if (product.categories && product.categories.length > 0) {
    const catIds = product.categories
      .filter((c) => !!c)
      .map((c) => c!.id)
      .join(",")
    filterParts.push(`category_ids:=[${catIds}]`)
  }

  // Fetch from Search Index with specific filter
  const searchResult = await searchProducts({
    query: "*",
    limit: 2,
    filter_by: filterParts.join(" && "),
  })

  if (!searchResult.results.length) {
    // FALLBACK 1: If we filtered by collection but got nothing, try Category fallback
    if (
      product.collection_id &&
      product.categories &&
      product.categories.length > 0
    ) {
      const catIds = product.categories
        .filter((c) => !!c)
        .map((c) => c!.id)
        .join(",")
      const categoryFallback = await searchProducts({
        query: "*",
        limit: 2,
        filter_by: `id:!=${product.id} && category_ids:=[${catIds}]`,
      })

      if (categoryFallback.results.length > 0) {
        searchResult.results = categoryFallback.results
      } else {
        // If Category also fails, try Global fallback
        const globalFallback = await searchProducts({
          query: "*",
          limit: 2,
          filter_by: `id:!=${product.id}`,
        })
        searchResult.results = globalFallback.results
      }
    } else {
      // No collection tried, or no categories available, go straight to global
      const globalFallback = await searchProducts({
        query: "*",
        limit: 2,
        filter_by: `id:!=${product.id}`,
      })
      searchResult.results = globalFallback.results
    }
  }

  if (!searchResult.results.length) return null

  // PURE SEARCH MODE (Fastest)
  // We trust the search index contains enough data (title, handle, thumbnail, standard price)
  const relatedProducts = searchResult.results.map((hit: any) => {
     return {
        id: hit.id,
        title: hit.title,
        handle: hit.handle,
        thumbnail: hit.thumbnail,
        // Map search index standard fields to Product 
        // Note: Search index might not have calculated tax-inclusive prices, but has base price
        variants: [{
            calculated_price: {
                calculated_amount: hit.variant_min_price || hit.price || 0,
                original_amount: hit.variant_min_price || hit.price || 0,
                currency_code: countryCode // Assumption
            }
        }]
     } as unknown as Product
  })

  const customer = customerPromise ? await customerPromise : null

  return (
    <UsuallyBoughtTogetherBar
      mainProduct={product}
      relatedProducts={relatedProducts}
      region={region}
      countryCode={countryCode}
      isValidCustomer={isApprovedCustomer(customer)}
    />
  )
}
