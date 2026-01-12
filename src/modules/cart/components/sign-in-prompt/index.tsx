import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const SignInPrompt = () => {
  return (
    <div className="bg-terminal-black flex items-center justify-between border border-terminal-border p-4">
      <div>
        <Heading level="h2" className="text-xl font-display font-black uppercase text-terminal-white tracking-wide">
          Already have an account?
        </Heading>
        <Text className="text-sm font-medium text-terminal-dim mt-1 font-mono">
          Sign in for a better experience.
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10 bg-bronco-orange text-black hover:bg-terminal-black hover:text-black font-display font-bold uppercase tracking-wider rounded-none border border-transparent hover:border-terminal-border transition-all px-6 py-2">
            Sign in
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
