import { Order } from "@xclade/types"
import { Text } from "@medusajs/ui"

type OrderDetailsProps = {
  order: Order
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div className="flex flex-col w-full text-terminal-white">
      {!showStatus && (
          <Text className="text-base text-terminal-dim text-center mb-6 font-body">
            We have sent the order confirmation details to <span className="font-bold text-terminal-white border-b-2 border-bronco-yellow">{order.email}</span>.
          </Text>
      )}

      <div className={`grid grid-cols-2 gap-x-8 gap-y-6 w-full text-left ${showStatus ? '' : 'justify-center'}`}>
          {showStatus && (
             <div className="flex flex-col">
                <Text className="text-xs text-terminal-dim uppercase tracking-widest font-bold mb-1 font-sans">Contact</Text>
                <Text className="font-bold text-terminal-white text-sm">{order.email}</Text>
             </div>
          )}

          <div className={`flex flex-col ${!showStatus ? 'items-end text-right' : ''}`}>
               <Text className="text-xs text-terminal-dim uppercase tracking-widest font-bold mb-1 font-sans">Order Date</Text>
               <Text className="font-bold text-terminal-white text-sm">{new Date(order.created_at).toDateString()}</Text>
          </div>
          
          <div className={`flex flex-col ${!showStatus ? 'items-start' : ''}`}>
               <Text className="text-xs text-terminal-dim uppercase tracking-widest font-bold mb-1 font-sans">Order Number</Text>
               <Text className="font-black text-terminal-white text-sm font-display">#{order.display_id}</Text>
          </div>

          {showStatus && (
            <>
              <div className="flex flex-col">
                <Text className="text-xs text-terminal-dim uppercase tracking-widest font-bold mb-1 font-sans">Order Status</Text>
                <Text className="font-bold text-terminal-white text-sm">{formatStatus(order.fulfillment_status || "N/A")}</Text>
              </div>
              <div className="flex flex-col">
                <Text className="text-xs text-terminal-dim uppercase tracking-widest font-bold mb-1 font-sans">Payment Status</Text>
                 <Text className="font-bold text-terminal-white text-sm">{formatStatus(order.payment_status || "N/A")}</Text>
              </div>
            </>
          )}
      </div>
    </div>
  )
}

export default OrderDetails
