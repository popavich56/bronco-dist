import { TOP_BRANDS, TOP_BRANDS_SECTION, type BrandAccent, type TopBrand } from "@config/brands"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import type { CSSProperties } from "react"

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

// Horizontal fade applied to the background logo layer so it softens toward
// the right side of the card where the text content sits.
const logoFadeStyle: CSSProperties = {
  WebkitMaskImage:
    "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0) 90%)",
  maskImage:
    "linear-gradient(to left, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 35%, rgba(0,0,0,0.25) 65%, rgba(0,0,0,0) 90%)",
}

function BrandBackgroundLogo({ brand }: { brand: TopBrand }) {
  const { logo, logoLight, logoDark } = brand
  const lightSrc = logoLight || logo
  const darkSrc = logoDark || logo

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full opacity-60 dark:opacity-60 group-hover:opacity-95 dark:group-hover:opacity-80 transition-opacity duration-300"
      style={logoFadeStyle}
    >
      {lightSrc && (
        <div className="relative w-full h-full block dark:hidden">
          <Image
            src={lightSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 200px"
            className="object-contain object-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
          />
        </div>
      )}
      {darkSrc && (
        <div className="relative w-full h-full hidden dark:block">
          <Image
            src={darkSrc}
            alt=""
            fill
            sizes="(max-width: 640px) 60vw, (max-width: 1024px) 30vw, 200px"
            className="object-contain object-center drop-shadow-[0_4px_8px_rgba(0,0,0,0.15)]"
          />
        </div>
      )}
    </div>
  )
}

function LetterBadge({ brand }: { brand: TopBrand }) {
  const colors = accentMap[brand.accent]
  return (
    <div className={`w-16 h-16 rounded-xl ${colors.bg} flex items-center justify-center`}>
      <span className={`font-display font-black text-2xl ${colors.text}`}>
        {brand.title[0]}
      </span>
    </div>
  )
}

export default function TopBrands() {
  return (
    <section className="py-20 bg-terminal-black border-y border-terminal-border">
      <div className="content-container">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-[10px] font-mono font-bold text-[#6DB3D9] uppercase tracking-widest mb-4 block">
            {TOP_BRANDS_SECTION.eyebrow}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display uppercase leading-none tracking-tight text-terminal-white mb-4">
            {TOP_BRANDS_SECTION.heading}
          </h2>
          <p className="text-base font-mono text-terminal-dim max-w-xl leading-relaxed">
            {TOP_BRANDS_SECTION.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOP_BRANDS.map((brand) => {
            const colors = accentMap[brand.accent]
            const hasLogo = !!(brand.logo || brand.logoLight || brand.logoDark)
            return (
              <LocalizedClientLink key={brand.handle} href={brand.href} className="block">
                <div
                  className={`relative overflow-hidden border ${colors.border} bg-terminal-panel p-6 rounded-2xl hover:bg-terminal-surface hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 group min-h-[180px]`}
                >
                  {hasLogo ? (
                    <BrandBackgroundLogo brand={brand} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <LetterBadge brand={brand} />
                    </div>
                  )}
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}
