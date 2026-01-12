import { Heading } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="mt-8 pt-8 border-t-2 border-dashed border-terminal-border">
      <Heading className="text-lg font-bold uppercase tracking-wide text-terminal-white mb-4">Need help?</Heading>
      <div className="text-sm font-medium text-gray-600">
        <ul className="gap-y-2 flex flex-col">
          <li>
            <LocalizedClientLink href="/contact" className="hover:text-terminal-white hover:underline underline-offset-4 transition-all">
              Contact Us
            </LocalizedClientLink>
          </li>
          <li>
            <LocalizedClientLink href="/contact" className="hover:text-terminal-white hover:underline underline-offset-4 transition-all">
              Returns & Exchanges
            </LocalizedClientLink>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Help
