import { login } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useActionState } from "react"

type Props = {
  countryCode: string
}

const Login = ({ countryCode }: Props) => {
  const [message, formAction] = useActionState(login, null)

  return (
    <div className="w-full flex flex-col items-center" data-testid="login-page">
      <h1 className="text-3xl font-display font-bold uppercase mb-2 tracking-wide text-terminal-white w-full text-center">
        Welcome back
      </h1>
      <p className="text-center text-base font-body text-terminal-dim mb-8">
        Sign in to access an enhanced shopping experience.
      </p>
      <form className="w-full" action={formAction}>
        <input type="hidden" name="country_code" value={countryCode} />
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border dark:border-[#6DB3D9]/15 bg-terminal-black dark:bg-[#001a28] focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border dark:border-[#6DB3D9]/15 bg-terminal-black dark:bg-[#001a28] focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
        </div>
        <div className="flex justify-end mt-3">
          <LocalizedClientLink
            href="/account/forgot-password"
            className="text-xs font-body text-terminal-dim hover:text-businessx-orange transition-colors"
          >
            Forgot password?
          </LocalizedClientLink>
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton
          data-testid="sign-in-button"
          className="w-full mt-8 bg-businessx-orange text-black hover:bg-terminal-panel hover:text-black font-display font-bold uppercase tracking-wider rounded-none border border-transparent hover:border-terminal-border transition-all shadow-none py-4 h-12"
        >
          Sign in
        </SubmitButton>
      </form>
      <span className="text-center text-terminal-dim text-sm font-body mt-10 font-medium leading-relaxed">
        Ready to shop?{" "}
        <LocalizedClientLink
          href="/account/register"
          className="underline font-bold text-businessx-orange hover:text-businessx-yellow transition-colors"
        >
          Apply for wholesale access
        </LocalizedClientLink>
        .
      </span>
    </div>
  )
}

export default Login
