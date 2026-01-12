"use client"

import { Cart, Customer } from "@xclade/types"
import Addresses from "@modules/checkout/components/addresses"
import Shipping from "@modules/checkout/components/shipping"
import Payment from "@modules/checkout/components/payment"
import Review from "@modules/checkout/components/review"
import { useEffect, useState } from "react"

type CheckoutFlowProps = {
  cart: Cart
  customer: Customer | null
  shippingMethods: any[]
  paymentMethods: any[]
}

const CheckoutFlow = ({
  cart,
  customer,
  shippingMethods,
  paymentMethods,
}: CheckoutFlowProps) => {
  const [step, setStep] = useState<"address" | "delivery" | "payment" | "review">("address")

  // Sync state with cart progress on mount
  useEffect(() => {
    if (cart?.shipping_address && cart?.email) {
      if ((cart?.shipping_methods?.length ?? 0) > 0) {
         if ((cart?.payment_collection?.payment_sessions?.length ?? 0) > 0) {
            setStep("review")
         } else {
            setStep("payment")
         }
      } else {
        setStep("delivery")
      }
    } else {
      setStep("address")
    }
  }, [cart])

  return (
    <div className="w-full grid grid-cols-1 gap-y-4">
      <Addresses 
        cart={cart} 
        customer={customer} 
        isOpen={step === "address"}
        onEdit={() => setStep("address")}
      />
      
      <Shipping 
        cart={cart}
        availableShippingMethods={shippingMethods}
        isOpen={step === "delivery"}
        onEdit={() => setStep("delivery")}
      />

      <Payment 
        cart={cart}
        availablePaymentMethods={paymentMethods}
        isOpen={step === "payment"}
        onEdit={() => setStep("payment")}
      />

      <Review 
        cart={cart}
        isOpen={step === "review"}
      />
    </div>
  )
}

export default CheckoutFlow
