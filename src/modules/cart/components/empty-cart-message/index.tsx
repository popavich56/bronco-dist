import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div className="py-24 px-4 flex flex-col justify-center items-center text-center" data-testid="empty-cart-message">
      <Heading
        level="h1"
        className="text-4xl md:text-5xl font-display font-black uppercase text-terminal-white tracking-tight mb-6"
      >
        Your Cart is Empty
      </Heading>
      <Text className="text-lg text-terminal-dim mb-8 max-w-[32rem] font-mono">
        You don&apos;t have anything in your cart yet. Let&apos;s change that.
      </Text>
      <div>
        <LocalizedClientLink href="/store">
          <Button className="h-12 bg-bronco-orange text-black hover:bg-terminal-black hover:text-black font-display font-bold uppercase tracking-wider rounded-none border border-transparent hover:border-terminal-border transition-all px-8 text-lg">
            Explore Products
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
