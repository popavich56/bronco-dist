import { Product } from "@xclade/types"
import { Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Star } from "lucide-react"

type ExtendedProduct = Product

type ProductInfoProps = {
  product: ExtendedProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info" className="flex flex-col gap-y-4">
      {product.collection && (
        <LocalizedClientLink
          href={`/collections/${product.collection.handle}`}
          className="text-[10px] font-mono font-bold text-businessx-orange uppercase tracking-[0.2em] hover:text-terminal-white transition-colors w-fit border border-businessx-orange/30 px-2 py-0.5"
        >
          {product.collection.title}
        </LocalizedClientLink>
      )}

      <div className="space-y-2">
        <Heading
          level="h1"
          className="text-3xl md:text-4xl leading-none font-display font-bold text-terminal-white uppercase tracking-tight"
          data-testid="product-title"
        >
          {product.title}
        </Heading>
        {product.subtitle && (
          <Text className="text-terminal-dim font-mono text-xs uppercase tracking-widest">
            SKU_REF: {product.subtitle}
          </Text>
        )}
      </div>

      {product.rating_summary && product.rating_summary.review_count > 0 && (
        <div className="flex items-center gap-x-2">
          <div className="flex gap-0.5 text-businessx-orange">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.rating_summary!.average_rating)
                    ? "fill-current"
                    : "text-terminal-border fill-terminal-border"
                }`}
              />
            ))}
          </div>
          <Text className="text-terminal-dim font-mono text-xs">
            [{product.rating_summary.review_count}_VERIFIED]
          </Text>
        </div>
      )}
    </div>
  )
}

export default ProductInfo
