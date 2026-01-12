import { Button } from "@medusajs/ui"
import { useMemo } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"

type QuoteCardProps = {
  quote: any // TODO: Replace with proper Quote type
}

const QuoteCard = ({ quote }: QuoteCardProps) => {
  return (
    <div className="bg-terminal-black border border-terminal-border p-4 hover:border-bronco-orange transition-all group flex flex-col gap-4" data-testid="quote-card">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-baseline gap-3 mb-1">
            <span className="text-xl font-black font-display uppercase text-terminal-white group-hover:text-bronco-orange transition-colors">
              #{quote.draft_order?.display_id || quote.id.slice(0, 7)}
            </span>
            <span className="text-xs font-bold font-mono uppercase text-terminal-dim" data-testid="quote-created-at">
              {new Date(quote.created_at).toDateString()}
            </span>
          </div>
          <div className="text-xs font-bold font-mono uppercase tracking-wide text-terminal-dim">
             Status: {quote.status}
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold font-display text-terminal-white" data-testid="quote-amount">
            {quote.draft_order?.total !== undefined ? convertToLocale({
              amount: quote.draft_order.total,
              currency_code: quote.draft_order.currency_code,
            }) : "N/A"}
          </span>
        </div>
      </div>

      <LocalizedClientLink href={`/account/quotes/${quote.id}`} className="w-full mt-auto">
        <Button data-testid="quote-details-link" className="w-full bg-transparent border border-terminal-border hover:border-bronco-orange text-terminal-dim hover:text-bronco-orange font-bold uppercase tracking-widest text-xs h-10 rounded-none shadow-none transition-all">
          View Quote
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default QuoteCard
