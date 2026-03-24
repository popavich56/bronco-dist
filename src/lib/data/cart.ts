"use server"

import {
  listShippingOptionsQL,
  completeCartQL,
  createPaymentCollectionQL,
  initializePaymentSessionQL,
  getCartQL,
  getCheckoutCartQL,
  createCartQL,
  updateCartQL,
  addCartLineItemQL,
  updateCartLineItemQL,
  removeCartLineItemQL,
  addCartShippingMethodQL,
  addCartPromotionsQL,
  getMiniCartQL,
} from "@lib/graphql-cart"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheTag,
  getCartId,
  removeCartId,
  setCartId,
} from "./cookies"
import { getRegion } from "./regions"
import { retrieveCustomer } from "./customer"
import { isApprovedCustomer } from "@lib/util/customer-status"
import {
  Cart,
  UpdateCartInput,
  InitializePaymentSessionInput,
} from "@xclade/types"

const APPROVAL_ERROR = "Account not approved for purchasing"

async function requireApprovedCustomer() {
  if (process.env.NEXT_PUBLIC_BYPASS_WHOLESALE_GATE === "true") return null
  const customer = await retrieveCustomer()
  if (!isApprovedCustomer(customer)) {
    return { error: APPROVAL_ERROR }
  }
  return null
}

/**
 * Retrieves a cart by its ID. If no ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to retrieve.
 * @returns The cart object if found, or null if not found.
 */
export async function retrieveCart(cartId?: string, fields?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartCacheTag = await getCacheTag("carts")
  const cacheTags = cartCacheTag ? [cartCacheTag] : undefined

  try {
    return await getCartQL(id, headers, cacheTags)
  } catch (error) {
    console.error("Error retrieving cart:", error)
    return null
  }
}

export async function retrieveCheckoutCart(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    return await getCheckoutCartQL(id, headers)
  } catch (error) {
    console.error("Error retrieving checkout cart:", error)
    return null
  }
}

export async function retrieveMiniCart(cartId?: string) {
  const id = cartId || (await getCartId())

  if (!id) {
    return null
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const cartCacheTag = await getCacheTag("carts")
  const cacheTags = cartCacheTag ? [cartCacheTag] : undefined

  try {
    return await getMiniCartQL(id, headers, cacheTags)
  } catch (error) {
    console.error("Error retrieving mini cart:", error)
    return null
  }
}

export async function getOrSetCart(countryCode: string) {
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  let cart = await retrieveCart()

  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cart) {
    cart = await createCartQL(
      {
        region_id: region.id,
        currency_code: region.currency_code,
      },
      headers
    )

    await setCartId(cart.id)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  if (cart && cart?.region_id !== region.id) {
    cart = await updateCartQL(cart.id, { region_id: region.id }, headers)
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  return cart
}

export async function updateCart(data: UpdateCartInput) {
  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found, please create one before updating")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const cart = await updateCartQL(cartId, data as any, headers)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)

    return cart
  } catch (error: any) {
    console.error("Error updating cart:", error)
    return { error: error.message }
  }
}

export async function addToCart({
  variantId,
  quantity,
  countryCode,
}: {
  variantId: string
  quantity: number
  countryCode: string
}) {
  const guard = await requireApprovedCustomer()
  if (guard) return guard

  if (!variantId) {
    throw new Error("Missing variant ID when adding to cart")
  }

  const cart = await getOrSetCart(countryCode)

  if (!cart) {
    throw new Error("Error retrieving or creating cart")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await addCartLineItemQL(
      cart.id,
      {
        variant_id: variantId,
        quantity,
      },
      headers
    )

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)
  } catch (error: any) {
    console.error("Error adding to cart:", error)
    return { error: error.message }
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  const guard = await requireApprovedCustomer()
  if (guard) return guard

  if (!lineId) {
    throw new Error("Missing lineItem ID when updating line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when updating line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await updateCartLineItemQL(cartId, lineId, { quantity }, headers)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)
  } catch (error: any) {
    console.error("Error updating line item:", error)
    return { error: error.message }
  }
}

export async function deleteLineItem(lineId: string) {
  const guard = await requireApprovedCustomer()
  if (guard) return guard

  if (!lineId) {
    throw new Error("Missing lineItem ID when deleting line item")
  }

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("Missing cart ID when deleting line item")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await removeCartLineItemQL(cartId, lineId, headers)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)
  } catch (error: any) {
    console.error("Error deleting line item:", error)
    return { error: error.message }
  }
}

export async function setShippingMethod({
  cartId,
  shippingMethodId,
}: {
  cartId: string
  shippingMethodId: string
}) {
  const guard = await requireApprovedCustomer()
  if (guard) return guard

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await addCartShippingMethodQL(
      cartId,
      { option_id: shippingMethodId },
      headers
    )

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  } catch (error: any) {
    console.error("Error setting shipping method:", error)
    return { error: error.message }
  }
}

export async function initiatePaymentSession(
  cart: Cart,
  data: InitializePaymentSessionInput
) {
  const guard = await requireApprovedCustomer()
  if (guard) return guard

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    let paymentCollectionId = cart.payment_collection?.id

    // Create payment collection if it doesn't exist
    if (!paymentCollectionId) {
      const pc = await createPaymentCollectionQL(cart.id, headers)
      paymentCollectionId = pc.id
    }

    const resp = await initializePaymentSessionQL(
      paymentCollectionId,
      {
        provider_id: data.provider_id,
        data: data.data || {},
      },
      headers
    )

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
    return resp
  } catch (error: any) {
    console.error("Error initiating payment session:", error)
    return { error: error.message }
  }
}

export async function applyPromotions(codes: string[]) {
  const guard = await requireApprovedCustomer()
  if (guard) return guard

  const cartId = await getCartId()

  if (!cartId) {
    throw new Error("No existing cart found")
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await addCartPromotionsQL(cartId, codes, headers)

    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)

    const fulfillmentCacheTag = await getCacheTag("fulfillment")
    revalidateTag(fulfillmentCacheTag)
  } catch (error: any) {
    console.error("Error applying promotions:", error)
    return { error: error.message }
  }
}

export async function applyGiftCard(code: string) {
  // Gift card logic to be implemented via GraphQL mutation
}

export async function removeDiscount(code: string) {
  // Discount removal logic to be implemented via GraphQL mutation
}

export async function removeGiftCard(codeToRemove: string, giftCards: any[]) {
  // Gift card removal logic to be implemented via GraphQL mutation
}

export async function submitPromotionForm(
  currentState: unknown,
  formData: FormData
) {
  const code = formData.get("code") as string
  try {
    return await applyPromotions([code])
  } catch (e: any) {
    return e.message
  }
}

export async function setAddresses(currentState: unknown, formData: FormData) {
  const guard = await requireApprovedCustomer()
  if (guard) return APPROVAL_ERROR

  try {
    if (!formData) {
      throw new Error("No form data found when setting addresses")
    }
    const cartId = await getCartId()
    if (!cartId) {
      throw new Error("No existing cart found when setting addresses")
    }

    const data: UpdateCartInput = {
      shipping_address: {
        first_name: formData.get("shipping_address.first_name") as string,
        last_name: formData.get("shipping_address.last_name") as string,
        address_1: formData.get("shipping_address.address_1") as string,
        address_2: formData.get("shipping_address.address_2") as string,
        company: formData.get("shipping_address.company") as string,
        postal_code: formData.get("shipping_address.postal_code") as string,
        city: formData.get("shipping_address.city") as string,
        country_code: formData.get("shipping_address.country_code") as string,
        province: formData.get("shipping_address.province") as string,
        phone: formData.get("shipping_address.phone") as string,
      },
      email: formData.get("email") as string,
    }

    const sameAsBilling = formData.get("same_as_billing")
    if (sameAsBilling === "on") data.billing_address = data.shipping_address

    if (sameAsBilling !== "on")
      data.billing_address = {
        first_name: formData.get("billing_address.first_name") as string,
        last_name: formData.get("billing_address.last_name") as string,
        address_1: formData.get("billing_address.address_1") as string,
        address_2: formData.get("billing_address.address_2") as string,
        company: formData.get("billing_address.company") as string,
        postal_code: formData.get("billing_address.postal_code") as string,
        city: formData.get("billing_address.city") as string,
        country_code: formData.get("billing_address.country_code") as string,
        province: formData.get("billing_address.province") as string,
        phone: formData.get("billing_address.phone") as string,
      }
    const result = await updateCart(data)
    if ((result as any)?.error) {
      throw new Error((result as any).error)
    }
  } catch (e: any) {
    return e.message
  }

  redirect(
    `/${formData.get("shipping_address.country_code")}/checkout?step=delivery`
  )
}

/**
 * Places an order for a cart. If no cart ID is provided, it will use the cart ID from the cookies.
 * @param cartId - optional - The ID of the cart to place an order for.
 * @returns The cart object if the order was successful, or null if not.
 */
export async function placeOrder(cartId?: string) {
  const guard = await requireApprovedCustomer()
  if (guard) return guard

  const id = cartId || (await getCartId())

  if (!id) {
    return {
      success: false,
      error: "No existing cart found when placing an order",
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const order = await completeCartQL(id, headers)

    if (order) {
      const countryCode = order.shipping_address?.country_code?.toLowerCase()

      const orderCacheTag = await getCacheTag("orders")
      revalidateTag(orderCacheTag)

      await removeCartId()
      redirect(`/${countryCode}/order/${order.id}/confirmed`)
    }

    return { success: true, order }
  } catch (error: any) {
    if (
      error.message === "NEXT_REDIRECT" ||
      error?.digest?.includes("NEXT_REDIRECT")
    ) {
      throw error
    }

    return {
      success: false,
      error: error.message || "An unexpected error occurred during checkout",
    }
  }
}

/**
 * Updates the countrycode param and revalidates the regions cache
 * @param regionId
 * @param countryCode
 */
export async function updateRegion(countryCode: string, currentPath: string) {
  const cartId = await getCartId()
  const region = await getRegion(countryCode)

  if (!region) {
    throw new Error(`Region not found for country code: ${countryCode}`)
  }

  if (cartId) {
    await updateCart({ region_id: region.id })
    const cartCacheTag = await getCacheTag("carts")
    revalidateTag(cartCacheTag)
  }

  const regionCacheTag = await getCacheTag("regions")
  revalidateTag(regionCacheTag)

  const productsCacheTag = await getCacheTag("products")
  revalidateTag(productsCacheTag)

  redirect(`/${countryCode}${currentPath}`)
}

export async function listCartOptions() {
  const cartId = await getCartId()
  const headers = {
    ...(await getAuthHeaders()),
  }

  if (!cartId) return null

  return await listShippingOptionsQL(cartId, headers)
}
