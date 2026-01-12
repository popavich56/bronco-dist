import { Metadata } from "next"

import SearchTemplate from "@modules/search/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

export const metadata: Metadata = {
  title: "Search Results",
  description: "Search results for your query.",
}

type Params = {
  searchParams: Promise<{
    q?: string
    sortBy?: SortOptions
    page?: string
    limit?: string
    view?: string
  }>
  params: Promise<{
    countryCode: string
  }>
}

export default async function SearchPage(props: Params) {
  const params = await props.params
  const searchParams = await props.searchParams
  const { q, sortBy, page, limit, view } = searchParams

  return (
    <SearchTemplate
      query={q}
      sortBy={sortBy}
      page={page}
      limit={limit}
      view={view}
      countryCode={params.countryCode}
    />
  )
}
