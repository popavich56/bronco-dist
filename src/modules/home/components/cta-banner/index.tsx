import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ArrowRight, UserPlus, ShieldCheck, ShoppingCart } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Register",
    description: "Fill out the wholesale application with your business details and reseller permit.",
  },
  {
    icon: ShieldCheck,
    step: "02",
    title: "Get Approved",
    description: "Our team reviews applications within 1–2 business days.",
  },
  {
    icon: ShoppingCart,
    step: "03",
    title: "Start Ordering",
    description: "Access wholesale pricing, place orders, and restock your shelves.",
  },
]

export default function CtaBanner() {
  return (
    <section className="py-20 bg-[#001F2E] border-y border-[#6DB3D9]/20">
      <div className="content-container">
        <div className="flex flex-col items-center text-center mb-14">
          <span className="text-[10px] font-mono font-bold text-[#6DB3D9] uppercase tracking-widest mb-4 block">
            Ready to Stock Up?
          </span>
          <h2 className="text-4xl md:text-5xl font-bold font-display uppercase leading-none tracking-tight text-white mb-4">
            Get Started in 3 Steps
          </h2>
          <p className="text-base font-mono text-white/60 max-w-xl leading-relaxed">
            From application to your first order — it only takes a few minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {steps.map(({ icon: Icon, step, title, description }) => (
            <div
              key={step}
              className="border border-[#6DB3D9]/20 bg-[#001F2E] p-8 flex flex-col items-center text-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-[#6DB3D9]/10 border border-[#6DB3D9]/20 flex items-center justify-center">
                <Icon className="w-5 h-5 text-[#6DB3D9]" />
              </div>
              <span className="text-[10px] font-mono font-bold text-[#6DB3D9] uppercase tracking-widest">
                Step {step}
              </span>
              <h3 className="font-display font-bold text-xl uppercase tracking-wide text-white">
                {title}
              </h3>
              <p className="text-sm font-mono text-white/50 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <LocalizedClientLink
            href="/account/register"
            className="inline-flex items-center gap-3 h-12 px-8 bg-[#6DB3D9] hover:bg-[#ADE0EE] text-[#001F2E] font-bold uppercase tracking-widest text-xs transition-all group"
          >
            Apply Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </LocalizedClientLink>
        </div>
      </div>
    </section>
  )
}
