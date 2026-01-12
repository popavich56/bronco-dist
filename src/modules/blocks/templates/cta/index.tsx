import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Page, Media } from '@lib/payload/types'

type CtaBlockProps = Extract<NonNullable<Page['contentBlocks']>[number], { blockType: 'cta' }>

export const CtaBlock = (props: CtaBlockProps) => {
  const { title, description, buttonText, buttonLink, buttonStyle, backgroundColor, backgroundImage } = props
  
  const bgImage = typeof backgroundImage === 'object' ? backgroundImage as Media : null

  return (
    <section 
      className="relative py-24 overflow-hidden"
      style={{ backgroundColor: backgroundColor || 'var(--terminal-black)' }}
    >
      {bgImage?.url && (
        <div className="absolute inset-0 z-0">
          <Image
            src={bgImage.url}
            alt={bgImage.alt || title}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
      )}

      <div className="relative z-10 content-container px-6 text-center">
        <h2 className={`text-4xl md:text-5xl font-bold mb-6 tracking-tight ${bgImage ? 'text-white' : 'text-terminal-white'}`}>
          {title}
        </h2>
        {description && (
          <p className={`text-xl mb-10 max-w-2xl mx-auto ${bgImage ? 'text-gray-200' : 'text-terminal-dim'}`}>
            {description}
          </p>
        )}
        <Link 
          href={buttonLink || '#'}
          className={`
            inline-flex items-center justify-center px-10 py-5 text-lg font-bold uppercase tracking-wider transition-all duration-300
            ${buttonStyle === 'secondary' 
              ? 'bg-transparent border-2 border-white text-white hover:bg-terminal-black hover:text-black' 
              : buttonStyle === 'outline' && !bgImage
              ? 'bg-transparent border-2 border-terminal-border text-terminal-white hover:bg-bronco-black hover:text-white'
              : 'bg-bronco-black text-white hover:bg-bronco-yellow hover:text-black border-2 border-transparent'
            }
          `}
        >
          {buttonText}
        </Link>
      </div>
    </section>
  )
}
