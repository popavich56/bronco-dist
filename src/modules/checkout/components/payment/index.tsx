"use client"

import { RadioGroup } from "@headlessui/react"
import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { initiatePaymentSession } from "@lib/data/cart"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Button, Container, Heading, Text, clx } from "@medusajs/ui"
import ErrorMessage from "@modules/checkout/components/error-message"
import PaymentContainer, {
  StripeCardContainer,
} from "@modules/checkout/components/payment-container"
import Divider from "@modules/common/components/divider"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useState } from "react"

const Payment = ({
  cart,
  availablePaymentMethods,
  isOpen,
  onEdit,
}: {
  cart: any
  availablePaymentMethods: any[]
  isOpen: boolean
  onEdit?: () => void
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const setPaymentMethod = async (method: string) => {
    setError(null)
    setSelectedPaymentMethod(method)

    setIsLoading(true)
    await initiatePaymentSession(cart, {
      provider_id: method,
    })
      .catch((err) => setError(err.message))
      .finally(async () => {
        setIsLoading(false)
        await new Promise(resolve => setTimeout(resolve, 300))
        // Trigger refresh to update cart in parent
        router.refresh()
      })
  }

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (cart?.shipping_methods?.length ?? 0) > 0 || paidByGiftcard

  return (
    <div className="bg-terminal-panel border border-terminal-border p-6 mb-4 relative transition-all">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-xl font-display font-black uppercase tracking-wide gap-x-2 items-baseline",
            {
              "text-terminal-white": isOpen || selectedPaymentMethod,
              "text-terminal-dim": !isOpen && !selectedPaymentMethod
            }
          )}
        >
          Payment Method
          {selectedPaymentMethod && !isOpen && <CheckCircleSolid className="text-businessx-orange" />}
        </Heading>
        {selectedPaymentMethod && !isOpen && onEdit && (
           <Button
             onClick={onEdit}
             variant="transparent"
             className="text-businessx-orange hover:text-white font-bold uppercase tracking-wide decoration-2 hover:underline font-mono text-xs"
             data-testid="edit-payment-button"
           >
             Edit
           </Button>
        )}
      </div>
      <div>
          {isOpen ? (
            <>
              {(!paymentReady) && (
                <div className="text-base-regular text-terminal-dim italic p-4 bg-terminal-black border border-terminal-border">
                  Please choose a delivery method to view payment options.
                </div>
              )}

              {paymentReady && !paidByGiftcard && availablePaymentMethods?.length && (
                <div className="flex flex-col gap-y-4">
                  <RadioGroup
                    value={selectedPaymentMethod}
                    onChange={(value: string) => setPaymentMethod(value)}
                  >
                    {availablePaymentMethods.map((paymentMethod) => (
                      <div key={paymentMethod.id} className={clx(
                        "mb-4 border border-terminal-border p-4 transition-all hover:bg-terminal-highlight/20",
                        {
                          "bg-terminal-highlight/30 border-businessx-orange": selectedPaymentMethod === paymentMethod.id,
                          "bg-terminal-black": selectedPaymentMethod !== paymentMethod.id
                        }
                      )}>
                        {isStripeLike(paymentMethod.id) ? (
                          <StripeCardContainer
                            paymentProviderId={paymentMethod.id}
                            selectedPaymentOptionId={selectedPaymentMethod}
                            paymentInfoMap={paymentInfoMap}
                            setCardBrand={setCardBrand}
                            setError={setError}
                            setCardComplete={setCardComplete}
                          />
                        ) : (
                          <PaymentContainer
                            paymentInfoMap={paymentInfoMap}
                            paymentProviderId={paymentMethod.id}
                            paymentInfo={paymentMethod}
                            selectedPaymentOptionId={selectedPaymentMethod}
                          />
                        )}
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {paymentReady && paidByGiftcard && (
                <div className="flex flex-col w-1/3">
                  <Text className="font-display font-bold uppercase text-terminal-white mb-1">
                    Payment method
                  </Text>
                  <Text
                    className="txt-medium text-ui-fg-subtle"
                    data-testid="payment-method-summary"
                  >
                    Gift card
                  </Text>
                </div>
              )}

              <ErrorMessage
                error={error}
                data-testid="payment-method-error-message"
              />
            </>
          ) : (
             <div className="text-terminal-dim font-mono text-sm">
                {selectedPaymentMethod ? (
                  <div className="flex flex-col gap-y-1 txt-medium">
                    <Text className="txt-large-plus font-bold text-terminal-white uppercase mb-2">
                       Payment
                    </Text>
                    <Text>
                       {paymentInfoMap[selectedPaymentMethod]?.title || selectedPaymentMethod}
                    </Text>
                  </div>
                ) : (
                   <div>Enter delivery details first</div>
                )}
             </div>
          )}
      </div>
    </div>
  )
}

export default Payment
