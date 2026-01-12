import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { Customer } from "@xclade/types"

interface AccountLayoutProps {
  customer: Customer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  if (!customer) {
    return (
      <div className="flex-1" data-testid="account-page">
        {children}
      </div>
    )
  }

  return (
    <div className="flex-1 small:py-12 font-body" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-terminal-black flex flex-col border border-terminal-border overflow-hidden">
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] py-12 px-8">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1 text-terminal-white">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between small:border-t border-terminal-border py-8 px-8 gap-8 bg-terminal-black">
          <div>
            <h3 className="text-xl font-display font-black uppercase mb-2 text-terminal-white">
              Got questions?
            </h3>
            <span className="text-sm font-medium text-terminal-dim">
              You can find frequently asked questions and answers on our
              customer service page.
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              Customer Service
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
