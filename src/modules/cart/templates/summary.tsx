"use client"

import { Button, Heading } from "@medusajs/ui"

import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Cart } from "@xclade/types"

type SummaryProps = {
  cart: Cart
}

function getCheckoutStep(cart: Cart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)

  return (
    <div className="flex flex-col gap-y-4 border border-terminal-border p-6 bg-terminal-black">
      <Heading level="h2" className="text-xl font-display font-black uppercase text-terminal-white tracking-wide mb-2">
        Order Summary
      </Heading>
      <DiscountCode cart={cart} />
      <Divider className="my-2 border-terminal-border" />
      <CartTotals totals={cart} />
      <LocalizedClientLink
        href={"/checkout?step=" + step}
        data-testid="checkout-button"
      >
        <Button className="w-full h-12 bg-bronco-orange text-black hover:bg-terminal-black hover:text-black font-display font-bold uppercase tracking-wider rounded-none transition-all border border-transparent hover:border-terminal-border">
            Secure Checkout
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default Summary
