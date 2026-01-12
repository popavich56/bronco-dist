
import { Metadata } from "next"
import { getMyCompany } from "@lib/data/b2b"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Company",
  description: "Manage your company settings and employees.",
}

import CompanyDetails from "@modules/account/components/company-details"
import EmployeeList from "@modules/account/components/employee-list"

export default async function CompanyPage() {
  const company = await getMyCompany()

  if (!company) {
    return (
        <div className="flex flex-col gap-y-4">
            <h1 className="text-2xl-semi">Company</h1>
            <p>You are not associated with any company.</p>
        </div>
    )
  }

  return (
    <div className="w-full" data-testid="company-page">
      <div className="mb-8">
        <h1 className="text-2xl-semi mb-2">Company: {company.name}</h1>
        <p className="text-base-regular text-gray-700">Manage your company details and employees.</p>
      </div>
      
      <div className="grid grid-cols-1 gap-y-8">
          <CompanyDetails company={company} />
          <EmployeeList employees={company.employees} />
      </div>
    </div>
  )
}
