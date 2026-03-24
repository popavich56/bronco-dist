import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import { getAccountStatus, PENDING_MESSAGE } from "@lib/util/customer-status"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const customer = await retrieveCustomer()
  const isBypass = process.env.NEXT_PUBLIC_BYPASS_WHOLESALE_GATE === "true"
  const status = getAccountStatus(customer)

  if (!isBypass && status === "guest") {
    redirect(`/${params.countryCode}/account`)
  }

  if (!isBypass && status === "pending") {
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

  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  return <CartTemplate cart={cart} customer={customer} />
}
