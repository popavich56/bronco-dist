import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element; instructions?: string }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_medusa-payments_default": {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
  check: {
    title: "Check",
    icon: <CreditCard />,
  },
  bank_transfer_ach: {
    title: "Bank Transfer (ACH)",
    icon: <CreditCard />,
  },
  call_to_pay: {
    title: "Call to Pay",
    icon: <CreditCard />,
  },
  "pp_check_offline-payments": {
    title: "Check",
    icon: <CreditCard />,
    instructions: "Please mail your check to our business address. Include your order number on the memo line."
  },
  "pp_bank_transfer_ach_offline-payments": {
    title: "Bank Transfer (ACH)",
    icon: <CreditCard />,
    instructions: "Please initiate an ACH transfer to our bank account. Include your order number in the transfer description."
  },
  "pp_call_to_pay_offline-payments": {
    title: "Call to Pay",
    icon: <CreditCard />,
    instructions: "Please call us to complete your payment over the phone."
  },
  // Add more payment providers here
}

// This only checks if it is native stripe or medusa payments for card payments, it ignores the other stripe-based providers
export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}
export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

// Check if provider is an offline payment method (check, bank transfer, etc.)
export const isOfflinePayment = (providerId?: string) => {
  return (
    providerId === "check" ||
    providerId === "bank_transfer_ach" ||
    providerId === "call_to_pay" ||
    providerId?.includes("offline-payments")
  )
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw",
  "jpy",
  "vnd",
  "clp",
  "pyg",
  "xaf",
  "xof",
  "bif",
  "djf",
  "gnf",
  "kmf",
  "mga",
  "rwf",
  "xpf",
  "htg",
  "vuv",
  "xag",
  "xdr",
  "xau",
]
