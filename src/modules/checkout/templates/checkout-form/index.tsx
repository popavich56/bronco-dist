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
    return null
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
