/**
 * Bronco Distribution — Shipping Eligibility Configuration
 *
 * Single source of truth for local-delivery ZIP codes and
 * shipping-method classification helpers.
 *
 * To update the delivery zone after launch, add or remove ZIP codes
 * from LOCAL_DELIVERY_ZIPS below — no other files need to change.
 */

// ---------------------------------------------------------------------------
// Delivery ZIP codes — Front Range / I-25 corridor
// Warehouse origin: 80216 (Globeville, Denver)
// Furthest service point: Colorado Springs (~80901-80951)
// ---------------------------------------------------------------------------

export const LOCAL_DELIVERY_ZIPS: ReadonlySet<string> = new Set([
  // ── Denver Metro (core) ─────────────────────────────────────────────
  "80201", "80202", "80203", "80204", "80205", "80206", "80207", "80208",
  "80209", "80210", "80211", "80212", "80214", "80215", "80216", "80217",
  "80218", "80219", "80220", "80221", "80222", "80223", "80224", "80225",
  "80226", "80227", "80228", "80229", "80230", "80231", "80232", "80233",
  "80234", "80235", "80236", "80237", "80238", "80239",

  // ── Arvada / Wheat Ridge / Golden ───────────────────────────────────
  "80002", "80003", "80004", "80005", "80007",
  "80033", "80034",
  "80401", "80403",

  // ── Westminster / Broomfield / Federal Heights ──────────────────────
  "80020", "80021", "80023",
  "80030", "80031",
  "80234", "80241", "80260",

  // ── Commerce City / Henderson / Brighton ────────────────────────────
  "80022", "80024",
  "80601", "80602", "80603",
  "80640",

  // ── Aurora ──────────────────────────────────────────────────────────
  "80010", "80011", "80012", "80013", "80014", "80015", "80016",
  "80017", "80018", "80019", "80045",

  // ── Englewood / Littleton / Lakewood ────────────────────────────────
  "80110", "80111", "80112", "80113",
  "80120", "80121", "80122", "80123", "80127", "80128", "80232", "80235",

  // ── Centennial / Greenwood Village / Lone Tree / Highlands Ranch ────
  "80111", "80112", "80124", "80126", "80129", "80130",

  // ── Parker ──────────────────────────────────────────────────────────
  "80134", "80138",

  // ── Castle Rock / Sedalia ───────────────────────────────────────────
  "80104", "80108", "80109",

  // ── Larkspur / Monument / Palmer Lake ───────────────────────────────
  "80118", "80132", "80133",

  // ── Colorado Springs ────────────────────────────────────────────────
  "80901", "80902", "80903", "80904", "80905", "80906", "80907", "80908",
  "80909", "80910", "80911", "80912", "80913", "80914", "80915", "80916",
  "80917", "80918", "80919", "80920", "80921", "80922", "80923", "80924",
  "80925", "80926", "80927", "80928", "80929", "80930", "80938", "80939",
  "80951",
])

// ---------------------------------------------------------------------------
// Address helpers
// ---------------------------------------------------------------------------

export function isDeliveryZip(zip: string | undefined | null): boolean {
  if (!zip) return false
  return LOCAL_DELIVERY_ZIPS.has(zip.trim())
}

export function isColorado(province: string | undefined | null): boolean {
  if (!province) return false
  return province.trim().toUpperCase() === "CO"
}

// ---------------------------------------------------------------------------
// Shipping-method classification
// ---------------------------------------------------------------------------

export type ShippingMethodKind =
  | "ups"
  | "local-delivery"
  | "local-pickup"

/**
 * Classify a shipping option so eligibility rules can be applied.
 *
 * Priority of discriminators (most → least stable):
 *  1. fulfillment_set.type === "pickup"  →  local-pickup
 *  2. option.name for shipping sub-types (Local Delivery vs UPS)
 *
 * All name matching is centralised here — no other file should inspect
 * option.name for eligibility purposes.
 */
export function classifyShippingMethod(option: {
  name: string
  service_zone?: { fulfillment_set?: { type: string } }
}): ShippingMethodKind {
  // 1. Pickup type from the fulfillment set (most stable)
  if (option.service_zone?.fulfillment_set?.type === "pickup") {
    return "local-pickup"
  }

  // 2. Name-based matching for shipping sub-types
  const name = option.name.toLowerCase()

  if (name.includes("local pickup") || name.includes("pick up")) {
    return "local-pickup"
  }

  if (name.includes("local delivery")) {
    return "local-delivery"
  }

  // Everything else (UPS Ground, UPS Shipping, etc.) — always eligible
  return "ups"
}

// ---------------------------------------------------------------------------
// Eligibility filter — apply all rules in one pass
// ---------------------------------------------------------------------------

export function filterShippingMethods<
  T extends { name: string; service_zone?: { fulfillment_set?: { type: string } } }
>(
  methods: T[],
  address: { province?: string | null; postal_code?: string | null } | undefined | null
): T[] {
  return methods.filter((method) => {
    const kind = classifyShippingMethod(method)

    switch (kind) {
      case "local-pickup":
        return isColorado(address?.province)
      case "local-delivery":
        return isDeliveryZip(address?.postal_code)
      case "ups":
      default:
        return true
    }
  })
}
