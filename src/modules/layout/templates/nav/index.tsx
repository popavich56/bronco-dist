import { Suspense } from "react"
import { getPayloadGlobal, getPayloadNavigation } from "@lib/payload"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MegaMenu from "@modules/layout/components/mega-menu"
import SearchBar from "@modules/layout/components/search-bar"
import Image from "next/image"
import BottomNav from "@modules/layout/components/bottom-nav"
import { ThemeToggle } from "@modules/layout/components/theme-toggle"

export default async function Nav() {
  const siteSettings = await getPayloadGlobal("site-settings")
  const mainNavigation = await getPayloadNavigation("main")
  const logo = siteSettings?.branding?.logo
  const logoUrl = logo?.url
    ? logo.url.startsWith("http") ? logo.url : `${process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:8000"}${logo.url}`
    : null

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <div className="bg-terminal-surface border-b border-terminal-border text-center py-1.5 text-[11px] font-mono text-terminal-dim tracking-wide hidden small:block">
        New Arrivals added weekly — apply for an account to unlock pricing &nbsp;·&nbsp;
        <a href="tel:7204855940" className="text-[#6DB3D9] hover:text-[#ADE0EE] transition-colors">720-485-5940</a>
      </div>
      <header className="relative h-16 mx-auto border-b border-terminal-border bg-terminal-panel transition-colors duration-200">
        <nav className="content-container flex items-center justify-between w-full h-full text-sm font-mono text-terminal-white">
          <div className="flex items-center gap-4 small:gap-6 h-full flex-1 basis-0">
            <LocalizedClientLink href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity" data-testid="nav-store-link">
              {logoUrl ? (
                <Image src={logoUrl} alt={logo?.alt || "Bronco Distribution"} width={150} height={40} className="h-7 small:h-8 w-auto object-contain" />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-[#6DB3D9] to-[#ADE0EE] flex items-center justify-center text-[#001F2E] font-black text-sm">B</div>
                  <div>
                    <div className="text-sm font-black tracking-[0.1em] text-terminal-white uppercase leading-none">BRONCO</div>
                    <div className="text-[8px] font-bold tracking-[0.18em] text-terminal-dim uppercase leading-none">DISTRIBUTION</div>
                  </div>
                </div>
              )}
            </LocalizedClientLink>
            <div className="hidden small:block h-full"><MegaMenu /></div>
          </div>
          <div className="hidden small:flex items-center h-full flex-[1.5]"><SearchBar /></div>
          <div className="flex items-center gap-x-4 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-4 h-full">
              <ThemeToggle />
              {mainNavigation?.menuItems?.map((item: any, i: number) => {
                const { link } = item
                let href = "/"
                if (link.type === "internal" && link.internalPage?.slug) href = `/${link.internalPage.slug}`
                if (link.type === "category" && link.category?.slug) href = `/category/${link.category.slug}`
                if (link.type === "external") href = link.externalUrl || "/"
                if (link.type === "custom") href = link.customUrl || "/"
                return (
                  <LocalizedClientLink key={i} className="text-terminal-dim hover:text-[#ADE0EE] hover:opacity-80 transition-all duration-150 uppercase tracking-wider text-xs font-bold" href={href} target={link.newTab ? "_blank" : undefined}>
                    {link.label}
                  </LocalizedClientLink>
                )
              })}
              {!mainNavigation && (
                <LocalizedClientLink className="text-terminal-dim hover:text-[#ADE0EE] hover:opacity-80 transition-all duration-150 uppercase tracking-wider text-xs font-bold" href="/account">Account</LocalizedClientLink>
              )}
            </div>
            <div className="hidden small:block">
              <Suspense fallback={<LocalizedClientLink className="text-terminal-dim hover:text-[#6DB3D9] transition-colors flex gap-2 font-mono text-xs font-bold" href="/cart">Cart (0)</LocalizedClientLink>}>
                <CartButton />
              </Suspense>
            </div>
          </div>
        </nav>
      </header>
      <BottomNav mainNavigation={mainNavigation} />
    </div>
  )
}
