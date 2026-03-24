"use client"

import { addToCart } from "@lib/data/cart"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { Product } from "@xclade/types"
import { Button } from "@medusajs/ui"
import { useParams, usePathname } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Check, X, AlertTriangle } from "lucide-react"

type VariantTableProps = {
  product: Product
  disabled?: boolean
  isValidCustomer?: boolean
}

export default function VariantTable({
  product,
  disabled,
  isValidCustomer = false,
}: VariantTableProps) {
  const { countryCode } = useParams()
  const pathname = usePathname()
  const [addingVariantId, setAddingVariantId] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [bulkAdding, setBulkAdding] = useState(false)
  const [bulkErrors, setBulkErrors] = useState<string[]>([])

  const handleAddToCart = async (variantId: string) => {
    setAddingVariantId(variantId)
    await addToCart({
      variantId,
      quantity: quantities[variantId] || 1,
      countryCode: countryCode as string,
    })
    setAddingVariantId(null)
  }

  const handleQuantityChange = (variantId: string, value: string) => {
      const val = parseInt(value)
      if(!isNaN(val)) {
          setQuantities(prev => ({...prev, [variantId]: val}))
      } else if (value === "") {
        // Allow empty while typing, but maybe handle logic elsewhere?
        // For now, simpler to default to 1 if NaN, or handle empty string in specific way if needed.
        // Let's just set to 0 or 1.
        setQuantities(prev => ({...prev, [variantId]: 1}))
      }
  }


  const getBulkCandidates = () => {
    if (!isValidCustomer || !product.variants) return []
    return product.variants.filter((v) => {
      const qty = quantities[v.id] || 1
      if (qty < 1) return false
      const isOOS = v.manage_inventory === true && v.inventory_quantity === 0
      const canBuy = !isOOS || v.allow_backorder
      return canBuy
    })
  }

  const bulkCandidates = getBulkCandidates()

  const handleBulkAddToCart = async () => {
    if (bulkCandidates.length === 0 || bulkAdding) return
    setBulkAdding(true)
    setBulkErrors([])

    const failed: string[] = []

    for (const variant of bulkCandidates) {
      try {
        setAddingVariantId(variant.id)
        await addToCart({
          variantId: variant.id,
          quantity: quantities[variant.id] || 1,
          countryCode: countryCode as string,
        })
      } catch {
        failed.push(variant.title || variant.id)
      } finally {
        setAddingVariantId(null)
      }
    }

    if (failed.length > 0) {
      setBulkErrors(failed)
    } else {
      // Clear quantities for successfully added variants
      setQuantities({})
    }

    setBulkAdding(false)
  }

  if (!product.variants || product.variants.length === 0) return null

  return (
    <div className="w-full overflow-x-auto border border-terminal-border bg-terminal-black mt-8">
      <table className="w-full text-left border-collapse min-w-[600px] text-sm font-mono">
        <thead>
          <tr className="bg-terminal-panel text-terminal-dim font-bold uppercase text-[11px] tracking-widest border-b border-terminal-border">
            <th className="p-4 border-r border-terminal-border">Product</th>
            <th className="p-4 border-r border-terminal-border hidden md:table-cell">SKU</th>
            <th className="p-4 text-center">Order</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-terminal-border  text-terminal-white ">
          {product.variants.map((variant) => {
            const variantPrice = getPricesForVariant(variant)

            // Only show OOS if manage_inventory is true AND quantity is confirmed 0
            // Never show OOS if inventory_quantity is null
            const isOOS = variant.manage_inventory === true && variant.inventory_quantity === 0

            const canBuy = !isOOS || variant.allow_backorder

            return (
              <tr
                key={variant.id}
                className="even:bg-terminal-panel/30 hover:bg-terminal-highlight transition-colors group border-b border-terminal-border last:border-b-0"
              >
                <td className="p-4 border-r border-terminal-border">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-businessx-orange">
                        {variant.title}
                      </span>
                      {isOOS && !variant.allow_backorder && (
                        <span className="text-[10px] text-red-500 font-mono uppercase border border-red-500 px-1">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    {isValidCustomer ? (
                      <span className="text-terminal-white font-mono text-xs mt-0.5">
                        {variantPrice?.calculated_price}
                      </span>
                    ) : (
                      <Link
                        href={`/${countryCode}/account/login?redirect=${encodeURIComponent(pathname)}`}
                        className="text-terminal-dim text-[10px] uppercase mt-0.5 hover:text-businessx-orange transition-colors"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </td>
                <td className="p-4 border-r border-terminal-border font-mono text-xs text-neutral-500 dark:text-neutral-400 hidden md:table-cell select-all">
                  {variant.sku || "N/A"}
                </td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min={1}
                        value={quantities[variant.id] || 1}
                        onChange={(e) => handleQuantityChange(variant.id, e.target.value)}
                        className="w-16 h-9 bg-terminal-black border border-terminal-border rounded-sm text-center text-terminal-white font-mono font-bold focus:outline-none focus:border-businessx-orange transition-colors"
                        disabled={!canBuy || disabled || !isValidCustomer}
                    />
                    {!isValidCustomer ? (
                      <Link
                        href={`/${countryCode}/account/login?redirect=${encodeURIComponent(pathname)}`}
                        className="flex-1 flex items-center justify-center border border-neutral-300 text-neutral-700 hover:text-businessx-orange hover:border-businessx-orange dark:bg-businessx-orange dark:text-black dark:border-businessx-orange dark:hover:bg-businessx-orange/90 dark:hover:text-black hover:shadow-[0_0_12px_rgba(255,85,0,0.15)] transition-all duration-200 rounded-none font-bold uppercase text-[10px] tracking-widest h-9"
                      >
                        Login
                      </Link>
                    ) : (
                      <Button
                        onClick={() => handleAddToCart(variant.id)}
                        disabled={!canBuy || addingVariantId === variant.id || disabled || bulkAdding}
                        isLoading={addingVariantId === variant.id}
                        className="flex-1 bg-transparent text-businessx-orange hover:bg-businessx-orange hover:text-black border border-businessx-orange transition-all rounded-none font-bold uppercase text-[10px] tracking-widest disabled:border-terminal-border disabled:text-terminal-dim disabled:hover:bg-transparent h-9"
                        size="base"
                      >
                        {addingVariantId === variant.id
                          ? "..."
                          : !canBuy
                          ? "Sold"
                          : "Add"}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {isValidCustomer && product.variants.length > 1 && (
        <div className="p-4 border-t border-terminal-border">
          {bulkErrors.length > 0 && (
            <p className="text-red-500 text-xs font-mono mb-3">
              Failed to add: {bulkErrors.join(", ")}
            </p>
          )}
          <Button
            onClick={handleBulkAddToCart}
            disabled={bulkCandidates.length === 0 || bulkAdding || disabled}
            isLoading={bulkAdding}
            className="w-full bg-businessx-orange text-black hover:bg-businessx-orange/90 transition-all rounded-none font-bold uppercase text-xs tracking-widest h-10 disabled:bg-terminal-panel disabled:text-terminal-dim disabled:border-terminal-border border border-businessx-orange disabled:border-terminal-border"
          >
            {bulkAdding
              ? "Adding..."
              : `Add ${bulkCandidates.length} Variant${bulkCandidates.length !== 1 ? "s" : ""} to Cart`}
          </Button>
        </div>
      )}
    </div>
  )
}
