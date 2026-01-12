"use server"
import "server-only"
import { Region } from "@xclade/types"
import { getCacheOptions } from "./cookies"
import { graphqlQuery, LIST_REGIONS, GET_REGION } from "@lib/graphql"

export const listRegions = async () => {
  const next = {
    ...(await getCacheOptions("regions")),
  }

  try {
    const data = await graphqlQuery<{ regions: { regions: Region[] } }>(
      LIST_REGIONS,
      {},
      {},
      { tags: next.tags }
    )
    return data.regions.regions
  } catch (error) {
    console.error("Error listing regions:", error)
    return []
  }
}

export const retrieveRegion = async (id: string) => {
  const next = {
    ...(await getCacheOptions(["regions", id].join("-"))),
  }

  try {
    const data = await graphqlQuery<{ region: Region }>(
      GET_REGION,
      { id },
      {},
      { tags: next.tags }
    )
    return data.region
  } catch (error) {
    console.error("Error retrieving region:", error)
    return null
  }
}

export const getRegion = async (countryCode: string) => {
  try {
    const regions = await listRegions()

    if (!regions) {
      return null
    }

    // Find the region that contains the countryCode
    const region = regions.find((r) =>
      r.countries?.some((c) => c?.iso_2 === countryCode)
    )

    // Default to US if not found, or first region
    const finalRegion = region || regions.find((r) => r.countries?.some((c) => c?.iso_2 === "us"))

    return finalRegion
  } catch (e: any) {
    console.error("Error in getRegion:", e)
    return null
  }
}
