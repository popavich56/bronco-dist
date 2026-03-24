import { Metadata } from "next"
import { Suspense } from "react"
import ResetPassword from "@modules/account/components/reset-password"

export const metadata: Metadata = {
  title: "Reset Password | Bronco Distribution",
  description: "Set a new password for your Bronco Distribution account.",
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full flex justify-center items-center py-24 bg-businessx-gray dark:bg-terminal-black min-h-[calc(100vh-80px)] transition-colors duration-200">
      <div className="bg-terminal-panel p-8 md:p-12 border border-terminal-border w-full max-w-lg transition-all duration-300">
        <Suspense
          fallback={
            <div className="w-full h-40 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-terminal-border border-t-businessx-orange rounded-full animate-spin" />
            </div>
          }
        >
          <ResetPassword />
        </Suspense>
      </div>
    </div>
  )
}
