import { notFound } from "next/navigation"
import { getPayloadPage } from "@lib/payload"
import { LiveBlockRenderer } from "@modules/blocks/LiveBlockRenderer"


type Props = {
  params: Promise<{ countryCode: string; slug: string }>
}


// ... (props)

export default async function PreviewPage({ params }: Props) {
  const { countryCode, slug } = await params

  // Fetch the page directly from Payload, bypassing Next.js cache if needed
  // In a real preview scenario, you might pass a ?draft=true param and use it in fetch headers
  // For now, we reuse the same fetcher but often preview mode in Payload sends a draft token
  const page = await getPayloadPage(slug, true)

  if (!page) {
    notFound()
  }

  const hasBlocks = page.contentBlocks && page.contentBlocks.length > 0

  if (!hasBlocks) {
    return (
      <>
        <div className="bg-businessx-yellow text-businessx-black text-center py-2 font-bold uppercase tracking-wider text-sm sticky top-0 z-50">
          Preview Mode
        </div>
        <div className="container mx-auto py-20 text-center">
            <h1 className="text-2xl font-bold mb-4">No Content Found</h1>
            <p>This page exists but has no content blocks.</p>
        </div>
      </>
    )
  }

  return (
    <>

      <div className="bg-businessx-yellow text-businessx-black text-center py-2 font-bold uppercase tracking-wider text-sm sticky top-0 z-50">
        Live Preview Mode
      </div>
      {/* We pass the whole page object to LiveBlockRenderer to handle live updates */}
      <LiveBlockRenderer initialPage={page} countryCode={countryCode} />
    </>
  )
}
