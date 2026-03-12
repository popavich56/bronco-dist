import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { getPayloadGlobal, getPayloadNavigation } from "@lib/payload"
import Image from "next/image"
import { ThemeToggle } from "@modules/layout/components/theme-toggle"

export default async function Footer() {
  const { collections } = await listCollections()
  const productCategories = await listCategories()
  const siteSettings = await getPayloadGlobal("site-settings")
  const footerNav = await getPayloadNavigation("footer")
  const logo = siteSettings?.branding?.logoAlt || siteSettings?.branding?.logo
  const logoUrl = logo?.url ? (logo.url.startsWith('http') ? logo.url : `${process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:8000'}${logo.url}`) : null

  return (
    <footer className="border-t border-white/10 bg-terminal-black text-terminal-white dark:bg-[#0a0a0a] w-full transition-colors duration-200">
      <div className="content-container flex flex-col w-full py-16">
        <div className="flex flex-col gap-y-12 lg:flex-row items-start justify-between">
          <div className="space-y-6">
            <LocalizedClientLink
              href="/"
              className="font-display font-extrabold text-3xl tracking-tighter text-terminal-white  hover:text-businessx-orange transition-colors uppercase block"
            >
              {logoUrl ? (
                <Image 
                  src={logoUrl} 
                  alt={logo?.alt || siteSettings?.general?.siteName || "Bronco Distribution"} 
                  width={150} 
                  height={40} 
                  className="h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all" 
                />
              ) : (
                <span className="uppercase">{siteSettings?.general?.siteName || "Bronco Distribution"}</span>
              )}
            </LocalizedClientLink>
            <p className="max-w-xs font-mono text-xs text-terminal-dim leading-relaxed">
              {siteSettings?.general?.siteDescription || "Premier distribution network for tier-one inventory."}
            </p>
            {(siteSettings?.contact?.email || siteSettings?.contact?.phone) && (
              <div className="flex flex-col gap-1 text-xs font-mono font-bold text-terminal-dim">
                 {siteSettings?.contact?.email && (
                    <a href={`mailto:${siteSettings.contact.email}`} className="hover:text-businessx-orange transition-colors uppercase">{siteSettings.contact.email}</a>
                 )}
                 {siteSettings?.contact?.phone && (
                    <a href={`tel:${siteSettings.contact.phone}`} className="hover:text-businessx-orange transition-colors uppercase">{siteSettings.contact.phone}</a>
                 )}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 md:gap-x-16 w-full lg:w-auto">
            {productCategories && productCategories?.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <span className="font-mono text-[10px] font-bold text-terminal-dim uppercase tracking-widest">
                  Inventory
                </span>
                <ul className="flex flex-col gap-y-2" data-testid="footer-categories">
                  {productCategories?.slice(0, 6).map((c) => {
                    if (c.parent_category) return null

                    return (
                      <li key={c.id}>
                        <LocalizedClientLink
                          className="font-bold font-display text-sm hover:text-businessx-orange uppercase transition-colors"
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
            
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-4">
                <span className="font-mono text-[10px] font-bold text-terminal-dim uppercase tracking-widest">
                  Collections
                </span>
                <ul className="flex flex-col gap-y-2">
                  {collections?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="font-bold font-display text-sm hover:text-businessx-orange uppercase transition-colors"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="flex flex-col gap-y-4">
              <span className="font-mono text-[10px] font-bold text-terminal-dim uppercase tracking-widest">Account & Support</span>
              <ul className="flex flex-col gap-y-2">
                {footerNav?.menuItems?.map((item: any, i: number) => {
                   let href = "/"
                   if (item.linkType === 'internal' && item.internalPage?.slug) href = `/${item.internalPage.slug}`
                   if (item.linkType === 'category' && item.category?.breadcrumbs) href = `/${item.category.breadcrumbs[item.category.breadcrumbs.length - 1].handle}`
                   if (item.linkType === 'external') href = item.externalUrl || "/"
                   if (item.linkType === 'custom') href = item.customUrl || "/"

                   return (
                      <li key={i}>
                        <LocalizedClientLink
                           href={href}
                           className="font-bold font-display text-sm hover:text-businessx-orange uppercase transition-colors"
                           target={item.openInNewTab ? "_blank" : undefined}
                        >
                          {item.label}
                        </LocalizedClientLink>
                      </li>
                   )
                })}

                {!footerNav && (
                  <>
                    <li>
                      <LocalizedClientLink
                         href="/customer-service"
                         className="font-bold font-display text-sm hover:text-businessx-orange uppercase transition-colors"
                      >
                        Support
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                         href="/account"
                         className="font-bold font-display text-sm hover:text-businessx-orange uppercase transition-colors"
                      >
                        Account
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <LocalizedClientLink
                         href="/account/register"
                         className="font-bold font-display text-sm hover:text-businessx-orange uppercase transition-colors"
                      >
                        Apply for Wholesale
                      </LocalizedClientLink>
                    </li>
                    <li>
                      <a
                         href="mailto:sales@broncodist.com"
                         className="font-bold font-display text-sm hover:text-businessx-orange uppercase transition-colors"
                      >
                        Contact Us
                      </a>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row w-full mt-12 pt-6 border-t border-white/10 justify-between items-center text-terminal-dim font-mono text-[10px] uppercase tracking-widest">
          <div className="flex items-center gap-4">
            <p>
              © {new Date().getFullYear()} Bronco Distribution. All Rights Reserved.
            </p>
            <div className="opacity-50 hover:opacity-100 transition-opacity">
               <ThemeToggle />
            </div>
          </div>
          <a 
            href="https://xclade.com/designlabs" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 group mt-4 md:mt-0 opacity-60 hover:opacity-100 transition-all duration-300"
          >
            <span className="group-hover:text-businessx-orange transition-colors">Engineered by</span>
            <Image 
                src="/xclade/logo.svg" 
                alt="Xclade Design Labs" 
                width={80} 
                height={20} 
                className="h-3 w-auto grayscale group-hover:grayscale-0 transition-all duration-500" 
            />
          </a>
        </div>
      </div>
    </footer>
  )
}
