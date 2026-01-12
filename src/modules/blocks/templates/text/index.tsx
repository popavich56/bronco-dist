import React from 'react'
import { Page } from '@lib/payload/types'
import RichText from '@modules/common/components/rich-text'

type TextBlockProps = Extract<NonNullable<Page['contentBlocks']>[number], { blockType: 'textBlock' }>

export const TextBlock = (props: TextBlockProps) => {
  const { content, alignment = 'left' } = props

  return (
    <section className="py-20 bg-terminal-black">
      <div className={`content-container px-6 max-w-4xl text-${alignment || 'left'}`}>
        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-bronco-yellow hover:prose-a:text-black">
          <RichText content={content} />
        </div>
      </div>
    </section>
  )
}
