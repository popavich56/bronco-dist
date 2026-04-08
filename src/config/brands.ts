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
  logoLight?: string
  logoDark?: string
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
    logoLight: "/images/brands/riddles-logo-light.png",
    logoDark: "/images/brands/riddles-logo.png",
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
    logoLight: "/images/brands/camo-logo-light.png",
    logoDark: "/images/brands/camo-logo-dark.png",
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
    logo: "/images/brands/afghan-hemp-logo.png",
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
    logoLight: "/images/brands/liso-logo-light.png",
    logoDark: "/images/brands/liso-logo-dark.png",
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
    logo: "/images/brands/crooks-logo.png",
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
    logo: "/images/brands/crystal-glass-logo.png",
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
    logo: "/images/brands/yocan-red-logo.png",
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
    logo: "/images/brands/yocan-black-logo.jpeg",
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
    logo: "/images/brands/saturn-logo.png",
  },
]

/**
 * Top Brands section — heading copy (editable)
 */
export const TOP_BRANDS_SECTION = {
  eyebrow: "Featured Partners",
  heading: "Top Brands",
  subheading: "Industry-leading brands available at wholesale pricing.",
}

export type TopBrand = {
  handle: string
  title: string
  subtitle: string
  ctaText: string
  href: string
  accent: BrandAccent
  /** Single logo (used when theme variants are not provided) */
  logo?: string
  /** Logo for light backgrounds (dark artwork) */
  logoLight?: string
  /** Logo for dark backgrounds (light artwork) */
  logoDark?: string
}

/**
 * Top Brands — used in the brand cards section on the homepage.
 * Edit `title`, `subtitle`, `ctaText`, and `href` here to update card copy.
 * Add `logo`, or `logoLight` + `logoDark`, to replace the letter badge.
 */
export const TOP_BRANDS: TopBrand[] = [
  {
    handle: "raw",
    title: "RAW",
    subtitle: "Rolling Papers & Accessories",
    ctaText: "Shop Brand",
    href: "/account/register",
    accent: "tan",
    logo: "/images/brands/raw-logo.png",
  },
  {
    handle: "puffco",
    title: "Puffco",
    subtitle: "Premium Devices",
    ctaText: "Shop Brand",
    href: "/account/register",
    accent: "slate",
    logoLight: "/images/brands/puffco-logo-light.png",
    logoDark: "/images/brands/puffco-logo-dark.png",
  },
  {
    handle: "vaporesso",
    title: "Vaporesso",
    subtitle: "Vape Systems",
    ctaText: "Shop Brand",
    href: "/account/register",
    accent: "green",
    logoLight: "/images/brands/vaporesso-logo-light.png",
    logoDark: "/images/brands/vaporesso-logo-dark.png",
  },
  {
    handle: "blazy-susan",
    title: "Blazy Susan",
    subtitle: "Papers & Accessories",
    ctaText: "Shop Brand",
    href: "/account/register",
    accent: "pink",
    logo: "/images/brands/blazy-susan-logo.png",
  },
]
