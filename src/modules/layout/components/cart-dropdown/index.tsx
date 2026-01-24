"use client"

import { Cart } from "@xclade/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: Cart | null
}) => {
  const totalItems =
    cartState?.items
      ?.filter((i) => !!i)
      ?.reduce((acc, item) => {
        return acc + (item?.quantity || 0)
      }, 0) || 0

  return (
    <div className="h-full z-[80] flex items-center">
      <LocalizedClientLink
        className="hover:text-businessx-orange text-terminal-white transition-colors font-bold uppercase font-mono tracking-wider text-xs"
        href="/cart"
        data-testid="nav-cart-link"
      >{`Cart (${totalItems})`}</LocalizedClientLink>
    </div>
  )
}

export default CartDropdown
