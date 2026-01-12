import { Text } from "@medusajs/ui"

import { isStripeLike, paymentInfoMap } from "@lib/constants"
import { convertToLocale } from "@lib/util/money"
import { Order } from "@xclade/types"

type PaymentDetailsProps = {
  order: Order
}

const PaymentDetails = ({ order }: PaymentDetailsProps) => {
  const payment = order.payment_collections?.[0]?.payments?.[0]

  return (
    <div className="flex flex-col gap-y-6 text-terminal-white">
      {payment ? (
          <>
            <div className="flex flex-col">
              <Text className="text-xs text-terminal-dim uppercase tracking-widest font-bold mb-1 font-sans">
                Payment Method
              </Text>
              <Text className="font-bold text-terminal-white text-sm" data-testid="payment-method">
                {paymentInfoMap[payment.provider_id]?.title || payment.provider_id}
              </Text>
            </div>
            
            <div className="flex flex-col">
              <Text className="text-xs text-terminal-dim uppercase tracking-widest font-bold mb-1 font-sans">
                Details
              </Text>
              <div className="flex items-center gap-2">
                 {paymentInfoMap[payment.provider_id]?.icon && (
                    <div className="w-8 border border-neutral-200 p-1 rounded-sm">
                        {paymentInfoMap[payment.provider_id].icon}
                    </div>
                 )}
                 <Text className="text-terminal-white text-sm" data-testid="payment-amount">
                    {isStripeLike(payment.provider_id) && typeof payment.data?.card_last4 === 'string'
                        ? `**** **** **** ${payment.data.card_last4}`
                        : `${convertToLocale({
                            amount: payment.amount,
                            currency_code: order.currency_code,
                        })} paid`
                    }
                 </Text>
              </div>
               {!isStripeLike(payment.provider_id) && payment.created_at && (
                    <Text className="text-xs text-neutral-400 mt-1">
                        {new Date(payment.created_at).toLocaleString()}
                    </Text>
               )}
            </div>
          </>
      ) : (
        <Text className="text-terminal-dim italic">No payment details available.</Text>
      )}
    </div>
  )
}

export default PaymentDetails
