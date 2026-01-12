"use server"

import { getAuthHeaders, getCacheOptions } from "./cookies"
import { listPaymentProvidersQL } from "@lib/graphql-payment"

export const listCartPaymentMethods = async (regionId: string) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("payment_providers")),
  }

  return listPaymentProvidersQL(
    regionId,
    headers,
    { tags: next.tags }
  )
    .then((payment_providers) =>
      payment_providers.sort((a, b) => {
        return a.id > b.id ? 1 : -1
      })
    )
    .catch(() => {
      return null
    })
}

