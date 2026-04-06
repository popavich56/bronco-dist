export type BrandAccent =
  | "red"
  | "tan"
  | "green"
  | "blue"
  | "orange"
  | "purple"
  | "gold"
  | "pink"
  | "sky"
  | "slate"
  | "lime"
  | "amber"
  | "rose"
  | "teal"

export type Brand = {
  handle: string
  title: string
  label: string
  category: string
  description: string
  highlights: string[]
  accent: BrandAccent
  productTag: string
  logo?: string
  productImage?: string
}

/**
 * 10 Most Requested brands — used in the tabbed homepage section
 */
export const BRONCO_BRANDS: Brand[] = [
  {
    handle: "riddles",
    title: "Riddles",
    label: "Premium Wraps",
    category: "Wraps & Papers",
    description:
      "Riddles wraps are a retailer favorite — smooth burning, consistent quality, and strong sell-through across all demographics.",
    highlights: [
      "Slow, even burn",
      "Multiple flavor options",
      "High repeat purchase rate",
    ],
    accent: "red",
    productTag: "riddles",
    logo: "/images/brands/riddles-logo.png",
    productImage: "/images/brands/riddles-product.png",
  },
  {
    handle: "iconic",
    title: "Iconic",
    label: "Glass & Accessories",
    category: "Glass",
    description:
      "Iconic delivers affordable glass pieces that look premium. A go-to for shops building out their display case without breaking the bank.",
    highlights: [
      "Affordable price point",
      "Eye-catching designs",
      "Strong impulse buy category",
    ],
    accent: "blue",
    productTag: "iconic",
  },
  {
    handle: "camo-wraps",
    title: "Camo Wraps",
    label: "Rolling Wraps",
    category: "Wraps & Papers",
    description:
      "Camo Wraps bring a bold brand identity that stands out on your shelf. Consistent quality and loyal customer following.",
    highlights: [
      "Distinctive camo branding",
      "Natural leaf wraps",
      "Strong brand recognition",
    ],
    accent: "green",
    productTag: "camo-wraps",
  },
  {
    handle: "afghan-hemp",
    title: "Afghan Hemp",
    label: "Hemp Products",
    category: "Hemp & Accessories",
    description:
      "Afghan Hemp offers a full line of hemp-based smoking accessories — from wick to papers. Clean-burning and eco-conscious.",
    highlights: [
      "100% natural hemp",
      "Full product line",
      "Eco-friendly positioning",
    ],
    accent: "tan",
    productTag: "afghan-hemp",
  },
  {
    handle: "liso",
    title: "Liso",
    label: "Disposable Vapes",
    category: "Vape",
    description:
      "Liso disposables offer reliable performance with bold flavors. Consistent stock and competitive margins for retailers.",
    highlights: [
      "High puff counts",
      "Wide flavor selection",
      "Competitive wholesale price",
    ],
    accent: "purple",
    productTag: "liso",
  },
  {
    handle: "crooks",
    title: "Crooks",
    label: "Premium Cigarillos",
    category: "Cigarillos",
    description:
      "Crooks cigarillos have built a cult following with unique blends and bold packaging that moves off shelves fast.",
    highlights: [
      "Unique flavor blends",
      "Bold packaging design",
      "Strong counter display presence",
    ],
    accent: "gold",
    productTag: "crooks",
  },
  {
    handle: "crystal-glass",
    title: "Crystal Glass",
    label: "Premium Glass",
    category: "Glass",
    description:
      "Crystal Glass pieces are known for thick, durable construction and clean aesthetics. A staple for any serious smoke shop.",
    highlights: [
      "Thick borosilicate glass",
      "Clean minimal designs",
      "Wide size range",
    ],
    accent: "sky",
    productTag: "crystal-glass",
  },
  {
    handle: "yocan-red",
    title: "Yocan Red",
    label: "Concentrate Devices",
    category: "Devices",
    description:
      "Yocan Red is the brand's performance line for concentrate enthusiasts — durable builds, strong vapor, and a loyal user base.",
    highlights: [
      "Built for concentrates",
      "Durable construction",
      "Established brand trust",
    ],
    accent: "red",
    productTag: "yocan-red",
  },
  {
    handle: "yocan-black",
    title: "Yocan Black",
    label: "Premium Vaporizers",
    category: "Devices",
    description:
      "Yocan Black is the elevated line — sleek design, advanced features, and premium positioning for shops targeting discerning customers.",
    highlights: [
      "Premium build quality",
      "Advanced heating tech",
      "Sleek, modern design",
    ],
    accent: "slate",
    productTag: "yocan-black",
  },
  {
    handle: "saturn",
    title: "Saturn",
    label: "Disposable Vapes",
    category: "Vape",
    description:
      "Saturn disposables are trending hard — bold branding, solid performance, and they fly off the shelf with younger demographics.",
    highlights: [
      "Trending brand momentum",
      "Strong visual branding",
      "High velocity SKU",
    ],
    accent: "orange",
    productTag: "saturn",
  },
]

/**
 * 4 Top Brands — used in the brand cards section
 */
export const TOP_BRANDS: Brand[] = [
  {
    handle: "raw",
    title: "RAW",
    label: "Rolling Papers & Accessories",
    category: "Papers & Accessories",
    description:
      "The world's most recognized rolling paper brand. RAW is a must-stock for every smoke shop.",
    highlights: [
      "Unbleached natural papers",
      "#1 brand in rolling papers",
      "Full accessory ecosystem",
    ],
    accent: "tan",
    productTag: "raw",
  },
  {
    handle: "puffco",
    title: "Puffco",
    label: "Premium Devices",
    category: "Devices",
    description:
      "Puffco redefined the concentrate device market. The Peak and Proxy drive premium traffic and high-margin sales.",
    highlights: [
      "Industry-leading devices",
      "Premium price point",
      "Strong brand demand",
    ],
    accent: "slate",
    productTag: "puffco",
  },
  {
    handle: "vaporesso",
    title: "Vaporesso",
    label: "Vape Systems",
    category: "Vape",
    description:
      "Vaporesso brings reliable, well-engineered vape systems. From pod mods to full kits — a brand customers trust.",
    highlights: [
      "Trusted engineering",
      "Wide product range",
      "Strong repeat customers",
    ],
    accent: "green",
    productTag: "vaporesso",
  },
  {
    handle: "blazy-susan",
    title: "Blazy Susan",
    label: "Papers & Accessories",
    category: "Papers & Accessories",
    description:
      "Blazy Susan's signature pink papers turned heads and built a movement. A strong add-on brand with loyal fans.",
    highlights: [
      "Iconic pink branding",
      "Growing product line",
      "Strong social media presence",
    ],
    accent: "pink",
    productTag: "blazy-susan",
  },
]
