import { notFound } from "next/navigation"
import { Suspense } from "react"
import Image from "next/image"
import { ArrowRight, Box } from "lucide-react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import StoreToolbar from "@modules/store/components/store-toolbar"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ProductCategory } from "@xclade/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  limit,
  view,
  countryCode,
}: {
  category: ProductCategory
  sortBy?: SortOptions
  page?: string
  limit?: string
  view?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const limitNumber = limit ? parseInt(limit) : 12
  const viewMode = view === "list" ? "list" : "grid"
  const sort = sortBy || "created_at"

  if (!category || !countryCode) notFound()

  const parents = [] as ProductCategory[]

  const getParents = (category: ProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div className="content-container py-8" data-testid="category-container">
      <div className="w-full">
        {/* Breadcrumbs */}
        <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-terminal-dim ">
          <LocalizedClientLink
            href="/"
            className="hover:text-bronco-orange transition-colors"
          >
            Home
          </LocalizedClientLink>
          <span>/</span>
          <LocalizedClientLink
            href="/store"
            className="hover:text-bronco-orange transition-colors"
          >
            Inventory
          </LocalizedClientLink>
          {parents && parents.length > 0 && <span>/</span>}
          {parents &&
            parents
              .slice()
              .reverse()
              .map((parent, index) => (
                <span key={parent.id} className="flex items-center gap-2">
                  <LocalizedClientLink
                    className="hover:text-bronco-orange transition-colors"
                    href={`/categories/${parent.handle}`}
                  >
                    {parent.name}
                  </LocalizedClientLink>
                  <span>/</span>
                </span>
              ))}
        </div>

        {/* Header Section */}
        <div className="mb-12 flex flex-col md:flex-row gap-8 justify-between items-end border-b border-terminal-border pb-8">
          <div className="flex-1">
            <h1
              data-testid="category-page-title"
              className="text-4xl md:text-6xl font-display font-black uppercase text-terminal-white tracking-tighter leading-none mb-4"
            >
              {category.name}
            </h1>

            {category.description && (
              <div
                className="text-sm font-mono text-terminal-dim max-w-2xl leading-relaxed"
                dangerouslySetInnerHTML={{ __html: category.description }}
              />
            )}
          </div>

          {(category as any).product_category_image?.[0]?.url && (
            <div className="relative w-full md:w-[320px] aspect-[16/9] bg-terminal-surface border border-terminal-border overflow-hidden shrink-0 group">
              {/* Tech overlay */}
              <div className="absolute inset-0 z-10 bg-terminal-black/20 group-hover:bg-transparent transition-all duration-500" />
              <Image
                src={(category as any).product_category_image[0].url}
                alt={category.name}
                fill
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                sizes="(max-width: 768px) 100vw, 320px"
                priority
              />
            </div>
          )}
        </div>

        {/* Subcategories (Pills) */}
        {category.category_children &&
          category.category_children.length > 0 && (
            <div className="mb-12">
              <ul className="flex flex-wrap gap-2">
                {category.category_children.map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      href={`/categories/${c.handle}`}
                      className="group flex items-center gap-x-3 bg-terminal-surface border border-terminal-border px-4 py-2 hover:border-bronco-orange transition-all duration-200"
                    >
                      <span className="font-bold font-mono uppercase tracking-wide text-xs text-terminal-white group-hover:text-bronco-orange">
                        {c.name}
                      </span>
                      <ArrowRight className="w-3 h-3 text-terminal-dim group-hover:text-bronco-orange group-hover:translate-x-1 transition-all" />
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

        <StoreToolbar sortBy={sort} limit={limitNumber} view={viewMode} />

        <Suspense
          fallback={
            <SkeletonProductGrid
              numberOfProducts={category.products?.length ?? 8}
            />
          }
        >
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            limit={limitNumber}
            view={viewMode}
            categoryId={category.id}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}
