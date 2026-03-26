"use client"

import { addToCart } from "@lib/data/cart"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { ShoppingCart, Check, Loader2, ChevronRight, Lock } from "lucide-react"

type QuickAddButtonProps = {
  productHandle: string
  variantId: string | null
  isApproved: boolean
  isLoggedIn: boolean
}

export default function QuickAddButton({
  productHandle,
  variantId,
  isApproved,
  isLoggedIn,
}: QuickAddButtonProps) {
  const { countryCode } = useParams()
  const router = useRouter()
  const [state, setState] = useState<"idle" | "adding" | "added">("idle")

  const stopBubble = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleAdd = async (e: React.MouseEvent) => {
    stopBubble(e)
    if (!variantId || state !== "idle") return

    setState("adding")
    try {
      await addToCart({
        variantId,
        quantity: 1,
        countryCode: countryCode as string,
      })
      setState("added")
      setTimeout(() => setState("idle"), 1800)
    } catch {
      setState("idle")
    }
  }

  const handleNavigate = (e: React.MouseEvent, path: string) => {
    stopBubble(e)
    router.push(`/${countryCode}${path}`)
  }

  const baseClass =
    "flex items-center justify-center gap-2 w-full h-11 border transition-all duration-200 text-xs font-bold uppercase tracking-wider"

  // Guest or pending → gated login CTA
  if (!isApproved) {
    return (
      <div onClick={stopBubble}>
        <button
          onClick={(e) =>
            handleNavigate(
              e,
              isLoggedIn ? "/account" : "/account/login"
            )
          }
          className={`${baseClass} bg-terminal-surface text-terminal-dim hover:text-terminal-white hover:bg-terminal-highlight border-terminal-border`}
        >
          <Lock className="w-3.5 h-3.5" />
          {isLoggedIn ? "Approval Pending" : "Login to Order"}
        </button>
      </div>
    )
  }

  // Multi-variant → view options
  if (!variantId) {
    return (
      <div onClick={stopBubble}>
        <button
          onClick={(e) => handleNavigate(e, `/products/${productHandle}`)}
          className={`${baseClass} bg-terminal-surface text-terminal-white hover:bg-businessx-orange hover:text-black border-terminal-border hover:border-businessx-orange`}
        >
          View Options
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    )
  }

  // Single-variant → add to cart
  return (
    <div onClick={stopBubble}>
      <button
        onClick={handleAdd}
        disabled={state !== "idle"}
        className={`${baseClass} ${
          state === "added"
            ? "bg-green-600 border-green-600 text-white"
            : state === "adding"
            ? "bg-businessx-orange/80 border-businessx-orange text-black"
            : "bg-businessx-orange border-businessx-orange text-black hover:bg-orange-600 hover:text-white"
        }`}
      >
        {state === "added" ? (
          <>
            <Check className="w-4 h-4" />
            Added
          </>
        ) : state === "adding" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <ShoppingCart className="w-3.5 h-3.5" />
            Add to Cart
          </>
        )}
      </button>
    </div>
  )
}
