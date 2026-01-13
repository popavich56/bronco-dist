// Re-export from graphql client
export { getPayloadPage, getPayloadNavigation } from "./graphql"
import { graphqlQuery } from "../graphql"

const PAYLOAD_URL = process.env.NEXT_PUBLIC_CMS_URL || "http://localhost:3000"

const BACKEND_SITE_SETTINGS_QUERY = `
  query GetBackendSiteSettings {
    siteSettings {
      brand_settings {
        site_name
        site_description
        logo_url
        logo_alt
        contact_email
        contact_phone
      }
    }
  }
`

async function fetchBackendSiteSettings() {
  try {
    const data = await graphqlQuery<{ siteSettings: { brand_settings: any } }>(
      BACKEND_SITE_SETTINGS_QUERY,
      undefined,
      undefined,
      { revalidate: 3600 }
    )
    const brand = data?.siteSettings?.brand_settings
    if (!brand) return null

    const backendUrl =
      process.env.NEXT_PUBLIC_XCLADE_BACKEND_URL || "http://localhost:9000"
    const normalizeUrl = (url: string) =>
      url.startsWith("http") ? url : `${backendUrl}${url}`

    return {
      general: {
        siteName: brand.site_name === "Bronco" ? "BusinessX" : brand.site_name,
        siteDescription: brand.site_description,
      },
      branding: {
        logo: brand.logo_url
          ? { url: normalizeUrl(brand.logo_url), alt: brand.logo_alt }
          : null,
        logoAlt: null,
      },
      contact: {
        email: brand.contact_email,
        phone: brand.contact_phone,
      },
    }
  } catch (error) {
    return null
  }
}

export async function getPayloadGlobal(slug: string) {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/globals/${slug}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { tags: [`global_${slug}`] },
    })

    if (!res.ok) {
      if (slug === "site-settings") return fetchBackendSiteSettings()
      return null
    }

    return res.json()
  } catch (error: any) {
    if (slug === "site-settings") {
      return fetchBackendSiteSettings()
    }

    if (
      error?.cause?.code !== "ECONNREFUSED" &&
      !error?.message?.includes("fetch failed")
    ) {
      console.error(`Error fetching global ${slug}:`, error)
    }
    return null
  }
}
