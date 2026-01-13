"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { SortOptions } from "../refinement-list/sort-products"
import { Grip, List } from "lucide-react"
import { clx } from "@medusajs/ui"

type StoreToolbarProps = {
  sortBy: SortOptions
  limit: number
  view: "grid" | "list"
}

const StoreToolbar = ({ sortBy, limit, view }: StoreToolbarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)
      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  return (
    <div className="flex flex-col small:flex-row justify-between items-start small:items-center mb-8 pb-6 border-b-2 border-terminal-border/10  gap-4">
      <div className="flex items-center gap-x-2">
           <span className="text-xs font-bold uppercase text-terminal-dim  tracking-wide">Sort By</span>
           <select 
             value={sortBy}
             onChange={(e) => setQueryParams("sortBy", e.target.value as SortOptions)}
             className="border-2 border-terminal-border dark:border-white p-2 font-bold bg-terminal-black  text-terminal-white  text-sm focus:outline-none focus:shadow-none-sm transition-shadow cursor-pointer"
           >
             <option value="created_at">Latest Arrivals</option>
             <option value="price_asc">Price: Low - High</option>
             <option value="price_desc">Price: High - Low</option>
           </select>
      </div>

      <div className="flex items-center gap-x-6 w-full small:w-auto justify-between small:justify-end">
        {/* View Toggle */}
        <div className="flex items-center gap-x-2">
            <span className="text-xs font-bold uppercase text-terminal-dim  tracking-wide hidden small:block">View</span>
            <div className="flex border-2 border-terminal-border dark:border-white">
                <button
                    onClick={() => setQueryParams("view", "grid")}
                    className={clx(
                        "p-2 transition-colors hover:bg-terminal-highlight dark:hover:bg-terminal-black/10",
                        view === "grid" ? "bg-businessx-black text-white hover:bg-businessx-black dark:bg-terminal-black dark:text-black dark:hover:bg-terminal-black" : "bg-terminal-black text-terminal-dim  "
                    )}
                >
                    <Grip className="w-5 h-5" />
                </button>
                <div className="w-[2px] bg-businessx-black dark:bg-terminal-black" />
                <button
                    onClick={() => setQueryParams("view", "list")}
                    className={clx(
                        "p-2 transition-colors hover:bg-terminal-highlight dark:hover:bg-terminal-black/10",
                        view === "list" ? "bg-businessx-black text-white hover:bg-businessx-black dark:bg-terminal-black dark:text-black dark:hover:bg-terminal-black" : "bg-terminal-black text-terminal-dim  "
                    )}
                >
                    <List className="w-5 h-5" />
                </button>
            </div>
        </div>

        {/* Limit Selector */}
        <div className="flex items-center gap-x-2">
           <span className="text-xs font-bold uppercase text-terminal-dim  tracking-wide">Show</span>
           <select 
             value={limit}
             onChange={(e) => setQueryParams("limit", e.target.value)}
             className="border-2 border-terminal-border dark:border-white p-2 font-bold bg-terminal-black  text-terminal-white  text-sm focus:outline-none focus:shadow-none-sm transition-shadow cursor-pointer"
           >
             <option value="12">12</option>
             <option value="24">24</option>
             <option value="48">48</option>
           </select>
        </div>
      </div>
    </div>
  )
}

export default StoreToolbar
