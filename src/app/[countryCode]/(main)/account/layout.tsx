import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"

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

  return (
    <AccountLayout customer={customer}>
      {children || (customer ? dashboard : <LoginTemplate countryCode={params.countryCode} />)}
      <Toaster />
    </AccountLayout>
  )
}
