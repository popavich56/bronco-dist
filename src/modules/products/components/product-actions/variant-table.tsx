"use client"

import { addToCart } from "@lib/data/cart"
import { getPricesForVariant } from "@lib/util/get-product-price"
import { Product } from "@xclade/types"
import { Button } from "@medusajs/ui"
import { useParams } from "next/navigation"
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
  const [addingVariantId, setAddingVariantId] = useState<string | null>(null)
  const [quantities, setQuantities] = useState<Record<string, number>>({})

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


  if (!product.variants || product.variants.length === 0) return null

  return (
    <div className="w-full overflow-x-auto border border-terminal-border bg-terminal-black mt-8">
      <table className="w-full text-left border-collapse min-w-[600px] text-sm font-mono">
        <thead>
          <tr className="bg-terminal-panel text-terminal-dim font-bold uppercase text-[10px] tracking-widest border-b border-terminal-border ">
            <th className="p-4 border-r border-terminal-border ">Variant / Cost</th>
            <th className="p-4 border-r border-terminal-border hidden md:table-cell">SKU_Code</th>
            {/* <th className="p-4 border-r border-terminal-border">UPC</th> - Optional, reducing width */}
            <th className="p-4 text-center">Protocol</th>
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
                className="hover:bg-terminal-highlight  transition-colors group border-b border-terminal-border last:border-b-0"
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
                      <span className="text-terminal-white font-mono text-xs mt-1">
                        {variantPrice?.calculated_price}
                      </span>
                    ) : (
                      <span className="text-terminal-dim text-[10px] uppercase mt-1">
                        Login
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 border-r border-terminal-border font-mono text-xs text-white/70 hidden md:table-cell">
                  {variant.sku || "N/A"}
                </td>
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    <input 
                        type="number" 
                        min={1}
                        value={quantities[variant.id] || 1}
                        onChange={(e) => handleQuantityChange(variant.id, e.target.value)}
                        className="w-16 h-9 bg-terminal-black border border-terminal-border text-center text-terminal-white font-mono font-bold focus:outline-none focus:border-businessx-orange transition-colors"
                        disabled={!canBuy || disabled || !isValidCustomer}
                    />
                    <Button
                        onClick={() =>
                        isValidCustomer ? handleAddToCart(variant.id) : null
                        }
                        disabled={
                        !canBuy ||
                        addingVariantId === variant.id ||
                        disabled ||
                        !isValidCustomer
                        }
                        isLoading={addingVariantId === variant.id}
                        className="flex-1 bg-transparent text-businessx-orange hover:bg-businessx-orange hover:text-black border border-businessx-orange transition-all rounded-none font-bold uppercase text-[10px] tracking-widest disabled:border-terminal-border disabled:text-terminal-dim disabled:hover:bg-transparent h-9"
                        size="base"
                    >
                        {addingVariantId === variant.id
                        ? "..."
                        : !isValidCustomer
                        ? "Lock"
                        : !canBuy
                        ? "Sold"
                        : "Add"}
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
