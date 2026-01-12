import { Suspense } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import StoreToolbar from "@modules/store/components/store-toolbar"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { ProductCollection } from "@xclade/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
  view,
  limit,
}: {
  sortBy?: SortOptions
  collection: ProductCollection
  page?: string
  countryCode: string
  view?: string
  limit?: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const limitNumber = limit ? parseInt(limit) : 12
  const viewMode = view === "list" ? "list" : "grid"
  const sort = sortBy || "created_at"

  return (
    <div className="py-6 content-container">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-black uppercase text-terminal-white">{collection.title}</h1>
      </div>
      <StoreToolbar sortBy={sort} limit={limitNumber} view={viewMode as "grid" | "list"} />
      <div className="w-full">
        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={collection.products?.length}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            limit={limitNumber}
            view={viewMode as "grid" | "list"}
            collectionId={collection.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
