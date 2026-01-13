import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Page, Media } from '@lib/payload/types'

type FeaturesBlockProps = Extract<NonNullable<Page['contentBlocks']>[number], { blockType: 'features' }>

export const FeaturesBlock = (props: FeaturesBlockProps) => {
  const { title, description, features, layout = 'grid' } = props

  if (!features || features.length === 0) return null

  return (
    <section className="py-24 bg-businessx-gray bg-opacity-10">
      <div className="content-container px-6">
        <div className="text-center mb-16">
          {title && (
            <h2 className="text-4xl font-bold mb-4 tracking-tight">{title}</h2>
          )}
          {description && (
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">{description}</p>
          )}
        </div>

        <div className={`
          ${layout === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10' : ''}
          ${layout === 'list' ? 'flex flex-col gap-10 max-w-3xl mx-auto' : ''}
          ${layout === 'cards' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : ''}
        `}>
          {features.map((feature, i) => {
             const icon = typeof feature.icon === 'object' ? feature.icon as Media : null
             
             return (
               <div 
                 key={feature.id || i}
                 className={`
                   ${layout === 'cards' ? 'bg-terminal-black p-8 border-2 border-transparent hover:border-terminal-border transition-colors duration-300 shadow-none hover:shadow-none' : 'flex flex-col items-center text-center'}
                   ${layout === 'list' ? 'flex-row text-left items-start gap-6 border-b border-terminal-border pb-10 last:border-0' : ''}
                 `}
               >
                 {icon && (
                   <div className={`relative mb-6 ${layout === 'list' ? 'mb-0 shrink-0' : ''} w-16 h-16`}>
                     <Image 
                       src={icon.url || ''} 
                       alt={icon.alt || feature.title} 
                       width={64} 
                       height={64} 
                       className="object-contain"
                     />
                   </div>
                 )}
                 <div>
                   <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                   {feature.description && (
                     <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                   )}
                   {feature.link && (
                     <Link href={feature.link} className="inline-block mt-4 text-terminal-white font-bold uppercase tracking-wider text-sm border-b-2 border-businessx-yellow hover:bg-businessx-yellow transition-all">
                       Learn More
                     </Link>
                   )}
                 </div>
               </div>
             )
          })}
        </div>
      </div>
    </section>
  )
}
