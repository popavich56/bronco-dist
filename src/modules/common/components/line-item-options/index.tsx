import { ProductVariant } from "@xclade/types"
import { Text } from "@medusajs/ui"

type LineItemOptionsProps = {
  variant: ProductVariant | undefined | null
  variantTitle?: string | null
  "data-testid"?: string
  "data-value"?: ProductVariant | null
}

const LineItemOptions = ({
  variant,
  variantTitle,
  "data-testid": dataTestid,
  "data-value": dataValue,
}: LineItemOptionsProps) => {
  // If we have detailed options, use them
  if (variant?.options && variant.options.length > 0) {
    return (
      <div 
        className="flex flex-col gap-y-1"
        data-testid={dataTestid}
        data-value={dataValue}
      >
        {variant.options.map((opt, i) => {
           // Handle case where option or title might be missing
           const title = (opt.option as any)?.title || "Option"
           return (
             <Text key={opt.id || i} className="text-xs font-mono text-terminal-dim uppercase tracking-wide">
               {title}: {opt.value}
             </Text>
           )
        })}
      </div>
    )
  }

  // Fallback to simple title
  return (
    <Text
      data-testid={dataTestid}
      data-value={dataValue}
      className="inline-block text-xs font-mono text-terminal-dim uppercase tracking-wide w-full overflow-hidden text-ellipsis"
    >
      Variant: {variantTitle || variant?.title}
    </Text>
  )
}

export default LineItemOptions
