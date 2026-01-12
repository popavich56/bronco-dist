"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { XMark, Minus, Plus } from "@medusajs/icons"
import { ProductCategory } from "@xclade/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"

type MobileCategoriesProps = {
  isOpen: boolean
  close: () => void
  categories: ProductCategory[]
}

const MobileCategories = ({ isOpen, close, categories }: MobileCategoriesProps) => {
  const pathname = usePathname()
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Close when path changes
  useEffect(() => {
    close()
  }, [pathname])

  const toggleCategory = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setActiveCategory(activeCategory === id ? null : id)
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[150]" onClose={close}>
        {/* Full screen white background */}
        <div className="fixed inset-0 bg-terminal-black z-50 overflow-hidden flex flex-col h-[calc(100vh-4rem)]">
          {/* Header */}
          <div className="flex-shrink-0 px-6 py-4 border-b border-terminal-border bg-terminal-panel sticky top-0 z-10 flex justify-between items-center">
            <h2 className="text-xl font-display font-black uppercase tracking-tight text-terminal-white ">
              Start Exploring
            </h2>
            <button
              onClick={close}
              className="p-2 text-terminal-white/50 /50 hover:text-terminal-white dark:hover:text-white transition-colors rounded-full hover:bg-bronco-black/5 dark:hover:bg-terminal-black/10"
            >
              <span className="sr-only">Close</span>
              <XMark className="w-6 h-6" />
            </button>
          </div>

          {/* Content: Categories */}
          <div className="flex-1 overflow-y-auto bg-terminal-panel/50 dark:bg-neutral-900/50 p-6">
            <div className="space-y-4">
              <LocalizedClientLink
                href="/products"
                className="block bg-terminal-black  p-5 rounded-none border-2 border-transparent hover:border-terminal-border dark:hover:border-white shadow-none transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg text-terminal-white  uppercase">
                    All Products
                  </span>
                  <div className="w-8 h-8 rounded-full bg-bronco-black dark:bg-terminal-black text-white dark:text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-lg leading-none">&rarr;</span>
                  </div>
                </div>
              </LocalizedClientLink>

              {categories.map((category) => {
                const hasChildren =
                  category.category_children && category.category_children.length > 0
                const isActive = activeCategory === category.id

                return (
                  <div
                    key={category.id}
                    className="bg-terminal-black  rounded-none border border-terminal-border  shadow-none overflow-hidden"
                  >
                    <div className="flex items-center justify-between p-1 pr-2">
                        <LocalizedClientLink
                            href={`/categories/${category.handle}`}
                            className="flex-1 p-4 font-display font-bold text-lg text-terminal-white  uppercase hover:text-terminal-white/70 dark:hover:text-white/70 transition-colors"
                        >
                            {category.name}
                        </LocalizedClientLink>
                      
                        {hasChildren && (
                            <button
                            onClick={(e) => toggleCategory(category.id, e)}
                            className="w-10 h-10 flex items-center justify-center rounded-none hover:bg-bronco-black/5  text-terminal-white/60 /60 transition-colors"
                            >
                            {isActive ? (
                                <Minus className="w-5 h-5" />
                            ) : (
                                <Plus className="w-5 h-5" />
                            )}
                            </button>
                        )}
                    </div>

                    {/* Children Accordion Body */}
                    <div
                        className={clx(
                        "bg-terminal-panel dark:bg-zinc-950 border-t border-terminal-border  transition-all duration-300 ease-in-out overflow-hidden",
                        isActive ? "max-h-[500px] opacity-100 py-2" : "max-h-0 opacity-0 py-0"
                        )}
                    >
                        {category.category_children?.map((child) => (
                        <LocalizedClientLink
                            key={child.id}
                            href={`/categories/${child.handle}`}
                            className="block px-6 py-3 text-sm font-medium text-gray-600  hover:text-terminal-white dark:hover:text-white hover:bg-terminal-highlight  transition-colors capitalize"
                        >
                            {child.name}
                        </LocalizedClientLink>
                        ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default MobileCategories
