import { convertToLocale } from "@lib/util/money"
import { Text } from "@medusajs/ui"
import { Order } from "@xclade/types"

type ShippingDetailsProps = {
  order: Order
}

const ShippingDetails = ({ order }: ShippingDetailsProps) => {
  return (
    <div className="flex flex-col gap-y-6 text-terminal-white">
        <div className="flex flex-col" data-testid="shipping-address-summary">
          <Text className="text-xs text-terminal-dim uppercase tracking-widest font-bold mb-1 font-sans">
            Shipping Address
          </Text>
          <Text className="font-bold text-terminal-white text-sm">
            {order.shipping_address?.first_name}{" "}
            {order.shipping_address?.last_name}
          </Text>
          <Text className="text-terminal-white text-sm font-body">
            {order.shipping_address?.address_1}{" "}
            {order.shipping_address?.address_2}
          </Text>
          <Text className="text-terminal-white text-sm font-body">
            {order.shipping_address?.postal_code}, {order.shipping_address?.city}
          </Text>
          <Text className="text-terminal-white text-sm font-body">
            {order.shipping_address?.country_code?.toUpperCase()}
          </Text>
        </div>

        <div className="flex flex-col" data-testid="shipping-contact-summary">
          <Text className="text-xs text-terminal-dim uppercase tracking-widest font-bold mb-1 font-sans">Contact</Text>
          <Text className="text-terminal-white text-sm">
            {order.shipping_address?.phone}
          </Text>
          <Text className="text-terminal-white text-sm">{order.email}</Text>
        </div>

        <div className="flex flex-col" data-testid="shipping-method-summary">
          <Text className="text-xs text-terminal-dim uppercase tracking-widest font-bold mb-1 font-sans">Method</Text>
          <Text className="text-terminal-white text-sm font-bold">
            {order.shipping_methods?.[0]?.name} ({convertToLocale({
              amount: order.shipping_methods?.[0]?.total ?? 0,
              currency_code: order.currency_code,
            })})
          </Text>
        </div>
    </div>
  )
}

export default ShippingDetails
