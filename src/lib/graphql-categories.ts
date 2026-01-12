// Product Categories GraphQL queries
import { graphqlQuery } from "./graphql"
import { ProductCategory } from "@xclade/types"
// Essential fields for navigation/links (Super Light)
const CATEGORY_FIELDS_NAV = `
  id
  name
  handle
  rank
`

// Full fields for the primary category being viewed
const CATEGORY_FIELDS_DETAIL = `
  description
  is_active
  is_internal
  metadata
  created_at
  updated_at
  product_category_image {
    url
    type
  }
`

// Fragment for parent category structure (Breadcrumbs: Name/Handle ONLY)
const PARENT_CATEGORY_FRAGMENT = `
  fragment ParentCategoryFields on ProductCategory {
    ${CATEGORY_FIELDS_NAV}
    parent_category {
      ${CATEGORY_FIELDS_NAV}
      parent_category {
        ${CATEGORY_FIELDS_NAV}
      }
    }
  }
`

// Fragment for category children (Nav: Name/Handle ONLY)
const CATEGORY_CHILDREN_FRAGMENT = `
  fragment CategoryChildrenFields on ProductCategory {
    category_children {
      ${CATEGORY_FIELDS_NAV}
      category_children {
        ${CATEGORY_FIELDS_NAV}
      }
    }
  }
`

// Main Category Fragment (Full detail for root, Light for branches)
const CATEGORY_FRAGMENT = `
  fragment CategoryFields on ProductCategory {
    ${CATEGORY_FIELDS_NAV}
    ${CATEGORY_FIELDS_DETAIL}
    ...ParentCategoryFields
    ...CategoryChildrenFields
  }
`


// Query: List Product Categories (Optimized for Nav)
export const LIST_NAV_CATEGORIES = `
  query ListNavCategories {
    productCategories(
      filters: { parent_category_id: null, is_active: true, is_internal: false }, 
      limit: 100
    ) {
      product_categories {
        id
        name
        handle
        category_children {
          id
          name
          handle
        }
      }
    }
  }
`

// Query: List Product Categories
export const LIST_PRODUCT_CATEGORIES = `
  ${PARENT_CATEGORY_FRAGMENT}
  ${CATEGORY_CHILDREN_FRAGMENT}
  ${CATEGORY_FRAGMENT}
  query ListProductCategories($limit: Int, $offset: Int, $filters: ProductCategoryFilters) {
    productCategories(limit: $limit, offset: $offset, filters: $filters) {
      product_categories {
        ...CategoryFields
      }
      count
      offset
      limit
    }
  }
`

// Query: Get Product Category by Handle (using list with filter)
// Query: Get Product Category by Handle (Optimized)
// Fetches full details for the category, recursive parents for breadcrumbs, 
// but ONLY direct children for navigation (no grandchildren)
export const GET_PRODUCT_CATEGORY_BY_HANDLE = `
  ${PARENT_CATEGORY_FRAGMENT}
  fragment CategoryFieldsLight on ProductCategory {
    ${CATEGORY_FIELDS_NAV}
    ${CATEGORY_FIELDS_DETAIL}
    ...ParentCategoryFields
    category_children {
       id
       name
       handle
       description
    }
  }
  query GetProductCategoryByHandle($handle: [String!]) {
    productCategories(filters: { handle: $handle }, limit: 1) {
      product_categories {
        ...CategoryFieldsLight
      }
    }
  }
`

/**
 * List product categories via GraphQL
 */
export async function listProductCategoriesQL(
  limit: number = 100,
  offset: number = 0,
  filters?: Record<string, any>,
  headers?: Record<string, string>,
  options?: { tags?: string[]; revalidate?: number | false }
): Promise<ProductCategory[]> {
  const data = await graphqlQuery<{
    productCategories: { product_categories: ProductCategory[] }
  }>(
    LIST_PRODUCT_CATEGORIES,
    { limit, offset, filters },
    headers,
    options
  )
  return data.productCategories.product_categories
}

/**
 * List nav product categories via GraphQL
 */
export async function listNavCategoriesQL(
  headers?: Record<string, string>,
  options?: { tags?: string[]; revalidate?: number | false }
): Promise<ProductCategory[]> {
  const data = await graphqlQuery<{
    productCategories: { product_categories: ProductCategory[] }
  }>(
    LIST_NAV_CATEGORIES,
    {},
    headers,
    options
  )
  return data.productCategories.product_categories
}

/**
 * Get product category by handle via GraphQL
 */
export async function getProductCategoryByHandleQL(
  handle: string,
  headers?: Record<string, string>,
  options?: { tags?: string[]; revalidate?: number | false }
): Promise<ProductCategory | null> {
  const data = await graphqlQuery<{
    productCategories: { product_categories: ProductCategory[] }
  }>(
    GET_PRODUCT_CATEGORY_BY_HANDLE,
    { handle: [handle] },
    headers,
    options
  )
  return data.productCategories.product_categories[0] || null
}
