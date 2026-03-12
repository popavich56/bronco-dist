"use client"

import { useState } from "react"
import { clx } from "@medusajs/ui"

type AccordionItem = {
  title: string
  content?: React.ReactNode
  html?: string
}

type ProductAccordionProps = {
  items: AccordionItem[]
}

export default function ProductAccordion({ items }: ProductAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!items.length) return null

  return (
    <div className="flex flex-col divide-y divide-border">
      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <div key={index}>
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between py-5 text-left group"
            >
              <span className="text-sm font-display font-bold uppercase tracking-wide text-foreground group-hover:text-[#6DB3D9] transition-colors">
                {item.title}
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={clx(
                  "text-muted-foreground transition-transform duration-200",
                  { "rotate-180": isOpen }
                )}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            <div
              className={clx(
                "overflow-hidden transition-all duration-200",
                {
                  "max-h-[1000px] opacity-100 pb-5": isOpen,
                  "max-h-0 opacity-0": !isOpen,
                }
              )}
            >
              {item.html ? (
                <div
                  className="prose prose-sm dark:prose-invert text-foreground max-w-none"
                  dangerouslySetInnerHTML={{ __html: item.html }}
                />
              ) : (
                <div className="text-sm font-mono text-muted-foreground dark:text-neutral-300 leading-relaxed">
                  {item.content}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
