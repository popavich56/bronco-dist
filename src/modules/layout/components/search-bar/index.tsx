"use client"

import { MagnifyingGlassMini, XMark } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef, Suspense } from "react"
import { searchProducts, SearchResponse } from "@lib/data/search"
import { clx } from "@medusajs/ui"
import { Box } from "lucide-react"

const useProductSearch = ({ query, limit = 5 }: { query: string; limit?: number }) => {
  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!query) {
      setData(null)
      return
    }

    const search = async () => {
      setLoading(true)
      setError(null)

      try {
        const result = await searchProducts({ 
          query, 
          limit,
          facet_by: "category_names"
        })
        setData(result)
      } catch (err: any) {
        setError(err)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query, limit])

  return { data, loading, error }
}

const SearchBarInner = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q")
  
  const [query, setQuery] = useState(initialQuery || "")
  const [focused, setFocused] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)
  
  // Sync with URL params
  useEffect(() => {
    const q = searchParams.get("q")
    if (q !== null) {
        setQuery(q)
    } else {
        setQuery("")
    }
  }, [searchParams])
  
  const { data, loading } = useProductSearch({ query, limit: 6 })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      setFocused(false)
    }
  }

  const clearSearch = () => {
    setQuery("")
    setFocused(false)
  }

  const showResults = focused && query.length > 0 && (loading || (data?.results && data.results.length > 0) || (data?.facet_counts && data.facet_counts.length > 0))
  const categories = data?.facet_counts?.find(f => f.field_name === 'category_names')?.counts || []

  return (
    <div ref={wrapperRef} className="flex-1 max-w-2xl mx-auto h-full flex items-center justify-center p-2">
      <div className="relative w-full z-[60]">
        <form onSubmit={handleSubmit} className="relative w-full">
          <input
            type="search"
            value={query}
            onFocus={() => setFocused(true)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search catalog..."
            className="w-full h-10 pl-10 pr-10 bg-terminal-surface border border-terminal-border text-terminal-white placeholder-terminal-dim font-mono text-xs rounded-none focus:outline-none focus:border-bronco-orange focus:ring-0 transition-all uppercase tracking-wide"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-terminal-dim">
            <MagnifyingGlassMini className="w-5 h-5" />
          </div>
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-terminal-dim hover:text-bronco-orange transition-colors"
            >
              <XMark className="w-5 h-5" />
            </button>
          )}
        </form>

        {showResults && (
          <div className="absolute top-full left-0 right-0 mt-0 bg-terminal-panel border border-terminal-border border-t-0 shadow-none overflow-hidden flex flex-col">
            {loading ? (
              <div className="p-4 text-center text-terminal-dim font-mono text-xs animate-pulse">
                INITIALIZING SEARCH...
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto">
                {/* Categories */}
                {categories.length > 0 && (
                  <div className="border-b border-terminal-border">
                    <div className="px-4 py-2 bg-terminal-surface">
                      <h3 className="text-[10px] font-bold text-terminal-dim uppercase tracking-widest font-mono">
                        Categories
                      </h3>
                    </div>
                    {categories.slice(0, 4).map((category, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          router.push(`/search?q=${encodeURIComponent(category.value)}`)
                          setFocused(false)
                        }}
                        className="w-full flex items-center justify-between px-4 py-2 hover:bg-terminal-highlight transition-colors group text-left"
                      >
                        <span className="flex items-center gap-2">
                          <Box className="w-3 h-3 text-terminal-dim group-hover:text-bronco-orange transition-colors" />
                          <span className="font-display font-bold text-terminal-white text-sm uppercase transition-colors">
                            {category.value}
                          </span>
                        </span>
                        <span className="text-[10px] font-mono text-terminal-dim bg-terminal-surface px-1.5 py-0.5">
                          {category.count}
                        </span>
                      </button>
                    ))}
                  </div>
                )}

                {/* Products */}
                {data?.results && data.results.length > 0 && (
                  <div>
                     {categories.length > 0 && (
                      <div className="px-4 py-2 bg-terminal-surface border-b border-terminal-border">
                        <h3 className="text-[10px] font-bold text-terminal-dim uppercase tracking-widest font-mono">
                          Manifest
                        </h3>
                      </div>
                    )}
                    {data.results.map((product) => (
                      <LocalizedClientLink
                        key={product.id}
                        href={`/products/${product.handle}`}
                        className="flex items-center gap-4 px-4 py-3 hover:bg-terminal-highlight transition-colors group border-b border-terminal-border last:border-0"
                        onClick={() => setFocused(false)}
                      >
                        {product.thumbnail && (
                          <div className="w-10 h-10 border border-terminal-border overflow-hidden flex-shrink-0 bg-terminal-surface">
                            <img 
                              src={product.thumbnail} 
                              alt={product.title} 
                              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all opacity-80 group-hover:opacity-100"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display font-bold text-terminal-white text-sm truncate uppercase transition-colors">
                            {product.title}
                          </h4>
                          {product.skus?.[0] && (
                            <p className="text-[10px] text-terminal-dim font-mono mt-0.5">
                              ID: {product.skus[0]}
                            </p>
                          )}
                        </div>
                      </LocalizedClientLink>
                    ))}
                  </div>
                )}
                
                <div className="p-2 border-t border-terminal-border sticky bottom-0 bg-terminal-panel">
                  <button
                    onClick={() => {
                        router.push(`/search?q=${encodeURIComponent(query)}`)
                        setFocused(false)
                    }}
                    className="w-full py-2 text-center text-xs font-bold font-mono uppercase bg-terminal-surface hover:bg-bronco-orange hover:text-white transition-all border border-terminal-border hover:border-bronco-orange text-terminal-white"
                  >
                    View all {data?.count} results
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Backdrop */}
      {focused && (
        <div 
          className="fixed inset-0 bg-terminal-black/50 z-[55]" 
          aria-hidden="true"
          onClick={() => setFocused(false)}
        />
      )}
    </div>
  )
}

const SearchBar = () => {
    return (
        <Suspense fallback={
            <div className="flex-1 max-w-2xl mx-auto h-full flex items-center justify-center p-2 isolate">
                 <div className="w-full h-10 bg-terminal-surface border border-terminal-border" />
            </div>
        }>
            <SearchBarInner />
        </Suspense>
    )
}

export default SearchBar
