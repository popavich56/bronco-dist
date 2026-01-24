"use server"

import { sortProducts } from "@lib/util/sort-products"
import { Product, Region } from "@xclade/types"

// ProductFilterInput is specific to GraphQL, defining a partial here or using Record
type ProductFilterInput = Record<string, any>
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
  order,
  skipAuth = false,
}: {
  pageParam?: number
  queryParams?: ProductFilterInput & {
    limit?: number
    offset?: number
    fields?: string
    region_id?: string
    order?: string
  }
  countryCode?: string
  regionId?: string
  order?: {
    created_at?: "ASC" | "DESC"
    updated_at?: "ASC" | "DESC"
    title?: "ASC" | "DESC"
  }
  skipAuth?: boolean
}): Promise<{
  response: { products: Product[]; count: number }
  nextPage: number | null
  queryParams?: ProductFilterInput & { limit?: number }
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: Region | undefined | null

  if (countryCode) {
    region = (await getRegion(countryCode)) as unknown as Region
  } else {
    region = (await retrieveRegion(regionId!)) as unknown as Region
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = skipAuth
    ? {}
    : {
        ...(await getAuthHeaders()),
      }

  const next = skipAuth
    ? {}
    : {
        ...(await getCacheOptions("products")),
      }

  const { graphqlQuery, LIST_PRODUCTS } = await import("@lib/graphql")

  // Filter out params that aren't valid ProductFilterInput fields
  const {
    limit: _,
    offset: __,
    fields: ___,
    region_id: ____,
    order: _____,
    ...filterParams
  } = queryParams || {}

  type GraphQLResponse = {
    products: {
      products: Product[]
      count: number
      limit: number
      offset: number
    }
  }

  const result = await graphqlQuery<GraphQLResponse>(
    LIST_PRODUCTS,
    {
      filter: filterParams,
      pricingContext: {
        region_id: region.id,
        currency_code: region.currency_code,
      },
      order: order || undefined,
      limit,
      offset,
    },
    headers
  )

  const { products, count } = result.products
  const nextPage = count > offset + limit ? pageParam + 1 : null

  return {
    response: {
      products,
      count,
    },
    nextPage,
    queryParams,
  }
}

/**
 * List products with sorting - uses GraphQL order parameter for efficient database-level sorting
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: ProductFilterInput & { limit?: number }
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: Product[]; count: number }
  nextPage: number | null
  queryParams?: ProductFilterInput & { limit?: number }
}> => {
  const limit = queryParams?.limit || 12
  const pageParam = Math.max(page, 1)

  // Map frontend sort options to GraphQL order input
  const orderMap = {
    created_at: { created_at: "DESC" as const },
    updated_at: { updated_at: "DESC" as const },
    title_asc: { title: "ASC" as const },
    title_desc: { title: "DESC" as const },
    price_asc: { created_at: "ASC" as const }, // Fallback to created_at for now (price sorting needs calculated_price support)
    price_desc: { created_at: "DESC" as const }, // Fallback to created_at for now
  }

  const order = orderMap[sortBy] || { created_at: "DESC" }

  return await listProducts({
    pageParam,
    queryParams,
    countryCode,
    order,
  })
}

/**
 * Get a single product by handle with FULL details for product detail pages
 * Uses GraphQL to get all variants, options, images, and pricing data
 */
export const getProductByHandle = async ({
  handle,
  countryCode,
  regionId,
}: {
  handle: string
  countryCode?: string
  regionId?: string
}): Promise<Product | null> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  let region: Region | undefined | null

  if (countryCode) {
    region = (await getRegion(countryCode)) as unknown as Region
  } else {
    region = (await retrieveRegion(regionId!)) as unknown as Region
  }

  if (!region) {
    return null
  }

  const { graphqlQuery, GET_PRODUCT_BY_HANDLE } = await import("@lib/graphql")

  type GraphQLResponse = {
    products: {
      products: Product[]
    }
  }

  const result = await graphqlQuery<GraphQLResponse>(
    GET_PRODUCT_BY_HANDLE,
    {
      handle: [handle],
      pricingContext: {
        region_id: region.id,
        currency_code: region.currency_code,
      },
    },
    {}
  )

  return result.products.products[0] || null
}

/**
 * SEO OPTIMIZATION: Lightweight query to fetch only metadata (title, image)
 * without triggering heavy pricing calculations (1.2s overhead).
 */
export const getProductSeoData = async ({
  handle,
}: {
  handle: string
}): Promise<{
  title: string
  thumbnail: string | null
  handle: string
} | null> => {
  const { graphqlQuery } = await import("@lib/graphql")

  const PRODUCT_METADATA_FRAGMENT = `
  fragment ProductMetadataFields on Product {
    id
    title
    handle
    thumbnail
    created_at
    updated_at
  }
`

  const GET_PRODUCT_METADATA = `
  ${PRODUCT_METADATA_FRAGMENT}
  query GetProductMetadata($handle: [String!]!) {
    products(filter: { handle: $handle }, limit: 1) {
      products {
        ...ProductMetadataFields
      }
    }
  }
`

  type GraphQLResponse = {
    products: {
      products: Array<{
        title: string
        thumbnail: string | null
        handle: string
      }>
    }
  }

  const result = await graphqlQuery<GraphQLResponse>(
    GET_PRODUCT_METADATA,
    {
      handle: [handle],
    },
    {},
    {
      tags: ["products"],
    }
  )

  return result.products.products[0] || null
}

/**
 * Get product shell (no variants/pricing) for fast initial render.
 */
export const getProductShell = async ({
  handle,
}: {
  handle: string
}): Promise<Product | null> => {
  const { graphqlQuery, GET_PRODUCT_SHELL } = await import("@lib/graphql")

  type GraphQLResponse = {
    products: {
      products: Product[]
    }
  }

  const result = await graphqlQuery<GraphQLResponse>(
    GET_PRODUCT_SHELL,
    {
      handle: [handle],
    },
    {},
    {
      tags: ["products"],
    }
  )

  return result.products.products[0] || null
}
