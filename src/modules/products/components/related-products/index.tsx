import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { searchProducts } from "@lib/data/search"
import { Product, Region } from "@xclade/types"
import ProductPreview from "../product-preview"

type RelatedProductsProps = {
  product: Product
  countryCode: string
  region: Region
}

export default async function RelatedProducts({
  product,
  countryCode,
  region,
}: RelatedProductsProps) {
  if (!region) {
    return null
  }

  // Build Typesense filter query
  // Priority: Collection > Category > Tags
  const filterParts: string[] = [`id:!=${product.id}`]

  if (product.collection_id) {
    filterParts.push(`collection_id:=${product.collection_id}`)
  } else if (product.categories && product.categories.length > 0) {
    // Note: Search index needs category_ids. Assuming product.categories has ids.
    const catIds = product.categories
      .filter((c) => !!c)
      .map((c) => c!.id)
      .join(",")
    filterParts.push(`category_ids:=[${catIds}]`)
  } else if (product.tags && product.tags.length > 0) {
    const escapedTags = product.tags.map((t) => `\`${t.value}\``).join(",")
    filterParts.push(`tags:=[${escapedTags}]`)
  }

  // If no filters other than ID exclude, we might get random products or nothing.
  // Typesense '*' query with just ID exclusion gives broad results (good fallback).

  const searchResult = await searchProducts({
    query: "*",
    limit: 5,
    filter_by: filterParts.join(" && "),
  })

  if (!searchResult.results.length) {
    return null
  }

  const ids = searchResult.results.map((r) => r.id)

  // Fetch full products to get prices
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: {
      id: ids,
      limit: 5,
    },
  })

  // Sort them back to match search influence (if relevant, though mostly relevance or random here)
  const productMap = new Map(products.map((p) => [p.id, p]))
  const displayProducts = ids
    .map((id) => productMap.get(id))
    .filter((p): p is Product => !!p)

  if (!displayProducts.length) {
    return null
  }

  return (
    <div className="product-page-constraint">
      <div className="flex flex-col items-start min-[480px]:items-center text-left min-[480px]:text-center mb-16 border-t border-terminal-border pt-16 w-full">
        <span className="font-mono text-sm text-terminal-dim uppercase tracking-widest mb-2">
          Related products
        </span>
        <h3 className="font-display font-bold text-2xl text-terminal-white tracking-tight">
          You might also want to check out these products.
        </h3>
      </div>

      <ul className="grid grid-cols-2 small:grid-cols-3 medium:grid-cols-5 gap-x-6 gap-y-8">
        {displayProducts.map((product) => (
          <li key={product.id}>
            <ProductPreview region={region} product={product} />
          </li>
        ))}
      </ul>
    </div>
  )
}
