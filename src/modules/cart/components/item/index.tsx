"use client"

import { Table, Text, clx } from "@medusajs/ui"
import { updateLineItem } from "@lib/data/cart"
import { LineItem } from "@xclade/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useState } from "react"
import { Trash2 } from "lucide-react"

type ItemProps = {
  item: LineItem
  type?: "full" | "preview"
  currencyCode: string
}

const Item = ({ item, type = "full", currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  // TODO: Update this to grab the actual max inventory
  const maxQtyFromInventory = 10
  const maxQuantity = item.variant?.manage_inventory ? 10 : maxQtyFromInventory

  return (
    <Table.Row className="w-full border-b border-terminal-border last:border-b-0 hover:bg-terminal-highlight/10 transition-colors group bg-transparent" data-testid="product-row">
      <Table.Cell className="!pl-4 p-4 w-24 align-top">
          <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className={clx("flex border border-terminal-border overflow-hidden bg-terminal-black aspect-square items-center justify-center", {
            "w-16": type === "preview",
            "small:w-24 w-12": type === "full",
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            images={item.variant?.product?.images}
            size="square"
            className="grayscale group-hover:grayscale-0 transition-all duration-500 object-cover w-full h-full"
          />
        </LocalizedClientLink>
      </Table.Cell>

      <Table.Cell className="text-left align-top py-4 pl-4">
        <div className="flex flex-col gap-1">
            <Text
            className="txt-medium-plus text-terminal-white font-bold font-display uppercase tracking-wide leading-tight"
            data-testid="product-title"
            >
            {item.product_title}
            </Text>
            <LineItemOptions variant={item.variant} data-testid="product-variant" />
        </div>
      </Table.Cell>

      {type === "full" && (
        <Table.Cell className="align-top py-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="relative border border-terminal-border bg-terminal-black hover:border-bronco-orange transition-colors h-8 w-16">
                 <CartItemSelect
                    value={item.quantity}
                    onChange={(value) => changeQuantity(parseInt(value.target.value))}
                    className="w-full h-full p-1 bg-transparent appearance-none text-center font-bold font-mono text-xs focus:outline-none text-terminal-white"
                    data-testid="product-select-button"
                  >
                    {Array.from(
                        {
                        length: Math.min(maxQuantity, 10),
                        },
                        (_, i) => (
                        <option value={i + 1} key={i}>
                            {i + 1}
                        </option>
                        )
                    )}
                 </CartItemSelect>
            </div>
             <DeleteButton id={item.id} data-testid="product-delete-button" className="text-terminal-dim hover:text-red-500 transition-colors">
                 <Trash2 className="w-4 h-4" />
             </DeleteButton>
            {updating && <Spinner />}
          </div>
          <ErrorMessage error={error} data-testid="product-error-message" />
        </Table.Cell>
      )}

      {type === "full" && (
        <Table.Cell className="hidden small:table-cell align-top py-4 text-right">
          <LineItemUnitPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-4 align-top py-4 text-right">
        <span
          className={clx("!pr-0", {
            "flex flex-col items-end h-full justify-center": type === "preview",
          })}
        >
          {type === "preview" && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                style="tight"
                currencyCode={currencyCode}
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            style="tight"
            currencyCode={currencyCode}
          />
        </span>
      </Table.Cell>
    </Table.Row>
  )
}

export default Item
