"use client"

import { useEffect } from "react"
import { useRecentlyViewed } from "@lib/hooks/use-recently-viewed"

export default function RecentlyViewedTracker({
  productId,
}: {
  productId: string
}) {
  const { addProduct } = useRecentlyViewed()

  useEffect(() => {
    if (productId) {
      addProduct(productId)
    }
  }, [productId, addProduct])

  return null
}
