import { Package, Building2, Calendar, Truck } from "lucide-react"

const stats = [
  { icon: Package, value: "1,000+", label: "Products" },
  { icon: Building2, value: "200+", label: "Brands" },
  { icon: Calendar, value: "Since 2016", label: "Established" },
  { icon: Truck, value: "Same Day", label: "Shipping" },
]

export default function StatsBar() {
  return (
    <section className="bg-[#001F2E] border-y border-[#6DB3D9]/20">
      <div className="content-container">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#6DB3D9]/20">
          {stats.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center py-8 md:py-10 gap-2"
            >
              <Icon className="w-5 h-5 text-[#6DB3D9] mb-1" />
              <span className="text-2xl md:text-3xl font-display font-bold text-white tracking-tight">
                {value}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#6DB3D9] uppercase tracking-widest">
                {label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
