"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  return (
    <div>
      <div className="flex flex-col gap-y-2 txt-medium text-terminal-white font-medium">
        <div className="flex items-center justify-between">
          <span className="font-mono uppercase tracking-widest text-[10px] text-terminal-dim font-bold">Subtotal</span>
          <span data-testid="cart-subtotal" data-value={item_subtotal || 0} className="font-mono font-bold">
            {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono uppercase tracking-widest text-[10px] text-terminal-dim font-bold">Shipping</span>
          <span data-testid="cart-shipping" data-value={shipping_subtotal || 0} className="font-mono font-bold">
            {convertToLocale({ amount: shipping_subtotal ?? 0, currency_code })}
          </span>
        </div>
        {!!discount_subtotal && (
          <div className="flex items-center justify-between">
            <span className="font-mono uppercase tracking-widest text-[10px] text-businessx-orange font-bold">Discount</span>
            <span
              className="text-businessx-orange font-mono font-bold"
              data-testid="cart-discount"
              data-value={discount_subtotal || 0}
            >
              -{" "}
              {convertToLocale({
                amount: discount_subtotal ?? 0,
                currency_code,
              })}
            </span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="font-mono uppercase tracking-widest text-[10px] text-terminal-dim flex gap-x-1 items-center font-bold">Taxes</span>
          <span data-testid="cart-taxes" data-value={tax_total || 0} className="font-mono font-bold">
            {convertToLocale({ amount: tax_total ?? 0, currency_code })}
          </span>
        </div>
      </div>
      <div className="w-full border-b border-terminal-border my-4" />
      <div className="flex items-center justify-between text-terminal-white mb-2">
        <span className="font-display font-black uppercase text-2xl tracking-tight">Total</span>
        <span
          className="font-display font-black text-2xl tracking-tight text-businessx-orange"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
      <div className="w-full border-b border-terminal-border mt-4" />
    </div>
  )
}

export default CartTotals
