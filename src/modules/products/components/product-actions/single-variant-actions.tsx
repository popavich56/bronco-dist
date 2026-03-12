"use client"

import { addToCart } from "@lib/data/cart"
import { Product, ProductVariant } from "@xclade/types"
import { Button } from "@medusajs/ui"
import { Minus, Plus, ShieldAlert, CheckCircle2 } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"

type SingleVariantActionsProps = {
  product: Product
  variant: ProductVariant
  disabled?: boolean
  isValidCustomer?: boolean
}

export default function SingleVariantActions({
  product,
  variant,
  disabled,
  isValidCustomer = false,
}: SingleVariantActionsProps) {
  const { countryCode } = useParams()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [quantity, setQuantity] = useState(1)

  // Stock Logic
  const inStock = variant.manage_inventory
    ? (variant.inventory_quantity || 0) > 0
    : true

  const canBuy = inStock || variant.allow_backorder

  const handleAddToCart = async () => {
    if (!canBuy || !isValidCustomer) return
    setIsAdding(true)
    await addToCart({
      variantId: variant.id,
      quantity,
      countryCode: countryCode as string,
    })
    setIsAdding(false)
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  const handleQuantity = (val: number) => {
    setQuantity((prev) => Math.max(1, prev + val))
  }

  return (
    <div className="flex flex-col gap-y-6 mt-6 border-t border-terminal-border pt-6">
      <div className="flex items-center justify-end text-xs font-mono">
        {canBuy ? (
          <span className="text-green-600 font-bold flex items-center gap-2 uppercase tracking-wide">
            <CheckCircle2 className="w-4 h-4" />
            {inStock ? "In Stock" : "Backorder Available"}
          </span>
        ) : (
          <span className="text-red-500 font-bold flex items-center gap-2 uppercase tracking-wide">
            <ShieldAlert className="w-4 h-4" />
            Stock Depleted
          </span>
        )}
      </div>

      <div className="flex gap-x-4 h-12">
        {/* Quantity Selector - Terminal Style */}
        <div className="flex items-center border border-terminal-border bg-terminal-black w-32">
          <button
            onClick={() => handleQuantity(-1)}
            className="h-full w-10 hover:bg-terminal-highlight transition-colors flex items-center justify-center text-terminal-white disabled:text-terminal-dim"
            disabled={quantity <= 1 || disabled}
          >
            <Minus className="w-4 h-4" />
          </button>
          <input
            type="number"
            min={1}
            value={quantity}
            onChange={(e) => {
              const val = parseInt(e.target.value)
              if (!isNaN(val)) setQuantity(val)
              else if (e.target.value === "") setQuantity(1)
            }}
            className="flex-1 h-full w-full bg-terminal-black text-center font-mono font-bold text-lg text-terminal-white focus:outline-none border-x border-terminal-border appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            onClick={() => handleQuantity(1)}
            className="h-full w-10 hover:bg-terminal-highlight transition-colors flex items-center justify-center text-terminal-white"
            disabled={disabled}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!canBuy || isAdding || disabled || !isValidCustomer}
          isLoading={isAdding}
          className="flex-1 h-full bg-businessx-orange text-black hover:bg-orange-600 hover:text-white transition-all rounded-none font-bold uppercase tracking-widest text-sm shadow-[4px_4px_0_0_#333] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
        >
          {isAdded
            ? "Request Queued"
            : isAdding
            ? "Processing..."
            : !isValidCustomer
            ? "Auth Required"
            : "Add to Manifest"}
        </Button>
      </div>
    </div>
  )
}
