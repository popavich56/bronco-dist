import { Metadata } from "next"

import { listCartOptions, retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { StoreCartShippingOption } from "@medusajs/types"
import { listNavCategories } from "@lib/data/categories"
import { NavigationProvider } from "@modules/layout/components/navigation-provider"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import FreeShippingPriceNudge from "@modules/shipping/components/free-shipping-price-nudge"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const customer = await retrieveCustomer()
  const cart = await retrieveCart()
  const categories = await listNavCategories()
  let shippingOptions: StoreCartShippingOption[] = []

  if (cart) {
    const options = await listCartOptions()

    if (options) {
      shippingOptions = options as any // Cast to any to match the slightly different ShippingOption types if needed, or refine types
    }
  }

  return (
    <NavigationProvider initialCategories={categories}>
      <Nav />
      {customer && cart && (
        <CartMismatchBanner customer={customer} cart={cart} />
      )}

      {cart && (
        <FreeShippingPriceNudge
          variant="popup"
          cart={cart}
          shippingOptions={shippingOptions}
        />
      )}
      {props.children}
      <Footer />
    </NavigationProvider>
  )
}
