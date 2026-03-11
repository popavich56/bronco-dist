import { Package, Zap, HeadphonesIcon, Tag } from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Curated Wholesale Products",
    description: "A focused catalog of proven smoke shop and vape products retailers actually sell.",
  },
  {
    icon: Zap,
    title: "Fast Order Fulfillment",
    description: "Orders processed quickly so your shelves stay stocked.",
  },
  {
    icon: HeadphonesIcon,
    title: "Retailer-Focused Support",
    description: "Our team understands smoke shop retail and helps you choose products that move.",
  },
  {
    icon: Tag,
    title: "Competitive Wholesale Pricing",
    description: "Strong margins and dependable supply for growing stores.",
  },
]

export default function WholesaleTrust() {
  return (
    <section className="py-20 bg-terminal-panel border-b border-terminal-border">
      <div className="content-container">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-[10px] font-mono font-bold text-[#6DB3D9] uppercase tracking-widest mb-4 block">
            Why Retailers Choose Bronco
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display uppercase leading-none tracking-tight text-terminal-white mb-6">
            Built for Smoke Shops<br className="hidden md:block" /> &amp; Vape Retailers
          </h2>
          <p className="text-base md:text-lg font-mono text-terminal-dim max-w-2xl leading-relaxed">
            Bronco Distribution supplies retailers across Colorado with trusted wholesale products, fast fulfillment, and competitive pricing.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-terminal-border border border-terminal-border">
          {features.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-terminal-panel p-8 flex flex-col gap-4 hover:bg-terminal-surface transition-colors group"
            >
              <div className="w-10 h-10 rounded-md bg-[#6DB3D9]/10 border border-[#6DB3D9]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#6DB3D9]/20 transition-colors">
                <Icon className="w-5 h-5 text-[#6DB3D9]" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm uppercase tracking-wide text-terminal-white mb-2 leading-tight">
                  {title}
                </h3>
                <p className="text-xs font-mono text-terminal-dim leading-relaxed">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
