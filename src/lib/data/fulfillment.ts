"use server"

import { getAuthHeaders } from "./cookies"
import { 
  listShippingOptionsQL, 
  calculateShippingOptionQL,
  ShippingOption 
} from "@lib/graphql-cart"

/**
 * List available shipping methods for a cart using GraphQL
 * Maps GraphQL response to include fields expected by frontend components
 */
export const listCartShippingMethods = async (
  cartId: string
): Promise<ShippingOption[] | null> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const options = await listShippingOptionsQL(cartId, headers)
    
    // Map to include amount field for frontend compatibility
    return options.map(opt => ({
      ...opt,
      amount: opt.calculated_price?.calculated_amount ?? 0,
      service_zone: opt.service_zone_id ? { id: opt.service_zone_id } : undefined,
    }))
  } catch (error) {
    console.error("Error listing shipping methods via GraphQL:", error)
    return null
  }
}

/**
 * Calculate price for a specific shipping option using GraphQL
 * Note: The 'data' parameter is not currently used by the backend GraphQL resolver
 */
export const calculatePriceForShippingOption = async (
  optionId: string,
  cartId: string,
  data?: Record<string, unknown>
) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const result = await calculateShippingOptionQL(optionId, cartId, headers)
    
    if (!result) {
      return null
    }

    // Return in the format expected by frontend components
    return {
      id: result.id,
      name: result.name,
      amount: result.amount,
      is_tax_inclusive: result.is_tax_inclusive,
      data: result.data,
    }
  } catch (error) {
    console.error("Error calculating shipping option price via GraphQL:", error)
    return null
  }
}
