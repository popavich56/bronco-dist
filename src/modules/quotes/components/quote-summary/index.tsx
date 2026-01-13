import { convertToLocale } from "@lib/util/money"

type QuoteSummaryProps = {
  cart: {
    currency_code: string
    total?: number
    subtotal?: number
    discount_total?: number
    gift_card_total?: number
    shipping_total?: number
    tax_total?: number
  }
}

const QuoteSummary = ({ cart }: QuoteSummaryProps) => {
  const getAmount = (amount?: number | null) => {
    if (amount === undefined || amount === null) {
      return
    }

    return convertToLocale({
      amount,
      currency_code: cart.currency_code,
    })
  }

  return (
    <div className="flex flex-col gap-y-3">
      <h2 className="text-xs font-bold uppercase tracking-wide text-terminal-dim border-b border-terminal-border pb-2">
        Financials
      </h2>
      <div className="flex flex-col gap-y-2 text-xs text-terminal-white">
        {cart.subtotal !== undefined && (
          <div className="flex items-center justify-between">
            <span className="text-terminal-dim">Subtotal</span>
            <span className="font-mono font-medium">{getAmount(cart.subtotal)}</span>
          </div>
        )}
        
        {cart.discount_total !== undefined && cart.discount_total > 0 && (
          <div className="flex items-center justify-between text-green-700">
             <span>Discount</span>
            <span className="font-mono">- {getAmount(cart.discount_total)}</span>
          </div>
        )}
        
        {cart.shipping_total !== undefined && (
          <div className="flex items-center justify-between">
             <span className="text-terminal-dim">Shipping</span>
            <span className="font-mono font-medium">{cart.shipping_total === 0 ? 'FREE' : getAmount(cart.shipping_total)}</span>
          </div>
        )}
        
        {cart.tax_total !== undefined && (
          <div className="flex items-center justify-between">
             <span className="text-terminal-dim">Taxes</span>
            <span className="font-mono font-medium">{getAmount(cart.tax_total)}</span>
          </div>
        )}

        <div className="h-px w-full bg-gray-200 my-1" />
        
        <div className="flex items-center justify-between font-bold text-terminal-white">
          <span className="uppercase tracking-wider">Total</span>
          <span className="text-lg font-mono bg-businessx-yellow px-1">
            {getAmount(cart.total ?? 0)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default QuoteSummary
