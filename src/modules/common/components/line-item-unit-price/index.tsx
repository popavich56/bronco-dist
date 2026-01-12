import { convertToLocale } from "@lib/util/money"
import { clx } from "@medusajs/ui"
import { LineItem } from "@xclade/types"

type LineItemUnitPriceProps = {
  item: LineItem
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemUnitPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemUnitPriceProps) => {
  const { total, original_total } = item
  const hasReducedPrice = (total || 0) < (original_total || 0)

  const percentage_diff = Math.round(
    (((original_total || 0) - (total || 0)) / (original_total || 1)) * 100
  )

  return (
    <div className="flex flex-col text-terminal-dim justify-center h-full font-mono">
      {hasReducedPrice && (
        <>
          <p>
            {style === "default" && (
              <span className="text-terminal-dim">Original: </span>
            )}
            <span
              className="line-through text-terminal-active"
              data-testid="product-unit-original-price"
            >
              {convertToLocale({
                amount: (original_total || 0) / item.quantity,
                currency_code: currencyCode,
              })}
            </span>
          </p>
          {style === "default" && (
            <span className="text-bronco-orange">-{percentage_diff}%</span>
          )}
        </>
      )}
      <span
        className={clx("text-base-regular", {
          "text-bronco-orange": hasReducedPrice,
          "text-terminal-white": !hasReducedPrice,
        })}
        data-testid="product-unit-price"
      >
        {convertToLocale({
          amount: (total || 0) / item.quantity,
          currency_code: currencyCode,
        })}
      </span>
    </div>
  )
}

export default LineItemUnitPrice
