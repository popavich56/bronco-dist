"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@medusajs/ui"

type Child = { id: string; name: string; handle: string }
type Category = { id: string; name: string; handle: string; category_children?: Child[] }

export default function CategorySidebar({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState<string | null>(null)
  const toggle = (id: string) => setOpen((prev) => (prev === id ? null : id))

  return (
    <aside className="w-[220px] flex-shrink-0 sticky top-[66px] self-start h-[calc(100vh-66px)] overflow-y-auto border-r border-terminal-border bg-terminal-panel no-scrollbar">
      <div className="px-4 py-4 border-b border-terminal-border">
        <LocalizedClientLink href="/store" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest font-mono text-[#6DB3D9] hover:text-[#ADE0EE] transition-colors">
          <span className="text-base">🏪</span>
          All Products
        </LocalizedClientLink>
      </div>
      <nav className="py-2">
        <div className="px-4 pt-3 pb-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-terminal-dim font-mono">Categories</span>
        </div>
        {categories.map((cat) => {
          const hasChildren = cat.category_children && cat.category_children.length > 0
          const isOpen = open === cat.id
          return (
            <div key={cat.id}>
              <div className="flex items-center group">
                <LocalizedClientLink href={`/categories/${cat.handle}`} className="flex-1 flex items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-terminal-white hover:text-[#6DB3D9] hover:bg-terminal-surface transition-all font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6DB3D9] flex-shrink-0 opacity-70 group-hover:opacity-100" />
                  {cat.name}
                </LocalizedClientLink>
                {hasChildren && (
                  <button onClick={() => toggle(cat.id)} className="px-2 py-2 text-terminal-dim hover:text-[#6DB3D9] transition-colors">
                    <ChevronDown className={clx("w-3 h-3 transition-transform duration-200", isOpen ? "rotate-180 text-[#6DB3D9]" : "")} />
                  </button>
                )}
              </div>
              {hasChildren && isOpen && (
                <ul className="ml-6 border-l border-terminal-border pb-1">
                  {cat.category_children!.map((child) => (
                    <li key={child.id}>
                      <LocalizedClientLink href={`/categories/${child.handle}`} className="block px-3 py-1.5 text-[11px] font-mono uppercase tracking-tight text-terminal-dim hover:text-[#ADE0EE] hover:bg-terminal-surface transition-all">
                        {child.name}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )
        })}
      </nav>
      <div className="mx-3 mt-4 mb-4 p-3 rounded-lg border border-terminal-border bg-terminal-surface">
        <p className="text-xs font-bold text-terminal-white mb-1">Wholesale Pricing</p>
        <p className="text-[11px] text-terminal-dim leading-relaxed mb-3">Apply for an account to unlock wholesale prices.</p>
        <LocalizedClientLink href="/account/register" className="block text-center text-[11px] font-bold uppercase tracking-wide py-2 px-3 rounded-md bg-[#6DB3D9] text-[#001F2E] hover:bg-[#ADE0EE] transition-colors">
          Apply Now →
        </LocalizedClientLink>
      </div>
      <div className="px-4 pb-4 border-t border-terminal-border pt-3">
        <p className="text-[10px] uppercase tracking-widest font-bold text-terminal-dim font-mono mb-2">Need Help?</p>
        <a href="tel:7204855940" className="flex items-center gap-1.5 text-[11px] text-terminal-dim hover:text-[#6DB3D9] transition-colors mb-1.5"><span>📞</span> 720-485-5940</a>
        <a href="mailto:Sales@BroncoDist.com" className="flex items-center gap-1.5 text-[11px] text-terminal-dim hover:text-[#6DB3D9] transition-colors"><span>✉️</span> Sales@BroncoDist.com</a>
      </div>
    </aside>
  )
}
