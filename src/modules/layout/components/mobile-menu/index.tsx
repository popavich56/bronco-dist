"use client"

import { usePathname } from "next/navigation"
import { useEffect, useState, Fragment } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { BarsThree, XMark } from "@medusajs/icons"
import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ProductCategory } from "@xclade/types"
import SearchBar from "../search-bar"

type MobileMenuProps = {
  categories: ProductCategory[]
  mainNavigation: any
}

const MobileMenu = ({ categories, mainNavigation }: MobileMenuProps) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const openCategory = (id: string) => {
    setActiveCategory(activeCategory === id ? null : id)
  }

  return (
    <div className="md:hidden flex items-center">
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 text-terminal-white hover:text-terminal-white/70 transition-colors"
        aria-label="Open menu"
      >
        <BarsThree className="w-6 h-6" />
      </button>

      <Transition show={isOpen} as={Fragment}>
        <Dialog 
          as="div" 
          className="relative z-[100]" 
          onClose={setIsOpen}
        >
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
          </Transition.Child>

          {/* Slide-out panel */}
          <div className="fixed inset-0 z-40 flex">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-300 sm:duration-500"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-300 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-terminal-panel pb-12 shadow-none">
                <div className="flex px-4 pb-2 pt-5">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-none p-2 text-terminal-white/50"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMark className="w-6 h-6" />
                  </button>
                </div>

                {/* Search in Menu - Removed as it is now in the header */}

                {/* Links */}
                <div className="space-y-6 px-4 py-6">
                  {/* Shop Categories Accordion */}
                   <div className="flow-root">
                    <Text className="font-display font-bold text-lg uppercase mb-4 text-terminal-white">Shop</Text>
                    <div className="flex flex-col gap-y-4">
                        <LocalizedClientLink 
                            href="/products"
                            className="text-base font-bold text-terminal-white/70 hover:text-terminal-white uppercase"
                        >
                            All Products
                        </LocalizedClientLink>
                        {categories.map((category) => (
                            <div key={category.id} className="flex flex-col">
                                <div className="flex justify-between items-center">
                                    <LocalizedClientLink
                                        href={`/categories/${category.handle}`}
                                        className="text-base font-bold text-terminal-white hover:text-terminal-white uppercase flex-1"
                                    >
                                        {category.name}
                                    </LocalizedClientLink>
                                    {category.category_children && category.category_children.length > 0 && (
                                        <button 
                                            onClick={() => openCategory(category.id)}
                                            className="p-2 text-terminal-white/50"
                                        >
                                            <span className="text-xs">{activeCategory === category.id ? '−' : '+'}</span>
                                        </button>
                                    )}
                                </div>
                                
                                {activeCategory === category.id && category.category_children && (
                                    <div className="flex flex-col gap-2 mt-2 pl-4 border-l-2 border-terminal-border/5">
                                        {category.category_children.map((child) => (
                                            <LocalizedClientLink
                                                key={child.id}
                                                href={`/categories/${child.handle}`}
                                                className="text-sm text-terminal-white/70 hover:text-terminal-white uppercase"
                                            >
                                                {child.name}
                                            </LocalizedClientLink>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                  </div>

                  <div className="border-t border-terminal-border/10 pt-6">
                    <div className="flex flex-col gap-y-4">
                         {mainNavigation?.menuItems?.map((item: any, i: number) => {
                             const { link } = item
                             let href = "/"
                             if (link.type === 'internal' && link.internalPage?.slug) href = `/${link.internalPage.slug}`
                             if (link.type === 'category' && link.category?.slug) href = `/category/${link.category.slug}`
                             if (link.type === 'external') href = link.externalUrl || "/"
                             if (link.type === 'custom') href = link.customUrl || "/"
                             
                             return (
                                <LocalizedClientLink
                                    key={i}
                                    href={href}
                                    target={link.newTab ? "_blank" : undefined}
                                    className="font-medium text-terminal-white hover:text-terminal-white/70"
                                >
                                    {link.label}
                                </LocalizedClientLink>
                             )
                         })}

                         <LocalizedClientLink
                            href="/account"
                            className="font-medium text-terminal-white hover:text-terminal-white/70"
                          >
                            Account
                          </LocalizedClientLink>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default MobileMenu
