"use server"

import { graphqlQuery } from "@lib/graphql"

const CREATE_REVIEW_MUTATION = `
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      status
    }
  }
`

export async function createReview(input: any) {
  return await graphqlQuery(CREATE_REVIEW_MUTATION, { input })
}

const LIST_PRODUCT_REVIEWS_QUERY = `
  query ListProductReviews($productId: String!, $limit: Int, $offset: Int) {
    reviews(filter: { product_id: [$productId] }, limit: $limit, offset: $offset) {
      reviews {
        id
        title
        content
        rating
        first_name
        last_name
        created_at
        customer_id
      }
      count
    }
  }
`

export async function listReviews(productId: string, limit = 5, offset = 0) {
  const result: any = await graphqlQuery(LIST_PRODUCT_REVIEWS_QUERY, { productId, limit, offset })
  return result?.reviews || { reviews: [], count: 0 }
}

const LIST_REVIEWS_QUERY = `
  query ListLatestReviews($limit: Int) {
    reviews(limit: $limit, order: "created_at:DESC") {
      reviews {
        id
        title
        content
        rating
        first_name
        last_name
        created_at
        product {
          title
          thumbnail
          handle
        }
      }
    }
  }
`

export async function listLatestReviews(limit = 3) {
  const result: any = await graphqlQuery(LIST_REVIEWS_QUERY, { limit })
  return result?.reviews?.reviews || []
}
