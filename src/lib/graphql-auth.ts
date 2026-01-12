// Auth GraphQL queries (login/logout stay with SDK for JWT token handling)
import { graphqlQuery } from "./graphql"
import { Customer, CustomerAddress } from "@xclade/types"

// Customer Fragment
const CUSTOMER_FRAGMENT = `
  fragment CustomerFields on Customer {
    id
    email
    first_name
    last_name
    phone
    company_name
    has_account
    metadata
    created_at
    updated_at
    addresses {
      id
      address_name
      is_default_shipping
      is_default_billing
      company
      first_name
      last_name
      address_1
      address_2
      city
      country_code
      province
      postal_code
      phone
      metadata
    }
    employee {
      id
      company_id
      company {
        id
        name
        email
        currency_code
      }
    }
    groups {
      id
      name
    }
  }
`

// Query: Get current authenticated customer
const GET_CURRENT_CUSTOMER = `
  ${CUSTOMER_FRAGMENT}
  query GetCurrentCustomer {
    currentCustomer {
      ...CustomerFields
    }
  }
`

// Query: Check authentication status
const GET_AUTH_STATUS = `
  query GetAuthStatus {
    authStatus {
      isAuthenticated
      actor_type
      actor_id
      auth_user_id
      app_metadata
    }
  }
`

// Query: Get customer by ID
const GET_CUSTOMER_BY_ID = `
  ${CUSTOMER_FRAGMENT}
  query GetCustomerById($id: ID!) {
    getCustomer(id: $id) {
      ...CustomerFields
    }
  }
`

// Type for auth status
export type AuthStatus = {
  isAuthenticated: boolean
  actor_type: string | null
  actor_id: string | null
  auth_user_id: string | null
  app_metadata: Record<string, any> | null
}

/**
 * Get the current authenticated customer via GraphQL
 * Requires valid JWT token in headers
 */
export async function getCurrentCustomerQL(
  headers?: Record<string, string>
): Promise<Customer | null> {
  try {
    const data = await graphqlQuery<{ currentCustomer: Customer | null }>(
      GET_CURRENT_CUSTOMER,
      {},
      headers,
      { revalidate: 0 } // Don't cache - auth state can change
    )
    return data.currentCustomer
  } catch (error) {
    console.error("Error fetching current customer:", error)
    return null
  }
}

/**
 * Check authentication status via GraphQL
 * Requires valid JWT token in headers
 */
export async function getAuthStatusQL(
  headers?: Record<string, string>
): Promise<AuthStatus> {
  try {
    const data = await graphqlQuery<{ authStatus: AuthStatus }>(
      GET_AUTH_STATUS,
      {},
      headers,
      { revalidate: 0 } // Don't cache - auth state can change
    )
    return data.authStatus
  } catch (error) {
    console.error("Error checking auth status:", error)
    return {
      isAuthenticated: false,
      actor_type: null,
      actor_id: null,
      auth_user_id: null,
      app_metadata: null,
    }
  }
}

/**
 * Get customer by ID via GraphQL
 * Requires authentication and proper permissions
 */
export async function getCustomerByIdQL(
  id: string,
  headers?: Record<string, string>
): Promise<Customer | null> {
  try {
    const data = await graphqlQuery<{ getCustomer: Customer }>(
      GET_CUSTOMER_BY_ID,
      { id },
      headers
    )
    return data.getCustomer
  } catch (error) {
    console.error("Error fetching customer by ID:", error)
    return null
  }
}

// Mutation: Login
const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

// Mutation: Create Customer (Register)
const CREATE_CUSTOMER_MUTATION = `
  ${CUSTOMER_FRAGMENT}
  mutation CreateCustomer($input: CreateCustomerInput!) {
    createCustomer(input: $input) {
      ...CustomerFields
    }
  }
`

// Fragment for Address
const ADDRESS_FRAGMENT = `
  fragment AddressFields on CustomerAddress {
    id
    address_name
    is_default_shipping
    is_default_billing
    company
    first_name
    last_name
    address_1
    address_2
    city
    country_code
    province
    postal_code
    phone
    metadata
  }
`

// Mutation: Update Customer
const UPDATE_CUSTOMER_MUTATION = `
  ${CUSTOMER_FRAGMENT}
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      ...CustomerFields
    }
  }
`

// Mutation: Add Customer Address
const ADD_CUSTOMER_ADDRESS_MUTATION = `
  ${ADDRESS_FRAGMENT}
  mutation AddCustomerAddress($input: CustomerAddressInput!) {
    addCustomerAddress(input: $input) {
      ...AddressFields
    }
  }
`

// Mutation: Update Customer Address
const UPDATE_CUSTOMER_ADDRESS_MUTATION = `
  ${ADDRESS_FRAGMENT}
  mutation UpdateCustomerAddress($addressId: ID!, $input: CustomerAddressInput!) {
    updateCustomerAddress(addressId: $addressId, input: $input) {
      ...AddressFields
    }
  }
`

// Mutation: Delete Customer Address
const DELETE_CUSTOMER_ADDRESS_MUTATION = `
  mutation DeleteCustomerAddress($addressId: ID!) {
    deleteCustomerAddress(addressId: $addressId) {
      success
    }
  }
`

export type CreateCustomerInput = {
  email: string
  password?: string
  first_name?: string
  last_name?: string
  phone?: string
  company_name?: string
  address_1?: string
  address_2?: string
  city?: string
  state?: string
  zip?: string
  country_code?: string
}

export type UpdateCustomerInput = {
  first_name?: string
  last_name?: string
  phone?: string
  company_name?: string
  email?: string
  password?: string
  metadata?: Record<string, any>
}

export type CustomerAddressInput = {
  address_name?: string
  is_default_shipping?: boolean
  is_default_billing?: boolean
  company?: string
  first_name?: string
  last_name?: string
  address_1?: string
  address_2?: string
  city?: string
  country_code?: string
  province?: string
  postal_code?: string
  phone?: string
  metadata?: Record<string, any>
}

/**
 * Login via GraphQL
 */
export async function loginQL(
  email: string,
  password: string
): Promise<{ token: string } | null> {
  try {
    const data = await graphqlQuery<{ login: { token: string } }>(
      LOGIN_MUTATION,
      { email, password },
      undefined,
      { revalidate: 0 }
    )
    return data.login
  } catch (error) {
    console.error("Error logging in:", error)
    throw error
  }
}

/**
 * Register a new customer via GraphQL
 */
export async function registerCustomerQL(
  input: CreateCustomerInput
): Promise<Customer | null> {
  try {
    const data = await graphqlQuery<{ createCustomer: Customer }>(
      CREATE_CUSTOMER_MUTATION,
      { input },
      undefined,
      { revalidate: 0 }
    )
    return data.createCustomer
  } catch (error) {
    console.error("Error registering customer:", error)
    throw error
  }
}

/**
 * Update customer profile via GraphQL
 */
export async function updateCustomerQL(
  input: UpdateCustomerInput,
  headers?: Record<string, string>
): Promise<Customer | null> {
  try {
    const data = await graphqlQuery<{ updateCustomer: Customer }>(
      UPDATE_CUSTOMER_MUTATION,
      { input },
      headers,
      { revalidate: 0 }
    )
    return data.updateCustomer
  } catch (error) {
    console.error("Error updating customer:", error)
    throw error
  }
}

/**
 * Add address to customer via GraphQL
 */
export async function addCustomerAddressQL(
  input: CustomerAddressInput,
  headers?: Record<string, string>
): Promise<CustomerAddress | null> {
  try {
    const data = await graphqlQuery<{ addCustomerAddress: CustomerAddress }>(
      ADD_CUSTOMER_ADDRESS_MUTATION,
      { input },
      headers,
      { revalidate: 0 }
    )
    return data.addCustomerAddress
  } catch (error) {
    console.error("Error adding customer address:", error)
    throw error
  }
}

/**
 * Update customer address via GraphQL
 */
export async function updateCustomerAddressQL(
  addressId: string,
  input: CustomerAddressInput,
  headers?: Record<string, string>
): Promise<CustomerAddress | null> {
  try {
    const data = await graphqlQuery<{ updateCustomerAddress: CustomerAddress }>(
      UPDATE_CUSTOMER_ADDRESS_MUTATION,
      { addressId, input },
      headers,
      { revalidate: 0 }
    )
    return data.updateCustomerAddress
  } catch (error) {
    console.error("Error updating customer address:", error)
    throw error
  }
}

/**
 * Delete customer address via GraphQL
 */
export async function deleteCustomerAddressQL(
  addressId: string,
  headers?: Record<string, string>
): Promise<boolean> {
  try {
    const data = await graphqlQuery<{
      deleteCustomerAddress: { success: boolean }
    }>(DELETE_CUSTOMER_ADDRESS_MUTATION, { addressId }, headers, {
      revalidate: 0,
    })
    return data.deleteCustomerAddress.success
  } catch (error) {
    console.error("Error deleting customer address:", error)
    throw error
  }
}
