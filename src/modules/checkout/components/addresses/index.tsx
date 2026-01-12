"use client"

import { setAddresses } from "@lib/data/cart"
import compareAddresses from "@lib/util/compare-addresses"
import { CheckCircleSolid } from "@medusajs/icons"
import { Cart, Customer } from "@xclade/types"
import { Button, Heading, Text, useToggleState, clx } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Spinner from "@modules/common/icons/spinner"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useActionState, useEffect } from "react"
import BillingAddress from "../billing_address"
import ErrorMessage from "../error-message"
import ShippingAddress from "../shipping-address"
import { SubmitButton } from "../submit-button"

const Addresses = ({
  cart,
  customer,
  isOpen,
  onEdit,
}: {
  cart: Cart | null
  customer: Customer | null
  isOpen: boolean
  onEdit?: () => void
}) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const { state: sameAsBilling, toggle: toggleSameAsBilling } = useToggleState(
    cart?.shipping_address && cart?.billing_address
      ? compareAddresses(cart?.shipping_address, cart?.billing_address)
      : true
  )

  const handleEdit = () => {
    router.push(pathname + "?step=address", { scroll: false })
  }

  const [message, formAction] = useActionState(setAddresses, null)

  return (
    <div className="bg-terminal-panel border border-terminal-border p-6 mb-4 relative transition-all">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-xl font-display font-black uppercase tracking-wide gap-x-2 items-baseline",
            {
              "text-terminal-white": isOpen || cart?.shipping_address,
              "text-terminal-dim": !isOpen && !cart?.shipping_address
            }
          )}
        >
          Shipping Address
          {!isOpen && cart?.shipping_address && <CheckCircleSolid className="text-bronco-orange" />}
        </Heading>
        {!isOpen && cart?.shipping_address && onEdit && (
          <Button
            onClick={onEdit}
            variant="transparent"
            className="text-bronco-orange hover:text-white font-bold uppercase tracking-wide decoration-2 hover:underline font-mono text-xs"
            data-testid="edit-address-button"
          >
            Edit
          </Button>
        )}
      </div>

      {isOpen ? (
        <form action={formAction}>
          <div className="pb-8">
            <ShippingAddress
              customer={customer}
              checked={sameAsBilling}
              onChange={toggleSameAsBilling}
              cart={cart}
            />

            {!sameAsBilling && (
              <div>
                <Heading
                  level="h2"
                  className="text-lg font-display font-bold uppercase gap-x-4 pb-6 pt-8 text-terminal-white"
                >
                  Billing address
                </Heading>

                <BillingAddress cart={cart} />
              </div>
            )}
            <SubmitButton className="mt-6 w-full bg-bronco-orange text-black hover:bg-terminal-black hover:text-black font-display font-bold uppercase tracking-wider rounded-none border border-transparent hover:border-terminal-border transition-all shadow-none text-base h-12" data-testid="submit-address-button">
              Confirm Address
            </SubmitButton>
            <ErrorMessage error={message} data-testid="address-error-message" />
          </div>
        </form>
      ) : (
        <div className="text-terminal-dim font-mono text-sm">
          {cart?.shipping_address ? (
            <div className="flex flex-col gap-y-1 txt-medium">
              <Text className="txt-large-plus font-bold text-terminal-white uppercase mb-2">
                {cart?.shipping_address?.first_name} {cart?.shipping_address?.last_name}
              </Text>
              <Text>
                {cart?.shipping_address?.address_1}
                {cart?.shipping_address?.address_2 && (
                  <span>, {cart?.shipping_address?.address_2}</span>
                )}
              </Text>
              <Text>
                {cart?.shipping_address?.postal_code}, {cart?.shipping_address?.city}
              </Text>
              <Text>
                {cart?.shipping_address?.country_code?.toUpperCase()}
              </Text>
              <div className="mt-4 flex flex-col gap-y-1">
                <Text className="font-bold text-terminal-white uppercase text-xs tracking-wider">Contact</Text>
                <Text>{cart?.shipping_address?.phone}</Text>
                <Text>{cart?.email}</Text>
              </div>
            </div>
          ) : (
             <div>
                Enter your address to proceed.
             </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Addresses
