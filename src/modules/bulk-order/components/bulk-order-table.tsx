"use client"

import { addToCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import { Product } from "@xclade/types"
import { Button, Input, Select } from "@medusajs/ui"
import { useParams } from "next/navigation"
import { useState } from "react"
import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type BulkOrderTableProps = {
  products: Product[]
  isValidCustomer?: boolean
}

export default function BulkOrderTable({ products, isValidCustomer = false }: BulkOrderTableProps) {
  const { countryCode } = useParams()
  const [addingState, setAddingState] = useState<Record<string, boolean>>({})
  const [quantities, setQuantities] = useState<Record<string, number>>({})

  const handleQuantityChange = (variantId: string, qty: number) => {
    setQuantities((prev) => ({
      ...prev,
      [variantId]: qty,
    }))
  }

  const handleAddToCart = async (variantId: string) => {
    setAddingState((prev) => ({ ...prev, [variantId]: true }))
    try {
      await addToCart({
        variantId,
        quantity: quantities[variantId] || 1,
        countryCode: countryCode as string,
      })
      // Reset quantity or give feedback?
      // For bulk, maybe keep it? Let's reset to 1 for now or keep to allow multi-add.
    } catch (e) {
      console.error(e)
    } finally {
      setAddingState((prev) => ({ ...prev, [variantId]: false }))
    }
  }

  if (products.length === 0) {
    return (
      <div className="py-12 text-center text-terminal-dim">
        No products found. Try a different search.
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto border-2 border-terminal-border shadow-none bg-terminal-black">
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-businessx-black text-white font-display uppercase text-sm tracking-wider">
            <th className="p-4 border-r border-white/20 w-[80px]">Image</th>
            <th className="p-4 border-r border-white/20">Product</th>
            <th className="p-4 border-r border-white/20">Variant</th>
            <th className="p-4 border-r border-white/20">Price</th>
            <th className="p-4 border-r border-white/20">Stock</th>
            <th className="p-4 border-r border-white/20 w-[100px]">Qty</th>
            <th className="p-4 text-center w-[120px]">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-businessx-black text-terminal-white font-medium">
          {products.flatMap((product) => {
            // If product has no variants, skip? Or show placeholder?
            // Medusa products usually have at least 1 variant (the default one).
            const variants = product.variants || []
            
            return variants.map((variant, index) => {
              const { variantPrice } = getProductPrice({
                product,
                variantId: variant.id,
              })

              const inStock = variant.manage_inventory
                ? (variant.inventory_quantity || 0) > 0
                : true
              
              const canBuy = inStock || variant.allow_backorder

              return (
                <tr key={variant.id} className="hover:bg-businessx-gray transition-colors group">
                  {/* Show image only for first variant or if variant has specific image? 
                      For simplicity, let's show product thumbnail on first variant of the product group,
                      or if we want to be fancy, match variant image.
                  */}
                  <td className="p-2 border-r-2 border-terminal-border">
                     {index === 0 ? (
                       <div className="w-[60px] h-[60px] relative">
                         <Thumbnail 
                            thumbnail={product.thumbnail} 
                            size="square" 
                            className="p-0 border-0 shadow-none rounded-none bg-transparent"
                         />
                       </div>
                     ) : (
                       // Optional: Variant specific image if available?
                       <div className="w-[60px] h-[60px]"/> 
                     )}
                  </td>
                  <td className="p-4 border-r-2 border-terminal-border">
                    <LocalizedClientLink href={`/products/${product.handle}`} className="hover:underline font-bold">
                      {product.title}
                    </LocalizedClientLink>
                  </td>
                  <td className="p-4 border-r-2 border-terminal-border text-sm">
                    {variant.title}
                  </td>
                  <td className="p-4 border-r-2 border-terminal-border tabular-nums">
                     {isValidCustomer ? variantPrice?.calculated_price : (
                       <span className="text-terminal-dim text-[10px] uppercase">Auth_Req</span>
                     )}
                  </td>
                  <td className="p-4 border-r-2 border-terminal-border text-sm">
                     {canBuy ? (
                        <span className="flex items-center gap-2 text-green-700">
                            {inStock ? "In Stock" : "Backorder"}
                        </span>
                    ) : (
                        <span className="text-red-500">Out of Stock</span>
                    )}
                  </td>
                  <td className="p-4 border-r-2 border-terminal-border">
                    <input
                      type="number"
                      min={1}
                      className="w-full p-2 border border-terminal-border font-mono text-center focus:ring-2 focus:ring-businessx-yellow outline-none"
                      value={quantities[variant.id] || 1}
                      onChange={(e) => handleQuantityChange(variant.id, parseInt(e.target.value))}
                      disabled={!canBuy || !isValidCustomer}
                    />
                  </td>
                  <td className="p-4">
                    <Button
                      onClick={() => isValidCustomer ? handleAddToCart(variant.id) : null}
                      disabled={!canBuy || addingState[variant.id] || !isValidCustomer}
                      isLoading={addingState[variant.id]}
                      className="w-full bg-businessx-black text-white hover:bg-businessx-yellow hover:text-terminal-white border border-transparent hover:border-terminal-border transition-all rounded-none font-bold uppercase shadow-none text-xs h-10"
                    >
                      {!isValidCustomer ? "Lock" : "Add"}
                    </Button>
                  </td>
                </tr>
              )
            })
          })}
        </tbody>
      </table>
    </div>
  )
}
