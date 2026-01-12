import { Heading } from "@medusajs/ui"

import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = ({ cart }: { cart: any }) => {
  return (
    <div className="sticky top-24 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0 ">
      <div className="w-full bg-terminal-panel border border-terminal-border p-6 flex flex-col">
        <Divider className="my-6 small:hidden border-terminal-border" />
        <Heading
          level="h2"
          className="flex flex-row text-xl font-display font-black uppercase tracking-wide items-baseline text-terminal-white mb-2"
        >
          Transaction Summary
        </Heading>
        <span className="text-[10px] font-mono text-terminal-dim uppercase mb-4 tracking-widest">
            Pending Order #{cart?.id?.slice(0, 7) || '...'}
        </span>
        <Divider className="mb-6 border-terminal-border" />
        <CartTotals totals={cart} />
        <div className="mt-6">
            <ItemsPreviewTemplate cart={cart} />
        </div>
        <div className="my-6">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
