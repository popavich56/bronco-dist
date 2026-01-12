import React from 'react'
import Image from 'next/image'
import { Page, Media } from '@lib/payload/types'
import GallerySlider from './slider'

type ImageGalleryBlockProps = Extract<NonNullable<Page['contentBlocks']>[number], { blockType: 'imageGallery' }> & {
    galleryLayout?: 'grid' | 'carousel' | 'masonry'
    sliderSettings?: {
        autoplay?: boolean
        autoplaySpeed?: number
        showArrows?: boolean
        showDots?: boolean
    }
}

export const ImageGalleryBlock = (props: ImageGalleryBlockProps) => {
  const { images, galleryLayout = 'grid', sliderSettings } = props

  if (!images || images.length === 0) return null

  if (galleryLayout === 'carousel') {
      return <GallerySlider images={images} settings={sliderSettings} />
  }

  // Basic Grid Layout
  return (
    <section className="py-20 bg-terminal-black">
        <div className="content-container px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {images.map((item, i) => {
                    const img = typeof item.image === 'object' ? item.image as Media : null
                    if (!img?.url) return null

                    return (
                        <div 
                            key={item.id || i}
                            className="relative group overflow-hidden w-full aspect-square bg-terminal-surface"
                        >
                            <Image
                                src={img.url}
                                alt={item.alt || img.alt || 'Gallery image'}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            {item.caption && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                    <p className="text-sm">{item.caption}</p>
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    </section>
  )
}
