import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Page } from '@lib/payload/types'
import { Media } from '@lib/payload/types'

type HeroBlockProps = Extract<NonNullable<Page['contentBlocks']>[number], { blockType: 'hero' }>

export const HeroBlock = (props: HeroBlockProps) => {
  const { title, subtitle, backgroundImage, ctaText, ctaLink, ctaType = 'primary' } = props

  const bgImage = typeof backgroundImage === 'object' ? backgroundImage as Media : null

  return (
    <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden bg-bronco-black text-white">
      {bgImage?.url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage.url}
            alt={bgImage.alt || title}
            fill
            className="object-cover opacity-60"
            priority
          />
        </div>
      )}
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-bronco-white">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        
        {ctaText && ctaLink && (
          <Link 
            href={ctaLink}
            className={`
              inline-flex items-center justify-center px-8 py-4 text-lg font-bold uppercase tracking-wider transition-all duration-300
              ${ctaType === 'primary' 
                ? 'bg-bronco-yellow text-terminal-white hover:bg-terminal-black border-2 border-bronco-yellow hover:border-white' 
                : ctaType === 'secondary'
                ? 'bg-terminal-black text-terminal-white hover:bg-bronco-yellow hover:text-terminal-white border-2 border-white hover:border-bronco-yellow'
                : 'bg-transparent text-white border-2 border-white hover:bg-terminal-black hover:text-terminal-white'
              }
            `}
          >
            {ctaText}
          </Link>
        )}
      </div>
    </section>
  )
}
