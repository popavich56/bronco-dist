import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import { Hero } from "@modules/home/components/hero"
import StatsBar from "@modules/home/components/stats-bar"
import MostRequested from "@modules/home/components/most-requested"
import ExploreCategories from "@modules/home/components/explore-categories"
import TopBrands from "@modules/home/components/top-brands"
import WholesaleTrust from "@modules/home/components/wholesale-trust"
import CtaBanner from "@modules/home/components/cta-banner"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { getPayloadPage, getPayloadGlobal } from "@lib/payload"
import { BlockRenderer } from "@modules/blocks"
import { Region } from "@xclade/types"

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const page = await getPayloadPage('home')
  const siteSettings = await getPayloadGlobal("site-settings")
  const storeName = siteSettings?.general?.siteName || "Bronco Distribution"

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
    description: "Colorado's wholesale smoke shop and vape distributor."
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const page = await getPayloadPage('home')

  if (page) {
    if (page.contentBlocks && page.contentBlocks.length > 0) {
      return <BlockRenderer blocks={page.contentBlocks} countryCode={countryCode} />
    }
  }

  const region = await getRegion(countryCode)
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />
      <StatsBar />
      <MostRequested />
      <ExploreCategories />
      <TopBrands />
      <div className="bg-terminal-black border-t border-terminal-border pb-20">
        <ul className="flex flex-col">
          <FeaturedProducts collections={collections} region={region as unknown as Region} />
        </ul>
      </div>
      <WholesaleTrust />
      <CtaBanner />
    </>
  )
}
