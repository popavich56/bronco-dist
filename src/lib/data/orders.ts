"use server"

import { getAuthHeaders, getCacheOptions } from "./cookies"
import { Order } from "@xclade/types"
import { graphqlQuery, GET_ORDER, LIST_ORDERS } from "@lib/graphql"
import {
  requestOrderTransferQL,
  acceptOrderTransferQL,
  declineOrderTransferQL,
} from "@lib/graphql-orders"

export const retrieveOrder = async (id: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  try {
    const data = await graphqlQuery<{ order: Order }>(
      GET_ORDER,
      { id },
      headers,
      { tags: next.tags }
    )
    return data.order
  } catch (error) {
    console.error("Error retrieving order:", error)
    return null
  }
}

export const listOrders = async (limit: number = 10, offset: number = 0) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("orders")),
  }

  try {
    const data = await graphqlQuery<{
      orders: { orders: Order[]; count: number }
    }>(LIST_ORDERS, { limit, offset }, headers, { tags: next.tags })
    return data.orders.orders
  } catch (error) {
    console.error("Error listing orders:", error)
    return []
  }
}

export const createTransferRequest = async (
  state: {
    success: boolean
    error: string | null
    order: Order | null
  },
  formData: FormData
): Promise<{
  success: boolean
  error: string | null
  order: Order | null
}> => {
  const id = formData.get("order_id") as string

  if (!id) {
    return { success: false, error: "Order ID is required", order: null }
  }

  const headers = await getAuthHeaders()

  try {
    const result = await requestOrderTransferQL(id, headers)

    if ("error" in result) {
      return {
        success: false,
        error: result.error.message || "Failed to request transfer",
        order: null,
      }
    }

    return {
      success: true,
      error: null,
      order: result.order as unknown as Order,
    }
  } catch (error: any) {
    console.error("Error creating transfer request:", error)
    return { success: false, error: error.message, order: null }
  }
}

export const acceptTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  try {
    const result = await acceptOrderTransferQL(id, token, headers)

    if ("error" in result) {
      return {
        success: false,
        error: result.error.message || "Failed to accept transfer",
        order: null,
      }
    }

    return { success: true, error: null, order: result.order }
  } catch (error: any) {
    console.error("Error accepting transfer request:", error)
    return { success: false, error: error.message, order: null }
  }
}

export const declineTransferRequest = async (id: string, token: string) => {
  const headers = await getAuthHeaders()

  try {
    const result = await declineOrderTransferQL(id, token, headers)

    if ("error" in result) {
      return {
        success: false,
        error: result.error.message || "Failed to decline transfer",
        order: null,
      }
    }

    return { success: true, error: null, order: result.order }
  } catch (error: any) {
    console.error("Error declining transfer request:", error)
    return { success: false, error: error.message, order: null }
  }
}
