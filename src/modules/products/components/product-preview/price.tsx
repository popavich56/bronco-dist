import { Text, clx } from "@medusajs/ui"
import { VariantPrice } from "types/global"
import { retrieveCustomer } from "@lib/data/customer"

export default async function PreviewPrice({ price }: { price: VariantPrice }) {
  const customer = await retrieveCustomer()

  if (!price || !customer) {
    return null
  }

  return (
    <>
      {price.price_type === "sale" && (
        <Text
          className="line-through text-ui-fg-muted"
          data-testid="original-price"
        >
          {price.original_price}
        </Text>
      )}
      <Text
        className={clx("text-ui-fg-muted", {
          "text-ui-fg-interactive": price.price_type === "sale",
        })}
        data-testid="price"
      >
        {price.calculated_price}
      </Text>
    </>
  )
}
