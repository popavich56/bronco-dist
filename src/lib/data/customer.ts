"use server"

import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
  setCartId,
} from "./cookies"
import { updateCartCustomerQL, getActiveCustomerCartQL } from "@lib/graphql-cart"
import { 
  updateCustomerQL, 
  addCustomerAddressQL, 
  updateCustomerAddressQL, 
  deleteCustomerAddressQL,
  getCurrentCustomerQL,
  registerCustomerQL,
  loginQL,
  CustomerAddressInput
} from "@lib/graphql-auth"
import { Customer } from "@xclade/types"

export const retrieveCustomer =
  async (): Promise<Customer | null> => {
    const authHeaders = await getAuthHeaders()

    // Check if we actually have an authorization header
    if (!("authorization" in authHeaders)) {
      return null
    }

    const headers = {
      ...authHeaders,
    }

    try {
      const customer = await getCurrentCustomerQL(headers)
      return customer as unknown as Customer
    } catch (error) {
      console.error("[RETRIEVE_CUSTOMER] Error retrieving customer:", error)
      return null
    }
  };

export const getCustomer = retrieveCustomer

export const updateCustomer = async (body: any) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    const customer = await updateCustomerQL(body, headers)
    
    if (!customer) {
      throw new Error("Failed to update customer")
    }

    const cacheTag = await getCacheTag("customers")
    revalidateTag(cacheTag)

    return customer
  } catch (error: any) {
    console.error("Error updating customer:", error)
    return { error: error.message }
  }
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
    password: password,
    company_name: formData.get("company_name") as string,
    address_1: formData.get("address_1") as string,
    city: formData.get("city") as string,
    state: formData.get("state") as string,
    zip: formData.get("postal_code") as string,
    country_code: formData.get("country_code") as string,
    metadata: {
      account_status: "pending",
      store_type: formData.get("store_type") as string,
      permit_number: formData.get("permit_number") as string,
      permit_expiry: formData.get("permit_expiry") as string,
      permit_file_url: formData.get("permit_file_url") as string,
    },
  }

  try {
    const createdCustomer = await registerCustomerQL(customerForm)

    if (!createdCustomer) {
      throw new Error("Failed to create customer")
    }

    // No auto-login — account is pending approval
    return null
  } catch (error: any) {
    console.error(error)
    return error.toString()
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const countryCode = formData.get("country_code") as string

  try {
    const loginRes = await loginQL(email, password)

    if (!loginRes?.token) {
      throw new Error("Invalid credentials")
    }

    await setAuthToken(loginRes.token)
    
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

  } catch (error: any) {
    if (error.message === 'NEXT_REDIRECT') throw error;
    console.error("[LOGIN] Error during login:", error)
    return error.toString()
  }

  // Try to transfer cart but don't block redirect if it fails
  try {
    await transferCart()

    // If no cart exists after transfer (fresh login), try to find an active cart for this user
    const currentCartId = await getCartId()
    if (!currentCartId) {
      const headers = await getAuthHeaders()
      const activeCart = await getActiveCustomerCartQL(headers)
      
      if (activeCart?.id) {
        await setCartId(activeCart.id)
        const cartCacheTag = await getCacheTag("carts")
        revalidateTag(cartCacheTag)
      }
    }
  } catch (error: any) {
    console.error("[LOGIN] Cart transfer/restore failed:", error)
    // Don't return error - allow redirect to continue
  }

  redirect(`/${countryCode || 'us'}/account`)
}

export async function requestPasswordReset(
  _currentState: unknown,
  formData: FormData
) {
  const email = formData.get("email") as string

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_XCLADE_BACKEND_URL || "http://localhost:9000"
    const apiKey =
      process.env.NEXT_PUBLIC_XCLADE_API_KEY || ""

    await fetch(`${backendUrl}/auth/customer/emailpass/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-publishable-api-key": apiKey,
      },
      body: JSON.stringify({ identifier: email }),
    })
  } catch (error) {
    // Silently catch — never reveal whether the email exists
    console.error("[PASSWORD_RESET] Request error:", error)
  }

  // Always return success to prevent email enumeration
  return { success: true }
}

export async function resetPassword(
  _currentState: unknown,
  formData: FormData
) {
  const token = formData.get("token") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm_password") as string

  if (!token) {
    return "Invalid or missing reset token."
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters."
  }

  if (password !== confirmPassword) {
    return "Passwords do not match."
  }

  try {
    const backendUrl =
      process.env.NEXT_PUBLIC_XCLADE_BACKEND_URL || "http://localhost:9000"
    const apiKey =
      process.env.NEXT_PUBLIC_XCLADE_API_KEY || ""

    const res = await fetch(
      `${backendUrl}/auth/customer/emailpass/update`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": apiKey,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password }),
      }
    )

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      throw new Error(body.message || "Password reset failed.")
    }

    return { success: true }
  } catch (error: any) {
    console.error("[PASSWORD_RESET] Reset error:", error)
    return error.message || "Something went wrong. Please try again."
  }
}

export async function signout(countryCode: string) {
  // Clearing cookies is sufficient for JWT stateless auth
  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await updateCartCustomerQL(cartId, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address: CustomerAddressInput = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await addCustomerAddressQL(address, headers)
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.toString() }
  }
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<{ success: boolean; error: string | null }> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await deleteCustomerAddressQL(addressId, headers)
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.toString() }
  }
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address: CustomerAddressInput = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  }

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  try {
    await updateCustomerAddressQL(addressId, address, headers)
    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)
    return { success: true, error: null }
  } catch (err: any) {
    return { success: false, error: err.toString() }
  }
}
