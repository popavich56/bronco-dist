"use client"

import { Button } from "@medusajs/ui"

import OrderCard from "../order-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Order } from "@xclade/types"

const OrderOverview = ({ orders }: { orders: Order[] }) => {
  if (orders?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {orders.map((o) => (
          <div key={o.id}>
            <OrderCard order={o} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-4 py-12"
      data-testid="no-orders-container"
    >
      <h2 className="text-xl font-display font-black uppercase text-terminal-white tracking-wide">Nothing to see here</h2>
      <p className="text-base font-mono text-terminal-dim">
        You don&apos;t have any orders yet.
      </p>
      <div className="mt-4">
        <LocalizedClientLink href="/" passHref>
          <Button 
            className="bg-bronco-orange text-black hover:bg-terminal-black hover:text-black font-display font-bold uppercase tracking-wider rounded-none border border-transparent hover:border-terminal-border transition-all h-10 px-6"
            data-testid="continue-shopping-button"
          >
            Continue shopping
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default OrderOverview
