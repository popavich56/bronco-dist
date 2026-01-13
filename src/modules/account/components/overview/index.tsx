import { Container } from "@medusajs/ui"

import ChevronDown from "@modules/common/icons/chevron-down"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { convertToLocale } from "@lib/util/money"
import { Customer, Order } from "@xclade/types"

type OverviewProps = {
  customer: Customer | null
  orders: Order[] | null
}

const Overview = ({ customer, orders }: OverviewProps) => {
  return (
    <div data-testid="overview-page-wrapper">
      <div className="hidden small:block">
        <div className="flex justify-between items-center mb-6">
          <span
            className="text-2xl font-display font-black uppercase text-terminal-white tracking-tight"
            data-testid="welcome-message"
            data-value={customer?.first_name}
          >
            Hello {customer?.first_name}
          </span>
          <span className="text-sm font-mono font-medium text-terminal-dim">
            Signed in as:{" "}
            <span
              className="font-bold text-terminal-white"
              data-testid="customer-email"
              data-value={customer?.email}
            >
              {customer?.email}
            </span>
          </span>
        </div>
        <div className="flex flex-col py-8 border-t border-terminal-border">
          <div className="flex flex-col gap-y-4 h-full col-span-1 row-span-2 flex-1">
            <div className="flex items-start gap-x-16 mb-8">
              <div className="flex flex-col gap-y-2">
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-terminal-dim">
                  Profile
                </h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-4xl font-display font-black text-businessx-orange"
                    data-testid="customer-profile-completion"
                    data-value={getProfileCompletion(customer)}
                  >
                    {getProfileCompletion(customer)}%
                  </span>
                  <span className="uppercase text-xs font-bold text-terminal-dim mb-1 font-mono">
                    Completed
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-y-2">
                <h3 className="text-sm font-mono font-bold uppercase tracking-widest text-terminal-dim">
                  Addresses
                </h3>
                <div className="flex items-end gap-x-2">
                  <span
                    className="text-4xl font-display font-black text-businessx-orange"
                    data-testid="addresses-count"
                    data-value={customer?.addresses?.length || 0}
                  >
                    {customer?.addresses?.length || 0}
                  </span>
                  <span className="uppercase text-xs font-bold text-terminal-dim mb-1 font-mono">
                    Saved
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-y-4">
              <div className="flex items-center gap-x-2">
                <h3 className="text-xl font-display font-black uppercase text-terminal-white">
                  Recent orders
                </h3>
              </div>
              <ul
                className="flex flex-col gap-y-4"
                data-testid="orders-wrapper"
              >
                {orders && orders.length > 0 ? (
                  orders.slice(0, 5).map((order) => {
                    return (
                      <li
                        key={order.id}
                        data-testid="order-wrapper"
                        data-value={order.id}
                      >
                        <LocalizedClientLink
                          href={`/account/orders/${order.id}`}
                        >
                          <Container className="bg-terminal-black border border-terminal-border hover:border-businessx-orange transition-colors flex justify-between items-center p-4 rounded-none shadow-none">
                            <div className="grid grid-cols-3 grid-rows-2 text-sm gap-x-4 flex-1">
                              <span className="font-mono font-bold uppercase text-terminal-dim text-[10px] tracking-wider">
                                Date placed
                              </span>
                              <span className="font-mono font-bold uppercase text-terminal-dim text-[10px] tracking-wider">
                                Order number
                              </span>
                              <span className="font-mono font-bold uppercase text-terminal-dim text-[10px] tracking-wider">
                                Total amount
                              </span>
                              <span
                                data-testid="order-created-date"
                                className="font-bold font-display text-terminal-white uppercase"
                              >
                                {new Date(order.created_at).toDateString()}
                              </span>
                              <span
                                data-testid="order-id"
                                data-value={order.display_id}
                                className="font-bold font-display text-terminal-white"
                              >
                                #{order.display_id}
                              </span>
                              <span
                                data-testid="order-amount"
                                className="font-bold font-display text-terminal-white"
                              >
                                {convertToLocale({
                                  amount: order.total,
                                  currency_code: order.currency_code,
                                })}
                              </span>
                            </div>
                            <button
                              className="flex items-center justify-between text-terminal-dim hover:text-businessx-orange transition-colors"
                              data-testid="open-order-button"
                            >
                              <span className="sr-only">
                                Go to order #{order.display_id}
                              </span>
                              <ChevronDown className="-rotate-90" />
                            </button>
                          </Container>
                        </LocalizedClientLink>
                      </li>
                    )
                  })
                ) : (
                  <span
                    data-testid="no-orders-message"
                    className="text-terminal-dim font-medium italic font-mono"
                  >
                    No recent orders
                  </span>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const getProfileCompletion = (customer: Customer | null) => {
  let count = 0

  if (!customer) {
    return 0
  }

  if (customer.email) {
    count++
  }

  if (customer.first_name && customer.last_name) {
    count++
  }

  if (customer.phone) {
    count++
  }

  const billingAddress = customer.addresses?.find(
    (addr) => addr && addr.is_default_billing
  )

  if (billingAddress) {
    count++
  }

  return (count / 4) * 100
}

export default Overview
