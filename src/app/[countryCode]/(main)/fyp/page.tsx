import { retrieveCustomer } from "@lib/data/customer"
import { searchProducts } from "@lib/data/search"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Text, Heading, Button } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Metadata } from "next"
import { Product } from "@xclade/types"
import RefreshButton from "./refresh-button"

export const metadata: Metadata = {
  title: "For You | Bronco Distribution",
  description: "Personalized product recommendations.",
}

type Props = {
  params: { countryCode: string }
}

export default async function FYPPage({ params }: Props) {
  const { countryCode } = params
  const customer = await retrieveCustomer().catch(() => null)
  const region = await getRegion(countryCode)

  if (!customer || !region) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-6 text-center px-4">
        <div className="w-24 h-24 bg-bronco-yellow/20 rounded-full flex items-center justify-center mb-4 text-4xl">
           👾
        </div>
        <Heading level="h1" className="text-4xl font-display uppercase font-extrabold text-bronco-black">
          Login Required
        </Heading>
        <Text className="text-lg text-bronco-gray max-w-md font-bold">
          To see your personalized "For You" selection, we need to know who you are!
        </Text>
        <LocalizedClientLink href="/account">
           <Button variant="primary" className="bg-bronco-yellow text-bronco-black hover:bg-bronco-black hover:text-bronco-yellow border-2 border-bronco-black font-bold uppercase tracking-wider px-8 py-3 h-auto text-lg transition-all shadow-[4px_4px_0px_0px_rgba(30,30,30,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
             Login / Register
           </Button>
        </LocalizedClientLink>
      </div>
    )
  }

  // ALGORITHM: "The Personalization Simulation"
  // 1. Fetch deep (100 items) to allow for random rotation
  const searchResult = await searchProducts({
    query: "*", 
    limit: 100, 
  })

  // Hydrate with prices
  let displayProducts: Product[] = []
  if (searchResult.results.length > 0) {
      const ids = searchResult.results.map(r => r.id)
      
      // Randomly shuffle the IDs to create a "fresh" feel on every refresh
      const shuffledIds = ids.sort(() => 0.5 - Math.random()).slice(0, 20)
      
      const { response: { products } } = await listProducts({
        countryCode,
        queryParams: { id: shuffledIds, limit: 20 }
      })
      // Map back to maintain random order
      const productMap = new Map(products.map(p => [p.id, p]))
      displayProducts = shuffledIds.map(id => productMap.get(id)).filter((p): p is Product => !!p)
  }


  return (
    <div className="bg-bronco-white min-h-screen pb-20">
      
      {/* Hero Header */}
      <div className="bg-bronco-black py-20 mb-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-96 h-96 bg-bronco-yellow/20 -translate-y-1/2 translate-x-1/2 rounded-full blur-[100px]" />
         <div className="content-container relative z-10">
            <Text className="text-bronco-yellow font-bold uppercase tracking-widest mb-2">
                Personalized Selection
            </Text>
            <Heading level="h1" className="text-5xl md:text-7xl font-display font-extrabold text-white uppercase tracking-tighter mb-4">
                For You Page
            </Heading>
            <div className="flex flex-col gap-4">
                <Text className="text-xl text-gray-400 font-bold max-w-2xl">
                    Curated specifically for <span className="text-bronco-yellow">{customer.first_name || "you"}</span> based on the latest drops and trending heat.
                </Text>
                <div className="mt-4">
                    <RefreshButton />
                </div>
            </div>
         </div>
      </div>

      {/* Masonry-ish Grid */}
      <div className="content-container">
        {displayProducts.length > 0 ? (
            <ul className="grid grid-cols-1 small:grid-cols-2 medium:grid-cols-3 large:grid-cols-4 gap-x-6 gap-y-12">
            {displayProducts.map((product) => (
                <li key={product.id} className="group">
                 <ProductPreview region={region} product={product} />
                </li>
            ))}
            </ul>
        ) : (
            <div className="py-20 text-center">
                <Text className="text-xl font-bold text-bronco-gray mb-4">No recommendations found just yet.</Text>
                <Text>Start browsing to build your profile!</Text>
            </div>
        )}
      </div>
    </div>
  )
}
