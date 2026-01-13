import { searchProducts } from "@lib/data/search"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@medusajs/ui"
import { Box, ChevronRight } from "lucide-react"

export default async function SearchResults({
  query,
  sortBy,
  page,
  limit = 12,
  view = "grid",
  countryCode,
}: {
  query?: string
  sortBy?: SortOptions
  page: number
  limit?: number
  view?: "grid" | "list"
  countryCode: string
}) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const offset = (page - 1) * limit

  // Map sort options to Typesense
  let typesenseSortBy: string | undefined = undefined
  if (sortBy === "created_at") typesenseSortBy = "created_at:desc"
  
  const searchResult = await searchProducts({
    query: query || "*",
    limit,
    offset,
    sort_by: typesenseSortBy,
    facet_by: "category_names"
  })

  const ids = searchResult.results.map(r => r.id)

  if (ids.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center text-terminal-dim border border-terminal-border bg-terminal-surface/50">
        <Text className="text-xl font-display font-bold mb-2 uppercase text-terminal-white">No Results</Text>
        <Text className="font-mono text-xs">Query &quot;{query}&quot; returned 0 records.</Text>
      </div>
    )
  }

  // Fetch full products by ID to get prices and details
  const {
    response: { products: fetchedProducts },
  } = await listProducts({
    pageParam: 1,
    queryParams: {
      id: ids,
      limit: ids.length,
    },
    countryCode,
  })

  // Re-order fetched products to match the search result order
  const productMap = new Map(fetchedProducts.map(p => [p.id, p]))
  const displayProducts = ids.map(id => productMap.get(id)).filter((p): p is typeof fetchedProducts[0] => !!p)

  const matchesCategories = searchResult.facet_counts?.find(f => f.field_name === 'category_names')?.counts || []

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      {/* Facets Sidebar - Terminal Style */}
        {matchesCategories.length > 0 && (
            <div className="hidden lg:block w-64 shrink-0 space-y-4 sticky top-24">
                <div className="p-4 border border-terminal-border bg-terminal-panel">
                    <h3 className="font-mono font-bold text-xs text-terminal-dim mb-4 pb-2 border-b border-terminal-border uppercase tracking-widest flex items-center gap-2">
                        <Box className="w-3 h-3" />
                        Sectors
                    </h3>
                    <ul className="space-y-px">
                        {matchesCategories.map((c: any) => (
                             <li key={c.value}>
                                <LocalizedClientLink 
                                    href={`/search?q=${encodeURIComponent(c.value)}`} 
                                    className="flex justify-between items-center group hover:bg-terminal-surface p-2 transition-all cursor-pointer"
                                >
                                    <span className="text-terminal-white font-bold text-xs uppercase tracking-wide group-hover:text-businessx-orange transition-colors flex items-center gap-2">
                                       <ChevronRight className="w-3 h-3 opacity-0 -ml-3 group-hover:opacity-100 group-hover:ml-0 transition-all text-businessx-orange" />
                                       {c.value}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-terminal-dim">{c.count}</span>
                                </LocalizedClientLink>
                             </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}

      <div className="flex-1 w-full">
         <ul
            className={view === "grid" 
              ? "grid grid-cols-2 lg:grid-cols-3 gap-px bg-terminal-border border border-terminal-border mb-12"
              : "flex flex-col gap-px bg-terminal-border border border-terminal-border mb-12"
            }
            data-testid="products-list"
        >
            {displayProducts.map((p) => {
            return (
                <li key={p.id} className="bg-terminal-black">
                  <ProductPreview product={p} region={region} view={view} />
                </li>
            )
            })}
        </ul>
         {searchResult.count > limit && (
            <Pagination
                data-testid="product-pagination"
                page={page}
                totalPages={Math.ceil(searchResult.count / limit)}
            />
        )}
      </div>
    </div>
  )
}
