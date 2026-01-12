import { Suspense } from "react"
import { listNavCategories } from "@lib/data/categories"
import { getPayloadGlobal, getPayloadNavigation } from "@lib/payload"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MegaMenu from "@modules/layout/components/mega-menu"
import SearchBar from "@modules/layout/components/search-bar"
import Image from "next/image"
import MobileMenu from "@modules/layout/components/mobile-menu"
import BottomNav from "@modules/layout/components/bottom-nav"
import { ThemeToggle } from "@modules/layout/components/theme-toggle"
import { Box } from "lucide-react"

export default async function Nav() {
  const siteSettings = await getPayloadGlobal("site-settings")
  const mainNavigation = await getPayloadNavigation("main")
  const logo = siteSettings?.branding?.logo
  const logoUrl = logo?.url ? (logo.url.startsWith('http') ? logo.url : `${process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8000'}${logo.url}`) : null

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 mx-auto border-b border-terminal-border bg-terminal-black dark:bg-[#0a0a0a]  transition-colors duration-200">
        <nav className="content-container flex items-center justify-between w-full h-full text-sm font-mono text-terminal-white dark:text-neutral-300">
          {/* Left: Logo and Shop Trigger */}
          <div className="flex items-center gap-4 small:gap-8 h-full flex-1 basis-0">
             
             <LocalizedClientLink
              href="/"
              className="font-display font-extrabold text-2xl tracking-tighter text-terminal-white hover:text-bronco-orange transition-colors uppercase flex items-center gap-2"
              data-testid="nav-store-link"
            >
              {logoUrl ? (
                <Image 
                  src={logoUrl} 
                  alt={logo?.alt || siteSettings?.general?.siteName || "Bronco"} 
                  width={150} 
                  height={40} 
                  className="h-6 small:h-8 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                />
              ) : (
                <span className="uppercase tracking-tight">{siteSettings?.general?.siteName || "bronco"}</span>
              )}
            </LocalizedClientLink>
            
            <div className="hidden small:block h-full">
                <MegaMenu />
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden small:flex items-center h-full flex-[1.5]">
            <SearchBar />
          </div>

          {/* Right: Account and Cart */}
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              {mainNavigation?.menuItems?.map((item: any, i: number) => {
                 const { link } = item
                 let href = "/"
                 if (link.type === 'internal' && link.internalPage?.slug) href = `/${link.internalPage.slug}`
                 if (link.type === 'category' && link.category?.slug) href = `/category/${link.category.slug}`
                 if (link.type === 'external') href = link.externalUrl || "/"
                 if (link.type === 'custom') href = link.customUrl || "/"

                 return (
                  <LocalizedClientLink
                    key={i}
                    className="hover:text-bronco-orange transition-colors uppercase tracking-wider text-xs font-bold"
                    href={href}
                    target={link.newTab ? "_blank" : undefined}
                  >
                    {link.label}
                  </LocalizedClientLink>
                 )
              })}
              
              {!mainNavigation && (
                <>
                  <LocalizedClientLink
                    className="hover:text-bronco-orange transition-colors uppercase tracking-wider text-xs font-bold"
                    href="/bulk-order"
                    data-testid="nav-bulk-link"
                  >
                    Bulk Order
                  </LocalizedClientLink>
                  <LocalizedClientLink
                    className="hover:text-bronco-orange transition-colors uppercase tracking-wider text-xs font-bold"
                    href="/account"
                    data-testid="nav-account-link"
                  >
                    Account
                  </LocalizedClientLink>
                </>
              )}
            </div>
            
            {/* Cart Button */}
            <div className="hidden small:block">
                <Suspense
                fallback={
                    <LocalizedClientLink
                    className="hover:text-bronco-orange transition-colors flex gap-2 font-mono text-xs font-bold"
                    href="/cart"
                    data-testid="nav-cart-link"
                    >
                    Cart (0)
                    </LocalizedClientLink>
                }
                >
                <CartButton />
                </Suspense>
            </div>
          </div>
        </nav>
      </header>
      
      {/* Mobile Bottom Navigation */}
      <BottomNav mainNavigation={mainNavigation} />
    </div>
  )
}
