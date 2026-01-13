"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { Cart } from "@xclade/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { Trash2 } from "lucide-react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: Cart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items
      ?.filter((i) => !!i)
      ?.reduce((acc, item) => {
        return acc + (item?.quantity || 0)
      }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-[80]"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full focus:outline-none">
          <LocalizedClientLink
            className="hover:text-businessx-orange text-terminal-white transition-colors font-bold uppercase font-mono tracking-wider text-xs"
            href="/cart"
            data-testid="nav-cart-link"
          >{`Cart (${totalItems})`}</LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 bg-terminal-black border border-terminal-border w-[420px] text-terminal-white z-[90]"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-between border-b border-terminal-border bg-terminal-black">
              <h3 className="text-sm font-display font-black uppercase tracking-wider text-terminal-white">Shopping Cart</h3>
              <span className="text-[10px] font-mono text-terminal-dim uppercase">{totalItems} Items</span>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-4 no-scrollbar p-4 bg-terminal-black">
                  {cartState.items
                    .filter((item): item is NonNullable<typeof item> => item !== null && item !== undefined)
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[80px_1fr] gap-x-4 border-b border-terminal-border/50 pb-4 last:border-0 last:pb-0"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-20 border border-terminal-border bg-terminal-surface aspect-square overflow-hidden group"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                            className="grayscale group-hover:grayscale-0 transition-all duration-300"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 className="text-sm font-display font-bold uppercase overflow-hidden text-ellipsis text-terminal-white">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                    className="hover:text-businessx-orange transition-colors"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                  className="font-mono text-[10px] text-terminal-dim font-bold mt-1 uppercase"
                                >
                                  Qty: {item.quantity}
                                </span>
                              </div>
                              <div className="flex justify-end font-bold text-terminal-white">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-2 text-[10px] text-terminal-dim hover:text-red-500 flex items-center gap-x-1 uppercase font-bold tracking-wider"
                            data-testid="cart-item-remove-button"
                          >
                            <Trash2 className="w-3 h-3" />
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="p-4 flex flex-col gap-y-4 border-t border-terminal-border bg-terminal-black">
                  <div className="flex items-center justify-between">
                    <span className="text-terminal-dim font-bold font-mono uppercase tracking-widest text-xs">
                      Subtotal
                    </span>
                    <span
                      className="text-lg font-display font-black text-terminal-white"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      className="w-full h-10 bg-businessx-orange text-black hover:bg-terminal-black hover:text-black font-display font-bold uppercase tracking-wider rounded-none border border-transparent hover:border-terminal-border transition-all"
                      size="large"
                      data-testid="go-to-cart-button"
                    >
                      Secure Checkout
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div>
                <div className="flex py-16 flex-col gap-y-4 items-center justify-center text-center px-8 bg-terminal-black">
                  <div className="bg-terminal-surface text-terminal-dim font-bold flex items-center justify-center w-8 h-8 border border-terminal-border rounded-none">
                    <span>0</span>
                  </div>
                  <span className="font-bold text-sm text-terminal-dim font-mono uppercase tracking-wide">Your cart is empty.</span>
                  <div>
                    <LocalizedClientLink href="/store">
                      <>
                        <span className="sr-only">Go to all products page</span>
                        <Button
                            onClick={close}
                            className="h-8 bg-transparent text-businessx-orange hover:bg-businessx-orange hover:text-black font-display font-bold uppercase tracking-wider rounded-none border border-businessx-orange transition-all"
                        >
                            Browse Products
                        </Button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
