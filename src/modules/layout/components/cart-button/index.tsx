import { retrieveMiniCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"

export default async function CartButton() {
  const cart = await retrieveMiniCart().catch(() => null)

  return <CartDropdown cart={cart} />
}
