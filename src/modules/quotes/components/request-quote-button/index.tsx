
"use client"

import { Button } from "@medusajs/ui"
import { useState } from "react"
import { useFormStatus } from "react-dom"
import { requestQuote } from "@lib/data/b2b"
import { useParams, useRouter } from "next/navigation"

export default function RequestQuoteButton({ cartId, disabled }: { cartId: string, disabled?: boolean }) {
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()
    const { countryCode } = useParams()

    const handleRequest = async () => {
        setIsLoading(true)
        try {
            const quote = await requestQuote(cartId)
            if (quote) {
                router.push(`/${countryCode}/account/quotes/${quote.id}`)
            }
        } catch (e) {
            console.error(e)
            alert("Failed to request quote")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button 
            variant="secondary" 
            className="w-full h-10 border border-terminal-border bg-transparent text-terminal-dim hover:text-businessx-orange hover:border-businessx-orange transition-colors uppercase font-bold tracking-wider rounded-none"
            onClick={handleRequest}
            disabled={disabled || isLoading}
        >
            {isLoading ? "Requesting..." : "Request Quote"}
        </Button>
    )
}
