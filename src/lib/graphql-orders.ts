// Order GraphQL mutations and queries
import { graphqlQuery, ORDER_FRAGMENT } from "./graphql"
import { Order } from "@xclade/types"

// Mutation: Request Order Transfer
export const REQUEST_ORDER_TRANSFER = `
  ${ORDER_FRAGMENT}
  mutation RequestOrderTransfer($orderId: ID!) {
    requestOrderTransfer(orderId: $orderId) {
      ...OrderFields
    }
  }
`

// Mutation: Accept Order Transfer
export const ACCEPT_ORDER_TRANSFER = `
  ${ORDER_FRAGMENT}
  mutation AcceptOrderTransfer($orderId: ID!, $token: String!) {
    acceptOrderTransfer(orderId: $orderId, token: $token) {
      ...OrderFields
    }
  }
`

// Mutation: Decline Order Transfer
export const DECLINE_ORDER_TRANSFER = `
  ${ORDER_FRAGMENT}
  mutation DeclineOrderTransfer($orderId: ID!, $token: String!) {
    declineOrderTransfer(orderId: $orderId, token: $token) {
      ...OrderFields
    }
  }
`

/**
 * Request an order transfer via GraphQL
 */
export async function requestOrderTransferQL(
  orderId: string,
  headers?: Record<string, string>
): Promise<{ order: Order } | { error: any }> {
  try {
    const data = await graphqlQuery<{ requestOrderTransfer: Order }>(
      REQUEST_ORDER_TRANSFER,
      { orderId },
      headers
    )
    return { order: data.requestOrderTransfer }
  } catch (error) {
    return { error }
  }
}

/**
 * Accept an order transfer via GraphQL
 */
export async function acceptOrderTransferQL(
  orderId: string,
  token: string,
  headers?: Record<string, string>
): Promise<{ order: Order } | { error: any }> {
  try {
    const data = await graphqlQuery<{ acceptOrderTransfer: Order }>(
      ACCEPT_ORDER_TRANSFER,
      { orderId, token },
      headers
    )
    return { order: data.acceptOrderTransfer }
  } catch (error) {
    return { error }
  }
}

/**
 * Decline an order transfer via GraphQL
 */
export async function declineOrderTransferQL(
  orderId: string,
  token: string,
  headers?: Record<string, string>
): Promise<{ order: Order } | { error: any }> {
  try {
    const data = await graphqlQuery<{ declineOrderTransfer: Order }>(
      DECLINE_ORDER_TRANSFER,
      { orderId, token },
      headers
    )
    return { order: data.declineOrderTransfer }
  } catch (error) {
    return { error }
  }
}
