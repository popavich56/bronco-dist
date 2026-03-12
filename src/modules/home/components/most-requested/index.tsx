"use client"

import { useState } from "react"
import { BRONCO_BRANDS, type BrandAccent } from "@config/brands"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight, Check } from "lucide-react"

const accentMap: Record<BrandAccent, { border: string; text: string; bg: string; tab: string; tabActive: string }> = {
  red: { border: "border-red-500/30", text: "text-red-400", bg: "bg-red-500/10", tab: "hover:text-red-400", tabActive: "text-red-400 border-red-400" },
  tan: { border: "border-amber-600/30", text: "text-amber-500", bg: "bg-amber-600/10", tab: "hover:text-amber-500", tabActive: "text-amber-500 border-amber-500" },
  green: { border: "border-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-500/10", tab: "hover:text-emerald-400", tabActive: "text-emerald-400 border-emerald-400" },
  blue: { border: "border-blue-500/30", text: "text-blue-400", bg: "bg-blue-500/10", tab: "hover:text-blue-400", tabActive: "text-blue-400 border-blue-400" },
  orange: { border: "border-orange-500/30", text: "text-orange-400", bg: "bg-orange-500/10", tab: "hover:text-orange-400", tabActive: "text-orange-400 border-orange-400" },
  purple: { border: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/10", tab: "hover:text-purple-400", tabActive: "text-purple-400 border-purple-400" },
  gold: { border: "border-yellow-500/30", text: "text-yellow-400", bg: "bg-yellow-500/10", tab: "hover:text-yellow-400", tabActive: "text-yellow-400 border-yellow-400" },
  pink: { border: "border-pink-500/30", text: "text-pink-400", bg: "bg-pink-500/10", tab: "hover:text-pink-400", tabActive: "text-pink-400 border-pink-400" },
  sky: { border: "border-sky-500/30", text: "text-sky-400", bg: "bg-sky-500/10", tab: "hover:text-sky-400", tabActive: "text-sky-400 border-sky-400" },
  slate: { border: "border-slate-400/30", text: "text-slate-300", bg: "bg-slate-400/10", tab: "hover:text-slate-300", tabActive: "text-slate-300 border-slate-300" },
  lime: { border: "border-lime-500/30", text: "text-lime-400", bg: "bg-lime-500/10", tab: "hover:text-lime-400", tabActive: "text-lime-400 border-lime-400" },
  amber: { border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/10", tab: "hover:text-amber-400", tabActive: "text-amber-400 border-amber-400" },
  rose: { border: "border-rose-500/30", text: "text-rose-400", bg: "bg-rose-500/10", tab: "hover:text-rose-400", tabActive: "text-rose-400 border-rose-400" },
  teal: { border: "border-teal-500/30", text: "text-teal-400", bg: "bg-teal-500/10", tab: "hover:text-teal-400", tabActive: "text-teal-400 border-teal-400" },
}

export default function MostRequested() {
  const [activeIdx, setActiveIdx] = useState(0)
  const brand = BRONCO_BRANDS[activeIdx]
  const colors = accentMap[brand.accent]

  return (
    <section className="py-20 bg-terminal-black border-y border-terminal-border">
      <div className="content-container">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="text-[10px] font-mono font-bold text-[#6DB3D9] uppercase tracking-widest mb-4 block">
            Retailer Favorites
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display uppercase leading-none tracking-tight text-terminal-white mb-4">
            Most Requested
          </h2>
          <p className="text-base font-mono text-terminal-dim max-w-xl leading-relaxed">
            The brands Colorado retailers ask for most.
          </p>
        </div>

        {/* Tabs — scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 px-4 mb-8">
          <div className="flex gap-1 min-w-max border-b border-terminal-border">
            {BRONCO_BRANDS.map((b, i) => {
              const c = accentMap[b.accent]
              return (
                <button
                  key={b.handle}
                  onClick={() => setActiveIdx(i)}
                  className={`px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                    i === activeIdx
                      ? c.tabActive
                      : `text-terminal-dim border-transparent ${c.tab}`
                  }`}
                >
                  {b.title}
                </button>
              )
            })}
          </div>
        </div>

        {/* Brand detail panel */}
        <div className={`border ${colors.border} bg-terminal-panel`}>
          <div className="grid md:grid-cols-2">
            {/* Left — brand info */}
            <div className="p-8 md:p-10 flex flex-col gap-6">
              <div>
                <span className={`text-[10px] font-mono font-bold ${colors.text} uppercase tracking-widest mb-2 block`}>
                  {brand.category}
                </span>
                <h3 className="text-3xl md:text-4xl font-display font-bold uppercase tracking-tight text-terminal-white mb-1">
                  {brand.title}
                </h3>
                <span className="text-sm font-mono text-terminal-dim">
                  {brand.label}
                </span>
              </div>
              <p className="text-sm font-mono text-terminal-dim leading-relaxed">
                {brand.description}
              </p>
              <ul className="flex flex-col gap-2">
                {brand.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2">
                    <Check className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                    <span className="text-sm font-mono text-terminal-white">
                      {h}
                    </span>
                  </li>
                ))}
              </ul>
              <LocalizedClientLink
                href="/account/register"
                className={`inline-flex items-center gap-2 ${colors.text} text-xs font-mono font-bold uppercase tracking-wider mt-2 group`}
              >
                Apply to view {brand.title} products
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </LocalizedClientLink>
            </div>

            {/* Right — honest MVP placeholder */}
            <div className={`${colors.bg} flex items-center justify-center p-8 md:p-10 border-t md:border-t-0 md:border-l ${colors.border}`}>
              <div className="text-center max-w-xs">
                <div className={`w-16 h-16 rounded-full ${colors.bg} border ${colors.border} flex items-center justify-center mx-auto mb-6`}>
                  <span className={`font-display font-black text-2xl ${colors.text}`}>
                    {brand.title[0]}
                  </span>
                </div>
                <p className="text-sm font-mono text-terminal-dim leading-relaxed mb-4">
                  {brand.title} products and wholesale pricing are available to approved accounts.
                </p>
                <LocalizedClientLink
                  href="/account/register"
                  className={`inline-flex items-center gap-2 text-xs font-mono font-bold ${colors.text} uppercase tracking-wider group`}
                >
                  Apply for Access
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
