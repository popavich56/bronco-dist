import { Metadata } from "next"
import CustomerServiceTemplate from "@modules/customer-service/templates"

export const metadata: Metadata = {
  title: "Customer Service",
  description: "Get help, contact support, and view FAQs.",
}

export default async function CustomerServicePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  return <CustomerServiceTemplate />
}
