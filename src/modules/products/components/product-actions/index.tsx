"use client"

import { useIntersection } from "@lib/hooks/use-in-view"
import { Product, Region } from "@xclade/types"
import { useRef } from "react"
import ProductPrice from "../product-price"
import VariantTable from "./variant-table"
import MobileActions from "./mobile-actions"
import SingleVariantActions from "./single-variant-actions"

type ProductActionsProps = {
  product: Product
  region: Region
  disabled?: boolean
  isValidCustomer?: boolean
}

export default function ProductActions({
  product,
  disabled,
  isValidCustomer = false,
}: ProductActionsProps) {
  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const isSingleVariant = product.variants?.length === 1

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
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
