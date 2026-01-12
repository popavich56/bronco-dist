import repeat from "@lib/util/repeat"
import { Cart } from "@xclade/types"
import { Heading, Table } from "@medusajs/ui"

import Item from "@modules/cart/components/item"
import SkeletonLineItem from "@modules/skeletons/components/skeleton-line-item"

type ItemsTemplateProps = {
  cart?: Cart
}

const ItemsTemplate = ({ cart }: ItemsTemplateProps) => {
  const items = cart?.items
  return (
    <div>
      <div className="pb-3 flex items-center border-b border-terminal-border mb-6">
        <Heading className="text-[2rem] leading-[2.75rem] font-display font-black uppercase text-terminal-white tracking-tight">Cart Inventory</Heading>
      </div>
      <div className="border border-terminal-border bg-terminal-black">
          <Table className="border-collapse w-full">
            <Table.Header className="border-b border-terminal-border">
              <Table.Row className="text-terminal-dim font-bold font-mono uppercase tracking-widest text-[10px] bg-transparent hover:bg-transparent">
                <Table.HeaderCell className="!pl-4 py-4 text-left">Product</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell className="text-center">Qty</Table.HeaderCell>
                <Table.HeaderCell className="hidden small:table-cell text-right">
                  Unit Price
                </Table.HeaderCell>
                <Table.HeaderCell className="!pr-4 text-right">
                  Total
                </Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body className="text-terminal-white bg-transparent">
              {items
                ? items
                    .sort((a, b) => {
                      return (a?.created_at ?? "") > (b?.created_at ?? "") ? -1 : 1
                    })
                    .map((item) => {
                      return (
                        item && (
                          <Item
                            key={item.id}
                            item={item}
                            currencyCode={cart?.currency_code}
                          />
                        )
                      )
                    })
                : repeat(5).map((i) => {
                    return <SkeletonLineItem key={i} />
                  })}
            </Table.Body>
          </Table>
      </div>
    </div>
  )
}

export default ItemsTemplate
