"use client"

import { XMark } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import { Order } from "@xclade/types"
import OrderDetails from "@modules/order/components/order-details"
import OrderSummary from "@modules/order/components/order-summary"
import ShippingDetails from "@modules/order/components/shipping-details"
import React from "react"

type OrderDetailsTemplateProps = {
  order: Order
}

const OrderDetailsTemplate: React.FC<OrderDetailsTemplateProps> = ({
  order,
}) => {
  return (
    <div className="flex flex-col justify-center gap-y-4">
      <div className="flex gap-2 justify-between items-center mb-6">
        <h1 className="text-2xl font-display font-black uppercase text-terminal-white">Order details</h1>
        <LocalizedClientLink
          href="/account/orders"
          className="flex gap-2 items-center text-terminal-dim hover:text-terminal-white transition-colors font-medium text-sm uppercase tracking-wide"
          data-testid="back-to-overview-button"
        >
          <XMark className="w-4 h-4" /> Back to overview
        </LocalizedClientLink>
      </div>
      <div
        className="flex flex-col gap-4 h-full bg-terminal-black w-full"
        data-testid="order-details-container"
      >
        <OrderDetails order={order} showStatus />
        <Items order={order} />
        <ShippingDetails order={order} />
        <OrderSummary order={order} />
        <Help />
      </div>
    </div>
  )
}

export default OrderDetailsTemplate
