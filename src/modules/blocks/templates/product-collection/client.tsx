'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Page, ProductCollection as PayloadProductCollection } from '@lib/payload/types'
import { Product } from "@xclade/types"
import { ProductPreviewCard } from '@modules/products/components/product-preview/card'
import { getProductPrice } from '@lib/util/get-product-price'

type ProductCollectionBlockProps = Extract<NonNullable<Page['contentBlocks']>[number], { blockType: 'productCollectionBlock' }> & {
  countryCode: string
}

export const ProductCollectionBlockClient = (props: ProductCollectionBlockProps) => {
  const { title, description, collection, limit = 4, layout = 'grid', countryCode } = props
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  // Resolve collection ID safely
  const collectionId = collection && typeof collection === 'object' && 'collectionId' in collection 
      ? collection.collectionId 
      : null
  const collectionHandle = collection && typeof collection === 'object' && 'handle' in collection 
      ? collection.handle 
      : null

  useEffect(() => {
    if (!collectionId) return

    let isMounted = true
    setLoading(true)

    fetch(`/api/medusa/products?collection_id=${collectionId}&country_code=${countryCode}&limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.products) {
          setProducts(data.products as Product[])
        }
      })
      .catch(err => console.error("Failed to load products", err))
      .finally(() => {
        if (isMounted) setLoading(false)
      })

      return () => { isMounted = false }
  }, [collectionId, countryCode, limit])

  if (!collectionId) return null
  if (loading && products.length === 0) {
      return (
          <section className="py-20 animate-pulse">
              <div className="content-container px-6">
                 <div className="h-8 bg-gray-200 w-1/3 mb-4 rounded"></div>
                 <div className="grid grid-cols-4 gap-6">
                     {[1,2,3,4].map(i => <div key={i} className="aspect-square bg-gray-200 rounded"></div>)}
                 </div>
              </div>
          </section>
      )
  }

  if (products.length === 0) return null

  // Helper to calculate price on client
  const renderProduct = (product: Product) => {
      const { cheapestPrice } = getProductPrice({ product })
      return <ProductPreviewCard key={product.id} product={product} price={cheapestPrice || null} view={layout === 'list' ? 'list' : 'grid'} />
  }

  return (
    <section className="py-20">
      <div className="content-container px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-gray-600 text-lg">{description}</p>
            )}
          </div>
          {typeof collection === 'object' && 'handle' in collection && (
               <Link 
               href={`/collections/${collection.handle || ''}`}
               className="text-terminal-white font-bold uppercase tracking-wider border-b-2 border-bronco-yellow hover:bg-bronco-yellow transition-all pb-1"
             >
               View All Products
             </Link>
          )}
        </div>

        {layout === 'grid' && (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map(renderProduct)}
          </ul>
        )}

        {layout === 'list' && (
           <div className="flex flex-col gap-6">
              {products.map(p => (
                  <div key={p.id} className="flex gap-4 border p-4">
                      {renderProduct(p)}
                  </div>
              ))}
           </div>
        )}
        
         {layout === 'carousel' && (
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
               {products.map(renderProduct)}
            </ul>
         )}
      </div>
    </section>
  )
}
