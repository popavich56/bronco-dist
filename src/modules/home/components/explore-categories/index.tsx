import { listNavCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight } from "lucide-react"

export default async function ExploreCategories() {
  const categories = await listNavCategories()

  if (!categories || categories.length === 0) return null

  // Take up to 9 top-level categories for the 3x3 grid
  const display = categories.slice(0, 9)

  return (
    <section className="py-20 bg-terminal-panel border-y border-terminal-border">
      <div className="content-container">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-[10px] font-mono font-bold text-[#6DB3D9] uppercase tracking-widest mb-4 block">
            Browse Inventory
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display uppercase leading-none tracking-tight text-terminal-white mb-4">
            Explore Categories
          </h2>
          <p className="text-base font-mono text-terminal-dim max-w-xl leading-relaxed">
            Shop by category to find exactly what your store needs.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-terminal-border border border-terminal-border">
          {display.map((cat) => (
            <LocalizedClientLink
              key={cat.id}
              href={`/categories/${cat.handle}`}
              className="bg-terminal-panel p-6 md:p-8 flex flex-col justify-between gap-4 hover:bg-terminal-surface transition-colors group min-h-[120px]"
            >
              <h3 className="font-display font-bold text-sm md:text-base uppercase tracking-wide text-terminal-white leading-tight">
                {cat.name}
              </h3>
              <div className="flex items-center gap-2 text-[#6DB3D9] text-xs font-mono font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Browse
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </div>
            </LocalizedClientLink>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <LocalizedClientLink
            href="/store"
            className="flex items-center gap-2 text-terminal-dim hover:text-[#6DB3D9] font-mono text-xs font-bold uppercase tracking-widest transition-all group"
          >
            View All Categories
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
