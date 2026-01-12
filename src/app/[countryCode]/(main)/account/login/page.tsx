import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Medusa Store account.",
}

export default async function Login(props: { params: Promise<{ countryCode: string }> }) {
  const params = await props.params
  return <LoginTemplate countryCode={params.countryCode} />
}
