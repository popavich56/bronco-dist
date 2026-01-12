import { NextResponse } from 'next/server'
import { listProducts } from '@lib/data/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const collectionId = searchParams.get('collection_id')
  const limit = searchParams.get('limit')
  const countryCode = searchParams.get('country_code') || 'us'

  if (!collectionId) {
    return NextResponse.json({ products: [] })
  }

  try {
      // Using the server-side listProducts function
      // It respects pricing context via countryCode
      const { response: { products } } = await listProducts({
          countryCode,
          queryParams: {
              collection_id: [collectionId],
              limit: limit ? parseInt(limit) : 4,
          },
          skipAuth: true // Preview mode doesn't share auth cookies usually
      })
      
      return NextResponse.json({ products })
  } catch (error) {
      console.error("Error fetching products for preview:", error)
      return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}
