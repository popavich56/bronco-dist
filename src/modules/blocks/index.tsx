import React from 'react'
import { Page } from '@lib/payload/types'
import { HeroBlock } from './templates/hero'
import { TextBlock } from './templates/text'
import { FeaturesBlock } from './templates/features'
import { CtaBlock } from './templates/cta'
import { ProductCollectionBlock } from './templates/product-collection'
import { ImageGalleryBlock } from './templates/gallery'
import { TestimonialsBlock } from './templates/testimonials'
import { VideoBlock } from './templates/video'
import { BlogPostsBlock } from './templates/blog-posts'

type Block = NonNullable<Page['contentBlocks']>[number]

export const BlockRenderer = ({ blocks, countryCode }: { blocks?: Block[] | null, countryCode: string }) => {
  if (!blocks) return null

  return (
    <>
      {blocks.map((block, index) => {
        const { blockType } = block
        // Access aliased fields from GraphQL response
        const b = block as any

        switch (blockType) {
          case 'hero':
            return <HeroBlock key={index} {...block} title={b.heroTitle} alignment={b.heroAlignment} />
          case 'textBlock':
            return <TextBlock key={index} {...block} alignment={b.textAlignment} />
          case 'features':
             return <FeaturesBlock key={index} {...block} title={b.featuresTitle} layout={b.featuresLayout} />
          case 'cta':
            return <CtaBlock key={index} {...block} title={b.ctaTitle} />
          case 'productCollectionBlock':
             return <ProductCollectionBlock key={index} {...block} title={b.collectionTitle} layout={b.collectionLayout} countryCode={countryCode} />
          case 'reusableContentBlock':
             // @ts-ignore - Dynamic types from recursive reusable blocks
             const reusableBlocks = block.blockReference?.content
             if (reusableBlocks) {
               return <BlockRenderer key={index} blocks={reusableBlocks} countryCode={countryCode} />
             }
             return null
          case 'imageGallery':
            // FIX: 'layout' prop in component is 'galleryLayout'
            return <ImageGalleryBlock key={index} {...block} title={b.galleryTitle} galleryLayout={b.galleryLayout} />
          case 'testimonials':
            return <TestimonialsBlock key={index} {...block} layout={b.testimonialsLayout} />
          case 'video':
            // FIX: Explicitly pass 'videoType' as done in LiveBlockRenderer
            return <VideoBlock key={index} {...block} title={b.videoTitle} videoType={b.videoType} videoFile={b.videoFile} />
          case 'blogPosts':
            return <BlogPostsBlock key={index} {...block} title={b.blogPostsTitle} layout={b.blogPostsLayout} />
          default:
            return null
        }
      })}
    </>
  )
}
