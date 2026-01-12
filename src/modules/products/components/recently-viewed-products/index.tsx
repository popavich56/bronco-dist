"use client"

import { useEffect, useState } from "react"
import { useRecentlyViewed } from "@lib/hooks/use-recently-viewed"
import { searchProducts } from "@lib/data/search"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { Heading, Text } from "@medusajs/ui"
import { Product } from "@xclade/types"
export default function RecentlyViewedProducts({
  countryCode,
}: {
  countryCode: string
}) {
  const { productIds } = useRecentlyViewed()
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      if (productIds.length === 0) return

      // Use Search Engine for max speed (avoid DB hit)
      const idsString = productIds.join(",")
      const { results } = await searchProducts({
        query: "*",
        limit: 12,
        filter_by: `id:=[${idsString}]`,
      })

      // Sort products to match the order in productIds
      // And map Search Document -> Minimal Product
      const sorted = results
        .sort((a: any, b: any) => {
          return productIds.indexOf(a.id) - productIds.indexOf(b.id)
        })
        .map((hit: any) => ({
          id: hit.id,
          title: hit.title,
          handle: hit.handle,
          thumbnail: hit.thumbnail,
          images: hit.thumbnail ? [{ url: hit.thumbnail, id: 'thumb' }] : [],
          // Minimal mock for required fields
          created_at: '',
          is_giftcard: false,
          profile_id: '',
          options: [],
          variants: []
        } as unknown as Product))

      setProducts(sorted)
    }

    fetchProducts()
  }, [productIds, countryCode])

  if (products.length === 0) return null

  return (
    <div className="flex flex-col gap-y-4 mt-12 pt-6 border-t border-terminal-border">
      <Heading
        level="h2"
        className="text-sm font-display font-bold uppercase text-terminal-white"
      >
        Recently Viewed
      </Heading>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
        {products.map((product) => (
          <LocalizedClientLink
            key={product.id}
            href={`/products/${product.handle}`}
            className="group flex flex-col gap-y-1 w-24 flex-shrink-0"
          >
            <div className="aspect-[1/1] w-full overflow-hidden bg-terminal-highlight rounded-sm border border-transparent group-hover:border-bronco-yellow transition-colors relative">
              <Thumbnail
                thumbnail={product.thumbnail}
                images={product.images}
                size="full"
              />
            </div>
            <Text className="text-[10px] leading-tight font-bold font-display uppercase truncate group-hover:text-bronco-yellow transition-colors">
              {product.title}
            </Text>
          </LocalizedClientLink>
        ))}
      </div>
    </div>
  )
}
