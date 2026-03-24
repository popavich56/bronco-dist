/**
 * Bronco Distribution — Fix Missing Thumbnails
 *
 * Sets thumbnail = images[0].url for products where:
 *   - thumbnail is null
 *   - images array has at least 1 entry
 *
 * Requires XCLADE_ADMIN_TOKEN env var (admin API bearer token).
 *
 * Usage:
 *   XCLADE_ADMIN_TOKEN=your_token node scripts/fix-missing-thumbnails.mjs
 *
 * Dry run (default — no mutations):
 *   node scripts/fix-missing-thumbnails.mjs
 *
 * Live run:
 *   XCLADE_ADMIN_TOKEN=your_token LIVE=1 node scripts/fix-missing-thumbnails.mjs
 */

const API_BASE = "https://bc4a5fc6.api.myxclade.com"
const GRAPHQL_URL = `${API_BASE}/graphql`
const STORE_API_KEY =
  "pk_b6fd10e8cd4e08fe4b437e5907ab7d93d40ffef3c1344fd001384b157b56a5e1"
const ADMIN_TOKEN = process.env.XCLADE_ADMIN_TOKEN || ""
const IS_LIVE = process.env.LIVE === "1"

async function fetchCandidates() {
  // Fetch all products with images but no thumbnail via store GraphQL
  let all = []
  let offset = 0
  const limit = 50

  while (true) {
    const query = `{
      products(limit: ${limit}, offset: ${offset}) {
        products {
          id
          title
          handle
          thumbnail
          images { id url }
        }
        count
      }
    }`

    const res = await fetch(GRAPHQL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": STORE_API_KEY,
        "x-graphql-request": "true",
      },
      body: JSON.stringify({ query }),
    })

    const json = await res.json()
    if (json.errors) throw new Error(JSON.stringify(json.errors))

    const { products, count } = json.data.products
    all.push(...products)

    if (all.length >= count || products.length === 0) break
    offset += limit
    await new Promise((r) => setTimeout(r, 300))
  }

  // Filter: thumbnail is null AND images has at least 1 entry
  return all.filter(
    (p) => !p.thumbnail && (p.images || []).length > 0
  )
}

async function updateThumbnail(productId, thumbnailUrl) {
  const res = await fetch(`${API_BASE}/admin/products/${productId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${ADMIN_TOKEN}`,
    },
    body: JSON.stringify({ thumbnail: thumbnailUrl }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status}: ${text}`)
  }

  return res.json()
}

async function main() {
  console.log("Bronco Distribution — Fix Missing Thumbnails")
  console.log("=============================================")
  console.log(`Mode: ${IS_LIVE ? "LIVE (mutations enabled)" : "DRY RUN (read-only)"}`)
  console.log()

  if (IS_LIVE && !ADMIN_TOKEN) {
    console.error("ERROR: XCLADE_ADMIN_TOKEN is required for live mode.")
    console.error("Usage: XCLADE_ADMIN_TOKEN=xxx LIVE=1 node scripts/fix-missing-thumbnails.mjs")
    process.exit(1)
  }

  // Step 1: Find candidates
  console.log("Scanning products...")
  const candidates = await fetchCandidates()
  console.log(`Found ${candidates.length} products with images[] but no thumbnail.\n`)

  if (candidates.length === 0) {
    console.log("Nothing to fix.")
    return
  }

  // Step 2: Show what will be updated
  let updated = 0
  let failed = 0
  const results = []

  for (const p of candidates) {
    const newThumb = p.images[0].url
    console.log(`  ${p.title}`)
    console.log(`    handle:    ${p.handle}`)
    console.log(`    id:        ${p.id}`)
    console.log(`    images[0]: ${newThumb}`)

    if (IS_LIVE) {
      try {
        await updateThumbnail(p.id, newThumb)
        console.log(`    => UPDATED`)
        updated++
        results.push({ handle: p.handle, status: "UPDATED", url: newThumb })
      } catch (err) {
        console.log(`    => FAILED: ${err.message}`)
        failed++
        results.push({ handle: p.handle, status: "FAILED", error: err.message })
      }
      // Rate limit
      await new Promise((r) => setTimeout(r, 500))
    } else {
      console.log(`    => WOULD UPDATE (dry run)`)
      results.push({ handle: p.handle, status: "DRY_RUN", url: newThumb })
    }
    console.log()
  }

  // Step 3: Summary
  console.log("=== SUMMARY ===")
  console.log(`Total candidates:  ${candidates.length}`)
  if (IS_LIVE) {
    console.log(`Updated:           ${updated}`)
    console.log(`Failed:            ${failed}`)
  } else {
    console.log(`Would update:      ${candidates.length}`)
    console.log()
    console.log("To apply changes, run:")
    console.log("  XCLADE_ADMIN_TOKEN=xxx LIVE=1 node scripts/fix-missing-thumbnails.mjs")
  }

  // Write rollback log (for live runs)
  if (IS_LIVE && updated > 0) {
    const { writeFileSync } = await import("fs")
    const rollback = candidates.map((p) => ({
      id: p.id,
      handle: p.handle,
      previous_thumbnail: null,
      new_thumbnail: p.images[0].url,
    }))
    const logPath = new URL("./thumb-fix-rollback.json", import.meta.url).pathname
    writeFileSync(logPath, JSON.stringify(rollback, null, 2))
    console.log(`\nRollback log: ${logPath}`)
    console.log("  To revert: set thumbnail back to null for each product ID in this file.")
  }
}

main().catch((err) => {
  console.error("Fix failed:", err)
  process.exit(1)
})
