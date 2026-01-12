import { Button } from "@medusajs/ui"
import { useMemo } from "react"

import Thumbnail from "@modules/products/components/thumbnail"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { Order } from "@xclade/types"

type OrderCardProps = {
  order: Order
}

const OrderCard = ({ order }: OrderCardProps) => {
  const numberOfLines = useMemo(() => {
    return (
      order.items?.reduce((acc, item) => {
        return acc + (item?.quantity || 0)
      }, 0) ?? 0
    )
  }, [order])

  const numberOfProducts = useMemo(() => {
    return order.items?.length ?? 0
  }, [order])

  return (
    <div
      className="bg-terminal-black border border-terminal-border p-4 hover:border-bronco-orange transition-all group flex flex-col gap-4"
      data-testid="order-card"
    >
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            <span
              className="text-xl font-black font-display uppercase text-terminal-white group-hover:text-bronco-orange transition-colors"
            >
              #{order.display_id}
            </span>
            <span
              className="text-xs font-bold font-mono uppercase text-terminal-dim"
              data-testid="order-created-at"
            >
              {new Date(order.created_at).toDateString()}
            </span>
          </div>
          <div className="text-xs font-bold font-mono uppercase tracking-wide text-terminal-dim">
            {numberOfLines} {numberOfLines > 1 ? "Items" : "Item"}
          </div>
        </div>
        <div className="text-right">
          <span
            className="text-lg font-bold font-display text-terminal-white"
            data-testid="order-amount"
          >
            {convertToLocale({
              amount: order.total,
              currency_code: order.currency_code,
            })}
          </span>
        </div>
      </div>

      <LocalizedClientLink
        href={`/account/orders/${order.id}`}
        className="w-full mt-auto"
      >
        <Button
          data-testid="order-details-link"
          className="w-full bg-transparent border border-terminal-border hover:border-bronco-orange text-terminal-dim hover:text-bronco-orange font-bold uppercase tracking-widest text-xs h-10 rounded-none shadow-none transition-all"
        >
          View Order
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default OrderCard
