import { listCartShippingMethods } from "@lib/data/fulfillment"
import { listCartPaymentMethods } from "@lib/data/payment"
import { Cart, Customer } from "@xclade/types"
import CheckoutFlow from "./checkout-flow"

export default async function CheckoutForm({
  cart,
  customer,
}: {
  cart: Cart | null
  customer: Customer | null
}) {
  if (!cart) {
    return null
  }

  const [shippingMethods, paymentMethods] = await Promise.all([
    listCartShippingMethods(cart.id),
    listCartPaymentMethods(cart.region?.id ?? ""),
  ])

  if (!shippingMethods || !paymentMethods) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center mb-4">
          <svg
            className="w-6 h-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h2 className="text-lg font-display font-bold uppercase text-terminal-white mb-2">
          Checkout temporarily unavailable
        </h2>
        <p className="text-sm font-body text-terminal-dim max-w-sm mb-6">
          We couldn&apos;t load shipping or payment options. Please refresh the
          page and try again.
        </p>
        <a
          href=""
          className="text-sm font-bold font-mono text-businessx-orange hover:text-businessx-yellow underline transition-colors uppercase tracking-wider"
        >
          Refresh Page
        </a>
      </div>
    )
  }

  return (
    <CheckoutFlow 
      cart={cart}
      customer={customer}
      shippingMethods={shippingMethods}
      paymentMethods={paymentMethods}
    />
  )
}
