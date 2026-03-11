"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { Product, Region } from "@xclade/types"
import { useRef } from "react"
import ProductPrice from "../product-price"
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

export default function ProductActions({
  product,
  disabled,
  isValidCustomer = false,
  isPending = false,
}: ProductActionsProps) {
  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const isSingleVariant = product.variants?.length === 1

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

        {/* Mobile Actions logic ... */}
      </div>
    </>
  )
}
