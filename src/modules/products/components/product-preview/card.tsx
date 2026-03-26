"use client"

import React from "react"
import { Text } from "@medusajs/ui"
import { Product } from "@xclade/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import { VariantPrice } from "types/global"
import QuickAddButton from "./quick-add-button"

type ProductPreviewCardProps = {
  product: Product
  isFeatured?: boolean
  view?: "grid" | "list"
  price?: VariantPrice | null
  isApproved?: boolean
  isLoggedIn?: boolean
  countryCode?: string
}

export const ProductPreviewCard = ({
  product,
  isFeatured,
  view = "grid",
  price,
  isApproved = false,
  isLoggedIn = false,
}: ProductPreviewCardProps) => {
  const isSingleVariant = product.variants?.length === 1
  const variantId = isSingleVariant ? product.variants![0].id : null

  // List View
  if (view === "list") {
    return (
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="group block w-full"
      >
        <div
          data-testid="product-wrapper"
          className="flex bg-terminal-panel border border-terminal-border p-4 transition-all hover:border-businessx-orange duration-200 gap-6 items-center"
        >
          <div className="relative overflow-hidden w-24 h-24 shrink-0 bg-terminal-surface border border-terminal-border">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="square"
              isFeatured={isFeatured}
              className="object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
            />
          </div>

          <div className="flex flex-col flex-1 justify-between h-full">
            <div className="flex justify-between items-start w-full">
              <div className="flex flex-col gap-1">
                {product.subtitle && (
                  <Text className="font-mono text-xs text-terminal-tech uppercase tracking-widest mb-1">
                    {product.subtitle}
                  </Text>
                )}
                <Text
                  className="font-display font-bold text-lg leading-tight text-terminal-white group-hover:text-businessx-orange transition-colors"
                  data-testid="product-title"
                >
                  {product.title}
                </Text>
              </div>
              {price && (
                <div className="flex items-center gap-x-2 font-mono font-bold text-lg text-terminal-white">
                  {price.calculated_price}
                </div>
              )}
            </div>
          </div>

          <div className="shrink-0 w-36">
            <QuickAddButton
              productHandle={product.handle!}
              variantId={variantId}
              isApproved={isApproved}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </LocalizedClientLink>
    )
  }

  // Grid View (Default)
  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block h-full w-full"
    >
      <div
        data-testid="product-wrapper"
        className="h-full flex flex-col justify-between bg-terminal-black hover:bg-terminal-panel p-4 md:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20 relative overflow-hidden"
      >
        {/* Image */}
        <div className="mb-3 relative overflow-hidden aspect-square bg-terminal-surface border border-terminal-border group-hover:border-businessx-orange/40 transition-colors duration-200 rounded-sm">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            isFeatured={isFeatured}
            className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-[1.06]"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col flex-1 justify-between gap-3">
          <div>
            <Text
              className="font-display font-bold text-sm md:text-base leading-tight text-terminal-white line-clamp-2 min-h-[2.5rem] group-hover:text-businessx-orange transition-colors duration-200"
              data-testid="product-title"
            >
              {product.title}
            </Text>

            {/* Price — approved customers only */}
            <div className="h-6 mt-1 font-mono text-sm">
              {price ? (
                <span className="text-terminal-white font-bold">
                  {price.calculated_price}
                  {price.price_type === "sale" && (
                    <span className="ml-2 text-terminal-dim line-through text-xs">
                      {price.original_price}
                    </span>
                  )}
                </span>
              ) : (
                <span className="text-terminal-dim text-xs">&nbsp;</span>
              )}
            </div>
          </div>

          {/* Quick Add CTA — always takes space */}
          <div className="mt-auto pt-2">
            <QuickAddButton
              productHandle={product.handle!}
              variantId={variantId}
              isApproved={isApproved}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
