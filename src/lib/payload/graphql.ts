import { Page } from "./types"

const PAYLOAD_GRAPHQL_URL = process.env.NEXT_PUBLIC_CMS_URL
  ? `${process.env.NEXT_PUBLIC_CMS_URL}/api/graphql`
  : "http://localhost:3000/api/graphql"

/**
 * BEST PRACTICE: SINGLE SOURCE OF TRUTH (PRODUCTION)
 *
 * In production environments, avoid "hybrid" states where a CMS URL is configured
 * but the instance is not actually provisioned or reachable.
 *
 * - If you are using the CMS, ensure it is fully deployed and the URL is correct.
 * - If you are NOT using the CMS, unset `NEXT_PUBLIC_CMS_URL` entirely.
 *
 * While we handle 404s/connection errors gracefully to support "Skeleton Store" fallback,
 * relied-upon ambiguity can lead to performance degradation (pointless fetch retries)
 * or confusing debugging sessions. Pick one source of truth!
 */

export async function payloadQuery<T>(
  query: string,
  variables?: Record<string, unknown>,
  options?: { tags?: string[]; revalidate?: number | false; draft?: boolean }
): Promise<T> {
  const url = options?.draft
    ? `${PAYLOAD_GRAPHQL_URL}?draft=true`
    : PAYLOAD_GRAPHQL_URL

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
    next: options?.tags
      ? { tags: options.tags }
      : options?.revalidate !== undefined
      ? { revalidate: options.revalidate }
      : { revalidate: 60 }, // Default cache: 60s
  })

  if (!response.ok) {
    throw new Error(`Payload GraphQL request failed: ${response.statusText}`)
  }

  const result = await response.json()

  if (result.errors) {
    console.error(
      "Payload GraphQL errors:",
      JSON.stringify(result.errors, null, 2)
    )
    throw new Error(result.errors[0]?.message || "Payload GraphQL query failed")
  }

  return result.data
}

// Fragments matching our schema refactor
const HERO_FRAGMENT = `
  ... on Hero {
    blockType
    heroTitle: title
    subtitle
    description
    backgroundImage {
      url
      alt
      width
      height
    }
    ctaText
    ctaLink
    ctaType
    heroAlignment: alignment
    textColor
  }
`

const TEXT_BLOCK_FRAGMENT = `
  ... on TextBlock {
    blockType
    content
    textAlignment: alignment
  }
`

const IMAGE_GALLERY_FRAGMENT = `
  ... on ImageGallery {
    blockType
    galleryTitle: title
    description
    images {
      image {
        url
        alt
        width
        height
      }
      caption
      alt
    }
    galleryLayout: layout
    sliderSettings {
      autoplay
      autoplaySpeed
      showArrows
      showDots
    }
  }
`

const TESTIMONIALS_FRAGMENT = `
  ... on Testimonials {
    blockType
    testimonialsLayout: layout
    testimonials {
        quote
        author
        title
        company
        rating
        avatar {
            url
            alt
        }
    }
  }
`

const FEATURES_FRAGMENT = `
  ... on Features {
    blockType
    featuresTitle: title
    description
    featuresLayout: layout
    features {
        title
        description
        icon {
            url
            alt
        }
        link
        id
    }
  }
`

const CTA_FRAGMENT = `
  ... on Cta {
    blockType
    ctaTitle: title
    description
    buttonText
    buttonLink
    buttonStyle
    backgroundColor
    backgroundImage {
        url
        alt
    }
  }
`

const PRODUCT_COLLECTION_FRAGMENT = `
  ... on ProductCollectionBlock {
    blockType
    collectionTitle: title
    description
    collection {
       title
       collectionId
       handle
    }
    limit
    collectionLayout: layout
    showPrice
    showAddToCart
  }
`

const VIDEO_FRAGMENT = `
  ... on Video {
    blockType
    videoTitle: title
    description
    videoType
    youtubeId
    vimeoId
    videoFile {
      url
      alt
      width
      height
    }
    embedCode
    thumbnail {
      url
      alt
      width
      height
    }
    autoplay
    controls
    aspectRatio
  }
`

const BLOG_POSTS_FRAGMENT = `
  ... on BlogPosts {
    blockType
    blogPostsTitle: title
    description
    posts {
       title
       slug
       excerpt
       featuredImage {
         url
         alt
         width
         height
       }
    }
    limit
    blogPostsLayout: layout
    showExcerpt
    showAuthor
    showDate
    showCategory
    showReadMore
  }
`

const FAQ_FRAGMENT = `
  ... on Faq {
    blockType
    faqTitle: title
    description
    faqs {
       question
       answer
       category
    }
    faqLayout: layout
  }
`

const NEWSLETTER_FRAGMENT = `
  ... on Newsletter {
    blockType
    newsletterTitle: title
    description
    placeholder
    buttonText
    successMessage
    backgroundColor
    backgroundImage {
        url
        alt
        width
        height
    }
    newsletterLayout: layout
  }
`

const STATS_FRAGMENT = `
  ... on Stats {
    blockType
    statsTitle: title
    description
    stats {
       number
       label
       description
       icon {
         url
         alt
         width
         height
       }
    }
    statsLayout: layout
  }
`

const BASE_BLOCK_FRAGMENTS = `
  ${HERO_FRAGMENT}
  ${TEXT_BLOCK_FRAGMENT}
  ${IMAGE_GALLERY_FRAGMENT}
  ${TESTIMONIALS_FRAGMENT}
  ${FEATURES_FRAGMENT}
  ${CTA_FRAGMENT}
  ${PRODUCT_COLLECTION_FRAGMENT}
  ${VIDEO_FRAGMENT}
`

const PAGE_BLOCK_FRAGMENTS = `
  ${BASE_BLOCK_FRAGMENTS}
  ${BLOG_POSTS_FRAGMENT}
`

const REUSABLE_INNER_BLOCK_FRAGMENTS = `
  ${BASE_BLOCK_FRAGMENTS}
  ${FAQ_FRAGMENT}
  ${NEWSLETTER_FRAGMENT}
  ${STATS_FRAGMENT}
`

const REUSABLE_CONTENT_BLOCK_FRAGMENT = `
  ... on ReusableContentBlock {
    blockType
    blockReference {
      ... on ContentBlock {
        content {
          ${REUSABLE_INNER_BLOCK_FRAGMENTS}
        }
      }
    }
  }
`

// Main Page Query
export const GET_PAGE = `
  query GetPage($slug: String!) {
    Pages(where: { slug: { equals: $slug } }, limit: 1) {
      docs {
        id
        title
        slug
        pageType
        contentBlocks {
          ${PAGE_BLOCK_FRAGMENTS}
          ${REUSABLE_CONTENT_BLOCK_FRAGMENT}
        }
        seo {
           title
           description
           ogImage {
             url
           }
        }
      }
    }
  }
`

export async function getPayloadPage(
  slug: string,
  draft: boolean = false
): Promise<Page | null> {
  try {
    const data = await payloadQuery<{ Pages: { docs: Page[] } }>(
      GET_PAGE,
      { slug },
      { tags: [`pages_${slug}`], draft }
    )
    return data.Pages.docs[0] || null
  } catch (error: any) {
    if (
      error?.cause?.code === "ECONNREFUSED" ||
      error?.message?.includes("fetch failed") ||
      error?.message?.includes("Not Found")
    ) {
      // Silent warning for page fetches in dev
      // console.warn(`Payload CMS not available, skipping page '${slug}'`)
    } else {
      console.error(`Error fetching page ${slug}:`, error)
    }
    return null
  }
}

// Navigation Query
const GET_NAVIGATION = `
  query GetNavigation($type: Navigation_type_Input) {
    Navigations(where: { type: { equals: $type } }, limit: 1) {
      docs {
        menuItems {
          link {
             type
             label
             internalPage {
               ... on Page {
                 slug
               }
             }
             category {
               id
               name
               slug
             }
             externalUrl
             customUrl
             newTab
          }
          icon {
            url
            alt
          }
          children {
            link {
              type
              label
              internalPage {
                ... on Page {
                  slug
                }
              }
              category {
                id
                name
                slug
              }
              externalUrl
              customUrl
              newTab
            }
            icon {
              url
              alt
            }
          }
        }
      }
    }
  }
`

export async function getPayloadNavigation(
  type: "main" | "footer" | "mobile" | "sidebar" | "breadcrumb" | "custom"
): Promise<any | null> {
  try {
    const data = await payloadQuery<{ Navigations: { docs: any[] } }>(
      GET_NAVIGATION,
      { type },
      { tags: [`navigation_${type}`] }
    )
    return data.Navigations.docs[0] || null
  } catch (error: any) {
    if (
      error?.cause?.code === "ECONNREFUSED" ||
      error?.message?.includes("fetch failed") ||
      error?.message?.includes("Not Found")
    ) {
      // Silent warning for navigation fetches if CMS is missing/404
      // console.warn(`Payload CMS not available, skipping navigation '${type}'`)
    } else {
      console.error(`Error fetching navigation ${type}:`, error)
    }
    return null
  }
}
