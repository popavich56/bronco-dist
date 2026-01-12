// Product Variant GraphQL queries
import { graphqlQuery } from "./graphql"
import { ProductVariant } from "@xclade/types"

// Variant Fragment
const VARIANT_FRAGMENT = `
  fragment VariantFields on ProductVariant {
    id
    title
    sku
    barcode
    ean
    upc
    inventory_quantity
    allow_backorder
    manage_inventory
    hs_code
    origin_country
    mid_code
    material
    weight
    length
    height
    width
    metadata
    variant_rank
    created_at
    updated_at
    product_id
    calculated_price {
      calculated_amount
      original_amount
      currency_code
      price_list_type
    }
    product {
      id
      title
      handle
      thumbnail
      images {
        id
        url
      }
    }
  }
`

// Query: Get Variant by ID
// Added pricingContext to support region-specific prices
export const GET_VARIANT = `
  ${VARIANT_FRAGMENT}
  query GetVariant($id: ID!, $pricingContext: PricingContextInput) {
    productVariant(id: $id, pricingContext: $pricingContext) {
      ...VariantFields
    }
  }
`

/**
 * Retrieve a product variant by ID via GraphQL
 */
export async function retrieveVariantQL(
  id: string,
  headers?: Record<string, string>,
  options?: { tags?: string[]; revalidate?: number | false },
  pricingContext?: { currency_code?: string; region_id?: string }
): Promise<ProductVariant | null> {
  const data = await graphqlQuery<{ productVariant: ProductVariant }>(
    GET_VARIANT,
    { id, pricingContext },
    headers,
    options
  )
  return data.productVariant
}
