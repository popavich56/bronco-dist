import React from 'react'
import { Page, Blog } from '@lib/payload/types'
import Link from 'next/link'
import Image from 'next/image'

type BlogPostsBlockProps = Extract<NonNullable<Page['contentBlocks']>[number], { blockType: 'blogPosts' }>

export const BlogPostsBlock = (props: BlogPostsBlockProps) => {
  const { title, description, posts, limit, layout, showExcerpt, showDate, showReadMore } = props

  if (!posts || posts.length === 0) return null

  // Ensure posts are fully populated objects, not just IDs
  const validPosts = posts.filter(post => typeof post === 'object' && post !== null) as Blog[]

  return (
    <section className="w-full py-16 bg-terminal-panel">
      <div className="content-container px-6">
        <div className="text-center mb-12">
          {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
          {description && <p className="text-lg text-gray-600 max-w-2xl mx-auto">{description}</p>}
        </div>

        <div className={`grid gap-8 ${layout === 'list' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
          {validPosts.slice(0, limit || 3).map((post) => (
            <div key={post.id} className="bg-terminal-black rounded-none shadow-none hover:shadow-none transition-shadow duration-300 overflow-hidden border border-terminal-border flex flex-col">
              {/* @ts-ignore - heroImage might be in contentBlocks or direct field depending on schema, adjusting for new schema */}
              {/* Using a placeholder logic since we removed generic hero field from Pages but Blog has contentBlocks */}
              <div className="relative h-48 w-full bg-gray-200">
                  {/* Ideally fetch the first image from contentBlocks or a dedicated featured image if added */}
                  <div className="absolute inset-0 flex items-center justify-center text-terminal-dim">
                    <span className="text-sm">Image Placeholder</span>
                  </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  {/* @ts-ignore */}
                   {post.categories && post.categories.length > 0 && typeof post.categories[0] === 'object' && (
                       <span className="text-xs font-semibold tracking-wider text-bronco-yellow uppercase mb-2 inline-block">
                           {/* @ts-ignore */}
                           {post.categories[0].name}
                       </span>
                   )}
                   <h3 className="text-xl font-bold text-terminal-white mb-2 line-clamp-2">
                     <Link href={`/blog/${post.slug}`} className="hover:text-bronco-yellow transition-colors">
                       {post.title}
                     </Link>
                   </h3>
                   {showDate && (
                     <div className="text-sm text-terminal-dim mb-3">
                       {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                     </div>
                   )}
                </div>

                {showExcerpt && (
                   // Note: Excerpt generation from contentBlocks is complex, using description or falling back
                   <div className="text-gray-600 mb-6 line-clamp-3 text-sm flex-1">
                      {/* @ts-ignore */}
                     {post.excerpt || "Click to read more..."} 
                   </div>
                )}

                {showReadMore && (
                  <Link href={`/blog/${post.slug}`} className="inline-flex items-center text-terminal-white font-semibold hover:text-bronco-yellow transition-colors mt-auto">
                    Read Article 
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
