/**
 * Bronco Distribution — Product Image Audit
 *
 * Scans all published products via GraphQL and generates a CSV report
 * showing which products are missing images, grouped by priority.
 *
 * Usage:
 *   node scripts/audit-product-images.mjs
 *
 * Output:
 *   scripts/image-audit-report.csv
 *   scripts/thumb-fix-candidates.csv (if any)
 *   + console summary
 */

const API_URL = "https://bc4a5fc6.api.myxclade.com/graphql"
const API_KEY =
  "pk_b6fd10e8cd4e08fe4b437e5907ab7d93d40ffef3c1344fd001384b157b56a5e1"
const PAGE_SIZE = 50

async function fetchPage(offset) {
  const query = `{
    products(
      limit: ${PAGE_SIZE}
      offset: ${offset}
    ) {
      products {
        id
        title
        handle
        thumbnail
        collection_id
        images { id url }
      }
      count
    }
  }`

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": API_KEY,
      "x-graphql-request": "true",
    },
    body: JSON.stringify({ query }),
  })

  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const json = await res.json()
  if (json.errors) throw new Error(JSON.stringify(json.errors))
  return json.data.products
}

function classifyPriority(product) {
  if (product.collection_id) return "HIGH"
  return "LOW"
}

function classifyAction(product) {
  const hasThumb = !!product.thumbnail
  const imgs = product.images || []
  const hasImages = imgs.length > 0

  if (hasThumb) return "OK"
  if (!hasThumb && hasImages) return "SET_THUMB_FROM_IMAGES"
  return "NEEDS_IMAGE_UPLOAD"
}

async function main() {
  console.log("Bronco Distribution — Product Image Audit")
  console.log("==========================================\n")

  let allProducts = []
  let offset = 0
  let total = 0

  while (true) {
    process.stdout.write(`  Fetching offset ${offset}...`)
    const page = await fetchPage(offset)
    total = page.count
    allProducts.push(...page.products)
    console.log(
      ` got ${page.products.length} (${allProducts.length}/${total})`
    )

    if (allProducts.length >= total || page.products.length === 0) break
    offset += PAGE_SIZE
    await new Promise((r) => setTimeout(r, 300))
  }

  console.log(`\nTotal products fetched: ${allProducts.length}\n`)

  const rows = allProducts.map((p) => ({
    title: p.title,
    handle: p.handle,
    thumbnail: p.thumbnail ? "YES" : "NULL",
    images_count: (p.images || []).length,
    in_collection: p.collection_id ? "YES" : "",
    priority: classifyPriority(p),
    action: classifyAction(p),
    first_image_url: (p.images || [])[0]?.url || "",
  }))

  const priorityOrder = { HIGH: 0, LOW: 1 }
  const actionOrder = {
    NEEDS_IMAGE_UPLOAD: 0,
    SET_THUMB_FROM_IMAGES: 1,
    OK: 2,
  }
  rows.sort(
    (a, b) =>
      priorityOrder[a.priority] - priorityOrder[b.priority] ||
      actionOrder[a.action] - actionOrder[b.action]
  )

  const summary = {
    total: rows.length,
    ok: rows.filter((r) => r.action === "OK").length,
    setThumb: rows.filter((r) => r.action === "SET_THUMB_FROM_IMAGES").length,
    needsUpload: rows.filter((r) => r.action === "NEEDS_IMAGE_UPLOAD").length,
    highMissing: rows.filter(
      (r) => r.priority === "HIGH" && r.action !== "OK"
    ).length,
    lowMissing: rows.filter(
      (r) => r.priority === "LOW" && r.action !== "OK"
    ).length,
  }

  console.log("=== SUMMARY ===")
  console.log(`Total products:             ${summary.total}`)
  console.log(`  OK (has thumbnail):       ${summary.ok}`)
  console.log(`  SET_THUMB_FROM_IMAGES:    ${summary.setThumb}`)
  console.log(`  NEEDS_IMAGE_UPLOAD:       ${summary.needsUpload}`)
  console.log()
  console.log("--- By Priority (missing images only) ---")
  console.log(`  HIGH (in collection):     ${summary.highMissing}`)
  console.log(`  LOW  (no collection):     ${summary.lowMissing}`)
  console.log()

  const { writeFileSync } = await import("fs")

  // Main report — only products needing action
  const csvHeader =
    "priority,action,title,handle,thumbnail,images_count,in_collection"
  const csvRows = rows
    .filter((r) => r.action !== "OK")
    .map(
      (r) =>
        `${r.priority},${r.action},"${r.title.replace(/"/g, '""')}",${r.handle},${r.thumbnail},${r.images_count},${r.in_collection}`
    )

  const csvContent = [csvHeader, ...csvRows].join("\n")
  const outPath = new URL("./image-audit-report.csv", import.meta.url).pathname
  writeFileSync(outPath, csvContent)
  console.log(`Report: ${outPath}`)
  console.log(`  ${csvRows.length} products need attention`)

  // Thumb-fix candidates
  const thumbFix = rows.filter((r) => r.action === "SET_THUMB_FROM_IMAGES")
  if (thumbFix.length > 0) {
    const fixHeader = "handle,first_image_url"
    const fixRows = thumbFix.map((r) => `${r.handle},${r.first_image_url}`)
    const fixContent = [fixHeader, ...fixRows].join("\n")
    const fixPath = new URL(
      "./thumb-fix-candidates.csv",
      import.meta.url
    ).pathname
    writeFileSync(fixPath, fixContent)
    console.log(`\nThumb-fix candidates: ${fixPath} (${thumbFix.length})`)
    console.log(
      "  Safe to automate: set thumbnail = images[0].url"
    )
  }
}

main().catch((err) => {
  console.error("Audit failed:", err)
  process.exit(1)
})
