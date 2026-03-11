"use client"

import { Popover, Transition } from "@headlessui/react"
import { Fragment } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@medusajs/ui"
import { useNavigation } from "@modules/layout/components/navigation-provider"
import { ChevronDown, LayoutGrid } from "lucide-react"

const MegaMenu = () => {
  const { categories } = useNavigation()
  return (
    <Popover className="h-full flex items-center">
      {({ open, close }) => (
        <>
          <Popover.Button
            className={clx(
              "h-full flex items-center px-4 font-bold font-mono text-xs uppercase tracking-widest transition-colors focus:outline-none gap-2 border-b-2",
              open ? "text-[#6DB3D9] border-[#6DB3D9] bg-terminal-surface" : "text-terminal-dim border-transparent hover:text-[#ADE0EE] hover:border-[#6DB3D9]"
            )}
            data-testid="nav-shop-link"
          >
            <LayoutGrid className="w-4 h-4" />
            Inventory
            <ChevronDown className={clx("w-3 h-3 transition-transform duration-200", open ? "rotate-180" : "")} />
          </Popover.Button>
          <Transition as={Fragment} enter="transition ease-out duration-200" enterFrom="opacity-0 -translate-y-2" enterTo="opacity-100 translate-y-0" leave="transition ease-in duration-150" leaveFrom="opacity-100 translate-y-0" leaveTo="opacity-0 -translate-y-2">
            <Popover.Panel className="absolute top-full left-0 w-full bg-terminal-panel border-b border-terminal-border z-50 shadow-lg">
              <div className="content-container py-8 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center gap-2 mb-8 border-b border-terminal-border pb-4">
                  <LayoutGrid className="w-4 h-4 text-[#6DB3D9]" />
                  <span className="text-xs font-mono font-bold text-[#6DB3D9] uppercase tracking-widest">All Categories</span>
                  <LocalizedClientLink href="/store" className="ml-auto text-xs font-mono text-terminal-dim hover:text-[#ADE0EE] transition-colors uppercase tracking-wide" onClick={close}>View All</LocalizedClientLink>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                  {categories.map((category) => (
                    <div key={category.id} className="flex flex-col gap-3 group">
                      <LocalizedClientLink href={`/categories/${category.handle}`} className="font-display font-bold text-sm uppercase tracking-wide text-terminal-white hover:text-[#6DB3D9] transition-colors flex items-center gap-2" onClick={close}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6DB3D9] flex-shrink-0" />
                        {category.name}
                      </LocalizedClientLink>
                      {category.category_children && category.category_children.length > 0 && (
                        <ul className="flex flex-col gap-1 pl-4 border-l border-terminal-border">
                          {category.category_children.map((child) => (
                            <li key={child.id}>
                              <LocalizedClientLink href={`/categories/${child.handle}`} className="text-xs font-mono text-terminal-dim hover:text-[#ADE0EE] transition-colors uppercase tracking-tight block py-1" onClick={close}>{child.name}</LocalizedClientLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
                {categories.length === 0 && (
                  <div className="flex flex-col gap-2 items-center justify-center py-12 text-terminal-dim font-mono text-xs">
                    <Text>No Categories Found.</Text>
                    <LocalizedClientLink href="/store" className="underline hover:text-[#6DB3D9]" onClick={close}>View Full Inventory</LocalizedClientLink>
                  </div>
                )}
              </div>
            </Popover.Panel>
          </Transition>
          {open && <div className="fixed inset-0 top-[var(--nav-height,64px)] z-40 bg-terminal-black/60" aria-hidden="true" onClick={close} />}
        </>
      )}
    </Popover>
  )
}

export default MegaMenu
