import { convertToLocale } from "@lib/util/money"
import { Order } from "@xclade/types"

type OrderSummaryProps = {
  order: Order
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (!amount) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: order.currency_code,
    })
  }

  return (
    <div className="flex flex-col gap-y-4">
      <h2 className="text-lg font-bold uppercase tracking-wide">Order Summary</h2>
      <div className="flex flex-col gap-y-2 text-sm text-terminal-white">
        <div className="flex items-center justify-between font-bold">
          <span className="text-gray-600 uppercase text-xs tracking-wider">Subtotal</span>
          <span>{getAmount(order.subtotal)}</span>
        </div>
        
        {order.discount_total > 0 && (
          <div className="flex items-center justify-between font-bold">
             <span className="text-gray-600 uppercase text-xs tracking-wider">Discount</span>
            <span>- {getAmount(order.discount_total)}</span>
          </div>
        )}
        
        {order.gift_card_total > 0 && (
          <div className="flex items-center justify-between font-bold">
             <span className="text-gray-600 uppercase text-xs tracking-wider">Gift Card</span>
            <span>- {getAmount(order.gift_card_total)}</span>
          </div>
        )}
        
        <div className="flex items-center justify-between font-bold">
           <span className="text-gray-600 uppercase text-xs tracking-wider">Shipping</span>
          <span>{getAmount(order.shipping_total)}</span>
        </div>
        
        <div className="flex items-center justify-between font-bold">
           <span className="text-gray-600 uppercase text-xs tracking-wider">Taxes</span>
          <span>{getAmount(order.tax_total)}</span>
        </div>

        <div className="h-0.5 w-full bg-businessx-black my-4" />
        
        <div className="flex items-center justify-between font-black text-xl font-display uppercase">
          <span>Total</span>
          <span className="text-terminal-white">{getAmount(order.total)}</span>
        </div>
      </div>
    </div>
  )
}

export default OrderSummary
