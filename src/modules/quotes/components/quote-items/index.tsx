import repeat from "@lib/util/repeat"
import { Table } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import Item from "@modules/order/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type QuoteItemsProps = {
  cart: {
    items?: any[]
    currency_code: string
  }
}

const QuoteItems = ({ cart }: QuoteItemsProps) => {
  const items = cart.items

  return (
    <div className="flex flex-col w-full text-xs">
      {/* Header */}
      <div className="hidden md:grid grid-cols-[1fr_80px_100px_100px] gap-4 px-4 py-2 bg-terminal-panel border-b border-terminal-border font-bold uppercase tracking-wider text-terminal-dim">
        <div>Product</div>
        <div className="text-center">Qty</div>
        <div className="text-right">Unit</div>
        <div className="text-right">Total</div>
      </div>

      <div className="flex flex-col divide-y divide-gray-100">
        {items?.length
            ? items
                .sort((a, b) => {
                   return (a.created_at ?? "") > (b.created_at ?? "") ? 1 : -1
                })
                .map((item) => {
                  return (
                    <div key={item.id} className="grid grid-cols-1 md:grid-cols-[1fr_80px_100px_100px] gap-4 p-4 items-center hover:bg-terminal-panel transition-colors">
                        {/* Product Info */}
                        <div className="flex gap-x-3 items-center">
                             <div className="w-10 h-10 bg-terminal-black border border-terminal-border shrink-0 flex items-center justify-center p-1">
                                 {item.thumbnail ? (
                                     <img src={item.thumbnail} alt={item.title} className="w-full h-full object-contain" />
                                 ) : (
                                     <div className="text-gray-200 text-[8px] font-bold font-mono">IMG</div>
                                 )}
                             </div>
                             <div className="flex flex-col">
                                 <span className="font-bold text-terminal-white leading-tight line-clamp-2">{item.product_title || item.title}</span>
                                 {item.variant_title && item.variant_title !== 'Default Variant' && (
                                     <span className="text-terminal-dim mt-0.5">{item.variant_title}</span>
                                 )}
                             </div>
                        </div>

                        {/* Quantity (Desktop) */}
                        <div className="hidden md:flex justify-center">
                            <span className="font-mono font-medium">
                                {item.quantity}
                            </span>
                        </div>

                        {/* Unit Price */}
                        <div className="hidden md:flex justify-end">
                            <span className="font-mono text-gray-600">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: cart.currency_code }).format(item.unit_price || 0)}
                            </span>
                        </div>

                        {/* Total Price */}
                         <div className="flex items-center justify-between md:justify-end w-full md:w-auto mt-2 md:mt-0">
                             <span className="md:hidden font-bold">Total:</span>
                             <span className="font-mono font-bold text-terminal-white">
                                 {new Intl.NumberFormat('en-US', { style: 'currency', currency: cart.currency_code }).format((item.unit_price || 0) * item.quantity)}
                             </span>
                         </div>
                    </div>
                  )
                })
            : Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 flex gap-x-4 animate-pulse">
                    <div className="w-10 h-10 bg-gray-200 rounded-sm"></div>
                    <div className="flex-1 flex flex-col gap-y-2 py-1">
                        <div className="w-1/3 h-3 bg-gray-200"></div>
                        <div className="w-1/4 h-2 bg-gray-200"></div>
                    </div>
                </div>
            ))}
      </div>
    </div>
  )
}

export default QuoteItems
