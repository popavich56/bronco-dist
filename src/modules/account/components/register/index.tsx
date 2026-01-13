"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
  countryCode: string
}

const Register = ({ setCurrentView, countryCode }: Props) => {
  const [message, formAction] = useActionState(signup, null)

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-3xl font-display font-bold uppercase mb-2 tracking-wide text-terminal-white w-full text-center">
        Become a Member
      </h1>
      <p className="text-center text-base font-body text-terminal-dim mb-8 max-w-[300px]">
        Create your profile and get access to an enhanced shopping experience.
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <input type="hidden" name="country_code" value={countryCode} />
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="First name"
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
          <Input
            label="Last name"
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
          <Input
            label="Email"
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
          <Input
            label="Company Name"
            name="company_name"
            required
            autoComplete="organization"
            data-testid="company-name-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
          <Input
            label="Address"
            name="address_1"
            required
            autoComplete="address-line1"
            data-testid="address-1-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
          <Input
            label="Apartment, suite, etc."
            name="address_2"
            autoComplete="address-line2"
            data-testid="address-2-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
          <div className="grid grid-cols-2 gap-x-2">
            <Input
              label="City"
              name="city"
              required
              autoComplete="address-level2"
              data-testid="city-input"
              className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
            />
            <Input
              label="State / Province"
              name="state"
              required
              autoComplete="address-level1"
              data-testid="state-input"
              className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
            />
          </div>
          <Input
            label="Postal Code"
            name="postal_code"
            required
            autoComplete="postal-code"
            data-testid="postal-code-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
          <Input
            label="Password"
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
            className="pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-terminal-dim text-sm font-body mt-6">
          By creating an account, you agree to our{" "}
          <LocalizedClientLink
            href="/content/privacy-policy"
            className="underline font-bold text-businessx-orange hover:text-businessx-yellow"
          >
            Privacy Policy
          </LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink
            href="/content/terms-of-use"
            className="underline font-bold text-businessx-orange hover:text-businessx-yellow"
          >
            Terms of Use
          </LocalizedClientLink>
          .
        </span>
        <SubmitButton
          className="w-full mt-8 bg-businessx-orange text-black hover:bg-terminal-panel hover:text-black font-display font-bold uppercase tracking-wider rounded-none border border-transparent hover:border-terminal-border transition-all shadow-none py-4 h-12"
          data-testid="register-button"
        >
          Join
        </SubmitButton>
      </form>
      <span className="text-center text-terminal-dim text-sm font-body mt-8 font-medium">
        Already a member?{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline font-bold text-businessx-orange hover:text-businessx-yellow transition-colors"
        >
          Sign in
        </button>
        .
      </span>
    </div>
  )
}

export default Register
