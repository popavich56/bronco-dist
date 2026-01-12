import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getQuote } from "@lib/data/b2b"
import QuoteDetailsTemplate from "@modules/quotes/templates/quote-details"

export const metadata: Metadata = {
  title: "Quote Details",
  description: "View details of your quote.",
}

export default async function QuoteDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const quote = await getQuote(id)

  if (!quote) {
    notFound()
  }

  return <QuoteDetailsTemplate quote={quote} />
}
