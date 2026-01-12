"use server"

import { getCacheOptions } from "./cookies"
import { 
  retrieveCollectionQL, 
  listCollectionsQL, 
  getCollectionByHandleQL 
} from "@lib/graphql-collections"
import { ProductCollection } from "@xclade/types"

export const retrieveCollection = async (id: string) => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  return retrieveCollectionQL(
    id,
    undefined,
    { tags: next.tags }
  )
}

export const listCollections = async (
  queryParams: Record<string, string> = {}
): Promise<{ collections: ProductCollection[]; count: number }> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  const limit = parseInt(queryParams.limit || "100")
  const offset = parseInt(queryParams.offset || "0")
  
  // Extract filters from query params
  const filter: Record<string, any> = { ...queryParams }
  delete filter.limit
  delete filter.offset
  delete filter.fields

  return listCollectionsQL(
    limit,
    offset,
    filter,
    undefined,
    { tags: next.tags }
  )
}

export const getCollectionByHandle = async (
  handle: string
): Promise<ProductCollection> => {
  const next = {
    ...(await getCacheOptions("collections")),
  }

  const collection = await getCollectionByHandleQL(
    handle,
    undefined,
    { tags: next.tags }
  )

  if (!collection) {
    throw new Error(`Collection with handle ${handle} not found`)
  }

  return collection
}

