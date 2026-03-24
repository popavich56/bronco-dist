"use client"

import { requestPasswordReset } from "@lib/data/customer"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useActionState } from "react"

const INPUT_CLASS =
  "pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"

const ForgotPassword = () => {
  const [state, formAction] = useActionState(requestPasswordReset, null)
  const submitted = state && typeof state === "object" && state.success

  if (submitted) {
    return (
      <div className="w-full flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-green-600/20 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-display font-bold uppercase mb-4 tracking-wide text-terminal-white">
          Check Your Email
        </h1>
        <p className="text-base font-body text-terminal-dim max-w-md leading-relaxed">
          If an account exists for that email, a password reset link has been
          sent. Please check your inbox and follow the instructions.
        </p>
        <LocalizedClientLink
          href="/account/login"
          className="mt-8 inline-block text-sm font-bold text-businessx-orange hover:text-businessx-yellow underline transition-colors"
        >
          Back to Sign In
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="forgot-password-page"
    >
      <h1 className="text-3xl font-display font-bold uppercase mb-2 tracking-wide text-terminal-white w-full text-center">
        Reset Password
      </h1>
      <p className="text-center text-base font-body text-terminal-dim mb-8 max-w-[380px]">
        Enter the email associated with your account and we&apos;ll send you a
        link to reset your password.
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            required
            data-testid="forgot-email-input"
            className={INPUT_CLASS}
          />
        </div>
        <SubmitButton
          data-testid="forgot-submit-button"
          className="w-full mt-8 bg-businessx-orange text-black hover:bg-terminal-panel hover:text-black font-display font-bold uppercase tracking-wider rounded-none border border-transparent hover:border-terminal-border transition-all shadow-none py-4 h-12"
        >
          Send Reset Link
        </SubmitButton>
      </form>
      <span className="text-center text-terminal-dim text-sm font-body mt-8 font-medium">
        Remember your password?{" "}
        <LocalizedClientLink
          href="/account/login"
          className="underline font-bold text-businessx-orange hover:text-businessx-yellow transition-colors"
        >
          Sign in
        </LocalizedClientLink>
        .
      </span>
    </div>
  )
}

export default ForgotPassword
