import { Metadata } from "next"
import QuoteOverview from "@modules/quotes/components/quote-overview"
import { notFound } from "next/navigation"
import { listQuotes } from "@lib/data/b2b"
import Divider from "@modules/common/components/divider"

export const metadata: Metadata = {
  title: "Quotes",
  description: "Overview of your requested quotes.",
}

export default async function Quotes() {
  const quotes = await listQuotes()

  return (
    <div className="w-full" data-testid="quotes-page-wrapper">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="text-2xl font-display font-black uppercase text-businessx-black">Quotes</h1>
        <p className="text-base text-gray-700">
          View your quote requests and their status.
        </p>
      </div>
      <div>
        <QuoteOverview quotes={quotes} />
        <Divider className="my-16" />
      </div>
    </div>
  )
}
