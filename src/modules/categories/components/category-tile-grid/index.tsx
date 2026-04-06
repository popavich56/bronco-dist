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

type CategoryTileGridProps = {
  eyebrow: string
  title: string
  subtitle: string
  headingTag?: "h1" | "h2"
  limit?: number
  cta?: {
    text: string
    href: string
  }
}

export default async function CategoryTileGrid({
  eyebrow,
  title,
  subtitle,
  headingTag = "h2",
  limit,
  cta,
}: CategoryTileGridProps) {
  const categories = await listNavCategories()

  if (!categories || categories.length === 0) return null

  const display = limit ? categories.slice(0, limit) : categories

  const Heading = headingTag

  return (
    <>
      <div className="flex flex-col items-center text-center mb-14">
        <span className="text-[10px] font-mono font-bold text-[#6DB3D9] uppercase tracking-widest mb-4 block">
          {eyebrow}
        </span>
        <Heading className="text-4xl md:text-5xl font-bold font-display uppercase leading-none tracking-tight text-terminal-white mb-4">
          {title}
        </Heading>
        <p className="text-base font-mono text-terminal-dim max-w-xl leading-relaxed">
          {subtitle}
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

      {cta && (
        <div className="flex justify-center mt-10">
          <LocalizedClientLink
            href={cta.href}
            className="flex items-center gap-2 text-terminal-dim hover:text-[#6DB3D9] font-mono text-xs font-bold uppercase tracking-widest transition-all group"
          >
            {cta.text}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </LocalizedClientLink>
        </div>
      )}
    </>
  )
}
