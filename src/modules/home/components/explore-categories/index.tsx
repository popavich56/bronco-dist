import { listNavCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

const CATEGORY_IMAGES: Record<string, string> = {
  dabbing: "dabbing.jpg",
  disposables: "disposables.jpg",
  accessories: "accessories.jpg",
  "papers-cones": "papers-cones.jpg",
  "water-pipes-rigs": "water-pipes-rigs.jpg",
  "e-liquids": "e-liquids.jpg",
  pipes: "pipes.jpg",
  torches: "torches.jpg",
  "new-items": "new-items.jpg",
}

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

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {display.map((cat) => {
            const imageFile = CATEGORY_IMAGES[cat.handle]

            return (
              <LocalizedClientLink
                key={cat.id}
                href={`/categories/${cat.handle}`}
                className="relative overflow-hidden rounded-xl group min-h-[180px] md:min-h-[240px] flex items-stretch bg-terminal-surface hover:bg-terminal-highlight border border-terminal-border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative z-10 flex-1 flex flex-col justify-between p-5 md:p-6">
                  <h3 className="font-display font-bold text-sm md:text-base uppercase tracking-wide text-terminal-white leading-tight">
                    {cat.name}
                  </h3>
                  <div className="flex items-center gap-2 text-[#6DB3D9] text-xs font-mono font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Browse
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="relative z-10 w-[50%] rounded-r-xl bg-terminal-panel border-l border-terminal-border flex items-center justify-center p-3 md:p-4">
                  {imageFile ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={`/images/categories/${imageFile}`}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 25vw, 16vw"
                        className="object-contain object-center transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-1"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-lg bg-terminal-highlight" />
                  )}
                </div>
              </LocalizedClientLink>
            )
          })}
        </div>

        <div className="flex justify-center mt-10">
          <LocalizedClientLink
            href="/store"
            className="flex items-center gap-2 text-terminal-dim hover:text-[#6DB3D9] font-mono text-xs font-bold uppercase tracking-widest transition-all group"
          >
            Browse Full Catalog
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
