import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import StoreToolbar from "@modules/store/components/store-toolbar"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import SearchResults from "./search-results"

const SearchTemplate = ({
  query,
  sortBy,
  page,
  limit,
  view,
  countryCode,
}: {
  query?: string
  sortBy?: SortOptions
  page?: string
  limit?: string
  view?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const limitNumber = limit ? parseInt(limit) : 12
  const viewMode = view === "list" ? "list" : "grid"
  const sort = sortBy || "created_at"

  return (
    <div
      className="py-6 content-container"
      data-testid="search-container"
    >
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-2xl font-display font-bold text-terminal-white uppercase tracking-wide">
          Search Results for <span className="text-bronco-yellow bg-bronco-black px-2 py-0.5 rounded-sm">&quot;{query}&quot;</span>
        </h1>
      </div>
      <StoreToolbar sortBy={sort} limit={limitNumber} view={viewMode as "grid" | "list"} />
      <div className="w-full mt-6">
        <Suspense fallback={<SkeletonProductGrid />}>
          <SearchResults
            query={query}
            sortBy={sortBy}
            page={pageNumber}
            limit={limitNumber}
            view={viewMode as "grid" | "list"}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default SearchTemplate
