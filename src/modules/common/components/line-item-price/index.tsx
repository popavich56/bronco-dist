import { getPercentageDiff } from "@lib/util/get-percentage-diff"
import { convertToLocale } from "@lib/util/money"
import { clx } from "@medusajs/ui"
import { LineItem } from "@xclade/types"

type LineItemPriceProps = {
  item: LineItem | any
  style?: "default" | "tight"
  currencyCode: string
}

const LineItemPrice = ({
  item,
  style = "default",
  currencyCode,
}: LineItemPriceProps) => {
  const { total, original_total } = item
  const originalPrice = original_total || 0
  const currentPrice = total || 0
  const hasReducedPrice = currentPrice < originalPrice

  return (
    <div className="flex flex-col gap-x-2 text-terminal-dim items-end font-mono">
      <div className="text-left">
        {hasReducedPrice && (
          <>
            <p>
              {style === "default" && (
                <span className="text-terminal-dim">Original: </span>
              )}
              <span
                className="line-through text-terminal-active"
                data-testid="product-original-price"
              >
                {convertToLocale({
                  amount: originalPrice,
                  currency_code: currencyCode,
                })}
              </span>
            </p>
            {style === "default" && (
              <span className="text-bronco-orange">
                -{getPercentageDiff(originalPrice, currentPrice || 0)}%
              </span>
            )}
          </>
        )}
        <span
          className={clx("text-base-regular", {
            "text-bronco-orange": hasReducedPrice,
            "text-terminal-white": !hasReducedPrice,
          })}
          data-testid="product-price"
        >
          {convertToLocale({
            amount: currentPrice,
            currency_code: currencyCode,
          })}
        </span>
      </div>
    </div>
  )
}

export default LineItemPrice
