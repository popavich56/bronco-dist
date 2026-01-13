import React, { Suspense } from 'react'
import Link from 'next/link'
import { Page, ProductCollection as PayloadProductCollection } from '@lib/payload/types'
import { listProducts } from '@lib/data/products'
import ProductPreview from '@modules/products/components/product-preview'
import { getRegion } from '@lib/data/regions'
import { ArrowRight, Box } from "lucide-react"

type ProductCollectionBlockProps = Extract<NonNullable<Page['contentBlocks']>[number], { blockType: 'productCollectionBlock' }> & {
  countryCode: string
}

export const ProductCollectionBlock = async (props: ProductCollectionBlockProps) => {
  const { title, description, collection, limit = 4, layout = 'grid', showPrice = true, showAddToCart = true, countryCode } = props

  // Resolve collection ID
  let medusaCollectionId: string | null = null
  let collectionHandle: string = ''
  
  if (collection && typeof collection === 'object' && 'collectionId' in collection) {
      medusaCollectionId = collection.collectionId
      collectionHandle = collection.handle || ''
  } else if (typeof collection === 'number') {
      console.warn("ProductCollection block has unexpanded collection relation.")
      return null
  }

  if (!medusaCollectionId) return null

  const region = await getRegion(countryCode)
  if (!region) return null

  const { response: { products } } = await listProducts({
      countryCode,
      queryParams: {
          collection_id: [medusaCollectionId],
          limit: limit || 4,
      }
  })

  if (!products || products.length === 0) return null

  return (
    <section className="py-24 bg-terminal-black border-t border-terminal-border relative overflow-hidden">
      <div className="content-container px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 border-l-2 border-businessx-orange pl-6">
          <div className="max-w-2xl">
             <div className="flex items-center gap-2 mb-2 text-businessx-orange">
                <Box className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-widest">Inventory Sector</span>
             </div>
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold mb-2 font-display uppercase leading-none text-terminal-white tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-terminal-dim font-mono text-sm max-w-lg">{description}</p>
            )}
          </div>
          <Link 
            href={`/collections/${collectionHandle}`}
            className="flex items-center gap-2 px-6 py-3 bg-transparent border border-terminal-border text-terminal-white hover:border-businessx-orange hover:text-businessx-orange font-mono text-xs font-bold uppercase tracking-widest transition-all group"
          >
            Access Full List
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {layout === 'grid' || layout === 'carousel' ? (
           <ul className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-terminal-border border border-terminal-border">
             {products.map((product) => (
               <li key={product.id} className="bg-terminal-black">
                 <ProductPreview 
                   product={product} 
                   region={region} 
                   isFeatured 
                 />
               </li>
             ))}
           </ul>
        ) : (
           <div className="flex flex-col gap-px bg-terminal-border border border-terminal-border">
              {products.map((product) => (
                  <div key={product.id} className="bg-terminal-black">
                      <ProductPreview 
                        product={product} 
                        region={region}
                        view="list" 
                      />
                  </div>
              ))}
           </div>
        )}
      </div>
    </section>
  )
}
