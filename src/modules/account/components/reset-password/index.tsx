"use client"

import { resetPassword } from "@lib/data/customer"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useSearchParams } from "next/navigation"
import { useActionState } from "react"

const INPUT_CLASS =
  "pt-4 pb-1 block w-full h-11 px-4 mt-0 appearance-none focus:outline-none rounded-none border border-terminal-border bg-terminal-black focus:border-businessx-orange transition-all placeholder:text-terminal-dim text-terminal-white font-medium"

const ResetPassword = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [state, formAction] = useActionState(resetPassword, null)

  const success = state && typeof state === "object" && state.success
  const error = typeof state === "string" ? state : null

  if (!token) {
    return (
      <div className="w-full flex flex-col items-center text-center">
        <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mb-6">
          <svg
            className="w-8 h-8 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-display font-bold uppercase mb-4 tracking-wide text-terminal-white">
          Invalid Reset Link
        </h1>
        <p className="text-base font-body text-terminal-dim max-w-md leading-relaxed">
          This password reset link is invalid or has expired. Please request a
          new one.
        </p>
        <LocalizedClientLink
          href="/account/forgot-password"
          className="mt-8 inline-block text-sm font-bold text-businessx-orange hover:text-businessx-yellow underline transition-colors"
        >
          Request New Reset Link
        </LocalizedClientLink>
      </div>
    )
  }

  if (success) {
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
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-display font-bold uppercase mb-4 tracking-wide text-terminal-white">
          Password Updated
        </h1>
        <p className="text-base font-body text-terminal-dim max-w-md leading-relaxed">
          Your password has been reset successfully. You can now sign in with
          your new password.
        </p>
        <LocalizedClientLink
          href="/account/login"
          className="mt-8 inline-block text-sm font-bold text-businessx-orange hover:text-businessx-yellow underline transition-colors"
        >
          Sign In
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div
      className="w-full flex flex-col items-center"
      data-testid="reset-password-page"
    >
      <h1 className="text-3xl font-display font-bold uppercase mb-2 tracking-wide text-terminal-white w-full text-center">
        Set New Password
      </h1>
      <p className="text-center text-base font-body text-terminal-dim mb-8 max-w-[380px]">
        Enter your new password below.
      </p>
      <form className="w-full" action={formAction}>
        <input type="hidden" name="token" value={token} />
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label="New Password"
            name="password"
            type="password"
            autoComplete="new-password"
            required
            data-testid="reset-password-input"
            className={INPUT_CLASS}
          />
          <Input
            label="Confirm Password"
            name="confirm_password"
            type="password"
            autoComplete="new-password"
            required
            data-testid="reset-confirm-input"
            className={INPUT_CLASS}
          />
        </div>
        <ErrorMessage error={error} data-testid="reset-error-message" />
        <SubmitButton
          data-testid="reset-submit-button"
          className="w-full mt-8 bg-businessx-orange text-black hover:bg-terminal-panel hover:text-black font-display font-bold uppercase tracking-wider rounded-none border border-transparent hover:border-terminal-border transition-all shadow-none py-4 h-12"
        >
          Reset Password
        </SubmitButton>
      </form>
    </div>
  )
}

export default ResetPassword
