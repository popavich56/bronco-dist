import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import { FeaturedReviews } from "@modules/home/components/featured-reviews"
import { Hero } from "@modules/home/components/hero"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getPayloadPage, getPayloadGlobal } from "@lib/payload"
import { BlockRenderer } from "@modules/blocks"
import { listLatestReviews } from "@lib/data/reviews"
import { Region } from "@xclade/types"

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const page = await getPayloadPage('home')

  // Get store configuration for dynamic branding
  const siteSettings = await getPayloadGlobal("site-settings")
  const storeName = siteSettings?.general?.siteName || "BusinessX"

  if (page && page.seo) {
    return {
      title: page.seo.title || page.title,
      description: page.seo.description,
      openGraph: {
        title: page.seo.ogTitle || page.seo.title || page.title,
        description: page.seo.ogDescription || page.seo.description || undefined,
        images: page.seo.ogImage && typeof page.seo.ogImage === 'object' && page.seo.ogImage.url ? [page.seo.ogImage.url] : undefined
      }
    }
  }

  return {
    title: storeName,
    description: "Premium tactical gear and equipment distribution."
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  // 1. Try to fetch 'home' page from Payload CMS
  const page = await getPayloadPage('home')

  if (page) {
    if (page.contentBlocks && page.contentBlocks.length > 0) {
       return <BlockRenderer blocks={page.contentBlocks} countryCode={countryCode} />
    }


  }

  // 2. Fallback to hardcoded homepage if CMS page is missing
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })
  
  const reviews = await listLatestReviews(3)

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <div className="bg-terminal-black border-t border-terminal-border pb-20">
        <ul className="flex flex-col">
          <FeaturedProducts collections={collections} region={region as unknown as import("@xclade/types").Region} />
        </ul>
      </div>
      <FeaturedReviews reviews={reviews} />
    </>
  )
}
