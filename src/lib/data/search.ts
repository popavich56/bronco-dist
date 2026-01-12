"use server"

import { getRegion } from "./regions"

export interface ProductDocument {
  id: string
  title: string
  description?: string
  handle: string
  thumbnail?: string
  skus: string[]
  status: string
  collection_id: string[]
  type_id?: string
  tags: string[]
  categories: object[]
  category_ids: string[]
  category_names: string[]
  variants: object[]
  upcs: string[]
  eans: string[]
  barcodes: string[]
  created_at: number
  updated_at: number
}

export interface SearchResponse {
  results: ProductDocument[]
  count: number
  limit: number
  offset: number
  search_time_ms: number
  facet_counts?: Array<{
    field_name: string
    counts: Array<{
      value: string
      count: number
    }>
  }>
}

export const searchProducts = async ({
  query,
  limit = 20,
  offset = 0,
  filter_by,
  sort_by,
  facet_by,
}: {
  query: string
  limit?: number
  offset?: number
  filter_by?: string
  sort_by?: string
  facet_by?: string
}): Promise<SearchResponse> => {
  try {
    const region = await getRegion("us") // Default to US region
    const baseUrl = process.env.NEXT_PUBLIC_XCLADE_BACKEND_URL || process.env.XCLADE_BACKEND_URL || "https://a1594fc3.api.myxclade.com"
    
    let searchUrl = `${baseUrl}/store/search/direct?q=${encodeURIComponent(query)}&limit=${limit}&offset=${offset}`
    
    // Add optional parameters
    if (region?.id) searchUrl += `&region_id=${region.id}`
    if (filter_by) searchUrl += `&filter_by=${encodeURIComponent(filter_by)}`
    if (sort_by) searchUrl += `&sort_by=${encodeURIComponent(sort_by)}`
    if (facet_by) searchUrl += `&facet_by=${encodeURIComponent(facet_by)}`

    const response = await fetch(searchUrl, {
      method: "GET",
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_XCLADE_API_KEY || "",
        "accept": "application/json",
      },
      next: { revalidate: 0 }, // Don't cache search results
    })

    if (!response.ok) {
      throw new Error(`Search failed: ${response.status}`)
    }

    const data = await response.json()
    
    return {
      results: data.results || [],
      count: data.count || 0,
      limit: data.limit || limit,
      offset: data.offset || offset,
      search_time_ms: data.search_time_ms || 0,
      facet_counts: data.facet_counts,
    }
  } catch (error) {
    console.error("Search error:", error)
    // Return empty results on error
    return {
      results: [],
      count: 0,
      limit,
      offset,
      search_time_ms: 0,
    }
  }
}
