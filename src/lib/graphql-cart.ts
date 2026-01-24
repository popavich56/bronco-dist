// Cart GraphQL queries and mutations with proper types
import { graphqlQuery } from "./graphql"
import {
  Cart,
  Order,
  PaymentCollection,
  CreateCartInput,
  UpdateCartInput,
  AddCartLineItemInput,
  UpdateCartLineItemInput,
  AddCartShippingMethodInput,
  AddressInput,
  InitializePaymentSessionInput,
} from "@xclade/types"

// Shipping option type (matches GraphQL schema)
export type ShippingOption = {
  id: string
  name: string
  price_type: string
  service_zone_id: string
  shipping_profile_id: string
  provider_id: string
  data?: Record<string, any>
  metadata?: Record<string, any>
  calculated_price?: {
    calculated_amount: number
    is_calculated_price_tax_inclusive: boolean
  }
  // Computed/compatible fields for frontend
  amount?: number
  insufficient_inventory?: boolean
  service_zone?: {
    id: string
    fulfillment_set?: { type: string }
  }
}

// Re-export input types from @xclade/types
// (definitions removed as they are now imported)

// Cart Fragment with all needed fields
const CART_FRAGMENT = `
  fragment CartFields on Cart {
    id
    email
    customer_id
    region_id
    sales_channel_id
    currency_code
    shipping_address_id
    billing_address_id
    metadata
    completed_at
    created_at
    updated_at
    
    # Cart totals - these trigger calculation of line item totals
    total
    subtotal
    tax_total
    discount_total
    item_total
    item_subtotal
    item_tax_total
    original_item_total
    shipping_total
    shipping_tax_total
    
    shipping_address {
      id
      first_name
      last_name
      company
      address_1
      address_2
      city
      country_code
      province
      postal_code
      phone
    }
    billing_address {
      id
      first_name
      last_name
      company
      address_1
      address_2
      city
      country_code
      province
      postal_code
      phone
    }
    items {
      id
      title
      subtitle
      thumbnail
      quantity
      variant_id
      product_id
      product_title
      product_handle
      variant_sku
      variant_title
      unit_price
      compare_at_unit_price
      subtotal
      total
      original_total
      discount_total
      tax_total
      is_discountable
      is_giftcard
      requires_shipping
      metadata
      variant {
        id
        title
        sku
        barcode
        manage_inventory
        allow_backorder
        options {
          id
          value
          option {
            id
            title
          }
        }
        product {
          id
          title
          handle
          thumbnail
        }
      }
    }
    shipping_methods {
      id
      name
      amount
      is_tax_inclusive
      shipping_option_id
    }
    region {
      id
      name
      currency_code
      countries {
        iso_2
        display_name
      }
    }
    promotions {
      id
      code
      type
      is_automatic
      campaign_id
      application_method {
        id
        type
        target_type
        allocation
        value
        currency_code
        max_quantity
      }
    }
    payment_collection {
      id
      amount
      status
      payment_sessions {
        id
        amount
        provider_id
        status
        data
      }
    }
  }
`

// Minimal checkout cart fragment (for payment button only)
const CHECKOUT_CART_FRAGMENT = `
  fragment CheckoutCartFields on Cart {
    id
    email
    shipping_address {
      id
      first_name
      last_name
    }
    billing_address {
      id
      first_name
      last_name
    }
    shipping_methods {
      id
      name
    }
    payment_collection {
      id
      status
      payment_sessions {
        id
        status
        provider_id
      }
    }
  }
`

// Mini Cart Fragment (for header dropdown) - Excludes payment/shipping for performance
const MINI_CART_FRAGMENT = `
  fragment MiniCartFields on Cart {
    id
    customer_id
    items {
      id
      quantity
    }
  }
`

// Query: Get Cart by ID
const GET_CART = `
  ${CART_FRAGMENT}
  query GetCart($id: ID!) {
    cart(id: $id) {
      ...CartFields
    }
  }
`

// Query: Get Mini Cart by ID (Optimized)
const GET_MINI_CART = `
  ${MINI_CART_FRAGMENT}
  query GetMiniCart($id: ID!) {
    cart(id: $id) {
      ...MiniCartFields
    }
  }
`

// Query: Get Cart for Checkout (lightweight)
const GET_CHECKOUT_CART = `
  ${CHECKOUT_CART_FRAGMENT}
  query GetCheckoutCart($id: ID!) {
    cart(id: $id) {
      ...CheckoutCartFields
    }
  }
`

// Query: Get Active Customer Cart
const GET_ACTIVE_CUSTOMER_CART = `
  ${CART_FRAGMENT}
  query GetActiveCustomerCart {
    activeCustomerCart {
      ...CartFields
    }
  }
`

// Mutation: Create Cart
const CREATE_CART = `
  ${CART_FRAGMENT}
  mutation CreateCart($input: CreateCartInput!) {
    createCart(input: $input) {
      ...CartFields
    }
  }
`

// Mutation: Update Cart
const UPDATE_CART = `
  ${CART_FRAGMENT}
  mutation UpdateCart($id: ID!, $input: UpdateCartInput!) {
    updateCart(id: $id, input: $input) {
      ...CartFields
    }
  }
`

// Mutation: Add Line Item
// Mutation: Add Line Item
// Level 4 Optimization: Return only ID to bypass backend calculation tax (Verified Dec 2025)
const ADD_CART_LINE_ITEM = `
  mutation AddCartLineItem($cartId: ID!, $input: AddCartLineItemInput!) {
    addCartLineItem(cartId: $cartId, input: $input) {
      id 
    }
  }
`

// Mutation: Update Line Item
const UPDATE_CART_LINE_ITEM = `
  ${CART_FRAGMENT}
  mutation UpdateCartLineItem($cartId: ID!, $lineId: ID!, $input: UpdateCartLineItemInput!) {
    updateCartLineItem(cartId: $cartId, lineId: $lineId, input: $input) {
      ...CartFields
    }
  }
`

// Query: List Shipping Options for Cart (with calculated prices)
const LIST_SHIPPING_OPTIONS = `
  query ListShippingOptions($cartId: ID!) {
    shippingOptions(cartId: $cartId) {
      shipping_options {
        id
        name
        price_type
        service_zone_id
        shipping_profile_id
        provider_id
        data
        metadata
        calculated_price {
          calculated_amount
          is_calculated_price_tax_inclusive
        }
      }
      count
    }
  }
`

// Query: Calculate Shipping Option Price
const CALCULATE_SHIPPING_OPTION = `
  query CalculateShippingOption($shippingOptionId: ID!, $cartId: ID!) {
    calculateShippingOption(shippingOptionId: $shippingOptionId, cartId: $cartId) {
      id
      name
      amount
      is_tax_inclusive
      data
    }
  }
`

// Mutation: Remove Line Item
// Level 4 Optimization: Return only ID to bypass backend calculation tax (Verified Dec 2025)
const REMOVE_CART_LINE_ITEM = `
  mutation RemoveCartLineItem($cartId: ID!, $lineId: ID!) {
    removeCartLineItem(cartId: $cartId, lineId: $lineId) {
      id
    }
  }
`

// Mutation: Add Shipping Method
// Mutation: Add Shipping Method
// Level 4 Optimization: Return only ID to bypass backend calculation tax (Verified Dec 2025)
const ADD_CART_SHIPPING_METHOD = `
  mutation AddCartShippingMethod($cartId: ID!, $input: AddCartShippingMethodInput!) {
    addCartShippingMethod(cartId: $cartId, input: $input) {
      id 
    }
  }
`

// Mutation: Add Promotions
const ADD_CART_PROMOTIONS = `
  ${CART_FRAGMENT}
  mutation AddCartPromotions($cartId: ID!, $promoCodes: [String!]!) {
    addCartPromotions(cartId: $cartId, promoCodes: $promoCodes) {
      ...CartFields
    }
  }
`

// Mutation: Remove Promotions
const REMOVE_CART_PROMOTIONS = `
  ${CART_FRAGMENT}
  mutation RemoveCartPromotions($cartId: ID!) {
    removeCartPromotions(cartId: $cartId) {
      ...CartFields
    }
  }
`

// Mutation: Update Cart Customer
const UPDATE_CART_CUSTOMER = `
  ${CART_FRAGMENT}
  mutation UpdateCartCustomer($cartId: ID!) {
    updateCartCustomer(cartId: $cartId) {
      ...CartFields
    }
  }
`

// Mutation: Complete Cart (creates order)
const COMPLETE_CART = `
  mutation CompleteCart($cartId: ID!) {
    completeCart(cartId: $cartId) {
      id
      display_id
      status
      email
      currency_code
      shipping_address {
        country_code
      }
    }
  }
`

// Mutation: Create Payment Collection
const CREATE_PAYMENT_COLLECTION = `
  mutation CreatePaymentCollection($cartId: ID!) {
    createPaymentCollection(cartId: $cartId) {
      id
      status
      amount
    }
  }
`

// Mutation: Initialize Payment Session
const INITIALIZE_PAYMENT_SESSION = `
  mutation InitializePaymentSession($paymentCollectionId: ID!, $input: InitializePaymentSessionInput!) {
    initializePaymentSession(paymentCollectionId: $paymentCollectionId, input: $input) {
      id
      status
      payment_sessions {
        id
        provider_id
        amount
        status
        data
      }
    }
  }
`

// Typed GraphQL helper functions
export async function getCartQL(
  id: string,
  headers?: Record<string, string>,
  cacheTags?: string[]
): Promise<Cart | null> {
  const data = await graphqlQuery<{ cart: Cart | null }>(
    GET_CART,
    { id },
    headers,
    cacheTags ? { tags: cacheTags } : { revalidate: 0 } // No cache by default for cart queries
  )
  return data.cart
}

export async function getCheckoutCartQL(
  id: string,
  headers?: Record<string, string>
): Promise<Cart | null> {
  const data = await graphqlQuery<{ cart: Cart | null }>(
    GET_CHECKOUT_CART,
    { id },
    headers,
    { revalidate: 0 }
  )
  return data.cart
}

export async function getMiniCartQL(
  id: string,
  headers?: Record<string, string>,
  cacheTags?: string[]
): Promise<Cart | null> {
  const data = await graphqlQuery<{ cart: Cart | null }>(
    GET_MINI_CART,
    { id },
    headers,
    cacheTags ? { tags: cacheTags } : { revalidate: 0 }
  )
  return data.cart
}

export async function createCartQL(
  input: CreateCartInput,
  headers?: Record<string, string>
): Promise<Cart> {
  const data = await graphqlQuery<{ createCart: Cart }>(
    CREATE_CART,
    { input },
    headers,
    { revalidate: 0 } // Don't cache mutations
  )
  return data.createCart
}

export async function updateCartQL(
  id: string,
  input: UpdateCartInput,
  headers?: Record<string, string>
): Promise<Cart> {
  const data = await graphqlQuery<{ updateCart: Cart }>(
    UPDATE_CART,
    { id, input },
    headers,
    { revalidate: 0 } // Don't cache mutations
  )
  return data.updateCart
}

export async function addCartLineItemQL(
  cartId: string,
  input: AddCartLineItemInput,
  headers?: Record<string, string>
): Promise<Cart> {
  const data = await graphqlQuery<{ addCartLineItem: Cart }>(
    ADD_CART_LINE_ITEM,
    { cartId, input },
    headers,
    { revalidate: 0 } // Don't cache mutations
  )
  return data.addCartLineItem
}

export async function updateCartLineItemQL(
  cartId: string,
  lineId: string,
  input: UpdateCartLineItemInput,
  headers?: Record<string, string>
): Promise<Cart> {
  const data = await graphqlQuery<{ updateCartLineItem: Cart }>(
    UPDATE_CART_LINE_ITEM,
    { cartId, lineId, input },
    headers,
    { revalidate: 0 } // Don't cache mutations
  )
  return data.updateCartLineItem
}

export async function removeCartLineItemQL(
  cartId: string,
  lineId: string,
  headers?: Record<string, string>
): Promise<Cart> {
  const data = await graphqlQuery<{ removeCartLineItem: Cart }>(
    REMOVE_CART_LINE_ITEM,
    { cartId, lineId },
    headers,
    { revalidate: 0 } // Don't cache mutations
  )
  return data.removeCartLineItem
}

export async function addCartShippingMethodQL(
  cartId: string,
  input: AddCartShippingMethodInput,
  headers?: Record<string, string>
): Promise<Cart> {
  const data = await graphqlQuery<{ addCartShippingMethod: Cart }>(
    ADD_CART_SHIPPING_METHOD,
    { cartId, input },
    headers
  )
  return data.addCartShippingMethod
}

export async function addCartPromotionsQL(
  cartId: string,
  promoCodes: string[],
  headers?: Record<string, string>
): Promise<Cart> {
  const data = await graphqlQuery<{ addCartPromotions: Cart }>(
    ADD_CART_PROMOTIONS,
    { cartId, promoCodes },
    headers
  )
  return data.addCartPromotions
}

export async function removeCartPromotionsQL(
  cartId: string,
  headers?: Record<string, string>
): Promise<Cart> {
  const data = await graphqlQuery<{ removeCartPromotions: Cart }>(
    REMOVE_CART_PROMOTIONS,
    { cartId },
    headers
  )
  return data.removeCartPromotions
}

export async function updateCartCustomerQL(
  cartId: string,
  headers?: Record<string, string>
): Promise<Cart> {
  const data = await graphqlQuery<{ updateCartCustomer: Cart }>(
    UPDATE_CART_CUSTOMER,
    { cartId },
    headers
  )
  return data.updateCartCustomer
}

export async function completeCartQL(
  cartId: string,
  headers?: Record<string, string>
): Promise<Order> {
  const data = await graphqlQuery<{ completeCart: Order }>(
    COMPLETE_CART,
    { cartId },
    headers
  )
  return data.completeCart
}

export async function listShippingOptionsQL(
  cartId: string,
  headers?: Record<string, string>
): Promise<ShippingOption[]> {
  const data = await graphqlQuery<{
    shippingOptions: { shipping_options: ShippingOption[] }
  }>(
    LIST_SHIPPING_OPTIONS,
    { cartId },
    headers,
    { revalidate: 0 } // Don't cache, prices need to be fresh
  )
  return data.shippingOptions.shipping_options
}

export async function calculateShippingOptionQL(
  shippingOptionId: string,
  cartId: string,
  headers?: Record<string, string>
): Promise<{
  id: string
  name: string
  amount: number
  is_tax_inclusive: boolean
  data?: Record<string, any>
} | null> {
  try {
    const data = await graphqlQuery<{
      calculateShippingOption: {
        id: string
        name: string
        amount: number
        is_tax_inclusive: boolean
        data?: Record<string, any>
      }
    }>(CALCULATE_SHIPPING_OPTION, { shippingOptionId, cartId }, headers, {
      revalidate: 0,
    })
    return data.calculateShippingOption
  } catch (error) {
    console.error("Error calculating shipping option:", error)
    return null
  }
}

export async function createPaymentCollectionQL(
  cartId: string,
  headers?: Record<string, string>
): Promise<PaymentCollection> {
  const data = await graphqlQuery<{
    createPaymentCollection: PaymentCollection
  }>(CREATE_PAYMENT_COLLECTION, { cartId }, headers)
  return data.createPaymentCollection
}

export async function initializePaymentSessionQL(
  paymentCollectionId: string,
  input: InitializePaymentSessionInput,
  headers?: Record<string, string>
): Promise<PaymentCollection> {
  const data = await graphqlQuery<{
    initializePaymentSession: PaymentCollection
  }>(INITIALIZE_PAYMENT_SESSION, { paymentCollectionId, input }, headers)
  return data.initializePaymentSession
}

export async function getActiveCustomerCartQL(
  headers?: Record<string, string>
): Promise<Cart | null> {
  const data = await graphqlQuery<{ activeCustomerCart: Cart | null }>(
    GET_ACTIVE_CUSTOMER_CART,
    {},
    headers,
    { revalidate: 0 }
  )
  return data.activeCustomerCart
}
