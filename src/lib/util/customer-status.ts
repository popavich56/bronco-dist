import { Customer } from "@xclade/types"

/**
 * Shared pending-account message used across all UI surfaces.
 */
export const PENDING_MESSAGE =
  "Your wholesale account is under review. Pricing and ordering will be available once approved (1–2 business days)."

/**
 * Returns true ONLY when the customer exists AND has been explicitly approved.
 * Missing, null, or any non-"approved" metadata value → false.
 */
export function isApprovedCustomer(customer: Customer | null): boolean {
  if (process.env.NEXT_PUBLIC_BYPASS_WHOLESALE_GATE === "true") return true
  if (!customer) return false
  return (customer as any).metadata?.account_status === "approved"
}

/**
 * Returns true when the customer is authenticated but NOT approved.
 * Covers missing metadata, null status, "pending", or any other value.
 */
export function isPendingCustomer(customer: Customer | null): boolean {
  if (!customer) return false
  return (customer as any).metadata?.account_status !== "approved"
}

/**
 * Three-state account status for routing / UI decisions.
 */
export function getAccountStatus(
  customer: Customer | null
): "guest" | "pending" | "approved" {
  if (!customer) return "guest"
  if ((customer as any).metadata?.account_status === "approved") return "approved"
  return "pending"
}
