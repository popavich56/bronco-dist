import { Metadata } from "next"
import { notFound } from "next/navigation"
import { listProducts, getProductByHandle, getProductSeoData, getProductShell } from "@lib/data/products"
import { getRegion, listRegions } from "@lib/data/regions"
import { getPayloadGlobal } from "@lib/payload"
import ProductTemplate from "@modules/products/templates"
import { Product, Region, Customer } from "@xclade/types"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

export async function generateStaticParams() {
  try {
    const countryCodes = await listRegions().then((regions) =>
      regions?.map((r) => r.countries?.map((c) => c?.iso_2)).flat()
    )

    if (!countryCodes) {
      return []
    }

    const promises = countryCodes.map(async (country) => {
      const { response } = await listProducts({
        countryCode: country,
        queryParams: { limit: 100 },
        skipAuth: true, // Skip auth during static generation
      })

      return {
        country,
        products: response.products,
      }
    })

    const countryProducts = await Promise.all(promises)

    return countryProducts
      .flatMap((countryData) =>
        countryData.products.map((product) => ({
          countryCode: countryData.country,
          handle: product.handle,
        }))
      )
      .filter((param) => param.handle)
  } catch (error) {
    console.error(
      `Failed to generate static paths for product pages: ${
        error instanceof Error ? error.message : "Unknown error"
      }.`
    )
    return []
  }
}

function getImagesForVariant(
  product: Product,
  selectedVariantId?: string
) {
  let images = product.images || []
  
  // Fallback to thumbnail if no images
  if (images.length === 0 && product.thumbnail) {
    images = [{
      id: 'thumbnail',
      url: product.thumbnail,
      created_at: product.created_at || '',
      updated_at: product.updated_at || '',
    } as any]
  }

  if (!selectedVariantId || !product.variants) {
    return images
  }

  const variant = product.variants!.find((v) => v.id === selectedVariantId)
  if (!variant || !(variant as any).images || !(variant as any).images.length) {
    return images
  }

  const imageIdsMap = new Map((variant as any).images.map((i: any) => [i.id, true]))
  return images.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params

  // Use lightweight query for SEO to avoid 1.2s pricing overhead
  const product = await getProductSeoData({
    handle,
  })

  if (!product) {
    notFound()
  }

  // Get store configuration for dynamic branding
  const siteSettings = await getPayloadGlobal("site-settings")
  const storeName = siteSettings?.general?.siteName || "BusinessX"

  return {
    title: `${product.title} | ${storeName}`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | ${storeName}`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

import { retrieveCustomer } from "@lib/data/customer"
import { listReviews } from "@lib/data/reviews"

export default async function ProductPage(props: Props) {
  const params = await props.params
  const searchParams = await props.searchParams
  const countryCode = params.countryCode
  const handle = params.handle

  const region = await getRegion(countryCode)
  
  if (!region) {
    notFound()
  }

  const customerPromise = retrieveCustomer().catch(() => null)
  
  const product = await getProductByHandle({
    handle,
    regionId: region.id,
    countryCode
  })

  if (!product) {
    notFound()
  }

  // Fetch reviews after we have the product ID
  const reviewsResult = await listReviews(product.id, 5)
  const reviews = reviewsResult?.reviews || []

  const selectedVariantId = searchParams.v_id
  const images = getImagesForVariant(product, selectedVariantId)

  return (
    <ProductTemplate
      product={product}
      region={region as unknown as Region}
      countryCode={countryCode}
      images={images}
      customerPromise={customerPromise}
      reviews={reviews}
    />
  )
}
