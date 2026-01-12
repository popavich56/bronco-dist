// Payment Providers GraphQL queries
import { graphqlQuery } from "./graphql"
import { PaymentProvider } from "@xclade/types"

// Payment Provider Fragment
const PAYMENT_PROVIDER_FRAGMENT = `
  fragment PaymentProviderFields on PaymentProvider {
    id
    is_enabled
    instructions
  }
`

// Query: List Payment Providers for a Region
export const LIST_PAYMENT_PROVIDERS = `
  ${PAYMENT_PROVIDER_FRAGMENT}
  query ListPaymentProviders($regionId: ID!) {
    paymentProviders(regionId: $regionId, limit: 100) {
      payment_providers {
        ...PaymentProviderFields
      }
    }
  }
`

/**
 * List payment providers for a specific region via GraphQL
 */
export async function listPaymentProvidersQL(
  regionId: string,
  headers?: Record<string, string>,
  options?: { tags?: string[]; revalidate?: number | false }
): Promise<PaymentProvider[]> {
  const data = await graphqlQuery<{
    paymentProviders: { payment_providers: PaymentProvider[] }
  }>(LIST_PAYMENT_PROVIDERS, { regionId }, headers, options)

  // Enrich frontend map with backend instructions
  const providers = data.paymentProviders.payment_providers

  // We need to mutate the map imported from constants or merge it in the component
  // Since constants is readonly, we'll return the enriched providers and handle mapping in the component
  // actually, we can't easily mutate the constant map globally.
  // BUT, the Component iterates over 'availablePaymentMethods' which ARE these providers.
  // So we just need to make sure the Component uses 'provider.instructions' if available.

  return providers
}
