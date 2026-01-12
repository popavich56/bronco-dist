// Collections GraphQL queries
import { graphqlQuery } from "./graphql"
import { ProductCollection } from "@xclade/types"

// Collection Fragment
const COLLECTION_FRAGMENT = `
  fragment CollectionFields on ProductCollection {
    id
    title
    handle
    metadata
    created_at
    updated_at
    products {
      id
      title
      handle
      thumbnail
      id
      title
      handle
      thumbnail
    }
  }
`

// Query: Get Collection by ID
export const GET_COLLECTION = `
  ${COLLECTION_FRAGMENT}
  query GetCollection($id: ID!) {
    collection(id: $id) {
      ...CollectionFields
    }
  }
`

// Query: Get Collection by Handle
export const GET_COLLECTION_BY_HANDLE = `
  ${COLLECTION_FRAGMENT}
  query GetCollectionByHandle($handle: String!) {
    collectionByHandle(handle: $handle) {
      ...CollectionFields
    }
  }
`

// Query: List Collections
export const LIST_COLLECTIONS = `
  ${COLLECTION_FRAGMENT}
  query ListCollections($limit: Int, $offset: Int, $filter: CollectionFilterInput) {
    collections(limit: $limit, offset: $offset, filter: $filter) {
      collections {
        ...CollectionFields
      }
      count
      offset
      limit
    }
  }
`

/**
 * Retrieve a collection by ID via GraphQL
 */
export async function retrieveCollectionQL(
  id: string,
  headers?: Record<string, string>,
  options?: { tags?: string[]; revalidate?: number | false }
): Promise<ProductCollection | null> {
  const data = await graphqlQuery<{ collection: ProductCollection }>(
    GET_COLLECTION,
    { id },
    headers,
    options
  )
  return data.collection
}

/**
 * Retrieve a collection by Handle via GraphQL
 */
export async function getCollectionByHandleQL(
  handle: string,
  headers?: Record<string, string>,
  options?: { tags?: string[]; revalidate?: number | false }
): Promise<ProductCollection | null> {
  const data = await graphqlQuery<{ collectionByHandle: ProductCollection }>(
    GET_COLLECTION_BY_HANDLE,
    { handle },
    headers,
    options
  )
  return data.collectionByHandle
}

/**
 * List collections via GraphQL
 */
export async function listCollectionsQL(
  limit: number = 100,
  offset: number = 0,
  filter?: Record<string, any>,
  headers?: Record<string, string>,
  options?: { tags?: string[]; revalidate?: number | false }
): Promise<{ collections: ProductCollection[]; count: number }> {
  const data = await graphqlQuery<{
    collections: { collections: ProductCollection[]; count: number }
  }>(
    LIST_COLLECTIONS,
    { limit, offset, filter },
    headers,
    options
  )
  return data.collections
}
