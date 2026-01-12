import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getPayloadPage } from "@lib/payload"
import { BlockRenderer } from "@modules/blocks"

type Props = {
  params: Promise<{ countryCode: string; slug: string[] }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const pageSlug = slug[slug.length - 1]
  
  const page = await getPayloadPage(pageSlug)
  if (!page) {
      return {
          title: 'Not Found',
          description: 'The page you are looking for does not exist.'
      }
  }

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description,
    openGraph: {
        title: page.seo?.ogTitle || page.seo?.title || page.title,
        description: page.seo?.ogDescription || page.seo?.description || undefined,
        images: page.seo?.ogImage && typeof page.seo?.ogImage === 'object' && page.seo?.ogImage.url ? [page.seo?.ogImage.url] : undefined
    }
  }
}

export default async function Page({ params }: Props) {
  const { countryCode, slug } = await params
  const pageSlug = slug[slug.length - 1]

  const page = await getPayloadPage(pageSlug)

  if (!page) {
    notFound()
  }

  return <BlockRenderer blocks={page.contentBlocks} countryCode={countryCode} />
}
