import { listProducts } from "@lib/data/products"
import { ProductCollection, Product, Region } from "@xclade/types"
import { Text } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"
import { ArrowRight } from "lucide-react"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: ProductCollection
  region: Region
}) {
  // Check if we have collection ID or handle
  if (!collection.id) return null

  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
    },
  })

  if (!pricedProducts) {
    return null
  }

  return (
    <div className="py-16 border-b border-terminal-border bg-terminal-black">
      <div className="content-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6 border-l-2 border-businessx-orange pl-6">
          <div>
            <span className="text-[10px] font-mono font-bold text-businessx-orange uppercase tracking-widest mb-2 block">
               Section: {collection.handle}
            </span>
            <Text className="text-3xl md:text-4xl font-bold text-terminal-white font-display uppercase leading-none tracking-tight">
              {collection.title}
            </Text>
          </div>
          <LocalizedClientLink 
            href={`/collections/${collection.handle}`} 
            className="flex items-center gap-2 text-terminal-dim hover:text-businessx-orange font-mono text-xs font-bold uppercase tracking-widest transition-all group"
          >
            Access Full List
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </LocalizedClientLink>
        </div>
        
        <ul className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-terminal-border border border-terminal-border">
          {pricedProducts &&
            pricedProducts.map((product) => (
              <li key={product.id} className="bg-terminal-black">
                <ProductPreview product={product} region={region} isFeatured />
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
