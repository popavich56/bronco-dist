'use client'

import React from 'react'
import { Page } from '@lib/payload/types'
import { useLivePreview } from '@lib/payload/useLivePreview'
import { HeroBlock } from './templates/hero'
import { TextBlock } from './templates/text'
import { FeaturesBlock } from './templates/features'
import { CtaBlock } from './templates/cta'
import { ProductCollectionBlockClient } from './templates/product-collection/client'
import { ImageGalleryBlock } from './templates/gallery'
import { TestimonialsBlock } from './templates/testimonials'
import { VideoBlock } from './templates/video'
import { BlogPostsBlock } from './templates/blog-posts'

export const LiveBlockRenderer = ({ 
    initialPage, 
    countryCode 
}: { 
    initialPage: Page, 
    countryCode: string 
}) => {
  const page = useLivePreview(initialPage)

  // Debug: Log the page content to verify live updates
  if (process.env.NODE_ENV === 'development') {
    console.log('[LiveBlockRenderer] Page Data:', page)
  }

  if (!page || !page.contentBlocks) return null

  return (
    <>
      {page.contentBlocks.map((block, index) => {
        const { blockType } = block
        const b = block as any

        // Helper to get property from live stream (raw name) or graphql (aliased name)
        // GraphQL aliases were used to avoid conflicts, but Live Preview sends raw 'title', 'layout', etc.
        const getProp = (alias: string, raw: string) => b[raw] !== undefined ? b[raw] : b[alias]

        switch (blockType) {
          case 'hero':
            return <HeroBlock 
              key={index} 
              {...block} 
              title={getProp('heroTitle', 'title')} 
              alignment={getProp('heroAlignment', 'alignment')} 
            />
          case 'textBlock':
            return <TextBlock 
              key={index} 
              {...block} 
              alignment={getProp('textAlignment', 'alignment')} 
            />
          case 'features':
             return <FeaturesBlock 
               key={index} 
               {...block} 
               title={getProp('featuresTitle', 'title')} 
               layout={getProp('featuresLayout', 'layout')} 
             />
          case 'cta':
            return <CtaBlock 
              key={index} 
              {...block} 
              title={getProp('ctaTitle', 'title')} 
            />
          case 'productCollectionBlock':
             return <ProductCollectionBlockClient 
               key={index} 
               {...block} 
               title={getProp('collectionTitle', 'title')} 
               layout={getProp('collectionLayout', 'layout')} 
               countryCode={countryCode} 
             />
          case 'reusableContentBlock':
             return null
          case 'imageGallery':
            return <ImageGalleryBlock 
              key={index} 
              {...block} 
              title={getProp('galleryTitle', 'title')} 
              galleryLayout={getProp('galleryLayout', 'layout')} 
            />
          case 'testimonials':
            return <TestimonialsBlock 
              key={index} 
              {...block} 
              layout={getProp('testimonialsLayout', 'layout')} 
            />
          case 'video':
            return <VideoBlock 
              key={index} 
              {...block} 
              title={getProp('videoTitle', 'title')} 
              videoType={b.videoType}
              videoFile={b.videoFile}
              autoplay={b.autoplay}
              controls={b.controls}
            />
          case 'blogPosts':
            return <BlogPostsBlock 
              key={index} 
              {...block} 
              title={getProp('blogPostsTitle', 'title')} 
              layout={getProp('blogPostsLayout', 'layout')} 
            />
          default:
            return null
        }
      })}
    </>
  )
}
