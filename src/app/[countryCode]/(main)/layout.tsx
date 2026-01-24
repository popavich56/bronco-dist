import { Metadata } from "next"

import { retrieveMiniCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getBaseURL } from "@lib/util/env"
import { listNavCategories } from "@lib/data/categories"
import { NavigationProvider } from "@modules/layout/components/navigation-provider"
import CartMismatchBanner from "@modules/layout/components/cart-mismatch-banner"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  const [customer, cart, categories] = await Promise.all([
    retrieveCustomer().catch(() => null),
    retrieveMiniCart().catch(() => null),
    listNavCategories().catch(() => null),
  ])

  return (
    <NavigationProvider initialCategories={categories || undefined}>
      <Nav />
      {customer && cart && <CartMismatchBanner customer={customer} cart={cart} />}

      {props.children}
      <Footer />
    </NavigationProvider>
  )
}
