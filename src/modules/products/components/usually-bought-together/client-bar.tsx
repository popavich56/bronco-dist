"use client"

import { Product, Region } from "@xclade/types"
import { Button, clx, Text } from "@medusajs/ui"
import { useState, useEffect } from "react"
import Image from "next/image"
import { addToCart } from "@lib/data/cart"
import { ShoppingBag, X } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

type UsuallyBoughtTogetherBarProps = {
  mainProduct: Product
  relatedProducts: Product[]
  region: Region
  countryCode: string
}

export default function UsuallyBoughtTogetherBar({
  mainProduct,
  relatedProducts,
  region,
  countryCode,
}: UsuallyBoughtTogetherBarProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [adding, setAdding] = useState(false)

  // Show after scrolling down a bit
  useEffect(() => {
    const handleScroll = () => {
      // Show almost immediately for testing
      if (window.scrollY > 100 && !isDismissed) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isDismissed])

  if (!relatedProducts.length || isDismissed) return null

  // We bundler Main Product + Top 2 Related
  const bundle = [mainProduct, ...relatedProducts.slice(0, 2)]

  // Calculate total price (using cheapest variants)
  const bundleTotal = bundle.reduce((acc, product) => {
    // Find cheapest variant price (safest bet for 'from')
    const cheapest = (product.variants || []).reduce((lowest, v) => {
      const price = v.calculated_price?.calculated_amount || 0
      return price < lowest ? price : lowest
    }, Infinity)
    return acc + (cheapest === Infinity ? 0 : cheapest)
  }, 0)

  const handleAddAll = async () => {
    setAdding(true)
    try {
      await Promise.all(
        bundle.map((p) => {
          const variantId = p.variants?.[0]?.id // Default to first variant
          if (!variantId) return Promise.resolve()
          return addToCart({
            variantId,
            quantity: 1,
            countryCode,
          })
        })
      )
      // Success feedback or open cart drawer?
      // Assuming addToCart handles revalidation and toast/drawer in its implementation or via separate UI listener
    } catch (e) {
      console.error(e)
    } finally {
      setAdding(false)
      setIsDismissed(true) // Dismiss after adding
    }
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat(region.currency_code?.toUpperCase(), {
      style: "currency",
      currency: region.currency_code?.toUpperCase(),
    }).format(amount)
  }

  return (
    <div
      className={clx(
        "fixed bottom-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out transform",
        isVisible ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Glassmorphism Container */}
      <div className="mx-auto max-w-5xl mb-6 px-4">
        <div className="bg-bronco-black/90 backdrop-blur-xl border border-bronco-gray/20 p-5 md:p-6 rounded-none shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute -top-20 -left-20 w-60 h-60 bg-bronco-yellow/10 rounded-full blur-[80px] pointer-events-none" />

          {/* Content Left: Products Stack */}
          <div className="flex items-center gap-6 z-10 w-full md:w-auto">
            <div className="flex items-center -space-x-4 shrink-0 pl-2">
              {bundle.map((product, i) => (
                <LocalizedClientLink
                  key={product.id}
                  href={`/products/${product.handle}`}
                  className="relative w-20 h-20 rounded-none border-2 border-terminal-border bg-terminal-black shadow-none shrink-0 group hover:z-20 cursor-pointer overflow-hidden transition-transform hover:scale-110 hover:-rotate-2"
                >
                  <Thumbnail
                    thumbnail={product.thumbnail}
                    images={product.images}
                    size="full"
                  />
                  {i > 0 && (
                    <div className="absolute top-0 right-0 w-5 h-5 bg-bronco-yellow text-terminal-white text-[10px] font-extrabold flex items-center justify-center rounded-bl-lg shadow-none">
                      +
                    </div>
                  )}
                </LocalizedClientLink>
              ))}
            </div>

            <div className="flex flex-col">
              <Text className="text-bronco-white font-display uppercase font-extrabold text-lg tracking-wide leading-tight">
                Usually Bought Together
              </Text>
              <Text className="text-bronco-gray font-medium text-sm mt-1">
                Buy {bundle.length} items for{" "}
                <span className="text-bronco-yellow font-bold text-base ml-1">
                  {formatPrice(bundleTotal)}
                </span>
              </Text>
            </div>
          </div>

          {/* Actions Right */}
          <div className="flex items-center gap-4 z-10 w-full md:w-auto mt-2 md:mt-0">
            <Button
              variant="primary"
              className="w-full md:w-auto bg-bronco-yellow text-terminal-white hover:bg-terminal-black hover:text-terminal-white border-2 border-transparent hover:border-bronco-yellow font-extrabold uppercase tracking-wider h-12 px-8 text-sm md:text-base shadow-none hover:shadow-bronco-yellow/20 transition-all"
              onClick={handleAddAll}
              isLoading={adding}
            >
              <ShoppingBag className="mr-2 h-5 w-5" />
              Add All To Cart
            </Button>
            <button
              onClick={() => setIsDismissed(true)}
              className="p-3 rounded-full bg-terminal-black/5 hover:bg-terminal-black/10 text-white/50 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
