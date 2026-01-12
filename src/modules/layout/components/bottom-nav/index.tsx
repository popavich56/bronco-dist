"use client"

import { useState, Fragment, Suspense } from "react"
import { usePathname } from "next/navigation"
import { Dialog, Transition } from "@headlessui/react"
import { SquaresPlus, MagnifyingGlassMini, User, ShoppingBag, XMark } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx, Text } from "@medusajs/ui"
import MobileCategories from "../mobile-categories"
import MobileSearch from "../mobile-search"
import { useNavigation } from "@modules/layout/components/navigation-provider"

type BottomNavProps = {
  mainNavigation: any
}

const BottomNav = ({ mainNavigation }: BottomNavProps) => {
  const { categories } = useNavigation()

  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState<"shop" | "search" | null>(null)
  
  // Close when path changes
  const [prevPath, setPrevPath] = useState(pathname)
  if (pathname !== prevPath) {
      setActiveTab(null)
      setPrevPath(pathname)
  }

  return (
    <>
        <div className="fixed bottom-0 inset-x-0 z-[100] bg-terminal-panel border-t-2 border-terminal-border h-16 small:hidden">
            <div className="grid grid-cols-4 h-full">
                {/* Account */}
                <LocalizedClientLink 
                    href="/account"
                    className="flex flex-col items-center justify-center gap-1 text-terminal-white hover:bg-terminal-highlight transition-colors"
                >
                    <User className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Account</span>
                </LocalizedClientLink>

                {/* Categories / Shop */}
                 <button 
                    onClick={() => setActiveTab(activeTab === "shop" ? null : "shop")}
                    className={clx(
                        "flex flex-col items-center justify-center gap-1 transition-colors",
                        activeTab === "shop" ? "bg-bronco-black text-white" : "text-terminal-white hover:bg-terminal-highlight"
                    )}
                >
                    <SquaresPlus className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Shop</span>
                </button>

                {/* Search */}
                <button 
                    onClick={() => setActiveTab(activeTab === "search" ? null : "search")}
                    className={clx(
                        "flex flex-col items-center justify-center gap-1 transition-colors",
                        activeTab === "search" ? "bg-bronco-black text-white" : "text-terminal-white hover:bg-terminal-highlight"
                    )}
                >
                    <MagnifyingGlassMini className="w-6 h-6" />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Search</span>
                </button>

                {/* Cart */}
                <div className="flex flex-col items-center justify-center gap-1 text-terminal-white hover:bg-terminal-highlight transition-colors cursor-pointer relative">
                     <LocalizedClientLink href="/cart" className="flex flex-col items-center justify-center w-full h-full">
                        <ShoppingBag className="w-6 h-6" />
                        <span className="text-[10px] font-bold uppercase tracking-wide">Cart</span>
                     </LocalizedClientLink>
                </div>
            </div>
        </div>

        {/* Mobile Overlays */}
        <MobileCategories
            isOpen={activeTab === "shop"}
            close={() => setActiveTab(null)}
            categories={categories}
        />
        
        <MobileSearch
             isOpen={activeTab === "search"}
             close={() => setActiveTab(null)}
        />
    </>
  )
}

export default BottomNav
