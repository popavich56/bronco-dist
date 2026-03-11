import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import { getPayloadGlobal } from "@lib/payload"
import Image from "next/image"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteSettings = await getPayloadGlobal("site-settings")
  const logo = siteSettings?.branding?.logo
  const logoUrl = logo?.url ? (logo.url.startsWith('http') ? logo.url : `${process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8000'}${logo.url}`) : null

  return (
    <div className="w-full bg-terminal-black relative min-h-screen text-terminal-white">
      <div className="h-20 bg-terminal-black border-b border-terminal-border sticky top-0 z-50">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-terminal-dim hover:text-businessx-orange transition-colors flex items-center gap-x-2 uppercase flex-1 basis-0 group"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90 group-hover:text-businessx-orange text-terminal-dim transition-colors" size={16} />
            <span className="mt-px hidden small:block font-mono font-bold text-xs uppercase tracking-wider">
              Return to Cart
            </span>
            <span className="mt-px block small:hidden font-mono font-bold text-xs uppercase tracking-wider">
              Back
            </span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="font-display font-black text-2xl uppercase tracking-wider text-terminal-white hover:text-businessx-orange transition-colors"
            data-testid="store-link"
          >
             {logoUrl ? (
                <Image 
                  src={logoUrl} 
                  alt={logo?.alt || siteSettings?.general?.siteName || "Bronco"} 
                  width={160} 
                  height={40} 
                  className="h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                />
              ) : (
                <span className="uppercase tracking-tight">{siteSettings?.general?.siteName || "Bronco Distribution"}</span>
              )}
          </LocalizedClientLink>
          <div className="flex-1 basis-0 flex justify-end">
             <span className="font-mono text-xs text-terminal-dim uppercase font-bold tracking-widest hidden small:block">
                Secure Checkout
             </span>
          </div>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
