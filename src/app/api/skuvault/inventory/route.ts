import { NextRequest, NextResponse } from "next/server"

type LocationEntry = {
  WarehouseCode: string
  LocationCode: string
  Quantity: number
  Reserve: boolean
}

type SkuVaultResult = Record<
  string,
  { totalQuantity: number; locations: { code: string; quantity: number }[] }
>

// In-memory cache with TTL
const cache = new Map<string, { data: SkuVaultResult; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached(key: string): SkuVaultResult | null {
  const entry = cache.get(key)
  if (!entry) return null
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  return entry.data
}

function setCached(key: string, data: SkuVaultResult) {
  cache.set(key, { data, timestamp: Date.now() })
}

const SKU_REGEX = /^[A-Z0-9\-]{3,30}$/

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { skus } = body

    // Input validation
    if (!Array.isArray(skus)) {
      return NextResponse.json({ error: "skus must be an array" }, { status: 400 })
    }
    if (skus.length === 0) {
      return NextResponse.json({}, { status: 200 })
    }
    if (skus.length > 20) {
      return NextResponse.json({ error: "Maximum 20 SKUs per request" }, { status: 400 })
    }
    if (skus.some((s: unknown) => typeof s !== "string" || !SKU_REGEX.test(s))) {
      return NextResponse.json({ error: "Invalid SKU format" }, { status: 400 })
    }

    // Check cache
    const cacheKey = skus.sort().join(",")
    const cached = getCached(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Normalize, deduplicate, uppercase before sending
    const normalizedSkus = [...new Set(skus.map((s: string) => s.toUpperCase()))]

    if (normalizedSkus.length === 0) {
      return NextResponse.json({}, { status: 200 })
    }

    // Fetch from SkuVault
    const tenantToken = process.env.SKUVAULT_TENANT_TOKEN
    const userToken = process.env.SKUVAULT_USER_TOKEN

    if (!tenantToken || !userToken) {
      return NextResponse.json({}, { status: 200 })
    }

    const response = await fetch(
      "https://app.skuvault.com/api/inventory/getInventoryByLocation",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          TenantToken: tenantToken,
          UserToken: userToken,
          ProductSKUs: normalizedSkus,
        }),
      }
    )

    if (!response.ok) {
      return NextResponse.json({}, { status: 200 })
    }

    const data = await response.json()

    if (!data.Items) {
      return NextResponse.json({}, { status: 200 })
    }

    // Build result for requested SKUs only
    const result: SkuVaultResult = {}

    for (const sku of normalizedSkus) {
      const entries: LocationEntry[] = data.Items[sku]
      if (!entries || entries.length === 0) continue

      const locations = entries.map((e) => ({
        code: e.LocationCode,
        quantity: e.Quantity,
      }))

      const totalQuantity = locations.reduce((sum, l) => sum + l.quantity, 0)

      result[sku] = { totalQuantity, locations }
    }

    setCached(cacheKey, result)

    return NextResponse.json(result)
  } catch {
    // Graceful degradation — return empty on any error
    return NextResponse.json({}, { status: 200 })
  }
}
