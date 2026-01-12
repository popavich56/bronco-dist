"use client"

import React from "react"
import { Text, clx } from "@medusajs/ui"
import { Product } from "@xclade/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import { ArrowUpRight } from "lucide-react"
import { VariantPrice } from "types/global"

type ProductPreviewCardProps = {
  product: Product
  isFeatured?: boolean
  view?: "grid" | "list"
}

export const ProductPreviewCard = ({
  product,
  isFeatured,
  view = "grid",
}: ProductPreviewCardProps) => {
  // List View specific styles
  if (view === "list") {
    return (
      <LocalizedClientLink
        href={`/products/${product.handle}`}
        className="group block w-full"
      >
        <div
          data-testid="product-wrapper"
          className="flex bg-terminal-panel border border-terminal-border p-4 transition-all hover:border-bronco-orange duration-200 gap-6 items-center"
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
                  className="font-display font-bold text-lg leading-tight text-terminal-white group-hover:text-bronco-orange transition-colors"
                  data-testid="product-title"
                >
                  {product.title}
                </Text>
              </div>
              <div className="flex items-center gap-x-2 font-mono font-bold text-lg text-terminal-white">
                {/* Price removed */}
              </div>
            </div>
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
        // 'Terminal Prime' Grid Cell Style - Minimalist
        className="h-full flex flex-col justify-between bg-terminal-black hover:bg-terminal-panel border-b-4 border-transparent p-6 transition-all duration-200 group-hover:border-bronco-orange relative overflow-hidden"
      >
        <div className="mb-4 relative overflow-hidden aspect-square bg-terminal-surface border border-terminal-border group-hover:border-terminal-active transition-colors">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="square"
            isFeatured={isFeatured}
            // Image styling: clear, slight zoom on hover
            className="object-cover opacity-90 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105"
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-col gap-1">
            <Text
              className="font-display font-bold text-base leading-tight text-terminal-white line-clamp-2 md:h-10 group-hover:text-bronco-orange transition-colors"
              data-testid="product-title"
            >
              {product.title}
            </Text>
          </div>


            <div className="flex items-end justify-between pt-3 border-t border-terminal-border border-dashed font-mono">
                <div className="flex flex-col">
                {/* Price removed as per request */}
                </div>
                <ArrowUpRight className="w-4 h-4 text-terminal-dim group-hover:text-bronco-orange transition-colors" />
            </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
