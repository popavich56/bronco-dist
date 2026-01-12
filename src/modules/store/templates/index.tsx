import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import StoreToolbar from "@modules/store/components/store-toolbar"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  limit,
  view,
  countryCode,
}: {
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
      data-testid="category-container"
    >
      <StoreToolbar sortBy={sort} limit={limitNumber} view={viewMode as "grid" | "list"} />
      <div className="w-full">
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
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

export default StoreTemplate
