import React from 'react'
import Image from 'next/image'
import { Page, Media } from '@lib/payload/types'

type TestimonialsBlockProps = Extract<NonNullable<Page['contentBlocks']>[number], { blockType: 'testimonials' }>

export const TestimonialsBlock = (props: TestimonialsBlockProps) => {
  const { testimonials, layout = 'cards' } = props

  if (!testimonials || testimonials.length === 0) return null

  return (
    <section className="py-24 bg-businessx-gray">
      <div className="content-container px-6">
        <div className={`
          ${layout === 'cards' ? 'grid grid-cols-1 md:grid-cols-3 gap-8' : ''}
          ${layout === 'list' ? 'flex flex-col gap-8 max-w-4xl mx-auto' : ''}
          ${layout === 'carousel' ? 'grid grid-cols-1' : ''} 
        `}>
            {/* Note: Carousel logic simplified to grid for MVP */}
          {testimonials.map((item, i) => {
             const avatar = typeof item.avatar === 'object' ? item.avatar as Media : null

             return (
               <div 
                 key={item.id || i} 
                 className="bg-terminal-black p-8 border border-terminal-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-300"
               >
                 <div className="flex items-center gap-4 mb-6">
                   {avatar?.url && (
                     <div className="relative w-12 h-12 rounded-full overflow-hidden border border-black">
                       <Image 
                         src={avatar.url} 
                         alt={item.author} 
                         fill 
                         className="object-cover"
                       />
                     </div>
                   )}
                   <div>
                     <p className="font-bold text-lg leading-tight">{item.author}</p>
                     {(item.title || item.company) && (
                       <p className="text-sm text-terminal-dim">
                         {item.title}{item.title && item.company ? ' at ' : ''}{item.company}
                       </p>
                     )}
                   </div>
                 </div>
                 
                 <blockquote className="text-gray-700 italic leading-relaxed">
                   "{item.quote}"
                 </blockquote>

                 {item.rating && (
                   <div className="flex gap-1 mt-6 text-businessx-yellow">
                     {[...Array(5)].map((_, starIndex) => (
                       <svg key={starIndex} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={starIndex < (item.rating || 0) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                       </svg>
                     ))}
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
