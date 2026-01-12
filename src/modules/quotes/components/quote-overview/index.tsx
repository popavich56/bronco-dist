"use client"

import { Button } from "@medusajs/ui"
import QuoteCard from "../quote-card"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const QuoteOverview = ({ quotes }: { quotes: any[] }) => {
  if (quotes?.length) {
    return (
      <div className="flex flex-col gap-y-8 w-full">
        {quotes.map((q) => (
          <div key={q.id}>
            <QuoteCard quote={q} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center gap-y-4"
      data-testid="no-quotes-container"
    >
      <h2 className="text-large-semi">No quotes yet</h2>
      <p className="text-base-regular">
        You haven't requested any quotes yet.
      </p>
      <div className="mt-4">
        <LocalizedClientLink href="/" passHref>
          <Button data-testid="continue-shopping-button">
            Continue shopping
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default QuoteOverview
