"use client"

import { useEffect, useState, useRef, Fragment } from "react"
import { useRouter } from "next/navigation"
import { Dialog, Transition } from "@headlessui/react"
import { MagnifyingGlassMini, XMark } from "@medusajs/icons"
import { searchProducts, SearchResponse } from "@lib/data/search"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type MobileSearchProps = {
  isOpen: boolean
  close: () => void
}

const MobileSearch = ({ isOpen, close }: MobileSearchProps) => {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [data, setData] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    } else {
        // Reset state when closed
        setQuery("")
        setData(null)
    }
  }, [isOpen])

  // Search Logic (Copied/Adapted from SearchBar)
  useEffect(() => {
    if (!query) {
      setData(null)
      return
    }

    const search = async () => {
      setLoading(true)
      try {
        const result = await searchProducts({ 
          query, 
          limit: 10,
          facet_by: "category_names"
        })
        setData(result)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}`)
      close()
    }
  }

  const hasResults = (data?.results && data.results.length > 0) || (data?.facet_counts && data.facet_counts.length > 0)
  const categories = data?.facet_counts?.find(f => f.field_name === 'category_names')?.counts || []

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[150]" onClose={close}>
        {/* Full screen backdrop */}
        <div className="fixed inset-0 bg-terminal-black z-50 flex flex-col h-[calc(100vh-4rem)]">
          {/* Header & Input */}
          <div className="flex-shrink-0 px-4 py-4 border-b border-terminal-border bg-terminal-panel sticky top-0 z-10">
            <div className="flex gap-3 items-center">
                <form onSubmit={handleSubmit} className="flex-1 relative">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <MagnifyingGlassMini className="w-5 h-5 text-terminal-dim group-focus-within:text-bronco-yellow transition-colors" />
                        </div>
                        <input
                            ref={inputRef}
                            type="search"
                            className="block w-full pl-11 pr-10 py-3.5 border-2 border-terminal-border  rounded-none leading-5 bg-terminal-panel  placeholder-gray-400 focus:outline-none focus:bg-terminal-black dark:focus:bg-zinc-800 focus:border-terminal-border dark:focus:border-white focus:ring-0 transition-all font-display font-bold uppercase tracking-wide text-terminal-white "
                            placeholder="Find products..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <button
                                type="button"
                                onClick={() => setQuery("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-terminal-dim hover:text-terminal-white dark:hover:text-white"
                            >
                                <XMark className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                </form>
                <button 
                    onClick={close} 
                    className="p-2 text-xs font-bold uppercase tracking-widest text-terminal-white/60 /60 hover:text-terminal-white dark:hover:text-white"
                >
                    Cancel
                </button>
            </div>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto bg-terminal-black dark:bg-black">
            {loading ? (
                // Skeleton Loading
                <div className="p-4 space-y-4">
                    <div className="h-6 w-1/3 bg-terminal-highlight  rounded animate-pulse mb-6"/>
                    {[1, 2, 3, 4].map((i) => (
                         <div key={i} className="flex items-center gap-4 px-2">
                            <div className="w-16 h-16 bg-terminal-highlight  rounded-none animate-pulse shrink-0" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 w-3/4 bg-terminal-highlight  rounded animate-pulse" />
                                <div className="h-3 w-1/2 bg-terminal-highlight  rounded animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : query && !hasResults ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                    <MagnifyingGlassMini className="w-12 h-12 text-gray-200 dark:text-zinc-700 mb-4" />
                    <p className="font-display font-bold text-lg text-terminal-white  uppercase">No results found</p>
                    <p className="text-terminal-dim  text-sm mt-1">Try adjusting your search terms</p>
                </div>
            ) : query && hasResults ? (
                <div className="pb-10">
                     {/* Suggest Categories */}
                     {categories.length > 0 && (
                        <div className="py-2">
                             <h3 className="px-6 py-2 text-xs font-bold text-terminal-dim dark:text-terminal-dim uppercase tracking-widest">
                                Categories
                            </h3>
                            <div className="flex flex-wrap gap-2 px-6">
                                {categories.slice(0, 5).map((cat: any) => (
                                    <button
                                        key={cat.value}
                                        onClick={() => {
                                            router.push(`/search?q=${encodeURIComponent(cat.value)}`)
                                            close()
                                        }}
                                        className="px-3 py-1.5 bg-terminal-panel  border border-terminal-border dark:border-zinc-700 rounded-full text-xs font-bold uppercase text-terminal-white dark:text-neutral-200 hover:border-terminal-border dark:hover:border-white hover:bg-bronco-black dark:hover:bg-terminal-black hover:text-white dark:hover:text-black transition-all"
                                    >
                                        {cat.value}
                                    </button>
                                ))}
                            </div>
                        </div>
                     )}

                     {/* Products */}
                     {data?.results && (
                        <div className="mt-4">
                            <h3 className="px-6 py-2 text-xs font-bold text-terminal-dim dark:text-terminal-dim uppercase tracking-widest border-b border-terminal-border ">
                                Products
                            </h3>
                            {data.results.map((product) => (
                                <LocalizedClientLink
                                    key={product.id}
                                    href={`/products/${product.handle}`}
                                    className="flex items-center gap-4 px-6 py-4 border-b border-gray-50  hover:bg-bronco-yellow/5  transition-colors group"
                                    onClick={close}
                                >
                                    <div className="w-16 h-16 rounded-none bg-terminal-highlight  border border-terminal-border  overflow-hidden shrink-0 relative">
                                        {product.thumbnail ? (
                                            <img 
                                                src={product.thumbnail} 
                                                alt={product.title} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-zinc-600">
                                                <MagnifyingGlassMini />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-display font-bold text-sm text-terminal-white  uppercase truncate pr-4 group-hover:text-terminal-white dark:group-hover:text-white transition-colors">
                                            {product.title}
                                        </h4>
                                        <p className="text-xs text-terminal-dim  font-mono mt-1">
                                            {product.skus?.[0] || "N/A"}
                                        </p>
                                    </div>
                                    <div className="text-gray-300 dark:text-zinc-600 group-hover:text-terminal-white dark:group-hover:text-white transition-colors">
                                        &rarr;
                                    </div>
                                </LocalizedClientLink>
                            ))}
                        </div>
                     )}
                     
                     <div className="p-4 mt-2">
                        <button
                            onClick={() => {
                                router.push(`/search?q=${encodeURIComponent(query)}`)
                                close()
                            }}
                            className="w-full py-3 bg-bronco-black dark:bg-terminal-black text-white dark:text-black font-bold uppercase rounded-none hover:bg-bronco-black/90 dark:hover:bg-gray-200 transition-colors shadow-none-sm"
                        >
                            View all {data?.count} results
                        </button>
                     </div>
                </div>
            ) : (
                // Empty State / Initial
                <div className="p-6 text-center">
                    <p className="text-terminal-dim text-sm italic">Start typing to search...</p>
                </div>
            )}
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MobileSearch
