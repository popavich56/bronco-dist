
"use server"

import { getAuthHeaders } from "./cookies"
import { retrieveCustomer } from "./customer"
import { isApprovedCustomer } from "@lib/util/customer-status"
import { createQuoteMessageQL, getMyCompanyQL, getQuoteQL, listQuotesQL, requestQuoteQL, inviteEmployeeQL, removeEmployeeQL, updateEmployeeQL, updateCompanyQL } from "../graphql-b2b"

export async function getMyCompany() {
    const headers = await getAuthHeaders()
    return await getMyCompanyQL(headers)
}

export async function listQuotes(status?: string[]) {
    const headers = await getAuthHeaders()
    return await listQuotesQL(headers, status)
}

export async function getQuote(id: string) {
    const headers = await getAuthHeaders()
    return await getQuoteQL(id, headers)
}

export async function requestQuote(cart_id: string) {
    const customer = await retrieveCustomer()
    if (!isApprovedCustomer(customer)) {
        throw new Error("Account not approved for purchasing")
    }
    const headers = await getAuthHeaders()
    return await requestQuoteQL(cart_id, headers)
}

export async function createQuoteMessage(quote_id: string, message: string) {
    const headers = await getAuthHeaders()
    return await createQuoteMessageQL(quote_id, message, headers)
}

export async function inviteEmployee(email: string, role: string) {
    const headers = await getAuthHeaders()
    return await inviteEmployeeQL(email, role, headers)
}

export async function removeEmployee(id: string) {
    const headers = await getAuthHeaders()
    return await removeEmployeeQL(id, headers)
}

export async function updateEmployee(id: string, input: { spending_limit?: number, is_admin?: boolean }) {
    const headers = await getAuthHeaders()
    return await updateEmployeeQL(id, input, headers)
}

export async function updateCompany(input: { name?: string, phone?: string, email?: string, currency_code?: string }) {
    const headers = await getAuthHeaders()
    return await updateCompanyQL(input, headers)
}
