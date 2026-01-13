import { Heading, Text } from "@medusajs/ui"
import { cookies as nextCookies } from "next/headers"

import CartTotals from "@modules/common/components/cart-totals"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OnboardingCta from "@modules/order/components/onboarding-cta"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { PaymentCollection, Order } from "@xclade/types"

type OrderCompletedTemplateProps = {
  order: Order
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  const cookies = await nextCookies()

  const isOnboarding = cookies.get("_medusa_onboarding")?.value === "true"
  const itemsCount = order.items?.length || 0

  return (
    <div className="bg-businessx-gray py-12 min-h-[calc(100vh-64px)]">
      <div className="content-container flex flex-col justify-center items-center gap-y-10 max-w-6xl mx-auto w-full px-4">
        {isOnboarding && <OnboardingCta orderId={order.id} />}
        
        {/* Success Header Card */}
        <div className="w-full bg-terminal-panel border-2 border-terminal-border p-8 shadow-none-lg text-center flex flex-col items-center rounded-none">
            <div className="w-16 h-16 bg-businessx-yellow rounded-full flex items-center justify-center border-2 border-terminal-border mb-6 shadow-none-sm">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-8 h-8 text-terminal-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
            </div>
            <Heading level="h1" className="text-4xl font-display font-black uppercase mb-2 tracking-wide text-terminal-white">Order Confirmed</Heading>
            <Text className="text-lg text-neutral-600 max-w-lg mb-6 font-body">
                Thank you for your purchase! We've received your order and are getting it ready.
            </Text>
            
            <div className="mt-4 pt-8 border-t-2 border-neutral-100 w-full max-w-md">
                <OrderDetails order={order} />
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
            {/* Left Col: Items (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
                <div className="bg-terminal-panel border-2 border-terminal-border p-0 shadow-none overflow-hidden rounded-none">
                    <div className="p-6 border-b-2 border-terminal-border bg-terminal-surface flex items-center justify-between">
                        <Heading level="h2" className="text-xl font-display font-black uppercase text-terminal-white">Order Summary</Heading>
                        <Text className="text-sm font-bold bg-businessx-black text-white px-3 py-1 rounded-full border border-terminal-border">{itemsCount} {itemsCount === 1 ? 'Item' : 'Items'}</Text>
                    </div>
                    <div className="p-6">
                        <Items order={order} />
                        <CartTotals totals={order} />
                    </div>
                </div>
            </div>

            {/* Right Col: Details (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
                 {/* Shipping */}
                 <div className="bg-terminal-panel border-2 border-terminal-border p-6 shadow-none rounded-none">
                    <Heading level="h2" className="text-lg font-display font-black uppercase border-b-2 border-terminal-border pb-3 mb-4 flex items-center gap-2 text-terminal-white">
                        <span>Delivery</span>
                    </Heading>
                    <ShippingDetails order={order} />
                 </div>
                 
                 {/* Payment */}
                 <div className="bg-terminal-panel border-2 border-terminal-border p-6 shadow-none rounded-none">
                    <Heading level="h2" className="text-lg font-display font-black uppercase border-b-2 border-terminal-border pb-3 mb-4 flex items-center gap-2 text-terminal-white">
                         <span>Payment</span>
                    </Heading>
                    <PaymentDetails order={order} />
                 </div>

                 <div className="bg-businessx-yellow border-2 border-terminal-border p-6 shadow-none text-terminal-white rounded-none">
                    <Heading level="h2" className="text-lg font-display font-black uppercase border-b-2 border-terminal-border pb-3 mb-4">Need Help?</Heading>
                    <Help />
                 </div>
            </div>
        </div>
      </div>
    </div>
  )
}
