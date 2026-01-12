"use client"

import React, { useState } from "react"
import { clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type FAQItem = {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "How do I track my order?",
    answer: "Once your order ships, you will receive an email with a tracking number. You can also view your order status in your Account dashboard.",
  },
  {
    question: "What is your return policy?",
    answer: "We accept returns within 30 days of purchase for unopened items. Please contact support to initiate a return authorization.",
  },
  {
    question: "Do you offer bulk discounts?",
    answer: "Yes! Please visit our Bulk Order page or contact our sales team for large volume pricing.",
  },
  {
    question: "How long does shipping take?",
    answer: "Standard shipping typically takes 3-5 business days. Expedited options are available at checkout.",
  },
]

const AccordionItem = ({ item, isOpen, onClick }: { item: FAQItem; isOpen: boolean; onClick: () => void }) => {
  return (
    <div className="border-2 border-terminal-border bg-terminal-black shadow-none mb-4 last:mb-0 transition-all">
      <button
        className="w-full flex items-center justify-between p-6 text-left font-display uppercase tracking-wide bg-terminal-black hover:bg-bronco-gray transition-colors"
        onClick={onClick}
      >
        <span>{item.question}</span>
        <span className="text-2xl font-bold leading-none ml-4">
          {isOpen ? "-" : "+"}
        </span>
      </button>
      <div
        className={clx(
            "overflow-hidden transition-[max-height] duration-300 ease-in-out border-t-0 border-terminal-border",
            isOpen ? "max-h-[500px] border-t-2" : "max-h-0"
        )}
      >
        <div className="p-6 text-terminal-white/80 font-medium leading-relaxed">
          {item.answer}
        </div>
      </div>
    </div>
  )
}

export default function CustomerServiceTemplate() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="py-20 bg-bronco-bg">
      <div className="content-container">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-display uppercase tracking-wider text-terminal-white">
            Customer Service
          </h1>
          <p className="text-lg md:text-xl max-w-2xl font-medium text-terminal-white/70">
            Have a question? We're here to help. Check out our FAQs below or get in touch with our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-bronco-black text-white p-8 shadow-none border-2 border-terminal-border">
                    <h3 className="text-xl font-display uppercase tracking-wide mb-4 text-bronco-yellow">
                        Contact Us
                    </h3>
                    <p className="mb-6 font-medium text-white/90">
                        Our support team is available Monday through Friday, 9am - 5pm EST.
                    </p>
                    <div className="space-y-4">
                        <div className="flex flex-col">
                            <span className="text-xs uppercase opacity-70 mb-1">Email</span>
                            <a href="mailto:support@broncodistribution.com" className="hover:text-bronco-yellow transition-colors font-bold text-lg">
                                support@broncodistribution.com
                            </a>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xs uppercase opacity-70 mb-1">Phone</span>
                            <a href="tel:18005550199" className="hover:text-bronco-yellow transition-colors font-bold text-lg">
                                1-800-555-0199
                            </a>
                        </div>
                    </div>
                </div>

                <div className="bg-bronco-yellow p-8 border-2 border-terminal-border shadow-none">
                    <h3 className="text-xl font-display uppercase tracking-wide mb-2 text-terminal-white">
                        Quick Links
                    </h3>
                    <ul className="space-y-2 font-bold text-terminal-white">
                        <li>
                            <LocalizedClientLink href="/account" className="hover:underline">
                                Track My Order &rarr;
                            </LocalizedClientLink>
                        </li>
                        <li>
                            <LocalizedClientLink href="/bulk-order" className="hover:underline">
                                Bulk Order &rarr;
                            </LocalizedClientLink>
                        </li>
                    </ul>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="lg:col-span-2">
                <h2 className="text-2xl font-display uppercase tracking-wide mb-8 border-b-2 border-terminal-border pb-4">
                    Frequently Asked Questions
                </h2>
                <div>
                   {faqs.map((item, index) => (
                       <AccordionItem 
                          key={index} 
                          item={item} 
                          isOpen={openIndex === index} 
                          onClick={() => handleToggle(index)} 
                        />
                   ))}
                </div>
            </div>

        </div>
      </div>
    </div>
  )
}
