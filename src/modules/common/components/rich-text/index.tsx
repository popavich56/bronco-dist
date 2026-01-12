import React, { Fragment } from 'react'
import Link from 'next/link'
import escapeHTML from 'lodash/escape'

export const IS_BOLD = 1
export const IS_ITALIC = 1 << 1
export const IS_STRIKETHROUGH = 1 << 2
export const IS_UNDERLINE = 1 << 3
export const IS_CODE = 1 << 4
export const IS_SUBSCRIPT = 1 << 5
export const IS_SUPERSCRIPT = 1 << 6
export const IS_HIGHLIGHT = 1 << 7

type Node = {
  type: string
  value?: {
    url: string
    alt: string
  }
  children?: Node[]
  url?: string
  [key: string]: any
}

const isText = (node: any): boolean => {
  return node.type === 'text' || typeof node.text === 'string'
}

export const Serialize = ({ children }: { children: Node[] }) => {
  return children?.map((node, i) => {
    if (isText(node)) {
      let text = <span dangerouslySetInnerHTML={{ __html: escapeHTML(node.text) }} />

      // Handle Slate-style booleans (legacy/Slate)
      if (node.bold) text = <strong key={i}>{text}</strong>
      if (node.code) text = <code key={i}>{text}</code>
      if (node.italic) text = <em key={i}>{text}</em>
      if (node.underline) text = <span style={{ textDecoration: 'underline' }} key={i}>{text}</span>
      if (node.strikethrough) text = <span style={{ textDecoration: 'line-through' }} key={i}>{text}</span>

      // Handle Lexical-style bitmask (Payload 3.0)
      if (typeof node.format === 'number') {
        if (node.format & IS_BOLD) text = <strong key={i}>{text}</strong>
        if (node.format & IS_ITALIC) text = <em key={i}>{text}</em>
        if (node.format & IS_STRIKETHROUGH) text = <span style={{ textDecoration: 'line-through' }} key={i}>{text}</span>
        if (node.format & IS_UNDERLINE) text = <span style={{ textDecoration: 'underline' }} key={i}>{text}</span>
        if (node.format & IS_CODE) text = <code key={i}>{text}</code>
        if (node.format & IS_SUBSCRIPT) text = <sub key={i}>{text}</sub>
        if (node.format & IS_SUPERSCRIPT) text = <sup key={i}>{text}</sup>
      }

      return <Fragment key={i}>{text}</Fragment>
    }

    if (!node) {
      return null
    }

    // Handle block alignment and indentation
    const alignment = node.format === 'center' ? 'text-center' : 
                      node.format === 'right' ? 'text-right' : 
                      node.format === 'justify' ? 'text-justify' : 
                      node.format === 'start' ? 'text-left' : 
                      node.format === 'left' ? 'text-left' : ''
    
    // Simple indent handling (20px per indent level)
    const indentStyle = node.indent > 0 ? { paddingInlineStart: `${node.indent * 20}px` } : {}

    switch (node.type) {
      case 'h1':
        return (
          <h1 key={i} className={`text-4xl font-bold mb-4 ${alignment}`} style={indentStyle}>
            <Serialize children={node.children || []} />
          </h1>
        )
      case 'h2':
        return (
          <h2 key={i} className={`text-3xl font-bold mb-3 ${alignment}`} style={indentStyle}>
            <Serialize children={node.children || []} />
          </h2>
        )
      case 'h3':
        return (
          <h3 key={i} className={`text-2xl font-bold mb-2 ${alignment}`} style={indentStyle}>
            <Serialize children={node.children || []} />
          </h3>
        )
      case 'h4':
        return (
          <h4 key={i} className={`text-xl font-bold mb-2 ${alignment}`} style={indentStyle}>
            <Serialize children={node.children || []} />
          </h4>
        )
      case 'h5':
        return (
          <h5 key={i} className={`text-lg font-bold mb-1 ${alignment}`} style={indentStyle}>
            <Serialize children={node.children || []} />
          </h5>
        )
      case 'h6':
        return (
          <h6 key={i} className={`text-base font-bold mb-1 ${alignment}`} style={indentStyle}>
            <Serialize children={node.children || []} />
          </h6>
        )
      case 'quote':
        return (
          <blockquote key={i} className={`border-l-4 border-gray-300 pl-4 italic my-4 ${alignment}`} style={indentStyle}>
            <Serialize children={node.children || []} />
          </blockquote>
        )
      case 'ul':
        return (
          <ul key={i} className={`list-disc list-inside mb-4 ${alignment}`} style={indentStyle}>
            <Serialize children={node.children || []} />
          </ul>
        )
      case 'ol':
        return (
          <ol key={i} className={`list-decimal list-inside mb-4 ${alignment}`} style={indentStyle}>
            <Serialize children={node.children || []} />
          </ol>
        )
      case 'li':
        return (
          <li key={i} className={alignment}>
            <Serialize children={node.children || []} />
          </li>
        )
      case 'link':
        return (
          <Link
            key={i}
            href={escapeHTML(node.url)}
            className={`text-blue-600 hover:underline ${alignment}`}
          >
            <Serialize children={node.children || []} />
          </Link>
        )
      
      case 'upload': 
        // Handle upload node if present in rich text
        // Center/Right alignment for images
        let imgClass = "max-w-full h-auto"
        if (node.format === 'center') imgClass += " mx-auto"
        if (node.format === 'right') imgClass += " ml-auto"

        return (
            <div key={i} className={`my-4 ${alignment}`} style={indentStyle}>
                <img src={node.value?.url} alt={node.value?.alt} className={imgClass} />
            </div>
        )

      default:
        // Render paragraph by default
        if (node.type === 'paragraph' || !node.type) {
             return (
                <p key={i} className={`mb-4 ${alignment}`} style={indentStyle}>
                    <Serialize children={node.children || []} />
                </p>
            )
        }
        
        return (
             <div key={i} className={alignment} style={indentStyle}>
                 <Serialize children={node.children || []} />
             </div>
        )
    }
  })
}

const RichText = ({ content, className }: { content: any, className?: string }) => {
  if (!content) {
    return null
  }

  // Handle Lexical structure specifically
  // Lexical wraps everything in a 'root' node.
  if (content.root && content.root.children) {
      return (
          <div className={`${className} rich-text`}>
              <Serialize children={content.root.children} />
          </div>
      )
  }

  // Handle Slate structure (array of nodes)
  if (Array.isArray(content)) {
      return (
        <div className={`${className} rich-text`}>
            <Serialize children={content} />
        </div>
      )
  }

  return null
}

export default RichText
