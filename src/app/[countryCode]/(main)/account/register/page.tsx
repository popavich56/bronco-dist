import { Metadata } from "next"

import BroncoRegisterPage from "@modules/account/components/register"

export const metadata: Metadata = {
  title: "Apply for Wholesale | Bronco Distribution",
  description:
    "Apply for a wholesale account with Bronco Distribution. Smoke shop, vape shop, and convenience store owners welcome.",
}

export default async function Register(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  return (
    <div className="w-full flex justify-center items-center py-24 bg-businessx-gray dark:bg-terminal-black min-h-[calc(100vh-80px)] transition-colors duration-200">
      <div className="bg-terminal-panel p-8 md:p-12 border border-terminal-border w-full max-w-lg transition-all duration-300">
        <BroncoRegisterPage countryCode={params.countryCode} />
      </div>
    </div>
  )
}
