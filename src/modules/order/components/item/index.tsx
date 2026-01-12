import { LineItem } from "@xclade/types"
import { Table, Text } from "@medusajs/ui"

import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: LineItem | any
  currencyCode: string
}

const Item = ({ item, currencyCode }: ItemProps) => {
  return (
    <Table.Row className="w-full" data-testid="product-row">
      <Table.Cell className="!pl-0 p-4 w-24">
        <div className="flex w-16 border-2 border-terminal-border shadow-none-sm">
          <Thumbnail thumbnail={item.thumbnail} size="square" />
        </div>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="font-bold uppercase text-terminal-white text-sm tracking-wide"
          data-testid="product-name"
        >
          {item.product_title}
        </Text>
        <LineItemOptions variant={item.variant as any} variantTitle={item.variant_title} data-testid="product-variant" />
      </Table.Cell>

      <Table.Cell className="!pr-0">
        <span className="!pr-0 flex flex-col items-end h-full justify-center">
          <span className="flex gap-x-1 ">
            <Text className="text-terminal-dim font-bold text-xs uppercase tracking-wide">
              <span data-testid="product-quantity">{item.quantity}</span>x{" "}
            </Text>
            <LineItemUnitPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </span>

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
