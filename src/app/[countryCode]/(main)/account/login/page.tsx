import { Metadata } from "next"

import { getPayloadGlobal } from "@lib/payload"
import LoginTemplate from "@modules/account/templates/login-template"

export async function generateMetadata(): Promise<Metadata> {
  // Get store configuration for dynamic branding
  const siteSettings = await getPayloadGlobal("site-settings")
  const storeName = siteSettings?.general?.siteName || "Bronco Distribution"

  return {
    title: "Sign in",
    description: `Sign in to your ${storeName} account.`,
  }
}

export default async function Login(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  return <LoginTemplate countryCode={params.countryCode} />
}
