import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import RequestQuoteButton from "@modules/quotes/components/request-quote-button"
import { Cart, Customer } from "@xclade/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: Cart | null
  customer: Customer | null
}) => {
  return (
    <div className="py-12 bg-terminal-black min-h-[calc(100vh-64px)]">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-x-12 relative">
            <div className="flex flex-col bg-transparent py-6 gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider className="border-terminal-border" />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-32">
                {cart && cart.region && (
                  <>
                    <div className="bg-terminal-black">
                      <Summary cart={cart as any} />
                      {customer && (
                        <div className="mt-4">
                            <RequestQuoteButton cartId={cart.id} />
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
