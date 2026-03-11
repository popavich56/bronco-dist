import { retrieveCart, retrieveCheckoutCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { getPayloadGlobal } from "@lib/payload"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getAccountStatus, PENDING_MESSAGE } from "@lib/util/customer-status"

export async function generateMetadata(): Promise<Metadata> {
  // Get store configuration for dynamic branding
  const siteSettings = await getPayloadGlobal("site-settings")
  const storeName = siteSettings?.general?.siteName || "Bronco Distribution"

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

  const status = getAccountStatus(customer)

  if (status === "guest") {
    redirect(`/${params.countryCode}/account`)
  }

  if (status === "pending") {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-terminal-black px-4">
        <div className="max-w-md w-full border border-[#6DB3D9]/30 bg-[#001F2E] p-8 text-center">
          <h1 className="text-2xl font-display font-bold uppercase tracking-wide text-white mb-4">
            Account Under Review
          </h1>
          <p className="text-sm text-[#ADE0EE] font-mono">
            {PENDING_MESSAGE}
          </p>
        </div>
      </div>
    )
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
