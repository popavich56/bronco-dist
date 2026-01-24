import React, { Suspense } from "react"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import ProductDescriptionTabs from "@modules/products/components/product-description-tabs"
import RecentlyViewedProducts from "../components/recently-viewed-products"
import RecentlyViewedTracker from "../components/recently-viewed-products/tracker"
import UsuallyBoughtTogether from "@modules/products/components/usually-bought-together"
import { notFound } from "next/navigation"
import { Product, Region, Customer, ProductImage } from "@xclade/types"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: Product
  region: Region
  countryCode: string
  images: ProductImage[]
  customerPromise: Promise<Customer | null>
  reviews?: any[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
  customerPromise,
  reviews = [],
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <div className="bg-terminal-black dark:bg-[#0a0a0a] min-h-screen text-terminal-white pb-20">
      {/* Breadcrumb Top Bar */}
      <div className="border-b border-terminal-border bg-terminal-panel/50 /50 backdrop-blur-sm sticky top-0 z-40">
        <div className="content-container py-3 flex items-center gap-2 text-[10px] font-mono uppercase text-terminal-dim tracking-widest">
          <span className="text-businessx-orange">Inventory</span>
          <span>/</span>
          <span>{product.collection?.title || "General"}</span>
          <span>/</span>
          <span className="text-terminal-white">{product.title}</span>
        </div>
      </div>

      <div
        className="content-container flex flex-col small:grid small:grid-cols-[1.5fr_1fr] gap-x-16 py-12 relative"
        data-testid="product-container"
      >
        <div className="block w-full relative">
          <ImageGallery images={images} />
        </div>

        <div className="flex flex-col gap-y-8 sticky top-32 h-fit">
          <div className="p-6 border border-terminal-border bg-terminal-panel/30 /30 backdrop-blur-sm">
            <ProductInfo product={product} />

            <div className="py-6 border-b border-dashed border-terminal-border ">
                <Suspense fallback={<div className="h-10 w-full animate-pulse bg-terminal-panel/50 rounded-sm" />}>
                  <ProductActionsWrapper
                    product={product}
                    region={region}
                    customerPromise={customerPromise}
                  />
                </Suspense>
            </div>

            <div className="pt-6">
              <ProductTabs product={product} />
            </div>
          </div>

          <ProductOnboardingCta />
        </div>
      </div>

      <div className="content-container py-12 border-t border-terminal-border ">
        <ProductDescriptionTabs product={product} reviews={reviews} />
      </div>

      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts
            product={product}
            countryCode={countryCode}
            region={region}
          />
        </Suspense>
        <RecentlyViewedProducts countryCode={countryCode} />
      </div>
      <RecentlyViewedTracker productId={product.id} />
      <Suspense fallback={null}>
        <UsuallyBoughtTogether
          product={product}
          region={region}
          countryCode={countryCode}
        />
      </Suspense>
    </div>
  )
}

export default ProductTemplate
