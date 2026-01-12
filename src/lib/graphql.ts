// GraphQL client and queries for Medusa backend

// Simple GraphQL client using fetch - no extra dependencies needed

const GRAPHQL_URL = process.env.NEXT_PUBLIC_XCLADE_BACKEND_URL
  ? `${process.env.NEXT_PUBLIC_XCLADE_BACKEND_URL}/graphql`
  : "http://localhost:9000/graphql"

export async function graphqlQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  headers?: Record<string, string>,
  options?: { tags?: string[]; revalidate?: number | false }
): Promise<T> {
  const publishableKey = process.env.NEXT_PUBLIC_XCLADE_API_KEY || ""

  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-graphql-request": "true",
      "x-publishable-api-key": publishableKey,
      ...headers,
    },
    body: JSON.stringify({ query, variables }),
    next: options?.tags
      ? { tags: options.tags }
      : options?.revalidate !== undefined
      ? { revalidate: options.revalidate }
      : { revalidate: 60 }, // Default: cache for 60 seconds
  })

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.statusText}`)
  }

  const result = await response.json()

  if (result.errors) {
    throw new Error(result.errors[0]?.message || "GraphQL query failed")
  }

  return result.data
}

// Product queries
// Product fragments
export const PRODUCT_LIST_FRAGMENT = `
  fragment ProductListFields on Product {
    id
    title
    handle
    subtitle
    thumbnail
    created_at
    variants {
      id
    }
    rating_summary {
      average_rating
      review_count
    }
  }
`

export const PRODUCT_DETAIL_FRAGMENT = `
  fragment ProductDetailFields on Product {
    id
    title
    handle
    subtitle
    description
    thumbnail
    is_giftcard
    discountable
    collection_id
    type_id
    weight
    length
    height
    width
    hs_code
    origin_country
    mid_code
    material
    created_at
    updated_at
    metadata
    type {
      id
      value
    }
    collection {
      id
      title
      handle
    }
    tags {
      id
      value
    }
    categories {
      id
      name
      handle
    }
    images {
      id
      url
    }
    options {
      id
      title
      values {
        id
        value
        option_id
      }
    }
    variants {
      id
      title
      sku
      barcode
      ean
      upc
      allow_backorder
      manage_inventory
      inventory_quantity
      product_id
      variant_rank
      options {
        id
        value
        option_id
      }
      calculated_price {
        calculated_amount
        original_amount
        currency_code
      }
    }
    rating_summary {
      average_rating
      review_count
    }
  }
`

export const PRODUCT_SHELL_FRAGMENT = `
  fragment ProductShellFields on Product {
    id
    title
    handle
    subtitle
    description
    thumbnail
    is_giftcard
    discountable
    collection_id
    type_id
    weight
    length
    height
    width
    hs_code
    origin_country
    mid_code
    material
    created_at
    updated_at
    metadata
    type {
      id
      value
    }
    collection {
      id
      title
      handle
    }
    tags {
      id
      value
    }
    categories {
      id
      name
      handle
    }
    images {
      id
      url
    }
    rating_summary {
      average_rating
      review_count
    }
  }
`

export const GET_PRODUCT_BY_HANDLE = `
  ${PRODUCT_DETAIL_FRAGMENT}
  query GetProductByHandle($handle: [String!]!, $pricingContext: PricingContextInput) {
    products(filter: { handle: $handle }, pricingContext: $pricingContext, limit: 1) {
      products {
        ...ProductDetailFields
      }
    }
  }
`

export const GET_PRODUCT_SHELL = `
  ${PRODUCT_SHELL_FRAGMENT}
  query GetProductShell($handle: [String!]!) {
    products(filter: { handle: $handle }, limit: 1) {
      products {
        ...ProductShellFields
      }
    }
  }
`

export const GET_PRODUCT_BY_ID = `
  ${PRODUCT_DETAIL_FRAGMENT}
  query GetProductById($id: ID!, $pricingContext: PricingContextInput) {
    product(id: $id, pricingContext: $pricingContext) {
      ...ProductDetailFields
    }
  }
`

export const LIST_PRODUCTS = `
  ${PRODUCT_LIST_FRAGMENT}
  query ListProducts(
    $filter: ProductFilterInput
    $pricingContext: PricingContextInput
    $order: ProductOrderInput
    $offset: Int
    $limit: Int
  ) {
    products(filter: $filter, pricingContext: $pricingContext, order: $order, offset: $offset, limit: $limit) {
      products {
        ...ProductListFields
      }
      count
      offset
      limit
    }
  }
`

export const ORDER_PREVIEW_FRAGMENT = `
  fragment OrderPreviewFields on Order {
    id
    display_id
    created_at
    status
    fulfillment_status
    payment_status
    currency_code
    email
    total
    subtotal
    tax_total
    shipping_total
    discount_total
    items {
      id
      quantity
    }
  }
`

export const ORDER_DETAIL_FRAGMENT = `
  fragment OrderFields on Order {
    id
    display_id
    created_at
    status
    fulfillment_status
    payment_status
    currency_code
    email
    total
    subtotal
    tax_total
    shipping_total
    discount_total
    items {
      id
      title
      subtitle
      thumbnail
      quantity
      unit_price
      total
      variant_id
      variant_sku
      variant_title
      variant {
        id
        title
        sku
        options {
          value
          option {
            title
          }
        }
      }
      product_id
      product_title
      product_handle
      product {
        id
        title
        handle
      }
      original_total
      discount_total
      tax_total
    }
    shipping_address {
      first_name
      last_name
      address_1
      address_2
      city
      postal_code
      province
      country_code
      phone
    }
    billing_address {
      first_name
      last_name
      address_1
      address_2
      city
      postal_code
      province
      country_code
      phone
    }
    payment_collections {
      id
      amount
      status
      payments {
        id
        amount
        currency_code
        provider_id
      }
    }
    shipping_methods {
      id
      name
      amount
      total
      tax_total
      tax_lines {
        code
        rate
        total
      }
    }
  }
`

export const ORDER_FRAGMENT = ORDER_DETAIL_FRAGMENT

export const GET_ORDER = `
  ${ORDER_DETAIL_FRAGMENT}
  query GetOrder($id: ID!) {
    order(id: $id) {
      ...OrderFields
    }
  }
`

export const LIST_ORDERS = `
  ${ORDER_PREVIEW_FRAGMENT}
  query ListOrders($limit: Int, $offset: Int) {
    orders(limit: $limit, offset: $offset) {
      orders {
        ...OrderPreviewFields
      }
      count
      offset
      limit
    }
  }
`
// Region queries
export const REGION_FRAGMENT = `
  fragment RegionFields on Region {
    id
    name
    currency_code
    automatic_taxes
    countries {
      iso_2
      display_name
    }
  }
`

export const LIST_REGIONS = `
  ${REGION_FRAGMENT}
  query ListRegions {
    regions(limit: 100) {
      regions {
        ...RegionFields
      }
    }
  }
`

export const GET_REGION = `
  ${REGION_FRAGMENT}
  query GetRegion($id: ID!) {
    region(id: $id) {
      ...RegionFields
    }
  }
`
