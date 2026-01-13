"use client"

import { Button } from "@medusajs/ui"
import { RefreshCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RefreshButton() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleRefresh = () => {
        setLoading(true)
        router.refresh()
        setTimeout(() => setLoading(false), 800)
    }

    return (
        <Button 
            variant="secondary" 
            className="flex items-center gap-2 border border-businessx-gray/20 bg-businessx-gray/10 text-businessx-white hover:bg-businessx-yellow hover:text-businessx-black transition-all"
            onClick={handleRefresh}
        >
            <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Feed
        </Button>
    )
}
