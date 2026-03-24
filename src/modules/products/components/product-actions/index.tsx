"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { Product, Region } from "@xclade/types"
import { useRef } from "react"
import ProductPrice from "../product-price"
import ProductInventory from "../product-inventory"
import VariantTable from "./variant-table"
import MobileActions from "./mobile-actions"
import SingleVariantActions from "./single-variant-actions"
import { PENDING_MESSAGE } from "@lib/util/customer-status"

type ProductActionsProps = {
  product: Product
  region: Region
  disabled?: boolean
  isValidCustomer?: boolean
  isPending?: boolean
}

const FULFILLMENT_OPTIONS = [
  { icon: "\u{1F3ED}", label: "Local Pickup", detail: "Denver Warehouse" },
  { icon: "\u{1F69A}", label: "Local Delivery", detail: "Free to your store" },
  { icon: "\u{1F4E6}", label: "UPS Ground", detail: "2\u20133 business days" },
  { icon: "\u{1F3EA}", label: "In-Store Browse", detail: "Visit us in Denver" },
]

export default function ProductActions({
  product,
  disabled,
  isValidCustomer = false,
  isPending = false,
}: ProductActionsProps) {
  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const isSingleVariant = product.variants?.length === 1
  const firstSku = product.variants?.[0]?.sku
  const allSkus = product.variants
    ?.map((v) => v.sku)
    .filter((sku): sku is string => !!sku && sku.trim() !== "")
    .filter((sku, index, arr) => arr.indexOf(sku) === index) ?? []

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        {isPending && (
          <div className="border border-[#6DB3D9]/30 bg-[#001F2E] p-4 text-sm text-[#ADE0EE] font-mono">
            {PENDING_MESSAGE}
          </div>
        )}

        {isValidCustomer && (
          <ProductPrice
            product={product}
            variant={isSingleVariant ? product.variants![0] : undefined}
          />
        )}

        {/* SKU display */}
        {firstSku && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            SKU: {firstSku}
          </div>
        )}

        {/* Warehouse location — conditional only */}
        {(product as any).metadata?.location && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-mono">
            <span className="text-neutral-400 dark:text-neutral-500 uppercase tracking-wider text-[10px]">Warehouse Location</span>
            <span className="ml-2">{(product as any).metadata.location}</span>
          </div>
        )}

        {/* Live inventory from SkuVault — visible to all users */}
        {allSkus.length > 0 && (
          (console.log("ProductInventory skus prop:", allSkus), true) &&
          <ProductInventory skus={allSkus} />
        )}

        {isSingleVariant ? (
          <SingleVariantActions
            product={product}
            variant={product.variants![0]}
            isValidCustomer={isValidCustomer}
            disabled={disabled}
          />
        ) : (
          <VariantTable
            product={product}
            disabled={disabled}
            isValidCustomer={isValidCustomer}
          />
        )}

        {/* Fulfillment options — below variant table */}
        <div className="bg-neutral-100 dark:bg-white/5 rounded-2xl p-4 mt-3">
          <div className="grid grid-cols-2 gap-3">
            {FULFILLMENT_OPTIONS.map((opt) => (
              <div key={opt.label} className="flex items-start gap-2">
                <span className="text-sm leading-none mt-0.5">{opt.icon}</span>
                <div className="flex flex-col">
                  <span className="text-xs font-mono text-neutral-900 dark:text-white font-bold leading-tight">{opt.label}</span>
                  <span className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400 leading-tight">{opt.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Actions logic ... */}
      </div>
    </>
  )
}
