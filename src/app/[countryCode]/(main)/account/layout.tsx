import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"
import { isPendingCustomer, PENDING_MESSAGE } from "@lib/util/customer-status"

import LoginTemplate from "@modules/account/templates/login-template"

export default async function AccountPageLayout(props: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
  children?: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { dashboard, login, children } = props
  const customer = await retrieveCustomer().catch(() => null)
  const isBypass = process.env.NEXT_PUBLIC_BYPASS_WHOLESALE_GATE === "true"

  return (
    <AccountLayout customer={customer}>
      {customer && isPendingCustomer(customer) && !isBypass && (
        <div className="border border-[#6DB3D9]/30 bg-[#001F2E] p-4 text-sm text-[#ADE0EE] font-mono mb-6">
          {PENDING_MESSAGE}
        </div>
      )}
      {children || (customer || isBypass ? dashboard : <LoginTemplate countryCode={params.countryCode} />)}
      <Toaster />
    </AccountLayout>
  )
}
