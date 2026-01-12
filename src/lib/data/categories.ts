
import { getCacheOptions } from "./cookies"
import { listProductCategoriesQL, getProductCategoryByHandleQL } from "@lib/graphql-categories"
import { ProductCategory } from "@xclade/types" 

export const listCategories = async (query?: Record<string, any>) => {
  const next = {
    ...(await getCacheOptions("categories")),
  }

  const limit = query?.limit || 100
  const offset = query?.offset || 0
  
  // Clean query params to use as filters
  const filters = { ...query }
  delete filters.limit
  delete filters.offset
  delete filters.fields

  return listProductCategoriesQL(
    limit,
    offset,
    filters,
    undefined,
    { tags: next.tags }
  )
}

export const listNavCategories = async () => {
  const { listNavCategoriesQL } = await import("@lib/graphql-categories")
  // Use static cache tags to avoid dynamic cookie reads
  return listNavCategoriesQL(undefined, { tags: ["categories"], revalidate: 3600 })
}

export const getCategoryByHandle = async (categoryHandle: string[]) => {
  const handle = `${categoryHandle.join("/")}`

  const next = {
    ...(await getCacheOptions("categories")),
  }

  return getProductCategoryByHandleQL(
    handle,
    undefined,
    { tags: next.tags }
  )
}

