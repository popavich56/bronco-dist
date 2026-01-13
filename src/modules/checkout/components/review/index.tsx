"use client"

import { Heading, Text, clx } from "@medusajs/ui"

import PaymentButton from "../payment-button"
import { useSearchParams } from "next/navigation"

const Review = ({
  cart,
  isOpen,
}: {
  cart: any
  isOpen: boolean
}) => {
  const searchParams = useSearchParams()

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  return (
    <div className="bg-terminal-panel border border-terminal-border p-6 mb-4 relative transition-all">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-xl font-display font-black uppercase tracking-wide gap-x-2 items-baseline",
            {
              "text-terminal-white": isOpen,
              "text-terminal-dim": !isOpen
            }
          )}
        >
          Review & Submit
        </Heading>
      </div>

      {isOpen && (
        <>
          <div className="flex items-start gap-x-1 w-full mb-6">
            <div className="w-full">
              <Text className="text-base-regular text-terminal-dim mb-1 font-mono text-sm leading-relaxed">
                By clicking the Place Order button, you confirm that you have
                read, understand and accept our Terms of Use, Terms of Sale and
                Returns Policy and acknowledge that you have read BusinessX&apos;s Privacy Policy.
              </Text>
            </div>
          </div>
          <PaymentButton cart={cart} data-testid="submit-order-button" />
        </>
      )}
    </div>
  )
}

export default Review
