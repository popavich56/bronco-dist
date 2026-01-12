"use client"

import { transferCart } from "@lib/data/customer"
import { ExclamationCircleSolid } from "@medusajs/icons"
import { Cart, Customer } from "@xclade/types"
import { Button } from "@medusajs/ui"
import { useState } from "react"

function CartMismatchBanner(props: {
  customer: Customer
  cart: Cart
}) {
  const { customer, cart } = props
  const [isPending, setIsPending] = useState(false)
  const [actionText, setActionText] = useState("Run transfer again")

  if (!customer || !!cart.customer_id) {
    return
  }

  const handleSubmit = async () => {
    try {
      setIsPending(true)
      setActionText("Transferring..")

      await transferCart()
    } catch {
      setActionText("Run transfer again")
      setIsPending(false)
    }
  }

  return (
    <div className="flex items-center justify-center small:p-4 p-2 text-center bg-bronco-orange text-black border-b border-black font-bold uppercase tracking-wide text-xs">
      <div className="flex flex-col small:flex-row small:gap-2 gap-1 items-center">
        <span className="flex items-center gap-1">
          <ExclamationCircleSolid className="inline" />
          Transfer Error: Cart Sync Failed
        </span>

        <span>·</span>

        <Button
          variant="transparent"
          className="hover:bg-terminal-black/20 active:bg-terminal-black/30 focus:bg-terminal-black/20 disabled:opacity-50 text-black p-0 bg-transparent font-bold underline decoration-2 underline-offset-2"
          size="base"
          disabled={isPending}
          onClick={handleSubmit}
        >
          {actionText}
        </Button>
      </div>
    </div>
  )
}

export default CartMismatchBanner
