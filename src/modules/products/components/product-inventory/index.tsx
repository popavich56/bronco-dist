"use client"

import { useEffect, useState } from "react"

type InventoryData = Record<
  string,
  { totalQuantity: number; locations: { code: string; quantity: number }[] }
>

type ProductInventoryProps = {
  skus: string[]
}

export default function ProductInventory({ skus }: ProductInventoryProps) {
  const [inventory, setInventory] = useState<InventoryData | null>(null)

  useEffect(() => {
    if (!skus.length) return

    const validSkus = skus
      .map((s) => s.toUpperCase())
      .filter((s) => /^[A-Z0-9\-]{3,30}$/.test(s))
    if (!validSkus.length) return

    fetch("/api/skuvault/inventory", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skus: validSkus }),
    })
      .then((res) => res.json())
      .then((data) => setInventory(data))
      .catch(() => setInventory(null))
  }, [skus])

  if (!inventory) return null

  const entries = Object.entries(inventory)
  if (entries.length === 0) return null

  return (
    <div className="flex flex-col gap-y-2 mt-2">
      {entries.map(([sku, data]) => {
        const primaryLocation = data.locations[0]
        const extraCount = data.locations.length - 1

        return (
          <div key={sku} className="flex items-baseline gap-x-3 text-xs font-mono">
            <span className="text-muted-foreground">
              {data.totalQuantity} in stock
            </span>
            {primaryLocation && (
              <span className="text-muted-foreground/70">
                {primaryLocation.code}
                {extraCount > 0 && ` and ${extraCount} more location${extraCount > 1 ? "s" : ""}`}
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
