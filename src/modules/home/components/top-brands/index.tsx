import { TOP_BRANDS, type BrandAccent } from "@config/brands"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight } from "lucide-react"

const accentMap: Record<BrandAccent, { border: string; text: string; bg: string }> = {
  red: { border: "border-red-500/30", text: "text-red-400", bg: "bg-red-500/10" },
  tan: { border: "border-amber-600/30", text: "text-amber-500", bg: "bg-amber-600/10" },
  green: { border: "border-emerald-500/30", text: "text-emerald-400", bg: "bg-emerald-500/10" },
  blue: { border: "border-blue-500/30", text: "text-blue-400", bg: "bg-blue-500/10" },
  orange: { border: "border-orange-500/30", text: "text-orange-400", bg: "bg-orange-500/10" },
  purple: { border: "border-purple-500/30", text: "text-purple-400", bg: "bg-purple-500/10" },
  gold: { border: "border-yellow-500/30", text: "text-yellow-400", bg: "bg-yellow-500/10" },
  pink: { border: "border-pink-500/30", text: "text-pink-400", bg: "bg-pink-500/10" },
  sky: { border: "border-sky-500/30", text: "text-sky-400", bg: "bg-sky-500/10" },
  slate: { border: "border-slate-400/30", text: "text-slate-300", bg: "bg-slate-400/10" },
  lime: { border: "border-lime-500/30", text: "text-lime-400", bg: "bg-lime-500/10" },
  amber: { border: "border-amber-500/30", text: "text-amber-400", bg: "bg-amber-500/10" },
  rose: { border: "border-rose-500/30", text: "text-rose-400", bg: "bg-rose-500/10" },
  teal: { border: "border-teal-500/30", text: "text-teal-400", bg: "bg-teal-500/10" },
}

export default function TopBrands() {
  return (
    <section className="py-20 bg-terminal-black border-y border-terminal-border">
      <div className="content-container">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-[10px] font-mono font-bold text-[#6DB3D9] uppercase tracking-widest mb-4 block">
            Featured Partners
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display uppercase leading-none tracking-tight text-terminal-white mb-4">
            Top Brands
          </h2>
          <p className="text-base font-mono text-terminal-dim max-w-xl leading-relaxed">
            Industry-leading brands available at wholesale pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOP_BRANDS.map((brand) => {
            const colors = accentMap[brand.accent]
            return (
              <div
                key={brand.handle}
                className={`border ${colors.border} bg-terminal-panel p-6 flex flex-col gap-4 hover:bg-terminal-surface transition-colors group`}
              >
                <div className={`w-10 h-10 rounded-md ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                  <span className={`font-display font-black text-sm ${colors.text}`}>
                    {brand.title[0]}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-display font-bold text-lg uppercase tracking-wide text-terminal-white mb-1">
                    {brand.title}
                  </h3>
                  <span className={`text-[10px] font-mono font-bold ${colors.text} uppercase tracking-widest`}>
                    {brand.label}
                  </span>
                </div>
                <LocalizedClientLink
                  href="/account/register"
                  className={`flex items-center gap-2 ${colors.text} text-xs font-mono font-bold uppercase tracking-wider opacity-70 group-hover:opacity-100 transition-opacity`}
                >
                  Shop Brand
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </LocalizedClientLink>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
