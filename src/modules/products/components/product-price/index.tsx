import { clx } from "@medusajs/ui"
import { Product, ProductVariant } from "@xclade/types"

import { getProductPrice } from "@lib/util/get-product-price"

export default function ProductPrice({
  product,
  variant,
}: {
  product: Product
  variant?: ProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return (
      <div className="block w-32 h-9 bg-terminal-active/20 animate-pulse" />
    )
  }

  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2">
        {selectedPrice.price_type === "sale" && (
          <span className="text-terminal-dim font-mono text-sm line-through decoration-bronco-orange/50">
            {selectedPrice.original_price}
          </span>
        )}
        <span
          className={clx(
            "text-4xl font-mono font-bold tracking-tight tabular-nums",
            {
              "text-bronco-orange": selectedPrice.price_type === "sale",
              "text-terminal-white": selectedPrice.price_type !== "sale",
            }
          )}
        >
          <span className="text-2xl text-terminal-dim mr-1">$</span>
          <span
            data-testid="product-price"
            data-value={selectedPrice.calculated_price_number}
            className="text-shadow-none"
          >
            {selectedPrice.calculated_price.replace("$", "")}{" "}
            {/* Strip symbol to style manually */}
          </span>
          {!variant && (
            <span className="text-xs text-terminal-dim ml-2 align-top uppercase tracking-wide">
              Base
            </span>
          )}
        </span>
      </div>

      {selectedPrice.price_type === "sale" && (
        <span className="text-bronco-orange font-mono text-xs uppercase tracking-widest mt-1">
          :: Price Override Detected [-{selectedPrice.percentage_diff}%]
        </span>
      )}
    </div>
  )
}
