"use client"

import { Product } from "@xclade/types"
import Accordion from "./accordion"
import { Truck, RefreshCw, Undo2 } from "lucide-react"

export type ProductTabsProps = {
  product: Product
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Technical Specs",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Logistics & Returns",
      component: <ShippingInfoTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const specs = [
    { label: "Material", value: product.material },
    { label: "Origin", value: product.origin_country },
    { label: "Type", value: product.type?.value },
    { label: "Weight", value: product.weight ? `${product.weight} g` : null },
    {
      label: "Dimensions",
      value:
        product.length && product.width && product.height
          ? `${product.length}L x ${product.width}W x ${product.height}H`
          : null,
    },
  ].filter((s) => s.value) // Only show populated specs

  return (
    <div className="py-2">
      {specs.length > 0 ? (
        <div className="grid grid-cols-1 gap-y-2">
          {specs.map((spec, i) => (
            <div
              key={i}
              className="flex items-center justify-between border-b border-terminal-border/50 pb-2 last:border-0"
            >
              <span className="font-bold text-terminal-dim uppercase text-[10px]">
                {spec.label}
              </span>
              <span className="text-terminal-white text-xs">{spec.value}</span>
            </div>
          ))}
        </div>
      ) : (
        <span className="text-terminal-dim italic text-xs">
          No technical specifications available.
        </span>
      )}
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="py-2 flex flex-col gap-6">
      <div className="flex items-start gap-x-3">
        <Truck className="w-4 h-4 text-businessx-orange mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="font-bold text-terminal-white text-xs uppercase">
            Deployment Speed
          </span>
          <p className="text-terminal-dim text-xs leading-relaxed">
            Standard tactical delivery window is 3-5 business days to designated
            drop zones or residential sectors.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-x-3">
        <RefreshCw className="w-4 h-4 text-businessx-orange mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="font-bold text-terminal-white text-xs uppercase">
            Exchange Protocol
          </span>
          <p className="text-terminal-dim text-xs leading-relaxed">
            Misfit detected? Initiate exchange sequence for immediate
            replacement.
          </p>
        </div>
      </div>
      <div className="flex items-start gap-x-3">
        <Undo2 className="w-4 h-4 text-businessx-orange mt-0.5 shrink-0" />
        <div className="flex flex-col gap-1">
          <span className="font-bold text-terminal-white text-xs uppercase">
            Return Authorization
          </span>
          <p className="text-terminal-dim text-xs leading-relaxed">
            Hassle-free return vectors authorized for all qualified inventory.
          </p>
        </div>
      </div>
    </div>
  )
}

const ReviewsTab = ({ product }: ProductTabsProps) => {
  return null
}

export default ProductTabs
