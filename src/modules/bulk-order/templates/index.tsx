"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { Product } from "@xclade/types"
import BulkOrderTable from "../components/bulk-order-table"
import { Input } from "@medusajs/ui"

export default function BulkOrderTemplate() {
  const { countryCode } = useParams()
  const [query, setQuery] = useState("")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  const searchProducts = useCallback(async (searchQuery: string) => {
    if (!searchQuery) {
        // Option based on preference: show nothing, or show recent/popular?
        // User said "type the name then add", implies searching.
        // Let's clear results if empty.
        setProducts([])
        return
    }

    setLoading(true)
    try {
      const { response } = await listProducts({
        countryCode: countryCode as string,
        queryParams: {
          q: searchQuery,
          limit: 20,
        },
      })
      setProducts(response.products)
    } catch (error) {
      console.error("Error searching products:", error)
    } finally {
      setLoading(false)
    }
  }, [countryCode])

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      searchProducts(query)
    }, 500) // 500ms delay

    return () => clearTimeout(timer)
  }, [query, searchProducts])

  return (
    <div className="py-12 content-container">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-display uppercase tracking-wide">Bulk Order</h1>
          <p className="text-gray-600">
            Rapidly build your order by searching for product names or SKUs below.
          </p>
        </div>

        <div className="w-full max-w-xl">
          <Input
            placeholder="Search by product name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 text-lg border-2 border-terminal-border focus:border-businessx-yellow transition-colors"
            autoFocus
          />
        </div>

        <div className="min-h-[300px]">
          {loading ? (
            <div className="py-12 text-center text-terminal-dim animate-pulse">
              Searching...
            </div>
          ) : (
            <BulkOrderTable products={products} />
          )}
        </div>
      </div>
    </div>
  )
}
