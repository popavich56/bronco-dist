import { retrieveCart, retrieveCheckoutCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getPayloadGlobal } from "@lib/payload"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

export async function generateMetadata(): Promise<Metadata> {
  // Get store configuration for dynamic branding
  const siteSettings = await getPayloadGlobal("site-settings")
  const storeName = siteSettings?.general?.siteName || "BusinessX"

  return {
    title: `Secure Checkout | ${storeName}`,
  }
}

export default async function Checkout(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const [cart, customer] = await Promise.all([
    retrieveCart(),
    retrieveCustomer(),
  ])

  if (!customer) {
    redirect(`/${params.countryCode}/account`)
  }

  if (!cart) {
    return notFound()
  }

  return (
    <div className="grid grid-cols-1 medium:grid-cols-[1fr_420px] content-container gap-x-12 py-12">
      <PaymentWrapper cart={cart}>
        <CheckoutForm cart={cart} customer={customer} />
      </PaymentWrapper>
      
      <div className="relative mt-8 medium:mt-0">
         <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}
