import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  const customer = await retrieveCustomer()

  if (!customer) {
    redirect(`/${params.countryCode}/account`)
  }

  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  return <CartTemplate cart={cart} customer={customer} />
}
