"use server"

import { getAuthHeaders, getCacheOptions } from "./cookies"
import { retrieveVariantQL } from "@lib/graphql-variants"
import { ProductVariant } from "@xclade/types"

export const retrieveVariant = async (
  variant_id: string
): Promise<ProductVariant | null> => {
  const authHeaders = await getAuthHeaders()

  if (!authHeaders) return null

  const headers = {
    ...authHeaders,
  }

  const next = {
    ...(await getCacheOptions("variants")),
  }

  return retrieveVariantQL(
    variant_id,
    headers,
    { tags: next.tags }
  ).then(v => v as unknown as ProductVariant | null)
}

