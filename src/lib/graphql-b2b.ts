// Fragments
export const COMPANY_FRAGMENT = `
  fragment CompanyFragment on B2BCompany {
    id
    name
    email
    phone
    address
    city
    state
    zip
    country
    logo_url
    currency_code
    spending_limit_reset_frequency
  }
`

export const QUOTE_MESSAGE_FRAGMENT = `
  fragment QuoteMessageFragment on B2BQuoteMessage {
    id
    message
    author_id
    created_at
  }
`

export const QUOTE_FRAGMENT = `
  fragment QuoteFragment on B2BQuote {
    id
    status
    customer_id
    draft_order_id
    order_change_id
    cart_id
    cart_id
    draft_order {
        id
        display_id
        email
        total
        currency_code
        
        # Addresses
        shipping_address {
            first_name
            last_name
            address_1
            address_2
            city
            postal_code
            country_code
            province
            phone
            company
        }
        billing_address {
            first_name
            last_name
            address_1
            address_2
            city
            postal_code
            country_code
            province
            phone
            company
        }
        
        # Shipping
        shipping_methods {
             amount
             name
        }
        
        # Region info
        shipping_tax_total
        item_tax_total
        
        # Items
        items {
            id
            created_at
            title
            product_title
            variant_title
            quantity
            thumbnail
            unit_price
            
            total
            subtotal
            tax_total
            discount_total
            original_total
            
            variant {
                id
                title
                sku
                options {
                    id
                    value
                }
            }
        }
    }
    customer {
        id
        first_name
        last_name
        email
        phone
    }
    messages {
      ...QuoteMessageFragment
    }
    created_at
    updated_at
  }
  ${QUOTE_MESSAGE_FRAGMENT}
`

export const APPROVAL_FRAGMENT = `
  fragment ApprovalFragment on B2BApproval {
    id
    cart_id
    type
    status
    created_by
    handled_by
    created_at
    updated_at
  }
`

// Queries

export const GET_MY_COMPANY = `
  query GetMyCompany {
    myCompany {
      ...CompanyFragment
      employees {
        id
        is_admin
        spending_limit
        customer {
            id
            first_name
            last_name
            email
        }
      }
    }
  }
  ${COMPANY_FRAGMENT}
`

export const LIST_QUOTES = `
  query ListQuotes($limit: Int, $offset: Int, $status: [String]) {
    quotes(limit: $limit, offset: $offset, status: $status) {
      ...QuoteFragment
    }
  }
  ${QUOTE_FRAGMENT}
`

export const GET_QUOTE = `
  query GetQuote($id: ID!) {
    quote(id: $id) {
      ...QuoteFragment
    }
  }
  ${QUOTE_FRAGMENT}
`

// Mutations

export const REQUEST_QUOTE = `
  mutation RequestQuote($cart_id: String!) {
    requestQuote(cart_id: $cart_id) {
      ...QuoteFragment
    }
  }
  ${QUOTE_FRAGMENT}
`

export const CREATE_QUOTE_MESSAGE = `
  mutation CreateQuoteMessage($quote_id: String!, $message: String!) {
    createQuoteMessage(quote_id: $quote_id, message: $message) {
      ...QuoteMessageFragment
    }
  }
  ${QUOTE_MESSAGE_FRAGMENT}
`

export const INVITE_EMPLOYEE = `
  mutation InviteEmployee($email: String!, $role: String!) {
    inviteEmployee(email: $email, role: $role)
  }
`

export const REMOVE_EMPLOYEE = `
  mutation RemoveEmployee($id: ID!) {
    removeEmployee(id: $id)
  }
`

// Assuming UpdateEmployeeInput matches backend
export const UPDATE_EMPLOYEE = `
  mutation UpdateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
    updateEmployee(id: $id, input: $input) {
      id
      is_admin
      spending_limit
    }
  }
`

export const UPDATE_COMPANY = `
  mutation UpdateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      ...CompanyFragment
    }
  }
  ${COMPANY_FRAGMENT}
`

// Helpers
import { graphqlQuery } from "./graphql"

export async function getMyCompanyQL(headers: HeadersInit) {
  const response = await graphqlQuery<{ myCompany: any }>(
    GET_MY_COMPANY,
    {},
    headers as Record<string, string>,
    { tags: ["company"] }
  )
  return response.myCompany
}

export async function listQuotesQL(headers: HeadersInit, status?: string[]) {
  const response = await graphqlQuery<{ quotes: any[] }>(
    LIST_QUOTES,
    { status },
    headers as Record<string, string>,
    { tags: ["quotes"] }
  )
  return response.quotes
}

export async function getQuoteQL(id: string, headers: HeadersInit) {
  const response = await graphqlQuery<{ quote: any }>(
    GET_QUOTE,
    { id },
    headers as Record<string, string>,
    { tags: [`quote-${id}`] }
  )
  return response.quote
}

export async function requestQuoteQL(cart_id: string, headers: HeadersInit) {
  const response = await graphqlQuery<{ requestQuote: any }>(
    REQUEST_QUOTE,
    { cart_id },
    headers as Record<string, string>
  )
  return response.requestQuote
}

export async function createQuoteMessageQL(
  quote_id: string,
  message: string,
  headers: HeadersInit
) {
  const response = await graphqlQuery<{ createQuoteMessage: any }>(
    CREATE_QUOTE_MESSAGE,
    { quote_id, message },
    headers as Record<string, string>
  )
  return response.createQuoteMessage
}

export async function inviteEmployeeQL(
  email: string,
  role: string,
  headers: HeadersInit
) {
  const { inviteEmployee } = await graphqlQuery<{ inviteEmployee: boolean }>(
    INVITE_EMPLOYEE,
    { email, role },
    headers as Record<string, string>
  )
  return inviteEmployee
}

export async function removeEmployeeQL(id: string, headers: HeadersInit) {
  const { removeEmployee } = await graphqlQuery<{ removeEmployee: boolean }>(
    REMOVE_EMPLOYEE,
    { id },
    headers as Record<string, string>
  )
  return removeEmployee
}

export async function updateEmployeeQL(
  id: string,
  input: { spending_limit?: number; is_admin?: boolean },
  headers: HeadersInit
) {
  const { updateEmployee } = await graphqlQuery<{ updateEmployee: any }>(
    UPDATE_EMPLOYEE,
    { id, input },
    headers as Record<string, string>
  )
  return updateEmployee
}

export async function updateCompanyQL(
  input: {
    name?: string
    phone?: string
    email?: string
    currency_code?: string
  },
  headers: HeadersInit
) {
  const { updateCompany } = await graphqlQuery<{ updateCompany: any }>(
    UPDATE_COMPANY,
    { input },
    headers as Record<string, string>
  )
  return updateCompany
}
